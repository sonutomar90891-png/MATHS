/* ===== Router, rendering and events ===== */
const TITLES = { practice: 'Create a Practice Test', home: '', about: 'About Us', contact: 'Contact Us', privacy: 'Privacy Policy', terms: 'Terms & Conditions', courses: 'Courses', lectures: 'Video Lectures', materials: 'Study Materials', quizzes: 'Quizzes', tests: 'Online Tests', series: 'Test Series', assignments: 'Assignments', results: 'Results & Performance', login: 'Login / Registration', dashboard: 'My Dashboard', admin: 'Admin Panel' };
function parseRoute() { const raw = decodeURIComponent(location.hash.slice(1)) || 'home'; const i = raw.indexOf('-'); return { raw, base: i < 0 ? raw : raw.slice(0, i), arg: i < 0 ? '' : raw.slice(i + 1) }; }
const App = {
  lastRoute: null,
  page(r) {
    const P = Pages, a = r.arg;
    switch (r.base) {
      case 'home': return P.home(); case 'about': return P.about(); case 'contact': return P.contact(); case 'privacy': return P.privacy(); case 'terms': return P.terms();
      case 'courses': return P.courses(); case 'course': return P.course(a);
      case 'lectures': return P.lectures(); case 'lecture': return P.lecture(a);
      case 'materials': return P.materials(); case 'material': return P.material(a);
      case 'quizzes': return P.quizzes(); case 'practice': return P.practice(); case 'quiz': return P.quiz(a); case 'review': return P.review(a);
      case 'tests': return P.tests(); case 'test': return P.test(a);
      case 'series': return a ? P.seriesDetail(a) : P.series();
      case 'assignments': return P.assignments(); case 'results': return P.results();
      case 'login': return P.login(); case 'dashboard': return P.dashboard(); case 'admin': return P.admin(a || 'overview');
      case 'guest': return P.guestResult();
      default: return notFound('Page');
    }
  },
  title(r) {
    const s = site(); const brand = s.brand || 'OnlyMaths';
    const item = { course: 'courses', lecture: 'lectures', material: 'materials', quiz: 'quizzes', test: 'tests', series: 'series' }[r.base];
    const doc = item && r.arg ? byId(item, r.arg) : null;
    const t = doc ? doc.title : TITLES[r.base];
    return t ? `${t} | ${brand}` : `${brand} — ${s.heroTitle || 'Learn Smarter. Achieve More.'}`;
  },
  render() {
    const r = parseRoute(); const app = $('#app');
    const ae = document.activeElement; const fid = ae && ae.id && app.contains(ae) ? ae.id : null; const sel = fid && 'selectionStart' in ae ? [ae.selectionStart, ae.selectionEnd] : null;
    const routeChanged = r.raw !== App.lastRoute;
    if (routeChanged && QZ.run && (QZ.run.result || !r.raw.startsWith('quiz-' + QZ.run.quizId))) { if (QZ.run.result) QZ.run = null; }
    if (['practice', 'review', 'dashboard', 'admin'].includes(r.base)) ensureBank();
    let main; try { main = App.page(r); } catch (e) { console.error(e); main = `<div class="container page-body">${emptyState('alert', 'Something went wrong', 'This page could not be displayed. Try refreshing or going back home.', '<a class="btn btn-primary" href="#home">Back to home</a>')}</div>`; }
    const s = site(); const pin = S.data.announcements.filter(a => a.pinned).sort(byDate)[0];
    const banner = S.mode === 'offline' ? `<div class="sys-banner">${icon('info', 14)} Preview mode — the database isn't reachable in this view, so you're seeing sample content and nothing you do is saved.</div>` : S.error ? `<div class="sys-banner">${icon('alert', 14)} ${h(S.error)}</div>` : '';
    const ann = pin && LS.get('annDismiss', '') !== pin.id ? `<div class="announce">${icon('megaphone', 14, 'style="vertical-align:-2px;color:var(--gold)"')} <b>${h(pin.title)}</b> <span class="hide-sm">— ${h(pin.body)}</span><button data-act="ann-x" data-id="${h(pin.id)}" aria-label="Dismiss">${icon('x', 15)}</button></div>` : '';
    app.innerHTML = banner + ann + navHTML(r.raw) + `<main id="main">${main}</main>` + (r.base === 'admin' ? '' : footerHTML());
    document.title = App.title(r);
    const md = $('meta[name=description]'); if (md) md.setAttribute('content', s.heroSub || 'Video lectures, notes, quizzes and mock tests.');
    if (fid) { const el = document.getElementById(fid); if (el) { el.focus(); if (sel) try { el.setSelectionRange(sel[0], sel[1]); } catch { } } }
    App.observe(); typesetMath();
    if (routeChanged) { App.lastRoute = r.raw; document.body.classList.remove('drawer-open'); window.scrollTo({ top: 0 }); App.onRoute(r); }
  },
  onRoute(r) {
    if (r.base === 'lecture' && isRegistered() && S.stateLoaded && byId('lectures', r.arg)) {
      const w = myState().watched; const last = w[w.length - 1];
      if (!last || last.id !== r.arg || Date.now() - new Date(last.at) > 30 * 60000) updateMyState(s => { s.watched = (s.watched || []).concat([{ id: r.arg, at: nowISO() }]).slice(-100); return s; });
    }
  },
  observe() {
    const els = $$('.reveal:not(.in)'); if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    if (!App.io) App.io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); App.io.unobserve(e.target); } }), { threshold: .08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(e => App.io.observe(e));
  },
};

