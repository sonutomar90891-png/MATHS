/* ===== In-memory DB (offline preview + local testing) — same surface as the platform db ===== */
function createMemoryDB(initial) {
  const docs = new Map(); const listeners = new Set();
  const parentOf = p => p.split('/').slice(0, -1).join('/');
  const snapDoc = p => ({ id: p.split('/').pop(), exists: docs.has(p), data: () => docs.has(p) ? clone(docs.get(p)) : undefined, metadata: { fromCache: false, hasPendingWrites: false } });
  const emit = () => setTimeout(() => listeners.forEach(l => l()), 0);
  function query(col, filters = [], ord = null, lim = 0) {
    const run = () => {
      let out = [...docs.keys()].filter(k => parentOf(k) === col).sort().map(snapDoc);
      for (const [f, op, v] of filters) out = out.filter(d => { const x = d.data()[f]; return op === '==' ? x === v : op === '!=' ? x !== v : op === '>' ? x > v : op === '<' ? x < v : op === '>=' ? x >= v : op === '<=' ? x <= v : op === 'array-contains' ? (x || []).includes(v) : op === 'in' ? v.includes(x) : true; });
      if (ord) out.sort((a, b) => { const A = a.data()[ord[0]], B = b.data()[ord[0]]; return (A > B ? 1 : A < B ? -1 : 0) * (ord[1] === 'desc' ? -1 : 1); });
      if (lim) out = out.slice(0, lim);
      return { docs: out, size: out.length, empty: !out.length, docChanges: () => [], metadata: { fromCache: false, hasPendingWrites: false } };
    };
    return {
      where: (f, op, v) => query(col, [...filters, [f, op, v]], ord, lim), orderBy: (f, d) => query(col, filters, [f, d], lim), limit: n => query(col, filters, ord, n),
      get: async () => run(),
      onSnapshot(next) { const l = () => next(run()); listeners.add(l); setTimeout(l, 0); return () => listeners.delete(l); },
    };
  }
  function docRef(p) {
    return {
      id: p.split('/').pop(), path: p,
      get: async () => snapDoc(p),
      set: async d => { docs.set(p, clone(d)); emit(); },
      update: async d => { if (!docs.has(p)) throw { code: 'invalid_argument', message: 'missing' }; docs.set(p, { ...docs.get(p), ...clone(d) }); emit(); },
      delete: async () => { docs.delete(p); emit(); },
      onSnapshot(next) { const l = () => next(snapDoc(p)); listeners.add(l); setTimeout(l, 0); return () => listeners.delete(l); },
      collection: c => colRef(p + '/' + c),
    };
  }
  function colRef(c) { const qq = query(c); return { ...qq, path: c, doc: id => docRef(c + '/' + (id || genId())), add: async d => { const r = docRef(c + '/' + genId()); await r.set(d); return r; } }; }
  if (initial) for (const [col, items] of Object.entries(initial)) for (const [id, d] of Object.entries(items)) docs.set(col + '/' + id, clone(d));
  return { doc: docRef, collection: colRef, _docs: docs };
}

/* ===== App store ===== */
const CONTENT = ['courses', 'lectures', 'materials', 'quizzes', 'tests', 'series', 'assignments', 'announcements', 'testimonials'];
const S = {
  mode: 'loading', db: null, user: null, assets: null, downloads: null,
  uid: null, isAdmin: false, isOwner: false, readOnly: false, accountName: '',
  data: {}, loaded: {}, results: [], subsAll: [], fbAll: [],
  mySub: null, myFb: null, myState: null, stateLoaded: false, error: '',
};
CONTENT.concat(['settings']).forEach(c => S.data[c] = []);
const site = () => (S.data.settings.find(d => d.id === 'site')) || {};
const tax = () => (S.data.settings.find(d => d.id === 'taxonomy')) || { classes: [], subjects: [], chapters: {} };
const access = () => (S.data.settings.find(d => d.id === 'access')) || { approved: {} };
const byId = (col, id) => (S.data[col] || []).find(d => d.id === id);
const myResult = () => S.results.find(r => r.id === S.uid) || null;
const isRegistered = () => !!myResult();
const defaultState = () => ({ completed: [], favs: [], savedNotes: [], bookmarks: [], downloads: [], watched: [], target: { lectures: 2, quizzes: 1, minutes: 60 } });
const myState = () => ({ ...defaultState(), ...(S.myState || {}) });
let renderQueued = false;
function scheduleRender() { if (renderQueued) return; renderQueued = true; requestAnimationFrame(() => { renderQueued = false; App.render(); }); }

