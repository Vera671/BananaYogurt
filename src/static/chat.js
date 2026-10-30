const form = document.querySelector('#chat-form');
const input = document.querySelector('#message');
const send = document.querySelector('#send');
const clear = document.querySelector('#clear');
const conversation = document.querySelector('#conversation');
const status = document.querySelector('#status');
const error = document.querySelector('#error');
const welcome = document.querySelector('#welcome');
let messages = [];
let busy = false;

function appendLinkedText(element, content) {
  const urls = /\bhttps?:\/\/[^\s<>"'`]+/gi;
  let position = 0;
  for (const match of content.matchAll(urls)) {
    let url = match[0].replace(/[.,!?;:]+$/, '');
    // Leave sentence delimiters outside links, preserving balanced URL brackets.
    for (const [opening, closing] of [['(', ')'], ['[', ']'], ['{', '}']]) {
      while (url.endsWith(closing)
        && url.split(closing).length > url.split(opening).length) {
        url = url.slice(0, -1);
      }
    }
    element.append(document.createTextNode(content.slice(position, match.index)));
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Invalid protocol');
      const link = document.createElement('a');
      link.href = parsed.href;
      link.textContent = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      element.append(link);
    } catch {
      element.append(document.createTextNode(url));
    }
    position = match.index + url.length;
  }
  element.append(document.createTextNode(content.slice(position)));
}

function addMessage(role, content) {
  const article = document.createElement('article');
  article.className = `message ${role}`;
  const label = document.createElement('h2');
  label.textContent = role === 'user' ? 'You' : 'Gemma';
  const text = document.createElement('p');
  if (role === 'assistant') {
    appendLinkedText(text, content);
  } else {
    text.textContent = content;
  }
  article.append(label, text);
  conversation.append(article);
  conversation.scrollTop = conversation.scrollHeight;
  return article;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const content = input.value.trim();
  if (busy || !content) return;
  busy = true;
  send.disabled = clear.disabled = input.disabled = true;
  error.hidden = true;
  status.textContent = 'Gemma is thinking…';
  welcome.hidden = true;
  const pending = addMessage('user', content);
  input.value = '';
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, { role: 'user', content }] }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not get a reply. Try again.');
    if (typeof data.message?.content !== 'string') throw new Error('The server returned an invalid reply.');
    messages.push({ role: 'user', content }, data.message);
    addMessage('assistant', data.message.content);
  } catch (failure) {
    pending.remove();
    input.value = content;
    welcome.hidden = messages.length > 0;
    error.textContent = failure instanceof TypeError
      ? 'Cannot reach the Flask app. Make sure it is running and try again.'
      : failure.message;
    error.hidden = false;
  } finally {
    busy = false;
    send.disabled = clear.disabled = input.disabled = false;
    status.textContent = '';
    input.focus();
  }
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    form.requestSubmit();
  }
});

clear.addEventListener('click', () => {
  if (busy) return;
  messages = [];
  conversation.querySelectorAll('.message').forEach((message) => message.remove());
  welcome.hidden = false;
  error.hidden = true;
  input.value = '';
  input.focus();
});
