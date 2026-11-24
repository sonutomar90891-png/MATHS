/* ===== Icons (stroke, 24 grid) ===== */
const IC = {
  home:'<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/>',
  book:'<path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6.5A2.5 2.5 0 0 0 4 21.5v-2z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H19"/>',
  video:'<rect x="2" y="5" width="15" height="14" rx="3"/><path d="m17 10 5-3v10l-5-3"/>',
  play:'<path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" fill="currentColor" stroke="none"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  quiz:'<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
  test:'<path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1z"/><path d="M16 5h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/><path d="m9 13 2 2 4-4"/>',
  layers:'<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  task:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  chart:'<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-6"/>',
  bar:'<path d="M12 20V10M18 20V4M6 20v-4"/>',
  mail:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m22 7-10 6L2 7"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  users:'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M16 3.1a4 4 0 0 1 0 7.8M22 21a7 7 0 0 0-4-6.3"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  right:'<path d="m9 18 6-6-6-6"/>',
  left:'<path d="m15 18-6-6 6-6"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  back:'<path d="M19 12H5M11 18l-6-6 6-6"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  checkc:'<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
  xc:'<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  cal:'<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>',
  heartf:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z" fill="currentColor"/>',
  bookmark:'<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  bookmarkf:'<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor"/>',
  star:'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" fill="currentColor" stroke="none"/>',
  award:'<circle cx="12" cy="8" r="6"/><path d="M15.5 13.2 17 22l-5-3-5 3 1.5-8.8"/>',
  trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1 1.2C7.8 18.8 7 20.2 7 22M14 14.7V17c0 .6.5 1 1 1.2 1.2.6 2 2 2 3.8"/><path d="M18 2H6v7a6 6 0 0 0 12 0z"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  zap:'<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  grad:'<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5M22 10v6"/>',
  bulb:'<path d="M9 18h6M10 22h4M15.1 14c.2-1 .7-1.7 1.4-2.5A6 6 0 1 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.4 2.5"/>',
  compass:'<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash:'<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  megaphone:'<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  tag:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/>',
  flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
  maximize:'<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
  refresh:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  shuffle:'<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  external:'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>',
  msg:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  map:'<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  fire:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3.3.3 1.6 1.3 2.8 2.5 2.8z"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  sparkle:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
  wa:'<path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z" fill="currentColor" stroke="none"/><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/>',
  yt:'<path d="M22.5 6.4a2.8 2.8 0 0 0-2-2C18.8 4 12 4 12 4s-6.8 0-8.5.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 5.6 2.8 2.8 0 0 0 2 2c1.7.4 8.5.4 8.5.4s6.8 0 8.5-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-5.6z"/><path d="m10 15 5-3-5-3z" fill="currentColor"/>',
  ig:'<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
  tg:'<path d="m22 3-20 8 7 2 2 7 4-5 5 4z"/><path d="m9 13 13-10"/>',
  fb:'<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  li:'<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
  x2:'<path d="M4 4l16 16M20 4 4 20" />',
  key:'<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
  pdf:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  pause:'<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  db:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
};
function icon(n, s = 18, extra = '') {
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}>${IC[n] || IC.info}</svg>`;
}

/* ===== Helpers ===== */
const h = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const clone = o => JSON.parse(JSON.stringify(o ?? null));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const nowISO = () => new Date().toISOString();
const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function fmtDate(iso) { if (!iso) return '—'; const d = new Date(iso); if (isNaN(d)) return '—'; return `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`; }
function fmtDT(iso) { if (!iso) return '—'; const d = new Date(iso); if (isNaN(d)) return '—'; let hr = d.getHours(), ap = hr >= 12 ? 'PM' : 'AM'; hr = hr % 12 || 12; return `${d.getDate()} ${MON[d.getMonth()]}, ${hr}:${String(d.getMinutes()).padStart(2, '0')} ${ap}`; }
function ago(iso) { const s = (Date.now() - new Date(iso)) / 1000; if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + 'm ago'; if (s < 86400) return Math.floor(s / 3600) + 'h ago'; if (s < 86400 * 7) return Math.floor(s / 86400) + 'd ago'; return fmtDate(iso); }
function fmtSecs(s) { s = Math.max(0, Math.round(s)); const hh = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60; return (hh ? hh + ':' + String(m).padStart(2, '0') : String(m).padStart(2, '0')) + ':' + String(ss).padStart(2, '0'); }
function fmtSize(b) { if (!b) return ''; if (b < 1024) return b + ' B'; if (b < 1048576) return (b / 1024).toFixed(0) + ' KB'; return (b / 1048576).toFixed(1) + ' MB'; }
function fmtNum(n) { n = +n || 0; if (n >= 100000) return (n / 100000).toFixed(1).replace(/\.0$/, '') + 'L'; if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'; return String(n); }
function initials(name) { return (name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'; }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
function uniq(a) { return [...new Set(a.filter(Boolean))]; }
function safeUrl(u) { u = String(u || '').trim(); return /^https:\/\//i.test(u) || u.startsWith('/_blob/') ? u : ''; }
function ytId(u) { const m = String(u || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(u) ? u : ''); }
function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }
const LS = { get(k, d) { try { const v = localStorage.getItem('apex:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } }, set(k, v) { try { localStorage.setItem('apex:' + k, JSON.stringify(v)); } catch { } } };

/* ===== Subject palette & generated thumbnails ===== */
const SUBJ = {
  Physics: { c1: '#2952E3', c2: '#0B1B3F', icon: 'atom' }, Chemistry: { c1: '#0EA5A4', c2: '#0B3B4F', icon: 'flask' },
  Mathematics: { c1: '#7A5AF8', c2: '#1E1650', icon: 'sigma' }, Biology: { c1: '#14A06B', c2: '#0B3B2B', icon: 'leaf' },
  English: { c1: '#E0475A', c2: '#4A0F1C', icon: 'quote' }, General: { c1: '#C9A24A', c2: '#3A2A08', icon: 'star' },
};
function subj(s) { return SUBJ[s] || { c1: '#2952E3', c2: '#13285A', icon: 'star' }; }
function subjBadge(s) { const map = { Physics: 'b-royal', Chemistry: 'b-green', Mathematics: 'b-violet', Biology: 'b-green', English: 'b-red' }; return `<span class="badge ${map[s] || 'b-gold'}">${h(s || 'General')}</span>`; }
function glyph(kind) {
  switch (kind) {
    case 'atom': return '<g fill="none" stroke="#fff" stroke-width="3" opacity=".95"><ellipse cx="0" cy="0" rx="46" ry="17"/><ellipse cx="0" cy="0" rx="46" ry="17" transform="rotate(60)"/><ellipse cx="0" cy="0" rx="46" ry="17" transform="rotate(-60)"/></g><circle r="7" fill="#E2C47A"/>';
    case 'flask': return '<g fill="none" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"><path d="M-12-42h24M-8-42v26l-26 44a6 6 0 0 0 5 9h58a6 6 0 0 0 5-9L8-16v-26"/></g><path d="M-24 18h48l8 13a4 4 0 0 1-3 6h-58a4 4 0 0 1-3-6z" fill="#E2C47A" opacity=".9"/><circle cx="-6" cy="4" r="4" fill="#fff" opacity=".7"/><circle cx="6" cy="-6" r="3" fill="#fff" opacity=".5"/>';
    case 'sigma': return '<text x="0" y="22" text-anchor="middle" font-family="Georgia,serif" font-size="84" fill="#fff" font-weight="700">∑</text><text x="44" y="-22" font-family="Georgia,serif" font-size="24" fill="#E2C47A" font-style="italic">dx</text>';
    case 'leaf': return '<path d="M-36 30C-36-20 0-42 40-40 40 6 14 36-30 34" fill="none" stroke="#fff" stroke-width="3.5"/><path d="M-36 34 26-28" stroke="#E2C47A" stroke-width="3.5"/>';
    case 'quote': return '<text x="0" y="40" text-anchor="middle" font-family="Georgia,serif" font-size="120" fill="#fff">“</text>';
    default: return '<path d="m0-40 11 24 26 3-19 18 5 26L0 18l-23 13 5-26-19-18 26-3z" fill="#E2C47A"/>';
  }
}
function thumbSVG(subject, title = '', label = '') {
  const s = subj(subject); const gid = 'g' + Math.random().toString(36).slice(2, 7);
  const t = h(String(title).slice(0, 38));
  return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${s.c1}"/><stop offset="1" stop-color="${s.c2}"/></linearGradient><pattern id="${gid}p" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0v22" fill="none" stroke="#fff" stroke-opacity=".06"/></pattern></defs><rect width="320" height="180" fill="url(#${gid})"/><rect width="320" height="180" fill="url(#${gid}p)"/><circle cx="280" cy="20" r="70" fill="#fff" opacity=".06"/><circle cx="250" cy="170" r="40" fill="#C9A24A" opacity=".18"/><g transform="translate(240 86) scale(.9)">${glyph(s.icon)}</g>${label ? `<text x="20" y="34" font-family="Inter,sans-serif" font-size="11" font-weight="700" letter-spacing="1.5" fill="#E2C47A">${h(String(label).toUpperCase().slice(0, 28))}</text>` : ''}<text x="20" y="${label ? 150 : 150}" font-family="Manrope,Inter,sans-serif" font-size="17" font-weight="800" fill="#fff">${t}</text></svg>`;
}
function docIcon(type) {
  const m = { 'Notes': ['#2952E3', 'PDF'], 'Handout': ['#0EA5A4', 'PDF'], 'Formula Sheet': ['#C9A24A', 'FX'], 'Worksheet': ['#7A5AF8', 'WS'], 'Assignment': ['#E0475A', 'DOC'] }[type] || ['#2952E3', 'PDF'];
  return `<div class="doc-ic" style="background:linear-gradient(160deg,${m[0]},${m[0]}cc)">${m[1]}</div>`;
}
const DIFF = { Easy: 'b-green', Moderate: 'b-amber', Difficult: 'b-red' };
const diffBadge = d => `<span class="badge ${DIFF[d] || ''}">${h(d || 'Moderate')}</span>`;