async function initStore() {
  const local = location.protocol === 'file:' || location.hostname === 'localhost';
  let claudeApi = window.claude && typeof window.claude.use === 'function' ? window.claude : null;
  if (local && !claudeApi) claudeApi = makeLocalClaude();
  let db = null, user = null;
  if (claudeApi) {
    try {
      const timeout = new Promise(r => setTimeout(() => r('timeout'), 10000));
      const got = await Promise.race([Promise.all([claudeApi.use('db'), claudeApi.use('user')]), timeout]);
      if (got !== 'timeout') [db, user] = got;
    } catch (e) { db = null; }
  }
  if (!db) return startOffline();
  S.db = db; S.user = user; S.mode = 'live';
  try { S.uid = user ? await user.id() : null; } catch { S.uid = null; }
  try { S.isOwner = user ? !!(await user.isOwner()) : false; } catch { }
  try { S.isAdmin = user ? !!(await user.canEdit()) : false; } catch { }
  if (S.isOwner) S.isAdmin = true;
  try { const me = user ? await user.me() : null; S.accountName = (me && me.name) || ''; } catch { }
  claudeApi.use('assets').then(a => { S.assets = a; scheduleRender(); }).catch(() => { });
  claudeApi.use('downloads').then(d => { S.downloads = d; }).catch(() => { });
  subscribeAll();
}
function startOffline() {
  S.mode = 'offline'; S.db = createMemoryDB(makeSeed()); S.uid = 'guest'; S.isAdmin = false;
  subscribeAll();
}
function makeLocalClaude() {
  const role = LS.get('testrole', 'admin');
  const db = createMemoryDB(LS.get('testseed', true) ? makeSeed() : null);
  window.__memdb = db;
  const uid = role === 'admin' ? 'u_owner' : 'u_student';
  return {
    use: async n => n === 'db' ? db : n === 'user' ? { id: async () => uid, isOwner: async () => role === 'admin', canEdit: async () => role === 'admin', can: async () => role === 'admin', me: async () => ({ id: uid, name: role === 'admin' ? 'Teacher' : 'Riya Sharma' }) } :
      n === 'assets' ? (role === 'admin' ? { upload: async b => { const url = URL.createObjectURL(b); return { id: 'local' + genId(), url, sizeBytes: b.size, contentType: b.type }; } } : null) :
        n === 'downloads' ? { save: async ({ filename }) => { console.log('download', filename); return { status: 'saved' }; } } : null
  };
}

function subscribeAll() {
  const db = S.db; const loadTimer = setTimeout(() => { if (!S.loaded.settings) { S.error = 'The database is taking longer than usual to respond. Content may be out of date.'; scheduleRender(); } }, 10000);
  const onErr = col => e => { S.loaded[col] = true; if (e && e.code === 'revoked') S.error = 'Access to this content has changed. Reload to continue.'; else S.error = 'Some content could not be loaded right now.'; scheduleRender(); };
  CONTENT.concat(['settings']).forEach(col => {
    db.collection(col).onSnapshot(snap => {
      S.data[col] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      S.loaded[col] = true;
      if (col === 'settings') { clearTimeout(loadTimer); if (!snap.metadata.fromCache) { S.error = ''; maybeSeed(); } }
      scheduleRender();
    }, onErr(col));
  });
  db.collection('results').onSnapshot(snap => { S.results = snap.docs.map(d => ({ id: d.id, ...d.data() })); S.loaded.results = true; scheduleRender(); }, onErr('results'));
  if (S.uid) {
    try {
      db.doc('data/users/' + S.uid + '/state').onSnapshot(s => { S.myState = s.exists ? s.data() : null; S.stateLoaded = true; scheduleRender(); }, () => { S.stateLoaded = true; });
      if (!S.isAdmin) {
        db.doc('submissions/' + S.uid).onSnapshot(s => { S.mySub = s.exists ? s.data() : null; scheduleRender(); }, () => { });
        db.doc('feedback/' + S.uid).onSnapshot(s => { S.myFb = s.exists ? s.data() : null; scheduleRender(); }, () => { });
      }
    } catch (e) { console.warn(e); }
  }
  if (S.isAdmin) {
    db.collection('submissions').onSnapshot(s => { S.subsAll = s.docs.map(d => ({ id: d.id, ...d.data() })); scheduleRender(); }, () => { });
    db.collection('feedback').onSnapshot(s => { S.fbAll = s.docs.map(d => ({ id: d.id, ...d.data() })); scheduleRender(); }, () => { });
  }
}

