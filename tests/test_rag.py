import io
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from src.rag import Store, extract, embed, IndexError
from src.app import app


class RagTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.uploads = self.root / 'uploads'
        self.uploads.mkdir()
        self.store = Store(self.uploads, self.root / 'index.sqlite3')

    @patch('src.rag.embed', side_effect=lambda texts, **kw: [[1.0, 0.0] for _ in texts])
    def test_existing_five_files_persist_change_and_delete(self, embedding):
        for i in range(5):
            (self.uploads / f'{i}.md').write_text('Sigmoid maps values between zero and one.')
        indexed, errors = self.store.sync()
        self.assertEqual(len(indexed), 5)
        self.assertFalse(errors)
        embedding.reset_mock()
        self.store.sync()
        embedding.assert_not_called()
        results = self.store.search('What is sigmoid?')
        self.assertEqual(len(results), 4)
        self.assertIn('Sigmoid', results[0]['text'])
        (self.uploads / '0.md').write_text('Updated study text')
        (self.uploads / '1.md').unlink()
        self.store.sync()
        with self.store.connect() as db:
            self.assertEqual(db.execute('SELECT count(*) FROM documents').fetchone()[0], 4)
            self.assertEqual(db.execute("SELECT text FROM chunks WHERE name='0.md'").fetchone()[0], 'Updated study text')
            self.assertEqual(db.execute("SELECT count(*) FROM chunks WHERE name='1.md'").fetchone()[0], 0)
        self.assertEqual(len(Store(self.uploads, self.store.database).search('text')), 4)

    @patch('src.rag.embed', side_effect=IndexError('Ollama offline'))
    def test_failure_preserves_upload_and_retries(self, embedding):
        path = self.uploads / 'notes.txt'
        path.write_text('study notes')
        self.assertIn('notes.txt', self.store.sync()[1])
        self.assertEqual(path.read_text(), 'study notes')
        embedding.side_effect = None
        embedding.return_value = [[1, 0]]
        self.assertEqual(self.store.sync(), ({'notes.txt'}, {}))

    def test_empty_and_bad_documents_fail_clearly(self):
        for name, content in [('empty.md', b''), ('bad.txt', b'\xff'), ('bad.pdf', b'broken'), ('bad.docx', b'broken')]:
            path = self.uploads / name
            path.write_bytes(content)
            with self.assertRaises(IndexError):
                extract(path)

    def test_chunk_overlap(self):
        path = self.uploads / 'long.md'
        path.write_text('a' * 2500)
        chunks = extract(path)
        self.assertEqual([len(text) for _, text in chunks], [1200, 1200, 500])

    @patch('src.rag.urlopen')
    def test_embedding_protocol_and_validation(self, open_url):
        open_url.return_value = io.BytesIO(json.dumps({'embeddings': [[3, 4]]}).encode())
        self.assertEqual(embed(['question'], query=True), [[0.6, 0.8]])
        payload = json.loads(open_url.call_args.args[0].data)
        self.assertEqual(payload['input'], ['search_query: question'])
        self.assertFalse(payload['truncate'])
        for vectors in ([], [[0, 0]], [[float('nan')]]):
            open_url.return_value = io.BytesIO(json.dumps({'embeddings': vectors}).encode())
            with self.assertRaises(IndexError):
                embed(['question'])

    @patch('src.app.Store.search', return_value=[])
    @patch('src.app.urlopen')
    def test_no_evidence_abstains_without_generation(self, generation, search):
        response = app.test_client().post('/api/chat', json={'messages': [{'role': 'user', 'content': 'unknown'}]})
        self.assertEqual(response.status_code, 200)
        self.assertIn('do not contain an answer', response.json['message']['content'])
        generation.assert_not_called()

    @patch('src.app.Store.search', side_effect=IndexError('Embedding failed'))
    def test_index_failure_is_not_silent(self, search):
        response = app.test_client().post('/api/chat', json={'messages': [{'role': 'user', 'content': 'question'}]})
        self.assertEqual(response.status_code, 503)


if __name__ == '__main__':
    unittest.main()
