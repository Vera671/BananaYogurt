"""Local document extraction and exact cosine search in a persistent SQLite store."""

from contextlib import contextmanager

import hashlib
import json
import math
import sqlite3
import threading
from pathlib import Path
from urllib.request import Request, urlopen

EXTENSIONS = {'.pdf', '.txt', '.docx', '.md'}
MODEL = 'nomic-embed-text'
VERSION = '1:' + MODEL
LOCK = threading.RLock()


class IndexError(Exception):
    """An actionable indexing or retrieval failure."""


def embed(texts, query=False):
    prefix = 'search_query: ' if query else 'search_document: '
    payload = {'model': MODEL, 'input': [prefix + text for text in texts], 'truncate': False}
    try:
        req = Request('http://localhost:11434/api/embed',
                      data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json'})
        with urlopen(req, timeout=120) as response:
            vectors = json.load(response)['embeddings']
        if not isinstance(vectors, list) or len(vectors) != len(texts):
            raise ValueError('Wrong embedding count')
        normalized = []
        for vector in vectors:
            if not isinstance(vector, list) or not vector:
                raise ValueError('Empty embedding')
            if any(isinstance(v, bool) or not isinstance(v, (int, float))
                   or not math.isfinite(v) for v in vector):
                raise ValueError('Invalid embedding')
            norm = math.sqrt(sum(v * v for v in vector))
            if not norm or (normalized and len(vector) != len(normalized[0])):
                raise ValueError('Invalid embedding dimension or norm')
            normalized.append([v / norm for v in vector])
        return normalized
    except Exception as error:
        raise IndexError('Embedding failed. Start Ollama and run: ollama pull nomic-embed-text. '
                         'Then refresh the Document Collection to retry.') from error


def extract(path):
    try:
        if path.suffix.lower() == '.pdf':
            from pypdf import PdfReader
            parts = [(f'page {i}', page.extract_text() or '')
                     for i, page in enumerate(PdfReader(path).pages, 1)]
        elif path.suffix.lower() == '.docx':
            from docx import Document
            doc = Document(path)
            text = '\n'.join([p.text for p in doc.paragraphs] +
                             [' | '.join(c.text for c in row.cells)
                              for table in doc.tables for row in table.rows])
            parts = [('text', text)]
        else:
            parts = [('text', path.read_text(encoding='utf-8-sig'))]
        chunks = []
        for location, text in parts:
            text = text.replace('\x00', '').strip()
            for start in range(0, len(text), 1000):
                chunk = text[start:start + 1200].strip()
                if chunk:
                    chunks.append((location, chunk))
        if not chunks:
            raise ValueError('No extractable text; scanned PDFs need OCR first')
        return chunks
    except Exception as error:
        raise IndexError(f'Cannot read {path.name}: {error}') from error


class Store:
    def __init__(self, uploads, database):
        self.uploads = Path(uploads)
        self.database = Path(database)

    @contextmanager
    def connect(self):
        self.database.parent.mkdir(parents=True, exist_ok=True)
        db = sqlite3.connect(self.database, timeout=120)
        db.execute('CREATE TABLE IF NOT EXISTS documents (name TEXT PRIMARY KEY, fingerprint TEXT)')
        db.execute('CREATE TABLE IF NOT EXISTS chunks '
                   '(name TEXT, number INTEGER, location TEXT, text TEXT, vector TEXT)')
        try:
            with db:
                yield db
        finally:
            db.close()

    def sync(self):
        """Retry failures, replace changed files atomically, and purge missing files."""
        with LOCK:
            self.uploads.mkdir(parents=True, exist_ok=True)
            files = {p.name: p for p in self.uploads.iterdir()
                     if not p.is_symlink() and p.is_file() and p.suffix.lower() in EXTENSIONS}
            errors = {}
            with self.connect() as db:
                known = dict(db.execute('SELECT name, fingerprint FROM documents'))
                for name in known.keys() - files.keys():
                    db.execute('DELETE FROM chunks WHERE name=?', (name,))
                    db.execute('DELETE FROM documents WHERE name=?', (name,))
                db.commit()
                for name, path in files.items():
                    try:
                        fingerprint = VERSION + hashlib.sha256(path.read_bytes()).hexdigest()
                        if known.get(name) == fingerprint:
                            continue
                        # Never retrieve stale content if replacement extraction fails.
                        db.execute('DELETE FROM chunks WHERE name=?', (name,))
                        db.execute('DELETE FROM documents WHERE name=?', (name,))
                        db.commit()
                        chunks = extract(path)
                        vectors = []
                        for start in range(0, len(chunks), 16):
                            vectors.extend(embed([c[1] for c in chunks[start:start + 16]]))
                        with db:
                            db.executemany('INSERT INTO chunks VALUES (?, ?, ?, ?, ?)',
                                           [(name, i, loc, text, json.dumps(vector))
                                            for i, ((loc, text), vector)
                                            in enumerate(zip(chunks, vectors), 1)])
                            db.execute('INSERT INTO documents VALUES (?, ?)', (name, fingerprint))
                    except (IndexError, OSError) as error:
                        errors[name] = str(error)
                indexed = {row[0] for row in db.execute('SELECT name FROM documents')}
            return indexed, errors

    def remove(self, name):
        with LOCK, self.connect() as db:
            db.execute('DELETE FROM chunks WHERE name=?', (name,))
            db.execute('DELETE FROM documents WHERE name=?', (name,))

    def search(self, question):
        with LOCK:
            indexed, errors = self.sync()
            if errors:
                raise IndexError('Some documents could not be indexed: ' + '; '.join(errors.values()))
            if not indexed:
                return []
            vector = embed([question], query=True)[0]
            with self.connect() as db:
                rows = db.execute('SELECT name, number, location, text, vector FROM chunks').fetchall()
            ranked = []
            for name, number, location, text, encoded in rows:
                candidate = json.loads(encoded)
                if len(candidate) != len(vector):
                    raise IndexError('Embedding dimensions changed. Remove the local index and reindex.')
                score = sum(a * b for a, b in zip(vector, candidate))
                if score >= 0.35:
                    ranked.append(dict(filename=name, chunk=number, location=location,
                                       text=text, score=score))
            return sorted(ranked, key=lambda item: item['score'], reverse=True)[:4]