/* ===== Actions ===== */
function setFilter(path, v) { const [a, b] = path.split('.'); F[a][b] = v; }
async function downloadMaterial(id) {
  const m = byId('materials', id); if (!m) return;
  const fname = (m.fileName || m.title.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') + '.pdf');
  let data;
  if (m.assetId) { try { const res = await fetch('/_blob/' + m.assetId); if (!res.ok) throw 0; data = await res.blob(); } catch { toast('Could not fetch the file. Try "Open in new tab" instead.', 'err'); return; } }
  else data = makePDF(m.title, m.content || '', `${site().brand || 'OnlyMaths'} · ${m.subject} · ${m.cls || ''}`);
  const ok = await offerDownload(fname.toLowerCase().endsWith('.pdf') ? fname : fname + '.pdf', data);
  if (ok) { toast('Download started'); if (isRegistered()) updateMyState(s => { s.downloads = (s.downloads || []).concat([{ id, at: nowISO() }]).slice(-60); return s; }); }
}
function toggleIn(list, id) { return list.includes(id) ? list.filter(x => x !== id) : [...list, id]; }
function needProfile() { if (isRegistered()) return false; toast('Create your student profile first.', 'info'); location.hash = 'login'; return true; }
function ytEmbed(start = 0) { const p = $('#yt-player'); if (!p) return false; p.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${h(p.dataset.yid)}?autoplay=1&rel=0&modestbranding=1${start ? '&start=' + start : ''}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="Lecture video"></iframe>`; return true; }
const tsToSec = t => String(t).split(':').reverse().reduce((s, v, i) => s + (+v || 0) * Math.pow(60, i), 0);

const ACT = {
  search: () => openSearch(),
  theme: () => { const d = document.documentElement; d.dataset.theme = d.dataset.theme === 'dark' ? 'light' : 'dark'; LS.set('theme', d.dataset.theme); App.render(); },
  notif: el => { const dd = el.closest('.dd'); dd.classList.toggle('open'); const a = S.data.announcements.slice().sort(byDate)[0]; if (a) LS.set('seenAnn', a.date); el.querySelector('.dot')?.remove(); },
  drawer: () => document.body.classList.add('drawer-open'),
  'drawer-close': () => document.body.classList.remove('drawer-open'),
  'ann-x': el => { LS.set('annDismiss', el.dataset.id); App.render(); },
  'home-quiz': el => { F.homeQuiz = el.dataset.v; App.render(); },
  filter: el => { setFilter(el.dataset.k, el.dataset.v); if (el.dataset.reset) setFilter(el.dataset.reset, 'All'); App.render(); },
  'clear-filters': el => { const k = el.dataset.k; Object.keys(F[k]).forEach(x => F[k][x] = x === 'q' ? '' : x === 'view' ? 'all' : 'All'); App.render(); },
  'dl-mat': el => downloadMaterial(el.dataset.id),
  'save-note': el => { if (needProfile()) return; const id = el.dataset.id; const on = myState().savedNotes.includes(id); updateMyState(s => { s.savedNotes = toggleIn(s.savedNotes, id); return s; }); toast(on ? 'Removed from your library' : 'Saved to your library'); },
  fav: el => { if (needProfile()) return; const id = el.dataset.id; const on = myState().favs.includes(id); updateMyState(s => { s.favs = toggleIn(s.favs, id); return s; }); toast(on ? 'Removed from favourites' : 'Added to favourites'); },
  complete: el => { if (needProfile()) return; const id = el.dataset.id; const on = myState().completed.includes(id); updateMyState(s => { s.completed = toggleIn(s.completed, id); return s; }); if (!on) toast('Lecture marked as completed'); },
  enroll: async el => { const id = el.dataset.id; const on = (myResult()?.enrolled || []).includes(id); if (on && !(await confirmBox('Leave this course?', 'Your lecture progress is kept.', 'Leave course'))) return; await updateMyResult(r => { r.enrolled = toggleIn(r.enrolled || [], id); return r; }); if (!on) toast('You are enrolled — happy learning!'); },
  'yt-play': () => ytEmbed(0),
  seek: el => { const sec = tsToSec(el.dataset.t); const v = $('#lec-video'); if (v) { v.currentTime = sec; v.play().catch(() => { }); v.scrollIntoView({ behavior: 'smooth', block: 'center' }); } else if (ytEmbed(sec)) $('#yt-player').scrollIntoView({ behavior: 'smooth', block: 'center' }); else toast('The video for this lecture isn\'t attached yet.', 'info'); },
  'quiz-start': el => QuizEngine.start(el.dataset.id),
  'quiz-pick': el => QuizEngine.pick(+el.dataset.j),
  'quiz-nav': el => QuizEngine.nav(+el.dataset.d),
  'quiz-go': el => QuizEngine.go(+el.dataset.i),
  'quiz-submit': () => QuizEngine.submit(false),
  'exam-start': el => Exam.start(el.dataset.id),
  'ex-pick': el => Exam.pick(+el.dataset.j), 'ex-nav': el => Exam.visit(EX.run.cur + +el.dataset.d), 'ex-go': el => Exam.visit(+el.dataset.i),
  'ex-save': () => Exam.save(), 'ex-mark': () => Exam.mark(), 'ex-clear': () => Exam.clear(), 'ex-submit': () => Exam.submit(false), 'ex-exit': () => Exam.exit(),
  'ex-pal': () => $('#exam')?.classList.toggle('pal-open'),
  'bm-q': el => { if (needProfile()) return; const key = el.dataset.ref + ':' + el.dataset.q; const on = myState().bookmarks.some(b => b.key === key); updateMyState(s => { s.bookmarks = on ? s.bookmarks.filter(b => b.key !== key) : s.bookmarks.concat([{ key, kind: el.dataset.kind, refId: el.dataset.ref, qid: el.dataset.q, at: nowISO() }]).slice(-200); return s; }); toast(on ? 'Bookmark removed' : 'Question bookmarked'); },
  'assign-open': el => openAssignment(el.dataset.id),
  'edit-profile': () => openProfile(), 'edit-target': () => openTarget(), feedback: (el, e) => { e && e.preventDefault(); openFeedback(); },
  'a-new': el => openEditor(el.dataset.col, null), 'a-edit': el => openEditor(el.dataset.col, el.dataset.id), 'a-del': el => AdminAct.del(el.dataset.col, el.dataset.id), 'a-qs': el => openQuestions(el.dataset.col, el.dataset.id),
  'a-seed': async el => { el.disabled = true; try { await writeSeed(makeSeed()); toast('Sample content added'); } catch (e) { toast('Could not add sample content', 'err'); el.disabled = false; } },
  'a-student': el => AdminAct.student(el.dataset.id), 'a-access': el => AdminAct.access(el.dataset.id), 'a-del-student': el => AdminAct.delStudent(el.dataset.id),
  'a-grade': el => AdminAct.grade(el.dataset.uid, el.dataset.aid), 'a-feature': el => AdminAct.feature(el.dataset.uid, el.dataset.id),
  'a-save-site': () => AdminAct.saveSite(), 'a-save-tax': () => AdminAct.saveTax(),
};
Object.assign(ACT, BANK_ACT);
const FORMS = {
  async register(f) {
    const name = f.name.value.trim(); if (name.length < 2) return toast('Please enter your name.', 'err');
    const btn = f.querySelector('button'); btn.disabled = true;
    try { await updateMyResult(r => { r.name = name; r.cls = f.cls.value; r.goal = f.goal.value; r.joined = r.joined || nowISO(); r.attempts = r.attempts || []; r.enrolled = r.enrolled || []; return r; }); toast('Welcome aboard, ' + name.split(' ')[0] + '!'); location.hash = 'dashboard'; } catch { btn.disabled = false; }
  },
  async contact(f) {
    const btn = f.querySelector('button'); btn.disabled = true;
    try { await updateMyDoc('feedback', d => { d.name = myResult()?.name || f.name.value.trim(); d.items = (d.items || []).concat([{ id: genId(), kind: 'contact', name: f.name.value.trim(), contact: f.contact.value.trim(), subject: f.subject.value.trim(), text: f.message.value.trim(), at: nowISO() }]).slice(-30); return d; }); f.reset(); toast('Message sent to the teacher. We\'ll get back to you soon.'); } catch { }
    btn.disabled = false;
  },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) { if (!e.target.closest('.dd')) $$('.dd.open').forEach(d => d.classList.remove('open')); return; }
  const fn = ACT[el.dataset.act]; if (!fn) return;
  if (el.tagName === 'A' && el.dataset.act === 'feedback') e.preventDefault();
  fn(el, e);
});
const rerenderSoon = debounce(() => App.render(), 160);
document.addEventListener('input', e => {
  const el = e.target;
  if (bankInput(el)) return;
  if (el.dataset.filter) { setFilter(el.dataset.filter, el.value); if (el.dataset.reset) setFilter(el.dataset.reset, 'All'); if (el.tagName === 'INPUT') rerenderSoon(); else App.render(); }
  else if (el.dataset.aq) { AQ[el.dataset.aq] = el.value; rerenderSoon(); }
});
document.addEventListener('change', e => { const el = e.target; if (el.dataset.actChange === 'lb-test') { F.lbTest = el.value; App.render(); } });
document.addEventListener('submit', e => { const f = e.target.closest('form'); if (!f) return; e.preventDefault(); const fn = FORMS[f.dataset.form]; if (fn) fn(f); });
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
  else if (e.key === 'Escape') { if (modalStack.length) closeModal(); else document.body.classList.remove('drawer-open'); }
  else if (EX.run && !modalStack.length && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName)) { if (e.key === 'ArrowRight') Exam.visit(EX.run.cur + 1); else if (e.key === 'ArrowLeft') Exam.visit(EX.run.cur - 1); }
});
window.addEventListener('hashchange', () => App.render());
window.addEventListener('scroll', () => $('#nav')?.classList.toggle('scrolled', window.scrollY > 10), { passive: true });

/* ===== Boot ===== */
(function boot() {
  const t = LS.get('theme', null) || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = t;
  App.render();
  initStore().then(() => App.render()).catch(e => { console.error(e); startOffline(); App.render(); });
})();