let seeding = false;
async function maybeSeed() {
  if (seeding || S.mode !== 'live' || !S.isOwner || site().brand) return;
  seeding = true;
  try {
    const chk = await S.db.doc('settings/site').get();
    if (chk.exists) { seeding = false; return; }
    toast('Setting up your academy with sample content…', 'info');
    await writeSeed(makeSeed());
    toast('Sample content added. Edit everything from the Admin panel.');
  } catch (e) { toast('Could not add sample content: ' + (e.message || e.code), 'err'); }
  seeding = false;
}
async function writeSeed(seed) {
  for (const [col, items] of Object.entries(seed)) {
    if (col === 'settings') continue;
    for (const [id, d] of Object.entries(items)) await S.db.collection(col).doc(id).set(d);
  }
  await S.db.doc('settings/taxonomy').set(seed.settings.taxonomy);
  await S.db.doc('settings/access').set(seed.settings.access);
  await S.db.doc('settings/site').set(seed.settings.site); // last: marks seeding complete
}

/* ===== Writes (one at a time per document) ===== */
const chains = {};
function queued(path, fn) { const p = (chains[path] || Promise.resolve()).then(fn, fn); chains[path] = p.catch(() => { }); return p; }
function handleWriteErr(e, what) {
  console.warn(what, e);
  const code = e && e.code;
  if (code === 'invalid_argument' && !S.isAdmin) { S.readOnly = true; scheduleRender(); toast('Your access is view-only, so progress can\'t be saved. Ask the teacher for Contributor access.', 'err'); }
  else if (code === 'quota_exceeded') toast('Storage is full: ' + (e.message || 'remove some old items and try again.'), 'err');
  else toast('Could not save ' + (what || 'changes') + '. Please try again.', 'err');
  throw e;
}
async function saveDoc(col, id, data) { return queued(col + '/' + id, () => S.db.collection(col).doc(id).set(data)).catch(e => handleWriteErr(e, 'changes')); }
async function deleteDoc(col, id) { return queued(col + '/' + id, () => S.db.collection(col).doc(id).delete()).catch(e => handleWriteErr(e, 'deletion')); }
function canSaveOwn() { return S.mode !== 'loading' && !!S.uid && !S.readOnly; }
async function updateMyResult(fn) {
  if (!canSaveOwn()) return;
  const path = 'results/' + S.uid;
  return queued(path, async () => { const cur = clone(myResult()) || { name: S.accountName || 'Student', joined: nowISO(), attempts: [], enrolled: [] }; const next = fn(cur) || cur; next.lastSeen = nowISO(); if (next.attempts && next.attempts.length > 150) next.attempts = next.attempts.slice(-150); await S.db.doc(path).set(next); S.results = S.results.filter(r => r.id !== S.uid).concat([{ id: S.uid, ...next }]); }).catch(e => handleWriteErr(e, 'your progress'));
}
async function updateMyState(fn) {
  if (!canSaveOwn()) { toast('Sign in with Contributor access to save progress.', 'info'); return; }
  const path = 'data/users/' + S.uid + '/state';
  return queued(path, async () => { const cur = myState(); const next = fn(clone(cur)) || cur; S.myState = next; scheduleRender(); await S.db.doc(path).set(next); }).catch(e => handleWriteErr(e, 'your progress'));
}
async function updateMyDoc(col, fn) {
  if (!canSaveOwn()) return;
  const path = col + '/' + S.uid; const local = col === 'submissions' ? 'mySub' : 'myFb';
  return queued(path, async () => { const cur = clone(S[local]) || { name: myResult()?.name || S.accountName || 'Student', items: col === 'submissions' ? {} : [] }; const next = fn(cur) || cur; S[local] = next; scheduleRender(); await S.db.doc(path).set(next); }).catch(e => handleWriteErr(e, 'your submission'));
}
async function uploadAsset(file) {
  if (!S.assets) throw new Error('Uploads are available to editors only.');
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const types = { pdf: 'application/pdf', mp4: 'video/mp4', webm: 'video/webm', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', csv: 'text/csv', txt: 'text/plain', md: 'text/markdown' };
  try { return await S.assets.upload(file, types[ext] ? { type: types[ext] } : undefined); }
  catch (e) {
    const m = { too_large: 'File is larger than 20 MB.', unsupported_type: 'This file type is not supported. Use PDF, MP4/WebM video or an image.', quota_or_state: 'Storage quota is full.', rate_limited: 'Too many uploads — wait a moment.' }[e.code];
    throw new Error(m || e.message || 'Upload failed');
  }
}
async function offerDownload(filename, data) {
  if (!S.downloads) { toast('Downloads are not available in this view.', 'err'); return false; }
  try { await S.downloads.save({ filename, data }); return true; }
  catch (e) { if (e.code !== 'declined') toast(e.code === 'host_unavailable' ? 'Open this page in a browser to download files.' : 'Download failed: ' + (e.message || e.code), 'err'); return false; }
}

/* ===== Derived helpers ===== */
function testStatus(t) { const n = Date.now(), s = t.start ? new Date(t.start).getTime() : 0, e = t.end ? new Date(t.end).getTime() : Infinity; return n < s ? 'upcoming' : n > e ? 'completed' : 'active'; }
function myAttempts(kind, refId) { const r = myResult(); return (r?.attempts || []).filter(a => (!kind || a.kind === kind) && (!refId || a.refId === refId)); }
function allAttempts(kind, refId) { const out = []; for (const r of S.results) for (const a of (r.attempts || [])) if ((!kind || a.kind === kind) && (!refId || a.refId === refId)) out.push({ ...a, uid: r.id, name: r.name }); return out; }
function rankFor(testId, uid) {
  const firsts = {}; for (const a of allAttempts('test', testId)) { if (a.practice) continue; if (!firsts[a.uid] || a.at < firsts[a.uid].at) firsts[a.uid] = a; }
  const list = Object.values(firsts).sort((a, b) => b.score - a.score || a.time - b.time);
  const idx = list.findIndex(a => a.uid === uid); if (idx < 0) return null;
  const me = list[idx]; const below = list.filter(a => a.score < me.score).length;
  return { rank: idx + 1, of: list.length, percentile: list.length > 1 ? +(below / (list.length - 1) * 100).toFixed(1) : 100, topper: list[0], avg: list.reduce((s, a) => s + a.score, 0) / list.length, list };
}
function leaderboard(kind, refId) {
  const best = {}; for (const a of allAttempts(kind, refId)) { const p = a.max ? a.score / a.max : 0; if (!best[a.uid] || p > best[a.uid].p || (p === best[a.uid].p && a.time < best[a.uid].time)) best[a.uid] = { ...a, p }; }
  return Object.values(best).sort((a, b) => b.p - a.p || a.time - b.time);
}
function hasCourseAccess(c) { if (!c || !c.restricted || S.isAdmin) return true; return ((access().approved || {})[S.uid] || []).includes(c.id); }
function totalQuestions() { return S.data.quizzes.reduce((s, x) => s + (x.questions || []).length, 0) + S.data.tests.reduce((s, x) => s + (x.questions || []).length, 0); }
