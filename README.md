# Local RAG Study Assistant

Flask + Ollama `gemma3:1b` answers study questions from your local PDF, TXT, DOCX, and Markdown collection. The existing Chat and Document Collection tabs, browser conversation history, uploads, and file limits are preserved. No cloud API or API key is needed.

## Install and run

Requires Python 3.9+ and [Ollama](https://ollama.com/).

```bash
ollama serve
```

Skip this if the Ollama desktop app is already serving on localhost:11434. In another terminal:

```bash
ollama pull gemma3:1b
ollama pull nomic-embed-text
git clone https://github.com/Vera671/BananaYogurt.git
cd BananaYogurt
python3 -m venv .venv  # skip if your virtual environment already exists
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m flask --app src.app index-documents
python src/app.py
```

Open **http://127.0.0.1:5000**. No build step is needed. Flask binds to loopback with debug disabled. Stop it with Ctrl+C.

The indexing command reads existing `uploads/` files. Existing local documents do not need to be uploaded again. A fresh clone contains no private documents: upload your own files using Document Collection. It prints the indexed count and any failures; rerunning only processes changed or failed files. Initial indexing may take time while Ollama loads the embedding model. You can also trigger synchronization by opening/refreshing Document Collection or asking a question.

## How it works

Previously, uploads were stored on disk and listed/deleted through `/api/documents`; chat forwarded conversation history directly to Ollama without reading documents.

Now `src/rag.py` extracts UTF-8 TXT/MD, PDF text per page, and DOCX paragraphs and tables. It splits text into 1,200-character passages with 200-character overlap. Batched calls to Ollama's `/api/embed` use `nomic-embed-text`, with document/query prefixes. Embeddings and extracted passages persist in `data/index.sqlite3`. SQLite with exact cosine search is a suitable local vector store for small study collections; it requires no separate database installation. Search scans the index, so larger collections may need an approximate vector database.

Content hashes and an index version prevent needless re-embedding. Changed documents replace their old passages; failed replacements cannot supply stale evidence. Missing or deleted files are purged. Index changes are transactional per document, and synchronization is serialized within the local Flask process. Run one server process. Original uploads are never rewritten by indexing.

For each question, Flask synchronizes the collection, embeds the question, and retrieves up to four passages with cosine similarity at least 0.35. A system instruction asks Gemma to answer only from those passages, cite numbered sources, ignore instructions embedded in documents, and acknowledge missing answers. The reply includes a server-generated list of retrieved filenames and page/chunk locations, also returned as structured `sources` in the API. Retrieved sources identify evidence supplied to the model; they do not independently verify every generated claim. Small models can still make grounding mistakes. The similarity cutoff is a heuristic, not a guarantee of answerability. With no matching passages, Flask returns a missing-answer message without calling Gemma.

Chat history remains in browser memory and clears on reload or New chat. Switching tabs preserves history and the draft. Follow-up retrieval uses the latest question, so include the subject in ambiguous follow-ups. Failed turns preserve the input for retry. Replies render safely as text with clickable HTTP/HTTPS links.

## Document Collection

Upload PDF, TXT, DOCX, or MD files up to **10 MiB** each. Names are sanitized and duplicates receive unique suffixes. Uploads are saved even when extraction or embeddings fail; the upload message and file list show the failure. Fix the cause and click **Refresh** to retry. The file list displays `indexed` or `failed` without changing the tab layout. A failure in any document blocks document chat with an actionable error, avoiding silently incomplete answers.

Delete permanently removes the selected upload and its index entries. Files removed outside the app are purged on the next synchronization. Scanned PDFs require OCR before upload; encrypted, corrupt, empty files, or non-UTF-8 text can fail extraction. DOCX table text is included; image text and embedded attachments are not extracted.

Endpoints: `GET /api/documents` lists and synchronizes; `POST /api/documents` accepts multipart `file`, saves, and synchronizes; `DELETE /api/documents/<filename>` removes a document; `POST /api/chat` accepts alternating user/assistant `messages`. Chat requests retain a 1 MiB limit and Ollama calls use a 120-second timeout per call.

## Privacy and troubleshooting

`uploads/`, `data/`, vector database files, virtual environments, `.env` files, and Python caches are ignored by Git. Do not force-add them. This project does not publish or upload your documents to GitHub. Document text and questions are sent only to Ollama at localhost:11434. The app is intended for personal local use and has no authentication.

- Cannot reach Ollama: start `ollama serve` or the desktop app.
- Embedding failure: run `ollama pull nomic-embed-text`, then Refresh. Check Ollama logs if it persists.
- Missing chat model: run `ollama pull gemma3:1b`.
- Parser import error: activate `.venv` and reinstall `requirements.txt`.
- No answer: check indexing status, ask a more specific question, or add relevant material.
- To rebuild a corrupt index or after replacing the embedding model: stop Flask, remove only `data/index.sqlite3`, then rerun `index-documents`. Keep `uploads/` intact.
- Storage error: check local permissions and disk space. Long initial indexing may require waiting through several embedding batches.

## Structure and verification

`src/app.py`: Flask routes and grounded prompts; `src/rag.py`: extraction, indexing, embedding, retrieval; `src/templates/` and `src/static/`: existing interface; `tests/`: automated tests; `uploads/`: original private files; `data/`: rebuildable private index.

```bash
python -m unittest discover -s tests -v
```

Tests use temporary directories and mock Ollama, covering index persistence, the five-document backfill, modification/deletion, retries, chunking, malformed embeddings, abstention, prompt injection of source context, API errors, and existing upload/chat behavior. They do not modify your collection. A real model smoke test still requires the setup above: ask “What range does the sigmoid function output?” after uploading a relevant document and confirm a citation to its filename; then ask an unrelated question and check that the assistant acknowledges missing evidence.

Optional frontend interaction check on macOS:

```bash
/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc tests/test_frontend.js
```

Formatting/lint tooling is configured in `pyproject.toml`; install `ruff` separately for development and run `ruff check src/rag.py` or `ruff format src/rag.py`. No frontend build is required.
