import io
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from src.app import app
from src import genie

STUDENT = {"X-Client-Id": "student-aaaa-1111"}
OTHER = {"X-Client-Id": "student-bbbb-2222"}


class GenieTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        root = Path(self.directory.name)
        self.config = patch.dict(app.config, UPLOAD_FOLDER=str(root / "uploads"),
                                 INDEX_PATH=str(root / "index.sqlite3"),
                                 GENIE_PATH=str(root / "genie.sqlite3"), TESTING=True)
        self.config.start()
        self.client = app.test_client()

    def tearDown(self):
        self.config.stop()
        self.directory.cleanup()

    def overview(self, headers=STUDENT, role="student"):
        response = self.client.get(f"/api/overview?role={role}", headers=headers)
        self.assertEqual(response.status_code, 200)
        return response.json

    def test_anonymous_question_vote_and_answer(self):
        response = self.client.post("/api/questions", json={"text": "How big should RAG chunks be?"},
                                    headers=STUDENT)
        self.assertEqual(response.status_code, 201)
        question = self.overview()["questions"][0]
        self.assertTrue(question["mine"])
        self.assertEqual(question["topic"], "RAG & Vector DBs")
        self.assertNotIn("author", question)
        self.assertFalse(self.overview(OTHER)["questions"][0]["mine"])
        self.client.post(f"/api/questions/{question['id']}/vote", headers=OTHER)
        self.client.post(f"/api/questions/{question['id']}/vote", headers=OTHER)
        self.assertEqual(self.overview()["questions"][0]["votes"], 2)
        response = self.client.post(f"/api/questions/{question['id']}/answer", json={"answer": "About 500 tokens."})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.overview()["questions"][0]["answer"], "About 500 tokens.")
        self.assertEqual(self.overview()["topics"]["RAG & Vector DBs"], 2)

    def test_question_needs_client_and_text(self):
        self.assertEqual(self.client.post("/api/questions", json={"text": "Why?"}).status_code, 400)
        self.assertEqual(self.client.post("/api/questions", json={"text": "Hi"}, headers=STUDENT).status_code, 400)

    def test_attendance_code_hidden_from_students(self):
        self.assertFalse(self.overview()["attendance"]["open"])
        bad = self.client.post("/api/attendance/checkin", json={"code": "ABCDEF"}, headers=STUDENT)
        self.assertEqual(bad.status_code, 409)
        code = self.client.post("/api/attendance/open").json["code"]
        self.assertNotIn("code", self.overview()["attendance"])
        wrong = self.client.post("/api/attendance/checkin", json={"code": "ZZZZZZ"}, headers=STUDENT)
        self.assertEqual(wrong.status_code, 400)
        ok = self.client.post("/api/attendance/checkin", json={"code": code.lower(), "name": "Verana"}, headers=STUDENT)
        self.assertEqual(ok.status_code, 200)
        self.assertTrue(self.overview()["attendance"]["checked_in"])
        professor = self.overview(role="professor")["attendance"]
        self.assertEqual((professor["code"], professor["count"], professor["names"]), (code, 1, ["Verana"]))

    def test_announcements_videos_and_material_labels(self):
        self.client.post("/api/announcements", json={"title": "Midterm moved", "kind": "Exam"})
        self.assertEqual(self.client.post("/api/videos", json={"title": "x", "url": "javascript:alert(1)"}).status_code, 400)
        self.client.post("/api/videos", json={"title": "RAG talk", "url": "https://example.com/v"})
        uploads = Path(app.config["UPLOAD_FOLDER"])
        uploads.mkdir()
        (uploads / "Week8_LoRA.md").write_text("# LoRA", encoding="utf-8")
        self.client.put("/api/materials/Week8_LoRA.md", json={"title": "Week 8: LoRA", "category": "slides", "week": 8})
        self.assertEqual(self.client.put("/api/materials/missing.md", json={}).status_code, 404)
        data = self.overview()
        self.assertEqual(data["announcements"][0]["title"], "Midterm moved")
        self.assertEqual(data["videos"][0]["url"], "https://example.com/v")
        self.assertEqual(data["materials"][0]["title"], "Week 8: LoRA")
        self.assertEqual(data["materials"][0]["week"], 8)

    @patch("src.genie.Store.passages", return_value=[(1, "text", "RAG retrieves documents.")])
    @patch("src.genie.urlopen")
    def test_generate_and_publish_summary(self, open_url, _passages):
        uploads = Path(app.config["UPLOAD_FOLDER"])
        uploads.mkdir()
        (uploads / "rag.md").write_text("RAG", encoding="utf-8")
        reply = "**Summary:** RAG looks things up before answering.\n\n**Takeaways:**\n- Retrieve first\n- Cite sources"
        open_url.return_value = io.BytesIO(json.dumps({"message": {"content": reply}}).encode())
        response = self.client.post("/api/summaries/generate", json={"document": "rag.md"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["summary"], "RAG looks things up before answering.")
        self.assertEqual(response.json["takeaways"], ["Retrieve first", "Cite sources"])
        payload = json.loads(open_url.call_args.args[0].data)
        self.assertEqual(payload["model"], "gemma3:1b")
        self.assertFalse(payload["stream"])
        self.assertIn("RAG retrieves documents.", payload["messages"][1]["content"])
        self.client.post("/api/summaries", json={"title": "RAG", "week": 7, "document": "rag.md",
                                                 "summary": response.json["summary"], "takeaways": ["A", " "]})
        summary = self.overview()["summaries"][0]
        self.assertEqual((summary["week"], summary["takeaways"]), (7, ["A"]))

    @patch("src.genie.urlopen", side_effect=genie.URLError("refused"))
    @patch("src.genie.Store.passages", return_value=[(1, "text", "x")])
    def test_ollama_down_gives_clear_error(self, _passages, _open_url):
        uploads = Path(app.config["UPLOAD_FOLDER"])
        uploads.mkdir()
        (uploads / "rag.md").write_text("RAG", encoding="utf-8")
        response = self.client.post("/api/summaries/generate", json={"document": "rag.md"})
        self.assertEqual(response.status_code, 503)
        self.assertIn("Ollama", response.json["error"])

    def test_chat_questions_count_toward_topics(self):
        with patch("src.app.Store.search", return_value=[]):
            self.client.post("/api/chat", json={"messages": [{"role": "user", "content": "What is cosine similarity?"}]})
        self.assertEqual(self.overview()["topics"], {"Embeddings": 1})

    def test_seed_demo_is_repeatable(self):
        copied, total = genie.seed_demo(app)
        self.assertEqual(copied, total)
        self.assertEqual(genie.seed_demo(app)[0], 0)
        data = self.overview(role="professor")
        self.assertEqual(len(data["materials"]), total)
        self.assertEqual(len(data["questions"]), 3)
        self.assertTrue(data["attendance"]["open"])
        syllabus = [m for m in data["materials"] if m["category"] == "syllabus"]
        self.assertEqual(len(syllabus), 1)

    def make_doc(self, name="rag.md"):
        uploads = Path(app.config["UPLOAD_FOLDER"])
        uploads.mkdir(exist_ok=True)
        (uploads / name).write_text("RAG", encoding="utf-8")

    @patch("src.genie.Store.passages", return_value=[(1, "text", "RAG retrieves documents before answering.")])
    @patch("src.genie.urlopen")
    def test_generate_lesson_private_then_shared(self, open_url, _passages):
        self.make_doc()
        lesson = {"title": "RAG basics", "overview": "How RAG works.", "objectives": ["Explain RAG", 5],
                  "sections": [{"heading": "Retrieval", "content": "Find passages."}, {"heading": "x", "content": ""}],
                  "key_terms": [{"term": "RAG", "definition": "Retrieval-augmented generation"}],
                  "quiz": [{"question": "What does R stand for?", "options": ["Retrieval", "Random"], "answer": 0,
                            "explanation": "R is retrieval."},
                           {"question": "Counted from one?", "options": ["a", "b", "c"], "answer": 3, "explanation": ""},
                           {"question": "Broken", "options": ["only one"], "answer": 0, "explanation": ""}]}
        open_url.return_value = io.BytesIO(json.dumps({"message": {"content": json.dumps(lesson)}}).encode())
        response = self.client.post("/api/lessons", json={"document": "rag.md", "focus": "examples"}, headers=STUDENT)
        self.assertEqual(response.status_code, 201)
        saved = response.json["lesson"]
        self.assertEqual(saved["objectives"], ["Explain RAG"])
        self.assertEqual(len(saved["sections"]), 1)
        self.assertEqual([q["answer"] for q in saved["quiz"]], [0, 2])
        payload = json.loads(open_url.call_args.args[0].data)
        self.assertEqual(payload["format"]["type"], "object")
        self.assertIn("FOCUS: examples", payload["messages"][1]["content"])
        lid = response.json["id"]
        self.assertTrue(self.overview()["lessons"][0]["mine"])
        self.assertEqual(self.overview(OTHER)["lessons"], [])
        self.assertEqual(self.client.post(f"/api/lessons/{lid}/share", json={"share": True}, headers=OTHER).status_code, 403)
        self.client.post(f"/api/lessons/{lid}/share", json={"share": True}, headers=STUDENT)
        self.assertEqual(self.overview(OTHER)["lessons"][0]["lesson"]["title"], "RAG basics")
        self.assertEqual(self.client.delete(f"/api/lessons/{lid}", headers=OTHER).status_code, 403)
        self.assertEqual(self.client.delete(f"/api/lessons/{lid}?role=professor", headers=OTHER).status_code, 200)

    @patch("src.genie.Store.passages", return_value=[(1, "text", "x")])
    @patch("src.genie.urlopen")
    def test_lesson_bad_model_output(self, open_url, _passages):
        self.make_doc()
        open_url.return_value = io.BytesIO(json.dumps({"message": {"content": "not json at all"}}).encode())
        response = self.client.post("/api/lessons", json={"document": "rag.md"}, headers=STUDENT)
        self.assertEqual(response.status_code, 502)
        self.assertEqual(self.overview()["lessons"], [])
        self.assertEqual(self.client.post("/api/lessons", json={"document": "missing.md"}, headers=STUDENT).status_code, 404)


if __name__ == "__main__":
    unittest.main()
