// Run from the repository root with the JavaScriptCore `jsc` CLI.
// This is an interaction smoke test with a minimal DOM and mocked network.
function assert(value, message) { if (!value) throw new Error(message); }
class Element {
  constructor() { this.children = []; this.listeners = {}; this.hidden = false; this.value = ''; this.textContent = ''; this.files = []; this.attributes = {}; }
  addEventListener(name, listener) { this.listeners[name] = listener; }
  append(...nodes) { for (const node of nodes) { this.children.push(node); node.parent = this; } }
  replaceChildren() { this.children = []; }
  remove() { this.parent.children = this.parent.children.filter(node => node !== this); }
  setAttribute(name, value) { this.attributes[name] = value; }
  querySelectorAll(selector) { return this.children.flatMap(node => [...(selector === 'button' && node.tag === 'button' ? [node] : []), ...(selector === '.message' && node.className?.startsWith('message ') ? [node] : []), ...node.querySelectorAll(selector)]); }
  focus() {}
  reset() { elements['#document-file'].files = []; }
}
const elements = {};
var document = {
  querySelector(selector) { return elements[selector] || (elements[selector] = new Element()); },
  createElement(tag) { const element = new Element(); element.tag = tag; return element; },
  createTextNode(text) { const element = new Element(); element.textContent = text; return element; }
};
var window = { document };
var FormData = class { constructor() { this.data = {}; } append(key, value) { this.data[key] = value; } };
let files = [];
let chatPayloads = [];
var fetch = async (url, options = {}) => {
  let data;
  if (url === '/api/chat') {
    chatPayloads.push(JSON.parse(options.body));
    data = { message: { role: 'assistant', content: 'Hello from Gemma' } };
  } else if (options.method === 'POST') {
    const file = options.body.data.file;
    files.push({ name: file.name, size: file.size });
    data = { message: 'Uploaded ' + file.name };
  } else if (options.method === 'DELETE') {
    files = files.filter(file => '/api/documents/' + encodeURIComponent(file.name) !== url);
    data = { message: 'Deleted document' };
  } else data = { documents: files };
  return { ok: true, json: async () => data };
};
load('src/static/chat.js');
load('src/static/documents.js');
const flush = async () => { for (let index = 0; index < 20; index++) await Promise.resolve(); };
(async () => {
  const event = { preventDefault() {} };
  elements['#message'].value = 'Hello';
  await elements['#chat-form'].listeners.submit(event);
  assert(elements['#conversation'].children.length === 2, 'Chat reply rendered');
  elements['#message'].value = 'Draft';
  elements['#documents-tab'].listeners.click();
  await flush();
  assert(elements['#chat-panel'].hidden && !elements['#documents-panel'].hidden, 'Documents navigation');
  assert(elements['#documents-empty'].hidden === false, 'Empty state');
  elements['#document-file'].files = [{ name: 'notes.txt', size: 42 }];
  elements['#upload-form'].listeners.submit(event);
  await flush();
  assert(elements['#document-list'].children.length === 1, 'Uploaded file listed');
  assert(elements['#document-status'].textContent.includes('Uploaded'), 'Upload message');
  assert(elements['#document-list'].children[0].children[0].children[1].textContent === '42 B', 'Size displayed');
  elements['#document-list'].children[0].children[1].listeners.click();
  await flush();
  assert(files.length === 0 && elements['#documents-empty'].hidden === false, 'Delete and empty state');
  assert(elements['#document-status'].textContent.includes('Deleted'), 'Deletion message');
  elements['#chat-tab'].listeners.click();
  assert(!elements['#chat-panel'].hidden && elements['#documents-panel'].hidden, 'Chat navigation');
  assert(elements['#message'].value === 'Draft', 'Draft preserved');
  elements['#message'].value = 'Follow-up';
  await elements['#chat-form'].listeners.submit(event);
  assert(chatPayloads[1].messages.length === 3, 'Chat history preserved after tab switches');
  assert(elements['#conversation'].children.length === 4, 'Chat still renders');
  print('PASS: tab switching, upload/list/size/delete/messages, draft and conversation preservation');
})().catch(error => { print('FAIL: ' + error.stack); throw error; });
