import io
import json
import unittest
from unittest.mock import patch
from urllib.error import HTTPError, URLError

from src.app import app


class ChatTests(unittest.TestCase):
    def setUp(self):
        self.source = {"filename": "guide.md", "location": "text", "chunk": 1, "text": "Yes", "score": 1}
        search = patch("src.app.Store.search", return_value=[self.source])
        search.start()
        self.addCleanup(search.stop)
        self.client = app.test_client()
        self.messages = [{"role": "user", "content": "Hello"}]

    def test_page_and_assets(self):
        for path in ("/", "/static/chat.js", "/static/style.css"):
            with self.client.get(path) as response:
                self.assertEqual(response.status_code, 200)

    @patch("src.app.urlopen")
    def test_follow_up_preserves_history_and_disables_streaming(self, open_url):
        open_url.return_value = io.BytesIO(json.dumps({"message": {"content": "Yes"}}).encode())
        self.messages.extend([
            {"role": "assistant", "content": "Hi"},
            {"role": "user", "content": "Remember me?"},
        ])
        response = self.client.post("/api/chat", json={"messages": self.messages})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json["message"]["content"].startswith("Yes"))
        self.assertIn("guide.md", response.json["message"]["content"])
        upstream = open_url.call_args.args[0]
        self.assertEqual(upstream.full_url, "http://localhost:11434/api/chat")
        payload = json.loads(upstream.data)
        self.assertEqual(payload["messages"][1:], self.messages)
        self.assertIn("guide.md", payload["messages"][0]["content"])
        self.assertFalse(payload["stream"])
        self.assertEqual(payload["model"], "gemma3:1b")

    @patch("src.app.urlopen")
    def test_invalid_requests_never_call_ollama(self, open_url):
        for messages in (None, [], [None], [{"role": "system", "content": "Hi"}],
                         [{"role": "user", "content": " "}]):
            response = self.client.post("/api/chat", json={"messages": messages})
            self.assertEqual(response.status_code, 400)
        open_url.assert_not_called()

    @patch("src.app.urlopen")
    def test_upstream_errors(self, open_url):
        cases = [
            (URLError("Connection refused"), 503, "ollama serve"),
            (TimeoutError(), 504, "120 seconds"),
            (HTTPError("url", 404, "missing", {}, None), 502, "ollama pull"),
            (HTTPError("url", 500, "failed", {}, None), 502, "HTTP 500"),
        ]
        for failure, code, text in cases:
            with self.subTest(failure=failure):
                open_url.side_effect = failure
                response = self.client.post("/api/chat", json={"messages": self.messages})
                self.assertEqual(response.status_code, code)
                self.assertIn(text, response.json["error"])

    @patch("src.app.urlopen")
    def test_invalid_ollama_responses(self, open_url):
        for body in (b"invalid json", b"[]", b'{}', b'{"message":{"content":""}}'):
            open_url.return_value = io.BytesIO(body)
            response = self.client.post("/api/chat", json={"messages": self.messages})
            self.assertEqual(response.status_code, 502)

    def test_oversized_request(self):
        response = self.client.post("/api/chat", data="x" * (1024 * 1024 + 1),
                                    content_type="application/json")
        self.assertEqual(response.status_code, 413)


if __name__ == "__main__":
    unittest.main()
