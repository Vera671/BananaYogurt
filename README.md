# GenieAi – Generative AI study assistant (Banana Yogurt)

GenieAi is a local web app for one course, with a student side and a professor side. Its core is **Ask GENieAi**, a chatbot that answers students' questions from the uploaded course materials and shows which file each answer came from. It uses **Ollama** running on your own computer (`gemma3:1b` for answers, `nomic-embed-text` for retrieval), so no cloud API or API key is needed and documents never leave the machine.

It grew out of the Lab "Codex and a personal AI assistant" chatbot (Flask + Ollama, browser-side history, document upload) and keeps all of that behaviour.

| Feature | Who | How it works |
|---|---|---|
| Ask GENieAi | Students (and professors) | RAG over the Library: question → `nomic-embed-text` → top passages → `gemma3:1b` → answer with numbered sources and clickable links. History stays in the browser. |
| Lessons | Everyone | Upload a file (or pick one from the Library) and `gemma3:1b` writes a lesson from it: overview, learning objectives, explained sections, key terms and a multiple-choice practice quiz with answer checking. Students' lessons are private to them; professors can share lessons with the class. |
| Library | Everyone | Uploaded PDF/DOCX/TXT/MD files, labelled as syllabus, lecture notes or weekly update, plus catch-up and recommended video links. Read any document's indexed passages. |
| Course Dashboard | Everyone | Overview, weekly topics, materials, assessments and announcements. |
| Class Summaries | Professors write, students read | `gemma3:1b` drafts a summary and key takeaways from a lecture document; the professor edits and publishes it. |
| Attendance | Both | The professor opens check-in and shows a 6-letter code; students enter it. |
| Anonymous Q&A | Both | Students ask without their name; classmates can add "I have this question too"; the professor replies, optionally starting from a `gemma3:1b` draft based on the course materials. |
| Professor Tools | Professors | Upload materials, generate summaries, post exam updates, recommend videos, manage Q&A. |
| Analytics (learning gaps) | Professors | Counts the topics of GENieAi and Q&A questions (anonymously) and flags topics with 3 or more. |

## Install on a Mac (one step)

You need macOS 14 or newer and about 2 GB of free disk space. Open **Terminal**, go to this folder and run:

```bash
bash setup_mac.sh
```

The script installs Ollama (if missing), downloads `gemma3:1b` and `nomic-embed-text`, creates a Python virtual environment, installs the packages, adds sample course materials, indexes them and opens GenieAi in your browser. If macOS asks to install the Command Line Tools (needed for Python), click **Install**, wait, then run the command again. Use `bash setup_mac.sh --no-demo` to skip the sample materials.

Next time, start GenieAi by double-clicking **start_genieai.command** (or `bash start_genieai.command`). Keep that Terminal window open while you use it; press Ctrl+C to stop. It opens **http://127.0.0.1:5000**, or port 5001 if macOS AirPlay Receiver is using 5000.

## Manual setup (any OS)