/* ===== Toasts & modals ===== */
function toast(msg, type = 'ok') {
  const el = document.createElement('div'); el.className = 'toast ' + type;
  el.innerHTML = (type === 'ok' ? icon('checkc', 18) : type === 'err' ? icon('alert', 18) : icon('info', 18)) + `<span>${h(msg)}</span>`;
  $('#toasts').appendChild(el); setTimeout(() => { el.style.opacity = '0'; el.style.transition = '.3s'; setTimeout(() => el.remove(), 300); }, 3400);
}
let modalStack = [];
function openModal({ title, body, foot = '', size = '', onMount }) {
  const bg = document.createElement('div'); bg.className = 'modal-bg';
  bg.innerHTML = `<div class="modal ${size}" role="dialog" aria-modal="true"><div class="modal-hd"><h3>${title}</h3><button class="icon-btn" data-close>${icon('x')}</button></div><div class="modal-bd">${body}</div>${foot ? `<div class="modal-ft">${foot}</div>` : ''}</div>`;
  bg.addEventListener('mousedown', e => { if (e.target === bg) closeModal(); });
  bg.querySelector('[data-close]').onclick = () => closeModal();
  $('#modal-root').appendChild(bg); modalStack.push(bg);
  onMount && onMount(bg);
  const f = bg.querySelector('input,select,textarea'); f && setTimeout(() => f.focus(), 50);
  return bg;
}
function closeModal() { const m = modalStack.pop(); m && m.remove(); }
function confirmBox(title, text, okLabel = 'Confirm', danger = false) {
  return new Promise(res => {
    const m = openModal({
      title: h(title), body: `<p class="muted">${h(text)}</p>`,
      foot: `<button class="btn btn-ghost" data-no>Cancel</button><button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-yes>${h(okLabel)}</button>`
    });
    m.querySelector('[data-no]').onclick = () => { closeModal(); res(false); };
    m.querySelector('[data-yes]').onclick = () => { closeModal(); res(true); };
  });
}

