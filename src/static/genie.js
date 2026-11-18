/* GenieAi frontend. Talks only to the local Flask app, which talks to Ollama on this computer. */
'use strict';

/* ======================= icons ======================= */
const ICONS={
  spark:'<path d="M12 2.5l2.1 6.4 6.4 2.1-6.4 2.1L12 19.5l-2.1-6.4L3.5 11l6.4-2.1z"/><path d="M19 17l.7 2.1 2.1.7-2.1.7L19 22.6l-.7-2.1-2.1-.7 2.1-.7z"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  chat:'<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>',
  book:'<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  library:'<path d="M4 4h4v16H4z"/><path d="M10 4h4v16h-4z"/><path d="M16.5 5.2l3.4-.9 3.1 15.5-3.4.9z"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/>',
  cal:'<rect x="3" y="4.5" width="18" height="16.5" rx="2"/><path d="M16 2.5v4M8 2.5v4M3 10h18"/><path d="M9 15.5l2 2 4-4"/>',
  question:'<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/><path d="M9.8 9.3a2.3 2.3 0 0 1 4.4.8c0 1.5-2.2 2-2.2 2"/><path d="M12 15.2h.01"/>',
  tools:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  chart:'<path d="M3 21h18"/><path d="M6 17V11M11 17V5M16 17v-8M21 17v-4"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>',
  video:'<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="M10 9l5 3-5 3z"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  send:'<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  check:'<path d="M20 6L9 17l-5-5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  lock:'<rect x="4.5" y="11" width="15" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  right:'<path d="M9 18l6-6-6-6"/>',
  x:'<path d="M18 6L6 18M6 6l12 12"/>',
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  layers:'<path d="M12 2l10 5-10 5L2 7z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  megaphone:'<path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M17 8.5a5 5 0 0 1 0 7"/><path d="M8 14l1 6h3l-1-5"/>',
  external:'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14L21 3"/>',
  refresh:'<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/>',
  thumb:'<path d="M7 10v11H3V10z"/><path d="M7 10l4-8a3 3 0 0 1 3 3v4h5.5a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 18.1 21H7"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/>'
};
const ic=(n,s=18)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||''}</svg>`;
const logo=(s=26)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><path fill="#de3561" d="M11 1.5l2.4 7.3 7.3 2.4-7.3 2.4L11 20.9l-2.4-7.3-7.3-2.4 7.3-2.4z"/><path fill="#ff8aa8" d="M19.5 15.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z"/></svg>`;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ======================= local preferences ======================= */
// Who is using this browser. GenieAi runs on your own computer and has no accounts yet,
// so the role and name are remembered in this browser only.
const PREF_KEY = 'genieai-prefs-v2';
function makeId() {
  try { if (crypto.randomUUID) return crypto.randomUUID(); } catch (e) { /* older browser */ }
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
let P = { role: null, name: '', cid: makeId(), checks: {}, seen: 0 };
try { P = Object.assign(P, JSON.parse(localStorage.getItem(PREF_KEY)) || {}); } catch (e) { /* storage unavailable */ }
function savePrefs() { try { localStorage.setItem(PREF_KEY, JSON.stringify(P)); } catch (e) { /* ignore */ } }
savePrefs();

let D = null; // data from /api/overview
const UI = { view: 'dashboard', libTab: 'all', libQuery: '', courseTab: 'overview', qaTab: 'all', attTab: 'checkin',
  openSummary: null, openLesson: null, answers: {}, checked: {}, busy: false, sideOpen: false, pop: false, loadError: '',
  chat: [], history: [], chatError: '', draft: '' };

/* ======================= API ======================= */
async function api(url, options = {}) {
  const init = { method: options.method || 'GET', headers: { 'X-Client-Id': P.cid } };
  if (options.form) init.body = options.form;
  else if (options.body !== undefined) { init.body = JSON.stringify(options.body); init.headers['Content-Type'] = 'application/json'; }
  let response;
  try { response = await fetch(url, init); } catch (e) {
    throw new Error('Cannot reach GenieAi. Make sure it is still running in Terminal, then try again.');
  }
  let data = {};
  try { data = await response.json(); } catch (e) { /* non-JSON error page */ }
  if (!response.ok) throw new Error(data.error || `Request failed (HTTP ${response.status}). Try again.`);
  return data;
}
async function refresh() {
  try { D = await api('/api/overview?role=' + encodeURIComponent(P.role || 'student')); UI.loadError = ''; }
  catch (e) { UI.loadError = e.message; }
  render();
}

/* ======================= helpers ======================= */
const C = () => D.course;
function rel(iso) {
  if (!iso) return '';
  const d = (Date.now() - new Date(iso)) / 60000;
  if (d < 1) return 'just now'; if (d < 60) return Math.round(d) + ' min ago';
  if (d < 1440) return Math.round(d / 60) + ' hr ago';
  const n = Math.round(d / 1440); return n + (n === 1 ? ' day ago' : ' days ago');
}
function size(b) { return b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB'; }
function toast(msg, bad) {
  document.querySelectorAll('.toast').forEach(x => x.remove());
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status');
  t.innerHTML = (bad ? ic('x', 16) : ic('check', 16)) + esc(msg); document.body.appendChild(t); setTimeout(() => t.remove(), 3200);
}
const pending = () => D.questions.filter(q => !q.answer).length;
const GAP_AT = 3;
const gapTopics = () => Object.entries(D.topics).filter(([, n]) => n >= GAP_AT);
const CAT = { student: 'Student upload', slides: 'Lecture notes', syllabus: 'Syllabus', update: 'Weekly update', other: 'Document', catchup: 'Catch-up video', recommended: 'Recommended video' };
const mat = name => D.materials.find(m => m.name === name);

// Safe rendering for model output: escape, then add **bold**, bullets, [n] citations and clickable links.
function linkify(html) {
  return html.replace(/\bhttps?:\/\/[^\s<]+/g, raw => {
    let url = raw.replace(/[.,!?;:)\]]+$/, '');
    const rest = raw.slice(url.length);
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>${rest}`;
  });
}
function md(text) {
  const lines = esc(text).split('\n'); let out = '', inList = false;
  const fmt = l => linkify(l.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[(\d{1,2})\]/g, '<sup>[$1]</sup>'));
  for (const raw of lines) {
    const l = raw.trim();
    if (/^[-•*]\s+/.test(l)) { if (!inList) { out += '<ul>'; inList = true; } out += '<li>' + fmt(l.replace(/^[-•*]\s+/, '')) + '</li>'; }
    else { if (inList) { out += '</ul>'; inList = false; } if (l) out += '<p>' + fmt(l) + '</p>'; }
  }
  if (inList) out += '</ul>'; return out;
}

/* ======================= layout ======================= */
const NAV = {
  student: [['dashboard', 'Dashboard', 'grid'], ['ask', 'Ask GENieAi', 'spark'], ['lessons', 'Lessons', 'layers'], ['courses', 'My Courses', 'book'], ['library', 'Library', 'library'], ['summaries', 'Class Summaries', 'file'], ['attendance', 'Attendance', 'cal'], ['qa', 'Anonymous Q&A', 'question']],
  professor: [['dashboard', 'Dashboard', 'grid'], ['courses', 'My Courses', 'book'], ['tools', 'Professor Tools', 'tools'], ['lessons', 'Lessons', 'layers'], ['qa', 'Anonymous Q&A', 'question'], ['analytics', 'Analytics', 'chart'], ['library', 'Library', 'library'], ['summaries', 'Class Summaries', 'file'], ['attendance', 'Attendance', 'cal'], ['ask', 'Ask GENieAi', 'spark']]
};
const TITLES = { lessons: 'Lessons', dashboard: 'Dashboard', ask: 'Ask GENieAi', courses: 'My Courses', library: 'Library', summaries: 'Class Summaries', attendance: 'Attendance', qa: 'Anonymous Q&A', tools: 'Professor Tools', analytics: 'Analytics' };

function notifications() {
  return [...D.announcements.map(a => ({ i: 'megaphone', t: a.title, at: a.created })),
    ...D.questions.filter(q => q.mine && q.answer).map(q => ({ i: 'question', t: 'Your question was answered: “' + q.text.slice(0, 60) + (q.text.length > 60 ? '…' : '') + '”', at: q.answered }))]
    .sort((a, b) => new Date(b.at) - new Date(a.at));
}

function render() {
  const root = document.getElementById('root');
  if (!P.role) { root.innerHTML = viewLogin(); bindLogin(); document.title = 'GenieAi'; return; }
  if (!D) {
    root.innerHTML = UI.loadError
      ? `<div class="loading-page"><div style="max-width:420px;text-align:center;display:flex;flex-direction:column;gap:12px"><p class="err">${esc(UI.loadError)}</p><button class="btn" data-act="retry">Try again</button></div></div>`
      : `<div class="loading-page"><span class="spin"></span>Loading GenieAi…</div>`;
    return;
  }
  const nav = NAV[P.role]; if (!nav.find(n => n[0] === UI.view)) UI.view = 'dashboard';
  const unseen = notifications().length - (P.seen || 0);
  root.innerHTML = `<div class="app">
   <aside class="side ${UI.sideOpen ? 'open' : ''}">
     <div class="brand">${logo()}<span>Genie<b>Ai</b></span></div>
     <nav class="nav" aria-label="Main">${nav.map(([k, l, i]) => `<a href="#${k}" class="${UI.view === k ? 'on' : ''}">${ic(i)}${l}${k === 'qa' && P.role === 'professor' && pending() ? `<span class="count">${pending()}</span>` : ''}</a>`).join('')}</nav>
     <div class="side-foot">
       <div class="who"><div class="avatar">${esc((P.name || '?')[0]).toUpperCase()}</div><div class="meta"><span>${esc(P.name)}</span><span>${P.role === 'student' ? 'Student' : 'Professor'}</span></div></div>
       <button class="btn ghost sm" data-act="logout">${ic('logout', 16)}Switch user</button>
     </div>
   </aside>
   <main class="main" id="main">
     <div class="topbar">
       <button class="icon-btn menu-btn" data-act="menu" aria-label="Open menu">${ic('menu')}</button>
       <span class="crumb">${esc(C().name)} · ${esc(C().program || C().code)} · Week ${C().current_week}</span>
       <span class="spacer"></span>
       <span class="pill" title="All AI runs on this computer through Ollama">${ic('lock', 12)}Local · gemma3:1b</span>
       <div style="position:relative"><button class="icon-btn" data-act="bell" aria-label="Notifications">${ic('bell')}${unseen > 0 ? '<span class="dot"></span>' : ''}</button></div>
     </div>
     ${UI.pop ? `<div class="pop" role="dialog" aria-label="Notifications"><div class="list">${notifications().map(x => `<div class="row">${ic(x.i, 16)}<div class="grow small">${esc(x.t)}<div class="tiny muted">${rel(x.at)}</div></div></div>`).join('') || '<div class="row muted small">No notifications yet.</div>'}</div></div>` : ''}
     ${VIEWS[UI.view]()}
   </main></div>`;
  document.title = TITLES[UI.view] + ' · GenieAi';
  if (after[UI.view]) after[UI.view]();
}

/* ======================= login ======================= */
let loginRole = 'student';
function viewLogin() {
  const feat = (i, t, d) => `<div>${ic(i, 22).replace('class="ic"', 'class="ic" style="color:var(--accent)"')}<strong>${t}</strong><span class="muted">${d}</span></div>`;
  return `<div class="login">
  <div class="login-copy">
    <div class="brand">${logo(58)}<span>Genie<b>Ai</b></span></div>
    <p class="lead">Your Generative AI study assistant</p>
    <p class="muted">Ask questions about your course and get answers that point back to the material they came from. Everything runs on this computer with Ollama, so your documents and questions never leave it.</p>
    <div class="login-feats">${feat('spark', 'AI Study Assistant', 'Ollama + RAG over course materials')}${feat('layers', 'Course Resources', 'Notes, updates, videos and AI summaries')}${feat('users', 'Students & Professors', 'Attendance, anonymous Q&A, learning gaps')}</div>
  </div>
  <form class="login-card" id="loginForm">
    <h2>Log in to GenieAi</h2>
    <div class="seg" role="tablist">
      <button type="button" class="${loginRole === 'student' ? 'on' : ''}" data-role="student">Student</button>
      <button type="button" class="${loginRole === 'professor' ? 'on' : ''}" data-role="professor">Professor</button>
    </div>
    <div class="field"><label for="lname">Your name</label><div class="input-icon">${ic('user', 16)}<input class="input" id="lname" value="${esc(P.name && P.name !== 'Professor' ? P.name : '')}" placeholder="${loginRole === 'student' ? 'e.g. Verana' : 'e.g. Dr. Kanya'}" autocomplete="name" required></div></div>
    <button class="btn primary" style="justify-content:center;padding:12px">Continue as ${loginRole}</button>
    <p class="demo-note">This local version has no passwords yet. Pick a role to see the student or professor side.</p>
  </form>
</div>`;
}
function bindLogin() {
  document.querySelectorAll('[data-role]').forEach(b => b.onclick = () => { loginRole = b.dataset.role; render(); });
  document.getElementById('loginForm').onsubmit = e => {
    e.preventDefault();
    const name = document.getElementById('lname').value.trim();
    if (!name) { toast('Enter your name to continue', true); return; }
    P.role = loginRole; P.name = name; savePrefs();
    UI.view = 'dashboard'; history.replaceState(null, '', '#dashboard'); D = null; render(); refresh();
  };
  const n = document.getElementById('lname'); if (n) n.focus();
}

/* ======================= views ======================= */
const VIEWS = {}; const after = {};

VIEWS.dashboard = () => P.role === 'student' ? studentDash() : profDash();
function studentDash() {
  const items = C().this_week || []; const done = items.filter(x => P.checks[x.id]).length;
  const s = D.summaries[0];
  return `<section class="view">
   <div class="view-head"><div><h1>Welcome back, ${esc(P.name)}</h1><p class="sub">Week ${C().current_week} of ${C().weeks.length}. Here is what's on for ${esc(C().name)}.</p></div></div>
   <div class="grid g2">
     <button class="course-hero" data-go="courses"><canvas id="heroWave"></canvas>
       <span class="pill accent" style="align-self:flex-start;margin-bottom:auto">Ongoing · Week ${C().current_week}</span>
       <h2>${esc(C().name)}</h2><span class="muted">${esc(C().code)} · ${esc(C().instructor)} · ${esc(C().schedule)}</span>
       <span class="go">${ic('right')}</span></button>
     <div class="card"><div class="card-head"><h2>This week</h2><span class="tiny muted">${done} of ${items.length} done</span></div>
       <div class="checklist">${items.map(x => `<label class="check-row ${P.checks[x.id] ? 'done' : ''}"><input type="checkbox" data-check="${esc(x.id)}" ${P.checks[x.id] ? 'checked' : ''}><span><span class="t">${esc(x.label)}</span><br><span class="tiny muted">${esc(x.meta || '')}</span></span></label>`).join('')}</div></div>
   </div>
   <div><h2 style="margin-bottom:12px">Quick access</h2>
    <div class="tiles">${[['ask', 'Ask GENieAi', 'spark'], ['lessons', 'Lessons', 'layers'], ['library', 'Library', 'library'], ['summaries', 'Class Summaries', 'file'], ['attendance', 'Attendance', 'cal'], ['qa', 'Anonymous Q&A', 'question']].map(([k, l, i]) => `<a class="tile" href="#${k}">${ic(i, 24)}${l}</a>`).join('')}</div></div>
   <div class="grid g2">
     <div class="card"><div class="card-head"><h2>Latest class summary</h2><a href="#summaries" class="small">All summaries</a></div>
       ${s ? `<h3>Week ${s.week}: ${esc(s.title)}</h3><p class="tiny muted" style="margin:2px 0 10px">${rel(s.created)} · AI summary</p><p class="muted">${esc(s.summary)}</p>` : '<p class="muted">Your professor hasn\'t published a summary yet.</p>'}</div>
     <div class="card"><div class="card-head"><h2>Announcements</h2></div>
       <div class="list">${D.announcements.slice(0, 3).map(a => `<div class="row">${ic('megaphone', 18)}<div class="grow"><div class="title">${esc(a.title)}</div><div class="small muted">${esc(a.body)}</div></div></div>`).join('') || '<p class="muted small">No announcements yet.</p>'}</div></div>
   </div></section>`;
}
after.dashboard = () => { drawWave(); document.querySelectorAll('[data-check]').forEach(x => x.onchange = () => { P.checks[x.dataset.check] = x.checked; savePrefs(); render(); }); };
function drawWave() {
  const cv = document.getElementById('heroWave'); if (!cv) return; const r = cv.getBoundingClientRect(); const d = devicePixelRatio || 1;
  cv.width = r.width * d; cv.height = r.height * d; const g = cv.getContext('2d'); g.scale(d, d);
  for (let i = 0; i < 18; i++) { g.beginPath(); g.strokeStyle = `rgba(255,${110 + i * 4},${150 + i * 3},${0.08 + i * 0.012})`; g.lineWidth = 1;
    for (let x = 0; x <= r.width; x += 6) { const y = r.height * 0.25 + i * 5 + Math.sin(x / 90 + i * 0.35) * 22 + Math.cos(x / 40 + i) * 4; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
}
function profDash() {
  const waiting = D.questions.filter(q => !q.answer).sort((a, b) => b.votes - a.votes);
  return `<section class="view">
   <div class="view-head"><div><h1>Welcome, ${esc(P.name)}</h1><p class="sub">Manage your course, materials and students.</p></div>
     <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-tool="upload">${ic('upload', 16)}Upload materials</button><button class="btn primary" data-tool="summary">${ic('spark', 16)}Generate summary</button></div></div>
   <div class="grid g4">
     <a class="card stat tile" href="#attendance">${ic('users', 22)}<span class="n">${C().students}</span><span class="small muted">Students</span></a>
     <a class="card stat tile" href="#qa">${ic('question', 22)}<span class="n">${pending()}</span><span class="small muted">Unanswered questions</span></a>
     <a class="card stat tile" href="#library">${ic('file', 22)}<span class="n">${D.materials.length}</span><span class="small muted">Course documents</span></a>
     <a class="card stat tile" href="#analytics">${ic('chart', 22)}<span class="n">${gapTopics().length}</span><span class="small muted">Learning gaps</span></a>
   </div>
   <div class="grid g2">
     <div class="card"><div class="card-head"><h2>Recent activity</h2></div>
       <div class="list">${D.activity.map(a => `<div class="row">${ic(a.icon, 18)}<div class="grow">${esc(a.text)}</div><span class="tiny muted">${rel(a.created)}</span></div>`).join('') || '<p class="muted small">Nothing yet.</p>'}</div></div>
     <div class="card"><div class="card-head"><h2>Needs a reply</h2><a href="#qa" class="small">Open Q&A</a></div>
       <div class="list">${waiting.slice(0, 3).map(q => `<div class="row"><div class="grow"><div class="small">${esc(q.text)}</div><div class="tiny muted">${esc(q.topic)} · ${q.votes} student${q.votes === 1 ? '' : 's'} asking</div></div></div>`).join('') || '<div class="row muted small">All questions answered.</div>'}</div></div>
   </div></section>`;
}

/* ---------- Ask GENieAi (Ollama + RAG) ---------- */
const SUGGEST = ['What is RAG and how is it different from fine-tuning?', 'How do I choose an embedding model for Thai documents?', 'When is the midterm and what does it cover?', 'Is temperature 0 deterministic?'];
VIEWS.ask = () => `<section class="chat-wrap">
   <div class="chat-head"><div><h1>Ask GENieAi</h1><p class="sub muted small">Your course-aware study assistant (Ollama + RAG). Answers come from the course materials, with sources.</p></div>
     <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
       <select class="input" style="width:auto;padding:7px 10px" aria-label="Project"><option>Project: ${esc(C().name)}</option></select>
       <button class="btn sm" data-act="newchat" ${UI.busy ? 'disabled' : ''}>${ic('plus', 14)}New chat</button></div></div>
   <div class="chat-scroll" id="chatScroll" role="log" aria-live="polite">
     ${UI.chat.length ? UI.chat.map(msgHTML).join('') : `<div class="msg bot"><div class="bot-ic">${ic('spark', 18)}</div><div class="bubble"><p>Hi ${esc(P.name)}! Ask me anything about ${esc(C().name)}. I answer only from the course materials in the Library and show which file each answer came from.</p><p class="tiny muted">I run on this computer with gemma3:1b, so an answer can take from a few seconds to a minute.</p></div></div>`}
   </div>
   ${UI.chatError ? `<p class="err" style="margin:0 28px 10px">${esc(UI.chatError)}</p>` : ''}
   ${!UI.chat.length ? `<div class="suggest">${SUGGEST.map(q => `<button data-suggest="${esc(q)}">${esc(q)}</button>`).join('')}</div>` : ''}
   <form class="composer" id="composer"><textarea id="chatIn" rows="1" placeholder="Ask a question about your course…" aria-label="Your question" ${UI.busy ? 'disabled' : ''}>${esc(UI.draft)}</textarea>
     <button class="btn primary" ${UI.busy ? 'disabled' : ''} aria-label="Send">${ic('send', 16)}</button></form>
  </section>`;
function msgHTML(m) {
  if (m.role === 'user') return `<div class="msg user"><div class="bubble">${esc(m.content)}</div></div>`;
  if (m.pending) return `<div class="msg bot"><div class="bot-ic">${ic('spark', 18)}</div><div class="bubble"><div class="status-line"><span class="typing"><i></i><i></i><i></i></span>Searching your course materials and asking gemma3:1b…</div></div></div>`;
  const shown = m.content.split(/\n\nRetrieved sources:\n/)[0];
  const src = (m.sources || []).map((s, i) => `<button class="src" data-src="${esc(s.filename)}" data-chunk="${s.chunk}">${ic('file', 13)}[${i + 1}] ${esc(s.filename)}${s.location && s.location !== 'text' ? ' (' + esc(s.location) + ')' : ''}</button>`).join('');
  return `<div class="msg bot"><div class="bot-ic">${ic('spark', 18)}</div><div class="bubble">${md(shown)}
    ${src ? `<div class="sources"><span class="tiny muted">Sources:</span>${src}</div>` : ''}</div></div>`;
}
after.ask = () => {
  const sc = document.getElementById('chatScroll'); sc.scrollTop = sc.scrollHeight;
  const ta = document.getElementById('chatIn');
  ta.oninput = () => { UI.draft = ta.value; ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'; };
  ta.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); document.getElementById('composer').requestSubmit(); } };
  document.getElementById('composer').onsubmit = e => { e.preventDefault(); const q = ta.value.trim(); if (q && !UI.busy) ask(q); };
  if (!UI.busy) ta.focus({ preventScroll: true });
};
async function ask(q) {
  UI.busy = true; UI.chatError = ''; UI.draft = '';
  const userMsg = { role: 'user', content: q }; const bot = { role: 'assistant', pending: true };
  UI.chat.push(userMsg, bot); render();
  try {
    const data = await api('/api/chat', { method: 'POST', body: { messages: [...UI.history, { role: 'user', content: q }] } });
    if (typeof data.message?.content !== 'string') throw new Error('GenieAi returned an invalid reply. Try again.');
    UI.history.push({ role: 'user', content: q }, data.message);
    Object.assign(bot, { pending: false, content: data.message.content, sources: data.sources || [] });
  } catch (e) {
    UI.chat = UI.chat.filter(m => m !== userMsg && m !== bot);
    UI.chatError = e.message; UI.draft = q;
  } finally { UI.busy = false; if (UI.view === 'ask') render(); }
}

/* ---------- Lessons (upload a file → lesson + practice quiz, written by gemma3:1b) ---------- */
VIEWS.lessons = () => {
  if (!Array.isArray(D.lessons)) return `<section class="view"><h1>Lessons</h1><div class="card" style="display:flex;flex-direction:column;gap:10px;max-width:560px"><h2>Restart GenieAi to use Lessons</h2><p class="muted">GenieAi is still running the version from before Lessons were added. Close the Terminal window that is running GenieAi, then double-click <strong>start_genieai</strong> in Documents → BananaYogurt and reload this page.</p></div></section>`;
  const l = D.lessons.find(x => x.id === UI.openLesson);
  if (l) return lessonView(l);
  const prof = P.role === 'professor';
  return `<section class="view">
   <div class="view-head"><div><h1>Lessons</h1><p class="sub">Upload a file or pick one from the Library, and GENieAi turns it into a lesson with learning goals, explanations, key terms and a practice quiz.</p></div>
     <button class="btn primary" data-act="newlesson">${ic('plus', 16)}Generate a lesson</button></div>
   <div class="grid g3">${D.lessons.map(x => `<button class="tool" style="align-items:flex-start;text-align:left" data-lesson="${x.id}">
       ${ic('layers', 24)}<strong>${esc(x.lesson.title)}</strong><span>${esc((x.lesson.overview || '').slice(0, 140))}${(x.lesson.overview || '').length > 140 ? '…' : ''}</span>
       <span class="qa-meta" style="margin-top:6px">${x.shared ? '<span class="pill good">Shared with class</span>' : '<span class="pill">Only you</span>'}<span>${x.lesson.quiz.length} quiz questions · ${rel(x.created)}</span></span></button>`).join('')}</div>
   ${D.lessons.length ? '' : `<div class="empty">No lessons yet. Click <strong>Generate a lesson</strong> and choose a file. ${prof ? 'Lessons you share appear for every student.' : 'Lessons you make are only visible to you.'}</div>`}
  </section>`;
};
function lessonView(x) {
  const L = x.lesson; const k = x.id; const ans = UI.answers[k] || {}; const chk = UI.checked[k] || {};
  const done = Object.keys(chk).length; const right = Object.keys(chk).filter(i => ans[i] === L.quiz[i].answer).length;
  const src = mat(x.document);
  return `<section class="view" style="max-width:860px">
   <div><button class="btn sm ghost" data-act="lessonlist">${ic('right', 14).replace('class="ic"', 'class="ic" style="transform:rotate(180deg)"')}All lessons</button></div>
   <div class="view-head"><div><h1>${esc(L.title)}</h1><p class="sub">From ${src ? `<button class="src" data-open="${esc(x.document)}">${ic('file', 13)}${esc(src.title)}</button>` : esc(x.document)} · written by gemma3:1b ${rel(x.created)}. Check important facts against the source.</p></div>
     <div style="display:flex;gap:8px;flex-wrap:wrap">${x.mine ? `<button class="btn sm" data-sharelesson="${x.id}">${x.shared ? 'Stop sharing' : 'Share with class'}</button>` : ''}${x.mine || P.role === 'professor' ? `<button class="btn sm ghost" data-dellesson="${x.id}">${ic('trash', 14)}Delete</button>` : ''}</div></div>
   ${L.overview ? `<div class="card"><p style="font-size:16px">${esc(L.overview)}</p></div>` : ''}
   ${L.objectives.length ? `<div class="card"><h2 style="margin-bottom:10px">After this lesson you can…</h2><ul style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:6px">${L.objectives.map(o => `<li>${esc(o)}</li>`).join('')}</ul></div>` : ''}
   ${L.sections.map((s, i) => `<div class="card"><p class="tiny muted" style="margin-bottom:4px">Part ${i + 1} of ${L.sections.length}</p><h2 style="margin-bottom:10px">${esc(s.heading || 'Part ' + (i + 1))}</h2>${md(s.content)}</div>`).join('')}
   ${L.key_terms.length ? `<div class="card"><h2 style="margin-bottom:10px">Key terms</h2><div class="list">${L.key_terms.map(t => `<div class="row" style="align-items:flex-start"><strong style="min-width:150px">${esc(t.term)}</strong><span class="muted">${esc(t.definition)}</span></div>`).join('')}</div></div>` : ''}
   ${L.quiz.length ? `<div class="card"><div class="card-head"><h2>Practice quiz</h2><span class="small muted num">${done ? `${right} of ${done} correct` : `${L.quiz.length} questions`}</span></div>
     <div class="list" style="gap:18px">${L.quiz.map((q, qi) => `<div style="display:flex;flex-direction:column;gap:8px"><p><strong>${qi + 1}. ${esc(q.question)}</strong></p>
       ${q.options.map((o, oi) => { const picked = ans[qi] === oi; const shown = chk[qi]; const cls = shown ? (oi === q.answer ? 'good' : picked ? 'accent' : '') : picked ? 'accent' : '';
         return `<button class="btn ${cls === 'good' ? '' : ''}" data-pick="${qi}:${oi}" style="justify-content:flex-start;text-align:left;${cls === 'good' ? 'border-color:var(--good);color:var(--good)' : cls === 'accent' ? 'border-color:var(--accent)' : ''}" ${shown ? 'aria-disabled="true"' : ''}>${String.fromCharCode(65 + oi)}. ${esc(o)}${shown && oi === q.answer ? ' ✓' : ''}</button>`; }).join('')}
       ${chk[qi] ? `<p class="small ${ans[qi] === q.answer ? '' : 'muted'}" style="${ans[qi] === q.answer ? 'color:var(--good)' : ''}">${ans[qi] === q.answer ? 'Correct. ' : 'Not quite. '}${esc(q.explanation)}</p>` : `<button class="btn sm" data-checkquiz="${qi}" ${ans[qi] === undefined ? 'disabled' : ''} style="align-self:flex-start">Check answer</button>`}
     </div>`).join('')}</div></div>` : ''}
   <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-askabout="${esc(x.document)}">${ic('spark', 16)}Ask GENieAi about this</button><button class="btn ghost" data-act="lessonlist">Back to all lessons</button></div>
  </section>`;
}
function toolLesson(preset) {
  const prof = P.role === 'professor';
  const docs = D.materials.slice().sort((a, b) => (b.week || 0) - (a.week || 0));
  let mode = preset ? 'pick' : 'upload';
  const sc = modal('Generate a lesson', `
   <div class="seg" role="tablist"><button type="button" data-mode="upload">Upload a new file</button><button type="button" data-mode="pick" ${docs.length ? '' : 'disabled'}>Choose from Library</button></div>
   <div id="mUpload" class="field"><label for="lFile">File (PDF, DOCX, TXT or MD, up to 10 MB)</label><input class="input" type="file" id="lFile" accept=".pdf,.txt,.docx,.md">
     <p class="tiny muted">${prof ? 'The file is also added to the Library so students can read it and ask GENieAi about it.' : 'The file is added to the Library as a student upload, so others using this GenieAi can see it.'}</p></div>
   <div id="mPick" class="field"><label for="lDoc">Library file</label><select class="input" id="lDoc">${docs.map(m => `<option value="${esc(m.name)}" ${m.name === preset ? 'selected' : ''}>${esc(m.title)}</option>`).join('')}</select></div>
   <div class="field"><label for="lFocus">Focus (optional)</label><input class="input" id="lFocus" placeholder="e.g. explain chunking with examples"></div>
   ${prof ? `<label class="check-row" style="padding:0"><input type="checkbox" id="lShare" checked><span>Share this lesson with the class</span></label>` : ''}
   <div id="lStatus" class="status-line" hidden></div>`, async box => {
    const status = box.querySelector('#lStatus'); const ok = box.querySelector('[data-ok]');
    const say = t => { status.hidden = false; status.innerHTML = `<span class="spin"></span>${t}`; ok.innerHTML = '<span class="spin"></span>Working…'; };
    let name;
    try {
      if (mode === 'upload') {
        const f = need(box.querySelector('#lFile').files[0], 'Choose a file, or switch to Choose from Library.');
        if (f.size > 10 * 1024 * 1024) throw new Error('File is too large. Maximum file size is 10 MiB.');
        say('Uploading and indexing the file with nomic-embed-text…');
        const form = new FormData(); form.append('file', f);
        const up = await api('/api/documents', { method: 'POST', form });
        name = up.document.name;
        if (up.document.index_status !== 'indexed') throw new Error(up.message);
        await api('/api/materials/' + encodeURIComponent(name), { method: 'PUT', body: { category: prof ? 'slides' : 'student', week: C().current_week } });
      } else name = need(box.querySelector('#lDoc').value, 'Choose a file from the Library.');
      say('Writing the lesson with gemma3:1b. On a laptop this usually takes 1–3 minutes…');
      const r = await api('/api/lessons', { method: 'POST', body: { document: name, focus: box.querySelector('#lFocus').value, share: prof && box.querySelector('#lShare').checked } });
      UI.openLesson = r.id; if (UI.view !== 'lessons') { UI.keepLesson = true; location.hash = 'lessons'; }
      toast('Lesson ready');
    } catch (e) { status.hidden = true; ok.textContent = 'Generate lesson'; throw e; }
  }, box => {
    const apply = () => { box.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('on', b.dataset.mode === mode)); box.querySelector('#mUpload').hidden = mode !== 'upload'; box.querySelector('#mPick').hidden = mode !== 'pick'; };
    box.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { mode = b.dataset.mode; apply(); });
    apply();
  }, 'Generate lesson');
  return sc;
}

/* ---------- Library ---------- */
function libraryItems() {
  const docs = D.materials.map(m => ({ type: 'doc', key: m.name, title: m.title, cat: m.category, week: m.week, meta: `${m.name.split('.').pop().toUpperCase()} · ${size(m.size)}`, when: m.modified, m }));
  const vids = D.videos.map(v => ({ type: 'video', key: 'v' + v.id, title: v.title, cat: v.kind, meta: `Video${v.duration ? ' · ' + v.duration : ''}`, when: v.created, v }));
  return [...docs, ...vids];
}
VIEWS.library = () => {
  const tabs = [['all', 'All Materials'], ['syllabus', 'Syllabus'], ['slides', 'Lecture notes'], ['update', 'Weekly Updates'], ['catchup', 'Catch-up Videos'], ['recommended', 'Recommended']];
  const q = UI.libQuery.toLowerCase(); const prof = P.role === 'professor';
  const items = libraryItems().filter(x => UI.libTab === 'all' || x.cat === UI.libTab).filter(x => !q || (x.title + ' ' + x.key).toLowerCase().includes(q))
    .sort((a, b) => (b.week || 0) - (a.week || 0) || String(b.when).localeCompare(String(a.when)));
  return `<section class="view">
   <div class="view-head"><div><h1>Library</h1><p class="sub">Every study material for ${esc(C().name)}. GENieAi answers from the documents here.</p></div>
     <div style="display:flex;gap:8px;flex-wrap:wrap">${prof ? `<button class="btn primary" data-tool="upload">${ic('upload', 16)}Upload</button><button class="btn" data-tool="video">${ic('video', 16)}Add video</button>` : ''}
     <div class="input-icon" style="width:240px;max-width:100%">${ic('search', 16)}<input class="input" id="libSearch" placeholder="Search materials…" value="${esc(UI.libQuery)}" aria-label="Search materials"></div></div></div>
   <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button class="tab ${UI.libTab === k ? 'on' : ''}" data-libtab="${k}">${l}</button>`).join('')}</div>
   <div class="card" style="padding:8px"><div class="list">${items.length ? items.map(x => `<div class="row" style="padding:10px;flex-wrap:wrap"><div class="file-ic ${x.type === 'video' ? 'video' : ''}">${ic(x.type === 'video' ? 'video' : 'file', 18)}</div>
      <div class="grow"><div class="title">${esc(x.title)}</div><div class="tiny muted">${esc(x.meta)} · ${CAT[x.cat] || 'Document'}${x.week ? ' · Week ' + x.week : ''} · ${rel(x.when)}</div></div>
      ${x.type === 'video' ? `<a class="btn sm" href="${esc(x.v.url)}" target="_blank" rel="noopener noreferrer">${ic('external', 14)}Watch</a>${prof ? `<button class="icon-btn" data-delvideo="${x.v.id}" aria-label="Remove ${esc(x.title)}">${ic('trash', 16)}</button>` : ''}`
        : `<button class="btn sm" data-open="${esc(x.key)}">Read</button><button class="btn sm ghost" data-askabout="${esc(x.key)}">${ic('spark', 14)}Ask</button><button class="btn sm ghost" data-lessonfrom="${esc(x.key)}">${ic('layers', 14)}Lesson</button>${prof ? `<button class="btn sm ghost" data-label="${esc(x.key)}">Edit</button><button class="icon-btn" data-deldoc="${esc(x.key)}" aria-label="Delete ${esc(x.title)}">${ic('trash', 16)}</button>` : ''}`}</div>`).join('')
      : `<div class="empty">${D.materials.length || D.videos.length ? 'Nothing matches this filter.' : prof ? 'No materials yet. Upload lecture notes so GENieAi can answer from them.' : 'Your professor hasn\'t added materials yet.'}</div>`}</div></div>
  </section>`;
};
after.library = () => { const s = document.getElementById('libSearch'); s.oninput = () => { UI.libQuery = s.value; const pos = s.selectionStart; render(); const n = document.getElementById('libSearch'); n.focus(); n.setSelectionRange(pos, pos); }; };
async function openDoc(name, chunk) {
  const m = mat(name); if (!m) return;
  const box = modal(m.title, `<p class="tiny muted">${esc(m.name)} · ${size(m.size)}</p><div id="pg" class="status-line"><span class="spin"></span>Loading…</div>`);
  try {
    const data = await api('/api/documents/' + encodeURIComponent(name) + '/passages');
    box.querySelector('#pg').outerHTML = data.passages.map(p => `<div class="page-block ${p.chunk == chunk ? 'hit' : ''}" ${p.chunk == chunk ? 'id="hitPage"' : ''}><span class="tiny muted">${p.location && p.location !== 'text' ? esc(p.location) + ' · ' : ''}Passage ${p.chunk}</span><p style="white-space:pre-wrap">${esc(p.text)}</p></div>`).join('');
    const h = box.querySelector('#hitPage'); if (h) h.scrollIntoView({ block: 'center' });
  } catch (e) { box.querySelector('#pg').outerHTML = `<p class="err">${esc(e.message)}</p>`; }
}

/* ---------- Courses ---------- */
VIEWS.courses = () => {
  const tabs = [['overview', 'Overview'], ['weeks', 'Weekly Topics'], ['materials', 'Materials'], ['assess', 'Assessments'], ['news', 'Announcements']];
  const wk = C().current_week; const cur = C().weeks.find(w => w[0] === wk) || [wk, '', ''];
  let body = '';
  if (UI.courseTab === 'overview') body = `<div class="grid g2">
     <div class="card"><h2 style="margin-bottom:8px">Course overview</h2><p class="muted">A practical course on generative AI, large language models and real-world applications.</p>
       <div class="list" style="margin-top:12px">
        <div class="row">${ic('user')}<div class="grow"><div class="tiny muted">Instructor</div>${esc(C().instructor)}</div></div>
        <div class="row">${ic('users')}<div class="grow"><div class="tiny muted">Students</div><span class="num">${C().students}</span></div></div>
        <div class="row">${ic('clock')}<div class="grow"><div class="tiny muted">Schedule</div>${esc(C().schedule)} · ${esc(C().room)}</div></div></div></div>
     <div class="card"><h2 style="margin-bottom:12px">This week (Week ${wk})</h2><div class="list">
       <div class="row">${ic('book')}<div class="grow">Topic: ${esc(cur[1])}</div></div>
       ${D.materials.filter(m => m.week === wk).map(m => `<div class="row">${ic('file')}<div class="grow">${esc(m.title)}</div><button class="btn sm" data-open="${esc(m.name)}">Read</button></div>`).join('')}
       ${(C().this_week || []).filter(x => x.id === 'assign').map(x => `<div class="row">${ic('cal')}<div class="grow">${esc(x.label)}<div class="tiny muted">${esc(x.meta)}</div></div><span class="pill warn">Due soon</span></div>`).join('')}</div></div></div>`;
  if (UI.courseTab === 'weeks') body = `<div class="card" style="padding:10px 14px">${C().weeks.map(([n, t, d]) => `<div class="week-row ${n === wk ? 'current' : ''}"><span class="small muted">Week ${n}</span><div><div class="title">${esc(t)}</div><div class="tiny muted">Fri ${esc(d)}</div></div>${n < wk ? '<span class="pill good">Done</span>' : n === wk ? '<span class="pill accent">This week</span>' : '<span class="pill">Upcoming</span>'}</div>`).join('')}</div>`;
  if (UI.courseTab === 'materials') body = `<div class="card" style="padding:8px"><div class="list">${D.materials.filter(m => m.category === 'slides').sort((a, b) => (b.week || 0) - (a.week || 0)).map(m => `<div class="row" style="padding:10px"><div class="file-ic">${ic('file', 18)}</div><div class="grow"><div class="title">${esc(m.title)}</div><div class="tiny muted">${m.week ? 'Week ' + m.week + ' · ' : ''}${size(m.size)}</div></div><button class="btn sm" data-open="${esc(m.name)}">Read</button></div>`).join('') || '<div class="empty">No lecture notes yet.</div>'}</div></div>`;
  if (UI.courseTab === 'assess') body = `<div class="card" style="overflow-x:auto"><table><thead><tr><th>Assessment</th><th>Type</th><th>Due</th><th class="num">Weight</th></tr></thead><tbody>${(C().assessments || []).map(a => `<tr><td>${esc(a[0])}</td><td class="muted">${esc(a[1])}</td><td>${esc(a[2])}</td><td class="num">${esc(a[3])}</td></tr>`).join('')}</tbody></table></div>`;
  if (UI.courseTab === 'news') body = `<div class="list" style="gap:12px">${D.announcements.map(a => `<div class="qa-item"><div class="qa-meta"><span class="pill accent">${esc(a.kind)}</span><span>${rel(a.created)}</span><span class="spacer"></span>${P.role === 'professor' ? `<button class="icon-btn" data-delnews="${a.id}" aria-label="Remove announcement">${ic('trash', 16)}</button>` : ''}</div><h3>${esc(a.title)}</h3>${a.body ? `<p class="muted">${esc(a.body)}</p>` : ''}</div>`).join('') || '<div class="empty">No announcements yet.</div>'}${P.role === 'professor' ? `<button class="btn" data-tool="exam" style="align-self:flex-start">${ic('plus', 16)}Post an update</button>` : ''}</div>`;
  return `<section class="view">
   <div class="course-hero" style="cursor:default;min-height:130px"><canvas id="heroWave"></canvas><h1>${esc(C().name)}</h1><span class="muted">${esc(C().code)} · ${esc(C().program || '')} · ${esc(C().term)}</span></div>
   <div class="tabs">${tabs.map(([k, l]) => `<button class="tab ${UI.courseTab === k ? 'on' : ''}" data-coursetab="${k}">${l}</button>`).join('')}</div>${body}</section>`;
};
after.courses = drawWave;

/* ---------- Summaries ---------- */
VIEWS.summaries = () => {
  const list = D.summaries; if (UI.openSummary === null && list[0]) UI.openSummary = list[0].id;
  return `<section class="view">
  <div class="view-head"><div><h1>Class Summaries</h1><p class="sub">AI summaries of each lecture, written by gemma3:1b and checked by your professor.</p></div>
   ${P.role === 'professor' ? `<button class="btn primary" data-tool="summary">${ic('spark', 16)}Generate summary</button>` : ''}</div>
  <div class="list" style="gap:12px">${list.map(s => `<div class="card summary-card ${UI.openSummary === s.id ? 'open' : ''}">
    <button data-summary="${s.id}" aria-expanded="${UI.openSummary === s.id}"><div class="file-ic">${ic('file', 18)}</div><div class="grow"><h3>Week ${s.week}: ${esc(s.title)}</h3><div class="qa-meta" style="margin-top:4px"><span>${rel(s.created)}</span><span class="pill">AI Summary</span>${s.takeaways.length ? '<span class="pill">Key Takeaways</span>' : ''}</div></div><span class="chev">${ic('right')}</span></button>
    ${UI.openSummary === s.id ? `<div class="summary-body"><p>${esc(s.summary)}</p>${s.takeaways.length ? `<div><h3 style="margin-bottom:6px">Key takeaways</h3><ul>${s.takeaways.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>` : ''}
      <div style="display:flex;gap:8px;flex-wrap:wrap">${mat(s.document) ? `<button class="btn sm" data-open="${esc(s.document)}">${ic('file', 14)}Source material</button><button class="btn sm" data-askabout="${esc(s.document)}">${ic('spark', 14)}Ask GENieAi about this</button>` : ''}${P.role === 'professor' ? `<button class="btn sm ghost" data-delsummary="${s.id}">${ic('trash', 14)}Remove</button>` : ''}</div></div>` : ''}
  </div>`).join('') || `<div class="empty">${P.role === 'professor' ? 'No summaries yet. Click Generate summary to create one from a lecture document.' : 'No summaries yet.'}</div>`}</div></section>`;
};

/* ---------- Attendance ---------- */
VIEWS.attendance = () => {
  const A = D.attendance; const wk = C().weeks.find(w => w[0] === A.week) || [A.week, '', ''];
  const when = `Week ${A.week} · Fri ${esc(wk[2])} · ${esc(C().schedule.replace(/^\w+\s/, ''))}`;
  if (P.role === 'professor') {
    return `<section class="view"><div class="view-head"><div><h1>Attendance</h1><p class="sub">Show this code in class. Students enter it in GenieAi to check in.</p></div></div>
    <div class="grid g2"><div class="card" style="display:flex;flex-direction:column;gap:14px"><div class="card-head" style="margin:0"><h2>${when}</h2>${A.open ? '<span class="pill good">Open</span>' : '<span class="pill">Not open</span>'}</div>
       ${A.open ? `<div class="code-box" aria-label="Check-in code">${esc(A.code)}</div>
       <div style="display:flex;gap:8px;justify-content:space-between;align-items:center;flex-wrap:wrap"><span class="muted"><strong class="num" style="color:var(--text)">${A.count}</strong> of ${C().students} checked in</span><span style="display:flex;gap:8px"><button class="btn sm" data-act="refresh">${ic('refresh', 14)}Refresh</button><button class="btn sm" data-act="newcode">New code</button></span></div>
       ${A.names && A.names.length ? `<p class="small muted">Checked in: ${A.names.map(esc).join(', ')}</p>` : ''}`
       : `<p class="muted">Open check-in to create a code for this week's class.</p><button class="btn primary" data-act="newcode" style="align-self:flex-start">Open check-in</button>`}</div>
     <div class="card"><h2 style="margin-bottom:12px">Attendance by week</h2>${A.sessions.length ? A.sessions.map(s => `<div class="bar-row"><span class="small">Week ${s.week}</span><div class="bar"><i style="width:${Math.min(100, s.count / C().students * 100)}%"></i></div><span class="small num muted" style="text-align:right">${s.count}</span></div>`).join('') : '<p class="muted small">No sessions yet.</p>'}</div></div></section>`;
  }
  const att = A.records.filter(r => r.present).length, tot = A.records.length;
  return `<section class="view"><div class="view-head"><div><h1>Attendance</h1><p class="sub">Check in to class and track your attendance.</p></div></div>
   <div class="tabs"><button class="tab ${UI.attTab === 'checkin' ? 'on' : ''}" data-atttab="checkin">Check In</button><button class="tab ${UI.attTab === 'records' ? 'on' : ''}" data-atttab="records">My Records</button></div>
   ${UI.attTab === 'checkin' ? `<div class="card" style="max-width:480px;display:flex;flex-direction:column;gap:14px;text-align:center">
     ${A.checked_in ? `<div style="color:var(--good);display:grid;place-items:center">${ic('check', 44)}</div><h2>You're checked in</h2><p class="muted">${esc(C().name)} · ${when}</p>`
     : A.open ? `<h2>Enter the check-in code</h2><p class="muted small">${when}. Your professor shows the code on screen in class.</p>
     <form id="ciForm" style="display:flex;flex-direction:column;gap:10px"><input class="input code-input" id="ciCode" maxlength="6" placeholder="······" aria-label="Check-in code" autocomplete="off"><button class="btn primary" style="justify-content:center">Check in</button></form>`
     : `<h2>Check-in isn't open yet</h2><p class="muted small">${when}. Your professor opens check-in during class.</p><button class="btn" data-act="refresh" style="align-self:center">${ic('refresh', 14)}Check again</button>`}</div>`
   : `<div class="grid g3"><div class="card stat"><span class="n">${tot ? Math.round(att / tot * 100) + '%' : '–'}</span><span class="small muted">Attendance rate</span></div><div class="card stat"><span class="n">${att}/${tot}</span><span class="small muted">Sessions attended</span></div><div class="card stat"><span class="n">80%</span><span class="small muted">Required</span></div></div>
    <div class="card" style="overflow-x:auto"><table><thead><tr><th>Week</th><th>Status</th></tr></thead><tbody>${A.records.slice().reverse().map(r => `<tr><td>Week ${r.week}</td><td><span class="pill ${r.present ? 'good' : 'accent'}">${r.present ? 'Present' : 'Absent'}</span></td></tr>`).join('') || '<tr><td colspan="2" class="muted">No sessions yet.</td></tr>'}</tbody></table>
    <p class="tiny muted" style="margin-top:8px">Records are kept for this browser on this computer.</p></div>`}
  </section>`;
};
after.attendance = () => {
  const f = document.getElementById('ciForm');
  if (f) f.onsubmit = async e => { e.preventDefault(); const code = document.getElementById('ciCode').value.trim();
    try { const r = await api('/api/attendance/checkin', { method: 'POST', body: { code, name: P.name } }); toast(r.message); await refresh(); } catch (err) { toast(err.message, true); } };
};

/* ---------- Anonymous Q&A ---------- */
VIEWS.qa = () => {
  const prof = P.role === 'professor';
  const tabs = prof ? [['all', 'All'], ['pending', 'Unanswered'], ['answered', 'Answered']] : [['all', 'All Questions'], ['mine', 'My Questions']];
  if (!tabs.find(t => t[0] === UI.qaTab)) UI.qaTab = 'all';
  const list = D.questions.filter(q => UI.qaTab === 'all' || (UI.qaTab === 'mine' && q.mine) || (UI.qaTab === 'pending' && !q.answer) || (UI.qaTab === 'answered' && q.answer))
    .sort((a, b) => prof ? (!!a.answer - !!b.answer) || b.votes - a.votes : new Date(b.created) - new Date(a.created));
  return `<section class="view"><div class="view-head"><div><h1>Anonymous Q&A</h1><p class="sub">${prof ? 'Questions from students. Names are never shown, to you or to classmates.' : 'Ask anything about the course. Your name is never shown, to your professor or to classmates.'}</p></div>
    ${prof ? '' : `<button class="btn primary" data-act="askq">${ic('plus', 16)}Ask a question</button>`}</div>
   <div class="tabs">${tabs.map(([k, l]) => `<button class="tab ${UI.qaTab === k ? 'on' : ''}" data-qatab="${k}">${l}</button>`).join('')}</div>
   <div class="list" style="gap:12px">${list.map(q => `<article class="qa-item">
     <div class="qa-meta">${ic('user', 14)}<span>Anonymous${q.mine && !prof ? ' (you)' : ''} · ${rel(q.created)}</span><span class="pill">${esc(q.topic)}</span><span class="spacer"></span>${q.answer ? '<span class="pill good">' + ic('check', 12) + 'Answered</span>' : '<span class="pill warn">Waiting for reply</span>'}</div>
     <p style="font-size:15.5px">${esc(q.text)}</p>
     ${q.answer ? `<div class="answer"><div class="by">Professor · ${rel(q.answered)}</div>${linkify(esc(q.answer))}</div>` : ''}
     <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      ${prof ? `<span class="small muted">${q.votes} student${q.votes === 1 ? ' has' : 's have'} this question</span>` : `<button class="btn sm ghost" data-vote="${q.id}" ${q.voted ? 'disabled' : ''}>${ic('thumb', 14)}${q.voted ? 'You asked this too' : 'I have this question too'} · ${q.votes}</button>`}
      ${prof ? `<span style="margin-left:auto;display:flex;gap:8px"><button class="btn sm ghost" data-delq="${q.id}">Remove</button><button class="btn sm ${q.answer ? '' : 'primary'}" data-reply="${q.id}">${q.answer ? 'Edit reply' : 'Reply'}</button></span>` : ''}
     </div></article>`).join('') || `<div class="empty">${UI.qaTab === 'mine' ? 'You haven\'t asked anything yet. Questions you ask appear here.' : 'No questions here yet.'}</div>`}</div></section>`;
};

/* ---------- Professor tools ---------- */
VIEWS.tools = () => `<section class="view"><div class="view-head"><div><h1>Professor Tools</h1><p class="sub">Manage course content, updates and student learning. AI features use gemma3:1b on this computer.</p></div></div>
  <div class="grid g3">
   ${[['upload', 'upload', 'Upload Materials', 'PDF, DOCX, TXT or MD. GENieAi indexes them for student questions.'], ['summary', 'spark', 'Generate Summary', 'Create an AI summary of a lecture for students.'], ['lesson', 'layers', 'Generate Lesson', 'Turn a file into a lesson with a practice quiz.'], ['exam', 'megaphone', 'Exam Updates', 'Announce exams and changes to the schedule.'], ['video', 'video', 'Recommend Videos', 'Add helpful video links to the Library.'], ['qa', 'question', 'Manage Q&A', `Reply to anonymous questions (${pending()} waiting).`], ['gaps', 'chart', 'Learning Gap Insights', 'See the topics students ask about most.']].map(([k, i, t, d]) => `<button class="tool" data-tool="${k}">${ic(i, 28)}<strong>${t}</strong><span>${d}</span></button>`).join('')}
  </div></section>`;

/* ---------- Analytics ---------- */
VIEWS.analytics = () => {
  const ent = Object.entries(D.topics).sort((a, b) => b[1] - a[1]); const max = ent.length ? ent[0][1] : 1;
  const total = ent.reduce((s, e) => s + e[1], 0);
  return `<section class="view"><div class="view-head"><div><h1>Learning Gap Insights</h1><p class="sub">Topics students ask GENieAi and the Q&A board about. Counts are anonymous and update as students ask.</p></div></div>
   <div class="grid g3"><div class="card stat"><span class="n">${total}</span><span class="small muted">Questions counted</span></div><div class="card stat"><span class="n">${D.questions.length}</span><span class="small muted">Anonymous questions</span></div><div class="card stat"><span class="n">${gapTopics().length}</span><span class="small muted">Topics flagged as gaps</span></div></div>
   <div class="grid g2"><div class="card"><div class="card-head"><h2>Questions by topic</h2><span class="tiny muted">Flagged at ${GAP_AT}+ questions</span></div>
     ${ent.map(([t, n]) => `<div class="bar-row"><span class="small">${esc(t)}</span><div class="bar"><i class="${n >= GAP_AT ? '' : 'soft'}" style="width:${n / max * 100}%"></i></div><span class="small num ${n >= GAP_AT ? '' : 'muted'}" style="text-align:right">${n}</span></div>`).join('') || '<p class="muted small">No questions yet. As students use GENieAi and the Q&A board, topics appear here.</p>'}</div>
    <div class="card"><h2 style="margin-bottom:12px">Suggested review</h2><div class="list">${gapTopics().sort((a, b) => b[1] - a[1]).map(([t, n]) => `<div class="row">${ic('target', 18)}<div class="grow"><div class="title">${esc(t)}</div><div class="tiny muted">${n} questions</div></div></div>`).join('') || '<p class="muted small">No gaps flagged yet.</p>'}</div>
     <p class="small muted" style="margin-top:12px">Consider a short recap of these at the start of next class, or a recommended video in the Library.</p></div></div></section>`;
};

/* ======================= modals & tools ======================= */
function modal(title, bodyHTML, onOk, onMount, okLabel = 'Save') {
  const sc = document.createElement('div'); sc.className = 'scrim';
  sc.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-head"><h2>${esc(title)}</h2><button class="icon-btn" data-close aria-label="Close">${ic('x')}</button></div><div class="modal-body">${bodyHTML}</div>${onOk ? `<div class="modal-foot"><p class="err" data-err hidden style="margin-right:auto"></p><button class="btn" data-close>Cancel</button><button class="btn primary" data-ok>${okLabel}</button></div>` : ''}</div>`;
  const close = () => { sc.remove(); document.removeEventListener('keydown', k); };
  const k = e => { if (e.key === 'Escape') close(); };
  sc.addEventListener('click', e => { if (e.target === sc || e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', k); document.body.appendChild(sc);
  if (onOk) {
    const ok = sc.querySelector('[data-ok]'); const err = sc.querySelector('[data-err]');
    ok.onclick = async () => {
      ok.disabled = true; err.hidden = true;
      try { const r = await onOk(sc); if (r !== false) { close(); await refresh(); } }
      catch (e) { err.textContent = e.message; err.hidden = false; }
      finally { ok.disabled = false; }
    };
  }
  if (onMount) onMount(sc);
  const f = sc.querySelector('input:not([type=file]),textarea,select'); if (f) f.focus();
  return sc;
}
const TOPIC_OPTS = ['RAG & Vector DBs', 'Embeddings', 'Prompt Engineering', 'LLM Evaluation', 'Transformers', 'Tokenization', 'LLM Basics', 'Assignments & Exams'];
const need = (v, msg) => { if (!v) throw new Error(msg); return v; };

function askQuestion() {
  modal('Ask anonymously', `<div class="field"><label for="qText">Your question</label><textarea class="input" id="qText" placeholder="e.g. How many chunks should we retrieve for the RAG assignment?"></textarea></div>
  <div class="field"><label for="qTopic">Topic</label><select class="input" id="qTopic">${TOPIC_OPTS.map(t => `<option>${t}</option>`).join('')}</select></div>
  <p class="tiny muted">Your name is not attached to this question.</p>`, async sc => {
    const r = await api('/api/questions', { method: 'POST', body: { text: sc.querySelector('#qText').value, topic: sc.querySelector('#qTopic').value } });
    UI.qaTab = 'mine'; toast(r.message);
  }, null, 'Post question');
}
function reply(id) {
  const q = D.questions.find(x => x.id === id);
  modal('Reply to question', `<div class="page-block"><span class="tiny muted">Anonymous · ${esc(q.topic)}</span><p>${esc(q.text)}</p></div>
  <div class="field"><label for="rText">Your reply (visible to all students)</label><textarea class="input" id="rText" style="min-height:130px">${esc(q.answer || '')}</textarea></div>
  <button class="btn sm" id="draftBtn" style="align-self:flex-start">${ic('spark', 14)}Draft a reply from course materials</button>`, async sc => {
    const r = await api(`/api/questions/${id}/answer`, { method: 'POST', body: { answer: sc.querySelector('#rText').value } }); toast(r.message);
  }, sc => {
    const b = sc.querySelector('#draftBtn');
    b.onclick = async () => {
      b.disabled = true; b.innerHTML = '<span class="spin"></span>Drafting with gemma3:1b…';
      try { const r = await api(`/api/questions/${id}/draft`, { method: 'POST', body: {} }); sc.querySelector('#rText').value = r.draft; }
      catch (e) { toast(e.message, true); }
      b.disabled = false; b.innerHTML = ic('spark', 14) + 'Draft again';
    };
  }, 'Post reply');
}
function toolUpload() {
  modal('Upload materials', `<div class="field"><label for="uFile">File (PDF, DOCX, TXT or MD, up to 10 MB)</label><input class="input" type="file" id="uFile" accept=".pdf,.txt,.docx,.md"></div>
  <div class="field"><label for="uTitle">Title</label><input class="input" id="uTitle" placeholder="e.g. Week 8: Fine-tuning & LoRA"></div>
  <div class="grid g2" style="grid-template-columns:1fr 1fr"><div class="field"><label for="uKind">Category</label><select class="input" id="uKind"><option value="slides">Lecture notes</option><option value="update">Weekly update</option><option value="syllabus">Syllabus</option><option value="other">Other</option></select></div>
  <div class="field"><label for="uWeek">Week</label><input class="input" id="uWeek" type="number" min="1" max="52" value="${C().current_week}"></div></div>
  <p class="tiny muted">GENieAi reads and indexes the file with nomic-embed-text, which can take a minute for long PDFs.</p>`, async sc => {
    const f = need(sc.querySelector('#uFile').files[0], 'Choose a file to upload.');
    if (f.size > 10 * 1024 * 1024) throw new Error('File is too large. Maximum file size is 10 MiB.');
    const form = new FormData(); form.append('file', f);
    sc.querySelector('[data-ok]').innerHTML = '<span class="spin"></span>Uploading and indexing…';
    const r = await api('/api/documents', { method: 'POST', form });
    const name = r.document.name;
    await api('/api/materials/' + encodeURIComponent(name), { method: 'PUT', body: { title: sc.querySelector('#uTitle').value || '', category: sc.querySelector('#uKind').value, week: parseInt(sc.querySelector('#uWeek').value, 10) || null } });
    toast(r.message);
  }, null, 'Upload');
}
function editLabel(name) {
  const m = mat(name);
  modal('Edit material', `<div class="field"><label for="eTitle">Title</label><input class="input" id="eTitle" value="${esc(m.title)}"></div>
  <div class="grid g2" style="grid-template-columns:1fr 1fr"><div class="field"><label for="eKind">Category</label><select class="input" id="eKind">${['slides', 'update', 'syllabus', 'other'].map(k => `<option value="${k}" ${m.category === k ? 'selected' : ''}>${CAT[k]}</option>`).join('')}</select></div>
  <div class="field"><label for="eWeek">Week</label><input class="input" id="eWeek" type="number" min="1" max="52" value="${m.week || ''}"></div></div>`, async sc => {
    await api('/api/materials/' + encodeURIComponent(name), { method: 'PUT', body: { title: sc.querySelector('#eTitle').value, category: sc.querySelector('#eKind').value, week: parseInt(sc.querySelector('#eWeek').value, 10) || null } });
    toast('Saved');
  });
}
function toolSummary() {
  const docs = D.materials.slice().sort((a, b) => (b.week || 0) - (a.week || 0));
  if (!docs.length) { toast('Upload a lecture document first', true); return; }
  let result = null;
  modal('Generate class summary', `<div class="field"><label for="sSrc">Lecture material</label><select class="input" id="sSrc">${docs.map(m => `<option value="${esc(m.name)}">${esc(m.title)}</option>`).join('')}</select></div>
   <button class="btn" id="genBtn" style="align-self:flex-start">${ic('spark', 16)}Generate with gemma3:1b</button>
   <div id="sOut" hidden style="display:flex;flex-direction:column;gap:12px">
     <div class="grid g2" style="grid-template-columns:2fr 1fr"><div class="field"><label for="sTitle">Title</label><input class="input" id="sTitle"></div><div class="field"><label for="sWeek">Week</label><input class="input" id="sWeek" type="number" min="1" max="52"></div></div>
     <div class="field"><label for="sText">Summary (you can edit it before publishing)</label><textarea class="input" id="sText" style="min-height:140px"></textarea></div>
     <div class="field"><label for="sTake">Key takeaways, one per line</label><textarea class="input" id="sTake"></textarea></div></div>`, async sc => {
    if (!result) throw new Error('Generate a summary first.');
    const r = await api('/api/summaries', { method: 'POST', body: { title: sc.querySelector('#sTitle').value, week: parseInt(sc.querySelector('#sWeek').value, 10) || C().current_week, document: result, summary: sc.querySelector('#sText').value, takeaways: sc.querySelector('#sTake').value.split('\n') } });
    UI.openSummary = null; location.hash = 'summaries'; toast(r.message);
  }, sc => {
    const btn = sc.querySelector('#genBtn');
    btn.onclick = async () => {
      const m = mat(sc.querySelector('#sSrc').value);
      btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Reading the lecture… this can take a minute';
      try {
        const r = await api('/api/summaries/generate', { method: 'POST', body: { document: m.name } });
        result = m.name; const out = sc.querySelector('#sOut'); out.hidden = false;
        sc.querySelector('#sTitle').value = m.title.replace(/^Week \d+:\s*/, '');
        sc.querySelector('#sWeek').value = m.week || C().current_week;
        sc.querySelector('#sText').value = r.summary; sc.querySelector('#sTake').value = r.takeaways.join('\n');
        btn.innerHTML = ic('refresh', 16) + 'Regenerate';
      } catch (e) { toast(e.message, true); btn.innerHTML = ic('spark', 16) + 'Generate with gemma3:1b'; }
      btn.disabled = false;
    };
  }, 'Publish to students');
}
function toolExam() {
  modal('Post an exam or course update', `<div class="field"><label for="aTitle">Headline</label><input class="input" id="aTitle" placeholder="e.g. Midterm moved to Room 1201"></div>
  <div class="field"><label for="aKind">Type</label><select class="input" id="aKind"><option>Exam</option><option>Assignment</option><option>Schedule</option><option>General</option></select></div>
  <div class="field"><label for="aBody">Details</label><textarea class="input" id="aBody"></textarea></div>`, async sc => {
    const r = await api('/api/announcements', { method: 'POST', body: { title: sc.querySelector('#aTitle').value, kind: sc.querySelector('#aKind').value, body: sc.querySelector('#aBody').value } }); toast(r.message);
  }, null, 'Post update');
}
function toolVideo() {
  modal('Add a video', `<div class="field"><label for="vTitle">Title</label><input class="input" id="vTitle" placeholder="e.g. Hybrid search explained"></div>
  <div class="field"><label for="vUrl">Link</label><input class="input" id="vUrl" type="url" placeholder="https://"></div>
  <div class="grid g2" style="grid-template-columns:1fr 1fr"><div class="field"><label for="vKind">Type</label><select class="input" id="vKind"><option value="recommended">Recommended video</option><option value="catchup">Catch-up recording</option></select></div>
  <div class="field"><label for="vDur">Length (optional)</label><input class="input" id="vDur" placeholder="12:30"></div></div>
  <div class="field"><label for="vDesc">Why watch it (optional)</label><textarea class="input" id="vDesc" style="min-height:60px"></textarea></div>`, async sc => {
    const r = await api('/api/videos', { method: 'POST', body: { title: sc.querySelector('#vTitle').value, url: sc.querySelector('#vUrl').value, kind: sc.querySelector('#vKind').value, duration: sc.querySelector('#vDur').value, description: sc.querySelector('#vDesc').value } }); toast(r.message);
  }, null, 'Add video');
}
async function act(promise) { try { const r = await promise; if (r && r.message) toast(r.message); await refresh(); } catch (e) { toast(e.message, true); } }

/* ======================= events ======================= */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-lessonfrom],[data-lesson],[data-pick],[data-checkquiz],[data-sharelesson],[data-dellesson],[data-act],[data-go],[data-libtab],[data-coursetab],[data-qatab],[data-atttab],[data-open],[data-src],[data-askabout],[data-suggest],[data-summary],[data-vote],[data-reply],[data-tool],[data-deldoc],[data-delvideo],[data-delnews],[data-delsummary],[data-delq],[data-label],.nav a');
  if (UI.pop && !e.target.closest('.pop') && !(t && t.dataset.act === 'bell')) { UI.pop = false; render(); if (!t) return; }
  if (!t) return; const d = t.dataset;
  if (t.matches('.nav a')) { UI.sideOpen = false; if (t.getAttribute('href') === '#lessons' && UI.view === 'lessons') { UI.openLesson = null; render(); } return; }
  if (d.act === 'logout') { UI.openLesson = null; P.role = null; savePrefs(); D = null; UI.chat = []; UI.history = []; history.replaceState(null, '', '#'); render(); return; }
  if (d.act === 'retry' || d.act === 'refresh') { refresh(); return; }
  if (d.act === 'menu') { UI.sideOpen = !UI.sideOpen; render(); return; }
  if (d.act === 'bell') { UI.pop = !UI.pop; P.seen = notifications().length; savePrefs(); render(); return; }
  if (d.act === 'newchat') { if (!UI.busy) { UI.chat = []; UI.history = []; UI.chatError = ''; render(); } return; }
  if (d.act === 'askq') { askQuestion(); return; }
  if (d.act === 'newcode') { act(api('/api/attendance/open', { method: 'POST', body: {} })); return; }
  if (d.go) { location.hash = d.go; return; }
  if (d.libtab) { UI.libTab = d.libtab; render(); return; }
  if (d.coursetab) { UI.courseTab = d.coursetab; render(); return; }
  if (d.qatab) { UI.qaTab = d.qatab; render(); return; }
  if (d.atttab) { UI.attTab = d.atttab; render(); return; }
  if (d.open) { openDoc(d.open); return; }
  if (d.src) { openDoc(d.src, +d.chunk); return; }
  if (d.askabout) { const m = mat(d.askabout); UI.draft = `Explain the key ideas in "${m ? m.title : d.askabout}"`; location.hash = 'ask'; if (UI.view === 'ask') render(); return; }
  if (d.suggest) { if (!UI.busy) ask(d.suggest); return; }
  if (d.summary) { const id = +d.summary; UI.openSummary = UI.openSummary === id ? -1 : id; render(); return; }
  if (d.vote) { act(api(`/api/questions/${d.vote}/vote`, { method: 'POST', body: {} })); return; }
  if (d.reply) { reply(+d.reply); return; }
  if (d.label) { editLabel(d.label); return; }
  if (d.deldoc) { if (window.confirm(`Delete ${d.deldoc}? This removes the file and its index from GenieAi.`)) act(api('/api/documents/' + encodeURIComponent(d.deldoc), { method: 'DELETE' })); return; }
  if (d.delvideo) { act(api('/api/videos/' + d.delvideo, { method: 'DELETE' })); return; }
  if (d.delnews) { act(api('/api/announcements/' + d.delnews, { method: 'DELETE' })); return; }
  if (d.delsummary) { UI.openSummary = null; act(api('/api/summaries/' + d.delsummary, { method: 'DELETE' })); return; }
  if (d.delq) { act(api('/api/questions/' + d.delq, { method: 'DELETE' })); return; }
  if (d.lessonfrom) { toolLesson(d.lessonfrom); return; }
  if (d.act === 'newlesson') { toolLesson(); return; }
  if (d.act === 'lessonlist') { UI.openLesson = null; render(); return; }
  if (d.lesson) { UI.openLesson = +d.lesson; render(); const m = document.getElementById('main'); if (m) m.scrollTop = 0; return; }
  if (d.pick) { const [qi, oi] = d.pick.split(':').map(Number); const k = UI.openLesson; UI.answers[k] = UI.answers[k] || {}; if (!(UI.checked[k] || {})[qi]) { UI.answers[k][qi] = oi; render(); } return; }
  if (d.checkquiz !== undefined) { const k = UI.openLesson; UI.checked[k] = UI.checked[k] || {}; UI.checked[k][+d.checkquiz] = true; render(); return; }
  if (d.sharelesson) { const l = D.lessons.find(x => x.id === +d.sharelesson); act(api(`/api/lessons/${l.id}/share`, { method: 'POST', body: { share: !l.shared } })); return; }
  if (d.dellesson) { if (window.confirm('Delete this lesson?')) { UI.openLesson = null; act(api(`/api/lessons/${d.dellesson}?role=${P.role}`, { method: 'DELETE' })); } return; }
  if (d.tool) { ({ lesson: () => toolLesson(), upload: toolUpload, summary: toolSummary, exam: toolExam, video: toolVideo, qa: () => { location.hash = 'qa'; }, gaps: () => { location.hash = 'analytics'; } })[d.tool](); }
});
function route() {
  const h = location.hash.slice(1);
  if (h !== UI.view && !UI.keepLesson) UI.openLesson = null; // opening Lessons from elsewhere shows the list
  UI.keepLesson = false;
  if (P.role && NAV[P.role].find(n => n[0] === h)) UI.view = h; else if (P.role && !h) UI.view = 'dashboard';
  UI.pop = false; render(); const m = document.getElementById('main'); if (m) m.scrollTop = 0;
}
window.addEventListener('hashchange', route);
let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(drawWave, 150); });
route();
if (P.role) refresh();
