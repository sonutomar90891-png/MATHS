/* ===== Layout: nav, footer, shared components ===== */
const NAV = {
  learn: [['courses', 'book', 'Courses', 'Structured, chapter-wise programs'], ['lectures', 'video', 'Video Lectures', 'Watch, bookmark and track progress'], ['materials', 'file', 'Study Materials', 'Notes, formula sheets & worksheets']],
  practice: [['quizzes', 'quiz', 'Quizzes', 'Daily, chapter & topic practice'], ['tests', 'test', 'Online Tests', 'Exam-grade timed tests'], ['series', 'layers', 'Test Series', 'Full mock series with rankings'], ['assignments', 'task', 'Assignments', 'Submit work, get graded']],
};
function brandHTML() { const s = site(); return `<a href="#home" class="brand"><span class="brand-mark">${icon('grad', 20)}</span><span>${h(s.brand || 'OnlyMaths')}<small>${h(s.tagline || 'Academy')}</small></span></a>`; }
function navHTML(route) {
  const base = route.split('-')[0];
  const isIn = arr => arr.some(a => a[0] === base);
  const dd = (label, arr, key) => `<div class="dd"><button class="nav-link ${isIn(arr) ? 'active' : ''}" aria-haspopup="true">${label} ${icon('down', 14)}</button><div class="dd-menu">${arr.map(([r, ic, t, d]) => `<a class="dd-item" href="#${r}"><span class="ic">${icon(ic, 18)}</span><span><b>${t}</b><span>${d}</span></span></a>`).join('')}</div></div>`;
  const anns = S.data.announcements.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const seen = LS.get('seenAnn', '');
  const unread = anns.length && anns[0].date > seen;
  const r = myResult();
  return `<header class="nav" id="nav"><div class="container">
    ${brandHTML()}
    <nav class="nav-links" aria-label="Main">
      <a class="nav-link ${base === 'home' ? 'active' : ''}" href="#home">Home</a>
      ${dd('Learn', NAV.learn)}${dd('Practice', NAV.practice)}
      <a class="nav-link ${base === 'results' ? 'active' : ''}" href="#results">Results</a>
      <a class="nav-link ${base === 'about' ? 'active' : ''}" href="#about">About</a>
      <a class="nav-link ${base === 'contact' ? 'active' : ''}" href="#contact">Contact</a>
    </nav>
    <div class="nav-right">
      <button class="search-trigger" data-act="search" aria-label="Search">${icon('search', 17)}<span class="lbl">Search anything…</span><kbd>Ctrl K</kbd></button>
      <button class="icon-btn" data-act="theme" aria-label="Toggle dark mode">${icon(document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon', 19)}</button>
      <div class="dd" id="notif"><button class="icon-btn" data-act="notif" aria-label="Notifications">${icon('bell', 19)}${unread ? '<i class="dot"></i>' : ''}</button>
        <div class="dd-menu notif-panel"><div class="hd">Announcements <span class="badge b-royal">${anns.length}</span></div>
        ${anns.length ? anns.slice(0, 6).map(a => `<div class="notif-item"><b>${h(a.title)}</b><div class="muted">${h(a.body)}</div><time>${ago(a.date)}</time></div>`).join('') : '<div class="notif-item muted">No announcements yet.</div>'}</div></div>
      ${S.isAdmin ? `<a href="#admin" class="btn btn-sm btn-gold hide-sm">${icon('settings', 15)} Admin</a>` : ''}
      ${r ? `<a href="#dashboard" class="avatar" title="My dashboard">${h(initials(r.name))}</a>` : `<a href="#login" class="btn btn-sm btn-primary hide-sm">Login / Register</a>`}
      <button class="icon-btn menu-btn" data-act="drawer" aria-label="Menu">${icon('menu', 22)}</button>
    </div></div></header>
  <div class="drawer-bg" data-act="drawer-close"></div>
  <aside class="drawer" aria-label="Mobile menu"><div class="drawer-hd">${brandHTML()}<button class="icon-btn" data-act="drawer-close">${icon('x')}</button></div>
    <nav><a href="#home" class="${base === 'home' ? 'active' : ''}">${icon('home')} Home</a>
    <div class="grp">Learn</div>${NAV.learn.map(([r, ic, t]) => `<a href="#${r}" class="${base === r ? 'active' : ''}">${icon(ic)} ${t}</a>`).join('')}
    <div class="grp">Practice</div>${NAV.practice.map(([r, ic, t]) => `<a href="#${r}" class="${base === r ? 'active' : ''}">${icon(ic)} ${t}</a>`).join('')}
    <div class="grp">More</div><a href="#results">${icon('chart')} Results & Performance</a><a href="#about">${icon('info')} About Us</a><a href="#contact">${icon('mail')} Contact Us</a>
    <div class="grp">Account</div>${r ? `<a href="#dashboard">${icon('grid')} My Dashboard</a>` : `<a href="#login">${icon('user')} Login / Register</a>`}${S.isAdmin ? `<a href="#admin">${icon('settings')} Admin Panel</a>` : ''}
    </nav></aside>`;
}
function footerHTML() {
  const s = site();
  const soc = [['youtube', 'yt'], ['instagram', 'ig'], ['telegram', 'tg'], ['facebook', 'fb'], ['linkedin', 'li']].filter(([k]) => safeUrl(s[k]));
  return `<footer class="footer"><div class="container"><div class="foot-grid">
    <div>${brandHTML()}<p class="mt16" style="max-width:320px">${h(s.mission || 'Structured learning, quality material and honest progress tracking for every student.')}</p>
      <div class="socials">${soc.map(([k, ic]) => `<a href="${h(safeUrl(s[k]))}" target="_blank" rel="noopener" aria-label="${k}">${icon(ic, 18)}</a>`).join('')}${s.whatsapp ? `<a href="https://wa.me/${h(String(s.whatsapp).replace(/\D/g, ''))}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon('wa', 18)}</a>` : ''}</div></div>
    <div><h5>Learn</h5><ul><li><a href="#courses">Courses</a></li><li><a href="#lectures">Video Lectures</a></li><li><a href="#materials">Study Materials</a></li><li><a href="#assignments">Assignments</a></li></ul></div>
    <div><h5>Practice</h5><ul><li><a href="#quizzes">Quizzes</a></li><li><a href="#tests">Online Tests</a></li><li><a href="#series">Test Series</a></li><li><a href="#results">Results</a></li></ul></div>
    <div><h5>Company</h5><ul><li><a href="#about">About Us</a></li><li><a href="#contact">Contact Us</a></li><li><a href="#privacy">Privacy Policy</a></li><li><a href="#terms">Terms & Conditions</a></li></ul></div>
    <div><h5>Get in touch</h5><ul>${s.email ? `<li class="flex">${icon('mail', 16)} ${h(s.email)}</li>` : ''}${s.phone ? `<li class="flex">${icon('phone', 16)} ${h(s.phone)}</li>` : ''}${s.address ? `<li class="flex">${icon('map', 16)} ${h(s.address)}</li>` : ''}</ul></div>
  </div><div class="foot-bottom"><span>© ${new Date().getFullYear()} ${h(s.brand || 'OnlyMaths')}. All rights reserved.</span><span>Made for curious minds.</span></div></div></footer>
  ${s.whatsapp ? `<a class="wa-fab" href="https://wa.me/${h(String(s.whatsapp).replace(/\D/g, ''))}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon('wa', 26)}</a>` : ''}`;
}
function pageHead(title, sub, crumbs = []) {
  return `<section class="page-hd"><div class="container"><nav class="crumbs" aria-label="Breadcrumb"><a href="#home">Home</a>${crumbs.map((c, i) => `${icon('right', 13)}${c[1] && i < crumbs.length - 1 ? `<a href="#${c[1]}">${h(c[0])}</a>` : `<span class="cur">${h(c[0])}</span>`}`).join('')}</nav><h1>${h(title)}</h1>${sub ? `<p>${h(sub)}</p>` : ''}</div></section>`;
}
function emptyState(ic, title, text, action = '') { return `<div class="empty"><div class="ic">${icon(ic, 28)}</div><h4>${h(title)}</h4><p>${h(text)}</p>${action}</div>`; }
function skeletonGrid(n = 3, cls = 'g3') { return `<div class="grid ${cls}">${Array.from({ length: n }, () => `<div class="card"><div class="skel" style="aspect-ratio:16/9;border-radius:20px 20px 0 0"></div><div class="card-pad"><div class="skel" style="height:14px;width:40%"></div><div class="skel mt12" style="height:20px;width:85%"></div><div class="skel mt12" style="height:12px"></div></div></div>`).join('')}</div>`; }
const ready = (...cols) => cols.every(c => S.loaded[c]);
function lockBadge(c) { return c && c.restricted ? `<span class="badge b-gold">${icon('lock', 12)} Restricted</span>` : ''; }
function thumbFor(item, label) { return item.thumbId ? `<img src="/_blob/${h(item.thumbId)}" alt="" loading="lazy">` : thumbSVG(item.subject, item.title, label); }

/* ===== Cards ===== */
function courseCard(c) {
  const lecs = S.data.lectures.filter(l => l.courseId === c.id).length;
  const mats = S.data.materials.filter(m => m.courseId === c.id || (m.subject === c.subject && m.cls === c.cls)).length;
  return `<article class="card hover course-card"><a href="#course-${h(c.id)}" class="thumb">${thumbFor(c, c.cls)}<span class="tag">${subjBadge(c.subject)}</span></a>
    <div class="body"><div class="flex wrap"><span class="badge">${h(c.cls || '')}</span>${c.level ? `<span class="badge b-gold">${h(c.level)}</span>` : ''}${lockBadge(c)}</div>
    <h3><a href="#course-${h(c.id)}">${h(c.title)}</a></h3><p class="desc">${h(c.desc)}</p>
    <div class="meta"><span>${icon('video', 15)} ${lecs} lectures</span><span>${icon('file', 15)} ${mats} notes</span></div>
    <div class="card-foot"><div class="instructor"><span class="avatar">${h(initials(c.instructor))}</span>${h(c.instructor || '')}</div><a href="#course-${h(c.id)}" class="btn btn-sm btn-soft">Explore Course ${icon('arrow', 14)}</a></div></div></article>`;
}
function lectureCard(l) {
  const done = myState().completed.includes(l.id);
  return `<article class="card hover lec-card"><a href="#lecture-${h(l.id)}" class="thumb">${thumbFor(l, l.chapter)}<span class="dur">${h(l.duration || '')}</span>${done ? `<span class="tag badge b-green">${icon('check', 12)} Completed</span>` : ''}<span class="play"><i>${icon('play', 22)}</i></span></a>
    <div class="body"><div class="flex wrap">${subjBadge(l.subject)}<span class="badge">${h(l.chapter)}</span></div>
    <h4><a href="#lecture-${h(l.id)}">${h(l.title)}</a></h4>
    <div class="meta"><span>${icon('clock', 14)} ${h(l.duration || '—')}</span><span>${icon('cal', 14)} ${fmtDate(l.date)}</span></div></div></article>`;
}
function materialCard(m) {
  return `<article class="card hover doc-card">${docIcon(m.type)}<div class="grow"><div class="flex wrap" style="gap:6px">${(m.tags || []).slice(0, 3).map(t => `<span class="badge ${t === 'Important' ? 'b-red' : t === 'Formula Sheet' ? 'b-gold' : t === 'Practice' ? 'b-violet' : 'b-royal'}">${h(t)}</span>`).join('')}</div>
    <h4 class="mt8"><a href="#material-${h(m.id)}">${h(m.title)}</a></h4>
    <div class="meta mt8"><span>${h(m.subject)}</span><span>${h(m.cls || '')}</span><span>${fmtDate(m.date)}</span></div>
    <div class="acts"><a href="#material-${h(m.id)}" class="btn btn-sm btn-soft">${icon('eye', 15)} View</a><button class="btn btn-sm btn-ghost" data-act="dl-mat" data-id="${h(m.id)}">${icon('download', 15)} Download</button></div></div></article>`;
}
function quizCard(qz) {
  const att = myAttempts('quiz', qz.id); const best = att.length ? Math.max(...att.map(a => pct(a.score, a.max))) : null;
  return `<article class="card hover quiz-card"><div class="flex between"><span class="badge b-royal">${h(qz.kind || 'Quiz')}</span>${diffBadge(qz.difficulty)}</div>
    <h4>${h(qz.title)}</h4><div class="meta"><span>${h(qz.subject)}</span>${qz.chapter ? `<span>· ${h(qz.chapter)}</span>` : ''}</div>
    <div class="qstats"><div><b>${(qz.questions || []).length}</b><span>Questions</span></div><div><b>${h(qz.duration || 10)}m</b><span>Duration</span></div><div><b>${best == null ? '—' : best + '%'}</b><span>Best</span></div></div>
    <a href="#quiz-${h(qz.id)}" class="btn btn-primary btn-block">${att.length ? 'Attempt Again' : 'Attempt Quiz'} ${icon('arrow', 15)}</a></article>`;
}
function statusBadge(st) { return { upcoming: `<span class="badge b-amber">${icon('clock', 12)} Upcoming</span>`, active: `<span class="badge b-green">${icon('zap', 12)} Live</span>`, completed: `<span class="badge">${icon('check', 12)} Closed</span>` }[st]; }
function seriesCard(sr) {
  const ts = S.data.tests.filter(t => t.seriesId === sr.id).sort((a, b) => (a.order || 0) - (b.order || 0));
  const done = ts.filter(t => myAttempts('test', t.id).length).length;
  return `<article class="card hover series-card"><div class="series-top"><span class="badge b-gold">${h(sr.exam || 'Test Series')}</span><h4>${h(sr.title)}</h4><p>${h(sr.desc || '')}</p>
    <div class="flex mt12" style="gap:16px;color:#C9D3F0;font-size:13px"><span class="flex" style="gap:6px">${icon('test', 15)} ${ts.length} tests</span><span class="flex" style="gap:6px">${icon('checkc', 15)} ${done} attempted</span></div></div>
    <div class="tl">${ts.slice(0, 4).map(t => `<a class="tl-item" href="#test-${h(t.id)}"><div class="grow"><b>${h(t.title)}</b><span>${testStatus(t) === 'upcoming' ? 'Opens ' + fmtDT(t.start) : testStatus(t) === 'active' ? 'Closes ' + fmtDT(t.end) : 'Closed ' + fmtDate(t.end)}</span></div>${statusBadge(testStatus(t))}</a>`).join('') || '<div class="tl-item muted">Tests will appear here soon.</div>'}</div>
    <div class="card-pad" style="padding-top:14px"><a href="#series-${h(sr.id)}" class="btn btn-soft btn-block">View series & performance ${icon('arrow', 15)}</a></div></article>`;
}

/* ===== Charts (inline SVG) ===== */
function lineChart(points, { h: H = 200, max = 100, suffix = '%' } = {}) {
  if (!points.length) return '';
  const W = 600, pl = 44, pr = 14, pt = 14, pb = 26, iw = W - pl - pr, ih = H - pt - pb;
  const x = i => pl + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw), y = v => pt + ih - (v / max) * ih;
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  const area = path + ` L${x(points.length - 1).toFixed(1)},${pt + ih} L${x(0).toFixed(1)},${pt + ih} Z`;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Score trend"><defs><linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2952E3" stop-opacity=".28"/><stop offset="1" stop-color="#2952E3" stop-opacity="0"/></linearGradient></defs>
    ${[0, 25, 50, 75, 100].map(g => `<line class="grid-l" x1="${pl}" x2="${W - pr}" y1="${y(g * max / 100)}" y2="${y(g * max / 100)}"/><text x="${pl - 8}" y="${y(g * max / 100) + 4}" text-anchor="end">${Math.round(g * max / 100)}${suffix}</text>`).join('')}
    <path d="${area}" fill="url(#lg1)"/><path d="${path}" fill="none" stroke="#2952E3" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${points.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.v)}" r="4" fill="var(--surface)" stroke="#2952E3" stroke-width="2"><title>${h(p.label)}: ${p.v}${suffix}</title></circle>`).join('')}
    ${points.length <= 12 ? points.map((p, i) => `<text x="${x(i)}" y="${H - 6}" text-anchor="middle">${h(p.short || i + 1)}</text>`).join('') : ''}</svg>`;
}
function barChart(items, { max = 100, suffix = '%' } = {}) {
  if (!items.length) return '';
  return `<div style="display:flex;flex-direction:column;gap:14px">${items.map(it => `<div><div class="flex between small"><span style="font-weight:600">${h(it.label)}</span><span class="muted">${it.v}${suffix}${it.note ? ' · ' + h(it.note) : ''}</span></div><div class="progress mt8 ${it.v >= 75 ? 'green' : it.v >= 50 ? '' : 'gold'}"><i style="width:${Math.min(100, it.v / max * 100)}%"></i></div></div>`).join('')}</div>`;
}
function ring(p, size = 150, label = 'Score', color = '#2952E3') {
  const r = size / 2 - 10, c = 2 * Math.PI * r;
  return `<div class="ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="12"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.max(0, Math.min(100, p)) / 100)}" style="transition:stroke-dashoffset 1s"/></svg><div class="v"><div><b>${p}%</b><span>${label}</span></div></div></div>`;
}

/* ===== Hero illustration ===== */
function heroArt() {
  return `<svg viewBox="0 0 560 480" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><linearGradient id="ha1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2952E3"/><stop offset="1" stop-color="#13285A"/></linearGradient>
  <linearGradient id="ha2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9CF8A"/><stop offset="1" stop-color="#B48A33"/></linearGradient>
  <linearGradient id="ha3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#EEF2FF"/></linearGradient></defs>
  <circle cx="300" cy="230" r="190" fill="#fff" opacity=".04"/><circle cx="300" cy="230" r="140" fill="none" stroke="#fff" stroke-opacity=".08" stroke-dasharray="4 8"/>
  <g transform="translate(70 70)"><rect width="400" height="290" rx="22" fill="url(#ha3)"/>
    <rect x="0" y="0" width="400" height="40" rx="22" fill="#fff"/><rect x="0" y="22" width="400" height="18" fill="#fff"/>
    <circle cx="24" cy="20" r="5" fill="#E0475A"/><circle cx="42" cy="20" r="5" fill="#E39B1B"/><circle cx="60" cy="20" r="5" fill="#14A06B"/>
    <rect x="150" y="12" width="150" height="16" rx="8" fill="#EEF2FF"/>
    <rect x="20" y="56" width="240" height="140" rx="14" fill="url(#ha1)"/>
    <g fill="#fff" opacity=".1"><circle cx="230" cy="70" r="50"/></g>
    <text x="38" y="88" font-family="Georgia,serif" font-style="italic" font-size="18" fill="#E9CF8A">∫ eˣ dx = eˣ + C</text>
    <circle cx="140" cy="130" r="24" fill="#fff"/><path d="M134 119v22l18-11z" fill="#2952E3"/>
    <rect x="38" y="176" width="204" height="5" rx="2.5" fill="#fff" opacity=".25"/><rect x="38" y="176" width="120" height="5" rx="2.5" fill="#E9CF8A"/>
    <rect x="276" y="56" width="104" height="66" rx="12" fill="#fff" stroke="#E2E7F1"/><text x="290" y="80" font-family="Inter" font-size="10" fill="#65718E" font-weight="600">LECTURES</text><text x="290" y="106" font-family="Manrope,Inter" font-size="22" font-weight="800" fill="#0B1B3F">12/18</text>
    <rect x="276" y="130" width="104" height="66" rx="12" fill="#fff" stroke="#E2E7F1"/><text x="290" y="154" font-family="Inter" font-size="10" fill="#65718E" font-weight="600">ACCURACY</text><text x="290" y="180" font-family="Manrope,Inter" font-size="22" font-weight="800" fill="#14A06B">86%</text>
    <rect x="20" y="212" width="360" height="58" rx="12" fill="#fff" stroke="#E2E7F1"/>
    <g transform="translate(36 226)"><rect width="30" height="30" rx="8" fill="#EEF2FF"/><path d="M8 9h14M8 15h14M8 21h9" stroke="#2952E3" stroke-width="2" stroke-linecap="round"/></g>
    <rect x="78" y="228" width="140" height="9" rx="4.5" fill="#0B1B3F" opacity=".85"/><rect x="78" y="244" width="90" height="7" rx="3.5" fill="#CFD6E6"/>
    <rect x="296" y="230" width="68" height="24" rx="12" fill="#2952E3"/><text x="330" y="246" text-anchor="middle" font-family="Inter" font-size="11" font-weight="700" fill="#fff">Attempt</text>
  </g>
  <g class="float"><g transform="translate(372 18)"><rect width="168" height="92" rx="18" fill="#fff" filter="drop-shadow(0 10px 20px rgba(0,0,0,.18))"/>
    <circle cx="44" cy="46" r="26" fill="none" stroke="#EEF2FF" stroke-width="8"/><circle cx="44" cy="46" r="26" fill="none" stroke="#C9A24A" stroke-width="8" stroke-dasharray="163" stroke-dashoffset="20" stroke-linecap="round" transform="rotate(-90 44 46)"/>
    <text x="44" y="51" text-anchor="middle" font-family="Manrope,Inter" font-weight="800" font-size="14" fill="#0B1B3F">92%</text>
    <text x="82" y="40" font-family="Inter" font-size="11" fill="#65718E" font-weight="600">Mock Test 2</text><text x="82" y="60" font-family="Manrope,Inter" font-size="16" font-weight="800" fill="#0B1B3F">Rank #3</text></g></g>
  <g class="float d2"><g transform="translate(12 300)"><rect width="176" height="78" rx="18" fill="#fff" filter="drop-shadow(0 10px 20px rgba(0,0,0,.18))"/>
    <rect x="16" y="18" width="42" height="42" rx="12" fill="url(#ha2)"/><path d="M27 41l6 6 12-14" stroke="#1B1405" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="70" y="36" font-family="Inter" font-size="11" fill="#65718E" font-weight="600">Daily target</text><text x="70" y="56" font-family="Manrope,Inter" font-size="15" font-weight="800" fill="#0B1B3F">Completed</text></g></g>
  <g class="float d3"><g transform="translate(400 390)"><rect width="140" height="58" rx="16" fill="#0B1B3F" stroke="#C9A24A" stroke-opacity=".5"/><text x="18" y="25" font-family="Inter" font-size="10" fill="#9AA8CC" font-weight="600">STREAK</text><text x="18" y="44" font-family="Manrope,Inter" font-size="16" font-weight="800" fill="#E9CF8A">7 days 🔥</text></g></g>
  </svg>`;
}

/* ===== Search overlay ===== */
function openSearch(initial = '') {
  if ($('.search-ov')) return;
  const ov = document.createElement('div'); ov.className = 'search-ov';
  ov.innerHTML = `<div class="search-box" role="dialog" aria-label="Search"><div class="top">${icon('search', 20)}<input placeholder="Search courses, lectures, notes, quizzes, tests…" value="${h(initial)}" aria-label="Search"><button class="btn btn-sm btn-ghost" data-x>Esc</button></div><div class="search-res"></div></div>`;
  document.body.appendChild(ov);
  const inp = ov.querySelector('input'), res = ov.querySelector('.search-res');
  const close = () => ov.remove();
  ov.addEventListener('mousedown', e => { if (e.target === ov) close(); });
  ov.querySelector('[data-x]').onclick = close;
  let sel = 0;
  const run = () => {
    const qv = inp.value.trim().toLowerCase();
    const groups = [['Courses', 'courses', 'book', 'course', c => [c.title, c.subject, c.cls, c.desc]], ['Video Lectures', 'lectures', 'video', 'lecture', l => [l.title, l.subject, l.chapter, l.topic]], ['Study Materials', 'materials', 'file', 'material', m => [m.title, m.subject, m.chapter, m.type, ...(m.tags || [])]], ['Quizzes', 'quizzes', 'quiz', 'quiz', q => [q.title, q.subject, q.chapter, q.topic]], ['Online Tests', 'tests', 'test', 'test', t => [t.title, t.subject]], ['Test Series', 'series', 'layers', 'series', s => [s.title, s.exam]]];
    if (!qv) { res.innerHTML = `<div class="sr-grp">Quick links</div>${[...NAV.learn, ...NAV.practice].map(([r, ic, t, d]) => `<a class="sr-item" href="#${r}"><span class="ic">${icon(ic)}</span><div><b>${t}</b><span>${d}</span></div></a>`).join('')}`; return; }
    let html = '', count = 0;
    for (const [label, col, ic, route, fields] of groups) {
      const hits = S.data[col].filter(x => fields(x).join(' ').toLowerCase().includes(qv)).slice(0, 5);
      if (!hits.length) continue; count += hits.length;
      html += `<div class="sr-grp">${label}</div>` + hits.map(x => `<a class="sr-item" href="#${route}-${h(x.id)}"><span class="ic">${icon(ic)}</span><div><b>${h(x.title)}</b><span>${h([x.subject, x.chapter || x.cls || x.exam].filter(Boolean).join(' · '))}</span></div></a>`).join('');
    }
    res.innerHTML = count ? html : `<div class="empty" style="border:0">${'<div class="ic">' + icon('search', 26) + '</div>'}<h4>No results for “${h(inp.value)}”</h4><p>Try a subject, chapter or topic name — for example “Integration” or “Matrices”.</p></div>`;
    sel = 0; mark();
  };
  const mark = () => { const items = $$('.sr-item', res); items.forEach((it, i) => it.classList.toggle('sel', i === sel)); };
  inp.addEventListener('input', run);
  inp.addEventListener('keydown', e => {
    const items = $$('.sr-item', res);
    if (e.key === 'ArrowDown') { sel = Math.min(items.length - 1, sel + 1); mark(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); mark(); e.preventDefault(); }
    else if (e.key === 'Enter' && items[sel]) { location.hash = items[sel].getAttribute('href'); close(); }
    else if (e.key === 'Escape') close();
  });
  res.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  run(); setTimeout(() => inp.focus(), 30);
}