/* ===== Mini markdown for notes (escaped first) ===== */
function md(src) {
  const lines = String(src || '').split('\n'); let out = '', inList = false;
  const inline = s => h(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code>$1</code>').replace(/_(.+?)_/g, '<i>$1</i>');
  for (const raw of lines) {
    const l = raw.trimEnd();
    if (/^\s*[-*] /.test(l)) { if (!inList) { out += '<ul>'; inList = true; } out += `<li>${inline(l.replace(/^\s*[-*] /, ''))}</li>`; continue; }
    if (inList) { out += '</ul>'; inList = false; }
    if (l.startsWith('### ')) out += `<h3>${inline(l.slice(4))}</h3>`;
    else if (l.startsWith('## ')) out += `<h2>${inline(l.slice(3))}</h2>`;
    else if (l.startsWith('# ')) out += `<h1>${inline(l.slice(2))}</h1>`;
    else if (l.startsWith('> ')) out += `<div class="box">${inline(l.slice(2))}</div>`;
    else if (l.trim()) out += `<p>${inline(l)}</p>`;
  }
  if (inList) out += '</ul>';
  return out;
}

/* ===== Tiny PDF writer (text notes → real PDF) ===== */
function makePDF(title, text, footer = '') {
  const map = { '²': '^2', '³': '^3', '→': '->', '←': '<-', '×': 'x', '÷': '/', '−': '-', '–': '-', '—': '-', 'θ': 'theta', 'λ': 'lambda', 'π': 'pi', 'Δ': 'Delta', 'μ': 'mu', 'ω': 'omega', 'α': 'alpha', 'β': 'beta', 'γ': 'gamma', 'ρ': 'rho', 'σ': 'sigma', 'Σ': 'Sum', '∑': 'Sum', '√': 'sqrt', '≈': '~', '≤': '<=', '≥': '>=', '°': ' deg', '½': '1/2', '“': '"', '”': '"', '‘': "'", '’': "'", '•': '-', '·': '.', '∫': 'Int', '∞': 'inf', 'ε': 'epsilon', 'φ': 'phi', 'Ω': 'Ohm', '₀': '0', '₁': '1', '₂': '2', '₃': '3', '⁻': '-', '¹': '1' };
  const clean = s => String(s).replace(/[^\x20-\x7E]/g, c => map[c] ?? '').replace(/\*\*|`/g, '');
  const esc = s => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const rows = [];
  for (const raw of String(text).split('\n')) {
    let l = raw.trimEnd(), font = 'F1', size = 11, maxc = 92, gap = 0;
    if (l.startsWith('# ')) { l = l.slice(2); font = 'F2'; size = 18; maxc = 54; gap = 8; }
    else if (l.startsWith('## ')) { l = l.slice(3); font = 'F2'; size = 14; maxc = 70; gap = 6; }
    else if (l.startsWith('### ')) { l = l.slice(4); font = 'F2'; size = 12; maxc = 84; gap = 4; }
    else if (/^\s*[-*] /.test(l)) l = '  - ' + l.replace(/^\s*[-*] /, '');
    else if (l.startsWith('> ')) { l = '| ' + l.slice(2); font = 'F3'; }
    l = clean(l);
    if (!l.trim()) { rows.push({ t: '', font, size, lh: 7 }); continue; }
    const words = l.split(' '); let cur = '';
    const push = s => rows.push({ t: s, font, size, lh: size * 1.45, gap });
    for (const w of words) { if ((cur + ' ' + w).trim().length > maxc) { push(cur); gap = 0; cur = w; } else cur = (cur ? cur + ' ' : '') + w; }
    push(cur);
  }
  const pages = []; let page = [], y = 760;
  for (const r of rows) { const need = r.lh + (r.gap || 0); if (y - need < 60) { pages.push(page); page = []; y = 760; } y -= need; page.push({ ...r, y }); }
  pages.push(page);
  const objs = []; const add = s => { objs.push(s); return objs.length; };
  add('<< /Type /Catalog /Pages 2 0 R >>'); add('PAGES');
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>');
  const kids = [];
  pages.forEach((p, i) => {
    let s = `0.79 0.64 0.29 RG 2 w 50 785 m 545 785 l S BT /F2 9 Tf 0.4 0.45 0.55 rg 50 792 Td (${esc(clean(title)).slice(0, 80)}) Tj ET `;
    s += `BT /F1 9 Tf 0.4 0.45 0.55 rg 50 34 Td (${esc(clean(footer))}   |   Page ${i + 1} of ${pages.length}) Tj ET `;
    for (const r of p) if (r.t) s += `BT /${r.font} ${r.size} Tf ${r.font === 'F2' ? '0.07 0.16 0.35' : '0.1 0.13 0.22'} rg 56 ${r.y.toFixed(1)} Td (${esc(r.t)}) Tj ET `;
    const c = add(`<< /Length ${s.length} >>\nstream\n${s}\nendstream`);
    kids.push(add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${c} 0 R >>`));
  });
  objs[1] = `<< /Type /Pages /Kids [${kids.map(k => k + ' 0 R').join(' ')}] /Count ${kids.length} >>`;
  let out = '%PDF-1.4\n', offs = [];
  objs.forEach((o, i) => { offs.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('');
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([out], { type: 'application/pdf' });
}

/* ===== CSV ===== */
function parseCSV(text) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows.filter(r => r.some(x => String(x).trim()));
}
function rowsToQuestions(rows) {
  if (!rows.length) return [];
  const head = rows[0].map(x => String(x).toLowerCase().trim());
  const hasHead = head.includes('question');
  const idx = n => head.indexOf(n);
  const body = hasHead ? rows.slice(1) : rows;
  const out = [];
  for (const r of body) {
    const g = (n, pos) => String((hasHead ? r[idx(n)] : r[pos]) ?? '').trim();
    const text = g('question', 0); if (!text) continue;
    const options = ['a', 'b', 'c', 'd', 'e', 'f'].map((k, i) => hasHead ? String(r[idx('option' + k)] ?? r[idx('option ' + k)] ?? '').trim() : String(r[2 + i] ?? '').trim()).filter(Boolean).slice(0, hasHead ? 6 : 4);
    const ansRaw = hasHead ? g('answer') : String(r[6] ?? '').trim();
    const answer = ansRaw.split(/[;,|\s]+/).filter(Boolean).map(a => /^\d+$/.test(a) ? +a - 1 : a.toUpperCase().charCodeAt(0) - 65).filter(i => i >= 0 && i < options.length);
    const type = (hasHead ? g('type') : String(r[1] ?? '')).toLowerCase().startsWith('m') || answer.length > 1 ? 'multi' : 'single';
    if (options.length < 2 || !answer.length) continue;
    out.push({ id: genId(), text, type, options, answer, explanation: hasHead ? g('explanation') : String(r[7] ?? '').trim() });
  }
  return out;
}
function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