Requires Python 3.9+ and [Ollama](https://ollama.com/).

```bash
ollama pull gemma3:1b
ollama pull nomic-embed-text
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
python -m pip install -r requirements.txt
python -m flask --app src.app seed-demo        # optional: sample course materials
python -m flask --app src.app index-documents
python src/app.py                               # PORT=5001 python src/app.py to change port
```

## Using it

Pick **Student** or **Professor** on the first screen and enter your name. This local version has no passwords: the role is remembered in that browser only, so anyone using the computer can switch. To try both sides at once, open the professor in one browser and the student in another (or a private window).

Course details (name, instructor, schedule, current week, weekly topics, assessments, the "This week" checklist) live in **`src/course.json`**. The values there are samples; edit them to match the real course and restart the app.

Small local models are slow on some laptops and can still make mistakes. An answer can take from a few seconds to a minute, and summaries and drafted replies should be checked before publishing.

## How it works

`src/rag.py` extracts text (PDF per page, DOCX paragraphs and tables, TXT/MD), splits it into 1,200-character passages with 200-character overlap, embeds them with `nomic-embed-text` through Ollama's `/api/embed`, and stores them in `data/index.sqlite3`. For each question it retrieves up to four passages with cosine similarity of at least 0.35. `src/app.py` sends those passages and the conversation to `gemma3:1b` through `/api/chat` (non-streaming) with instructions to answer only from them, cite `[1]`, `[2]`, and ignore instructions inside documents. With no matching passage it says so without calling the model. All Ollama calls happen in Python, never in the browser.

`src/genie.py` adds the course features. Questions, votes, announcements, summaries, attendance, video links, material labels and topic counts are stored in `data/genie.sqlite3`. Students are identified only by a random ID kept in their browser, which lets GenieAi show "My Questions" and attendance records without names. Professors never see who asked a question. Topic counts come from keyword rules, not from the model.

Content hashes stop unchanged documents from being embedded again; changed or deleted files are re-indexed or purged on the next sync. Uploads are limited to 10 MiB, and chat requests to 1 MiB. Ollama calls time out after 120 seconds for chat, 180 seconds for summaries and drafted replies, and 300 seconds for lessons. Lessons use only the first 7,000 characters of a document, so split very long files.

## API

| Method and path | Purpose |
|---|---|
| `POST /api/chat` | `{messages:[...]}` alternating user/assistant → `{message, sources}` |
| `GET/POST /api/documents`, `DELETE /api/documents/<name>` | List and sync, upload (multipart `file`), delete |
| `GET /api/documents/<name>/passages` | Indexed passages of one document |
| `PUT /api/materials/<name>` | Title, category (`slides`, `syllabus`, `update`, `other`) and week |
| `GET /api/overview?role=student\|professor` | Everything the pages show (attendance code only for `professor`) |
| `POST /api/questions`, `/vote`, `/answer`, `/draft`; `DELETE /api/questions/<id>` | Anonymous Q&A (send `X-Client-Id`) |
| `POST /api/announcements`, `DELETE /api/announcements/<id>` | Exam and course updates |
| `POST /api/summaries/generate`, `POST /api/summaries`, `DELETE /api/summaries/<id>` | Draft with `gemma3:1b`, publish, remove |
| `POST /api/lessons` (`document`, optional `focus`, `share`), `POST /api/lessons/<id>/share`, `DELETE /api/lessons/<id>` | Generate a lesson with Ollama structured JSON output, share it, delete it |
| `POST /api/videos`, `DELETE /api/videos/<id>` | Recommended and catch-up video links |
| `POST /api/attendance/open`, `POST /api/attendance/checkin` | New check-in code; student check-in |

## Privacy and troubleshooting

`uploads/`, `data/`, `.venv/`, `.env` files and caches are ignored by Git. Do not force-add them; this project never uploads your documents to GitHub. Document text and questions go only to Ollama at localhost:11434. Flask binds to 127.0.0.1 with debug off. There is no authentication, so this is for local use and demos, not a public server.

- **Cannot reach Ollama**: open the Ollama app (llama icon in the menu bar) or run `ollama serve`.
- **Model not found**: `ollama pull gemma3:1b` and `ollama pull nomic-embed-text`.
- **Port 5000 in use / 403 page**: macOS AirPlay Receiver uses port 5000. `start_genieai.command` switches to 5001 automatically; or turn off AirPlay Receiver in System Settings → General → AirDrop & Handoff.
- **No answer found**: add relevant material to the Library or ask more specifically.
- **Rebuild the index**: stop the app, delete only `data/index.sqlite3`, then run `index-documents`. Deleting `data/genie.sqlite3` resets Q&A, summaries, attendance and announcements.

## Structure and tests

`src/app.py` Flask app, chat and document routes · `src/rag.py` extraction, embeddings, retrieval · `src/genie.py` course features · `src/course.json` course details · `src/templates/`, `src/static/` the GenieAi interface (no build step) · `docs/sample-materials/` sample lecture notes used by `seed-demo` · `tests/` automated tests · `setup_mac.sh`, `start_genieai.command` Mac install and start.

```bash
python -m unittest discover -s tests -v
```

The tests use temporary folders and mock Ollama. They cover chat history and errors, uploads, indexing and retrieval, anonymous Q&A (authors hidden, votes counted once), attendance codes hidden from students, summaries parsed from model output, Ollama-down errors, video link validation, lesson generation (malformed model output is cleaned or rejected; private lessons stay private) and the demo seed. A real-model check still needs the setup above: ask "What is RAG and how is it different from fine-tuning?" and confirm the answer cites `Week7_RAG_and_Vector_Databases.md`; then ask something unrelated and check that GENieAi says the materials don't cover it.
