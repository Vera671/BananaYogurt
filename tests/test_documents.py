import io
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from src.app import app, MAX_FILE_SIZE


class DocumentTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.config = patch.dict(app.config, UPLOAD_FOLDER=self.directory.name, TESTING=True)
        self.config.start()
        sync = patch('src.app.Store.sync', return_value=(set(), {}))
        sync.start()
        self.addCleanup(sync.stop)
        remove = patch('src.app.Store.remove')
        remove.start()
        self.addCleanup(remove.stop)
        self.client = app.test_client()

    def tearDown(self):
        self.config.stop()
        self.directory.cleanup()

    def upload(self, name, content=b'example'):
        response = self.client.post('/api/documents', data={'file': (io.BytesIO(content), name)})
        response.request.close()
        response.request.input_stream.close()
        return response

    def test_supported_formats_list_size_and_delete(self):
        self.assertEqual(self.client.get('/api/documents').json, {'documents': []})
        for name in ('guide.pdf', 'notes.txt', 'report.docx', 'README.MD'):
            response = self.upload(name)
            self.assertEqual(response.status_code, 201)
            self.assertIn('Uploaded', response.json['message'])
            self.assertEqual((Path(self.directory.name) / name).read_bytes(), b'example')
        documents = self.client.get('/api/documents').json['documents']
        self.assertEqual(len(documents), 4)
        self.assertTrue(all(document['size'] == 7 for document in documents))
        for document in documents:
            response = self.client.delete('/api/documents/' + document['name'])
            self.assertEqual(response.status_code, 200)
            self.assertIn('Deleted', response.json['message'])
        self.assertEqual(list(Path(self.directory.name).iterdir()), [])

    def test_safe_names_and_duplicates_do_not_overwrite(self):
        first = self.upload('../../notes.txt', b'first').json['document']['name']
        second = self.upload('notes.txt', b'second').json['document']['name']
        self.assertEqual(first, 'notes.txt')
        self.assertNotEqual(first, second)
        self.assertEqual((Path(self.directory.name) / first).read_bytes(), b'first')
        self.assertEqual((Path(self.directory.name) / second).read_bytes(), b'second')

    def test_reject_missing_and_unsupported_files(self):
        self.assertEqual(self.client.post('/api/documents').status_code, 400)
        for name in ('', 'file.html', 'file.exe', 'file.pdf.exe', '???'):
            self.assertEqual(self.upload(name).status_code, 400)
        self.assertEqual(list(Path(self.directory.name).iterdir()), [])

    def test_file_size_boundary_and_request_limit(self):
        self.assertEqual(self.upload('limit.txt', b'x' * MAX_FILE_SIZE).status_code, 201)
        response = self.upload('large.txt', b'x' * (MAX_FILE_SIZE + 1))
        self.assertEqual(response.status_code, 413)
        self.assertIn('10 MiB', response.json['error'])
        response = self.upload('huge.txt', b'x' * (MAX_FILE_SIZE + 2 * 1024 * 1024))
        self.assertEqual(response.status_code, 413)
        self.assertEqual(len(list(Path(self.directory.name).iterdir())), 1)

    def test_delete_traversal_missing_and_symlink(self):
        self.assertEqual(self.client.delete('/api/documents/../README.md').status_code, 400)
        self.assertEqual(self.client.delete('/api/documents/missing.txt').status_code, 404)
        target = Path(self.directory.name) / 'target.txt'
        target.write_text('keep')
        (Path(self.directory.name) / 'link.txt').symlink_to(target)
        self.assertEqual(self.client.delete('/api/documents/link.txt').status_code, 404)
        names = [document['name'] for document in self.client.get('/api/documents').json['documents']]
        self.assertNotIn('link.txt', names)
        self.assertEqual(target.read_text(), 'keep')

    def test_storage_errors_return_json(self):
        with patch('src.app.Path.mkdir', side_effect=PermissionError):
            response = self.client.get('/api/documents')
        self.assertEqual(response.status_code, 500)
        self.assertIn('permissions', response.json['error'])

    def test_tabs_and_assets(self):
        page = self.client.get('/').get_data(as_text=True)
        for identifier in ('chat-tab', 'documents-tab', 'chat-panel', 'documents-panel', 'chat-form', 'upload-form'):
            self.assertIn('id="' + identifier + '"', page)
        with self.client.get('/static/documents.js') as response:
            self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
