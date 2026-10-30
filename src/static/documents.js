const chatTab = document.querySelector('#chat-tab');
const documentsTab = document.querySelector('#documents-tab');
const chatPanel = document.querySelector('#chat-panel');
const documentsPanel = document.querySelector('#documents-panel');
const uploadForm = document.querySelector('#upload-form');
const fileInput = document.querySelector('#document-file');
const uploadButton = document.querySelector('#upload-button');
const documentList = document.querySelector('#document-list');
const documentStatus = document.querySelector('#document-status');
const documentError = document.querySelector('#document-error');
const emptyDocuments = document.querySelector('#documents-empty');
const refreshDocuments = document.querySelector('#refresh-documents');
let documentsBusy = false;

async function documentRequest(url, options = {}) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error('Cannot reach Flask. Make sure the app is running and try again.');
  }
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Document request failed. Try again.');
  return data;
}

function showDocumentError(error) {
  documentError.textContent = error.message;
  documentError.hidden = false;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}

async function loadDocuments() {
  const data = await documentRequest('/api/documents');
  documentList.replaceChildren();
  emptyDocuments.hidden = data.documents.length !== 0;
  for (const document of data.documents) {
    const row = window.document.createElement('li');
    const details = window.document.createElement('div');
    const name = window.document.createElement('strong');
    name.textContent = document.name;
    const size = window.document.createElement('span');
    size.textContent = formatSize(document.size) + (document.index_status ? ` · ${document.index_status}` : "");
    if (document.index_error) size.textContent += `: ${document.index_error}`;
    details.append(name, size);
    const remove = window.document.createElement('button');
    remove.type = 'button';
    remove.className = 'secondary';
    remove.textContent = 'Delete';
    remove.setAttribute('aria-label', `Delete ${document.name}`);
    remove.addEventListener('click', () => performDocumentAction(async () => {
      const result = await documentRequest(`/api/documents/${encodeURIComponent(document.name)}`, { method: 'DELETE' });
      documentStatus.textContent = result.message;
      await loadDocuments();
    }));
    row.append(details, remove);
    documentList.append(row);
  }
}

async function performDocumentAction(action) {
  if (documentsBusy) return;
  documentsBusy = true;
  documentError.hidden = true;
  documentStatus.textContent = 'Working…';
  uploadButton.disabled = fileInput.disabled = refreshDocuments.disabled = true;
  documentList.querySelectorAll('button').forEach((button) => { button.disabled = true; });
  try {
    await action();
  } catch (error) {
    if (documentStatus.textContent === 'Working…') documentStatus.textContent = '';
    showDocumentError(error);
  } finally {
    documentsBusy = false;
    uploadButton.disabled = fileInput.disabled = refreshDocuments.disabled = false;
    documentList.querySelectorAll('button').forEach((button) => { button.disabled = false; });
  }
}

function selectSection(showDocuments) {
  chatPanel.hidden = showDocuments;
  documentsPanel.hidden = !showDocuments;
  clear.hidden = showDocuments;
  chatTab.setAttribute('aria-pressed', String(!showDocuments));
  documentsTab.setAttribute('aria-pressed', String(showDocuments));
  if (showDocuments) refreshCollection();
}

function refreshCollection() {
  return performDocumentAction(async () => {
    await loadDocuments();
    documentStatus.textContent = '';
  });
}

chatTab.addEventListener('click', () => selectSection(false));
documentsTab.addEventListener('click', () => selectSection(true));
refreshDocuments.addEventListener('click', refreshCollection);
uploadForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const file = fileInput.files[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) {
    showDocumentError(new Error('File is too large. Maximum file size is 10 MiB.'));
    return;
  }
  const body = new FormData();
  body.append('file', file);
  performDocumentAction(async () => {
    const result = await documentRequest('/api/documents', { method: 'POST', body });
    documentStatus.textContent = result.message;
    uploadForm.reset();
    await loadDocuments();
  });
});
