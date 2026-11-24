/* ===== Admin panel ===== */
const subjOpts = () => uniq([...(tax().subjects || []), 'General']);
const clsOpts = () => uniq([...(tax().classes || [])]);
const chapOpts = () => uniq(Object.values(tax().chapters || {}).flat());
const SCHEMAS = {
  courses: {
    label: 'Course', icon: 'book', cols: [['title', 'Title'], ['subject', 'Subject'], ['cls', 'Class'], ['featured', 'Featured', v => v !== false ? 'Yes' : 'No'], ['restricted', 'Access', v => v ? 'Restricted' : 'Open']], order: (a, b) => (a.order || 0) - (b.order || 0),
    fields: [['title', 'Course title', 'text', { req: 1 }], ['desc', 'Description', 'textarea'], ['subject', 'Subject', 'select', { opts: subjOpts }], ['cls', 'Class', 'select', { opts: clsOpts }], ['instructor', 'Instructor', 'text', { def: () => site().instructor }], ['level', 'Level', 'text', { ph: 'e.g. Beginner → Advanced' }], ['order', 'Display order', 'number', { def: () => 99 }], ['featured', 'Feature on homepage', 'check', { def: () => true }], ['restricted', 'Restricted (only approved students can open lectures & notes)', 'check'], ['thumbId', 'Thumbnail image (optional)', 'file', { accept: 'image/*', kind: 'image' }]]
  },
  lectures: {
    label: 'Lecture', icon: 'video', cols: [['title', 'Title'], ['subject', 'Subject'], ['chapter', 'Chapter'], ['videoType', 'Video', v => ({ youtube: 'YouTube', upload: 'Uploaded', link: 'Link' }[v] || '—')], ['date', 'Uploaded', fmtDate]], order: (a, b) => (b.date || '').localeCompare(a.date || ''),
    fields: [['title', 'Lecture title', 'text', { req: 1 }], ['courseId', 'Course', 'select', { opts: () => [['', '— none —'], ...S.data.courses.map(c => [c.id, c.title])] }], ['subject', 'Subject', 'select', { opts: subjOpts }], ['chapter', 'Chapter', 'text', { list: chapOpts }], ['topic', 'Topic', 'text'], ['duration', 'Duration', 'text', { ph: 'e.g. 45:30' }], ['order', 'Order in course', 'number', { def: () => 1 }], ['date', 'Upload date', 'datetime', { def: nowISO }], ['desc', 'Description', 'textarea'],
    ['videoType', 'Video source', 'select', { opts: () => [['none', 'No video yet'], ['youtube', 'YouTube link'], ['upload', 'Upload video file (MP4/WebM, up to 20 MB)'], ['link', 'Secure hosting link (opens in new tab)']] }], ['videoUrl', 'YouTube URL / hosting link', 'text', { ph: 'https://…' }], ['assetId', 'Video file', 'file', { accept: 'video/mp4,video/webm', kind: 'video' }], ['timestamps', 'Timestamps (one per line: 12:30 Topic name)', 'timestamps']]
  },
  materials: {
    label: 'Study material', icon: 'file', cols: [['title', 'Title'], ['type', 'Type'], ['subject', 'Subject'], ['cls', 'Class'], ['assetId', 'Source', v => v ? 'PDF upload' : 'Written notes']], order: (a, b) => (b.date || '').localeCompare(a.date || ''),
    fields: [['title', 'Title', 'text', { req: 1 }], ['type', 'Type', 'select', { opts: () => ['Notes', 'Handout', 'Formula Sheet', 'Worksheet'] }], ['cls', 'Class', 'select', { opts: clsOpts }], ['subject', 'Subject', 'select', { opts: subjOpts }], ['chapter', 'Chapter', 'text', { list: chapOpts }], ['topic', 'Topic', 'text'], ['courseId', 'Course (optional)', 'select', { opts: () => [['', '— any —'], ...S.data.courses.map(c => [c.id, c.title])] }], ['tags', 'Tags', 'tags', { opts: ['Important', 'Revision', 'Practice', 'Formula Sheet'] }], ['date', 'Upload date', 'datetime', { def: nowISO }],
    ['assetId', 'PDF file (preview & download)', 'file', { accept: 'application/pdf', kind: 'pdf' }], ['content', 'Or write notes here (Markdown: # heading, - bullet, > highlight, **bold**) — turned into a PDF on download', 'textarea', { rows: 12 }], ['pages', 'Pages (for written notes)', 'number', { def: () => 1 }]]
  },
  quizzes: {
    label: 'Quiz', icon: 'quiz', cols: [['title', 'Title'], ['kind', 'Type'], ['subject', 'Subject'], ['difficulty', 'Difficulty'], ['questions', 'Questions', v => (v || []).length]], order: (a, b) => (b.date || '').localeCompare(a.date || ''), questions: true,
    fields: [['title', 'Quiz title', 'text', { req: 1 }], ['kind', 'Type', 'select', { opts: () => ['Daily', 'Chapter-wise', 'Topic-wise'] }], ['subject', 'Subject', 'select', { opts: subjOpts }], ['chapter', 'Chapter', 'text', { list: chapOpts }], ['topic', 'Topic', 'text'], ['difficulty', 'Difficulty', 'select', { opts: () => ['Easy', 'Moderate', 'Difficult'] }], ['duration', 'Time limit (minutes)', 'number', { def: () => 10 }], ['randomize', 'Shuffle questions and options', 'check', { def: () => true }], ['date', 'Publish date', 'datetime', { def: nowISO }]]
  },
  tests: {
    label: 'Online test', icon: 'test', cols: [['title', 'Title'], ['seriesId', 'Series', v => byId('series', v)?.title || '—'], ['start', 'Opens', fmtDT], ['end', 'Closes', fmtDT], ['questions', 'Qs', v => (v || []).length]], order: (a, b) => (a.start || '').localeCompare(b.start || ''), questions: true,
    fields: [['title', 'Test title', 'text', { req: 1 }], ['seriesId', 'Test series', 'select', { opts: () => [['', '— standalone —'], ...S.data.series.map(s => [s.id, s.title])] }], ['subject', 'Subject(s)', 'text', { ph: 'e.g. PCM or Physics' }], ['order', 'Order in series', 'number', { def: () => 1 }], ['start', 'Available from', 'datetime', { def: nowISO }], ['end', 'Available until', 'datetime', { def: () => new Date(Date.now() + 7 * 864e5).toISOString() }], ['duration', 'Duration (minutes)', 'number', { def: () => 60 }], ['markCorrect', 'Marks per correct answer', 'number', { def: () => 4 }], ['markWrong', 'Negative marks per wrong answer (0 for none)', 'number', { def: () => 1 }], ['randomize', 'Shuffle question order', 'check'], ['instructions', 'Instructions (one per line)', 'textarea', { rows: 6 }]]
  },
  series: { label: 'Test series', icon: 'layers', cols: [['title', 'Title'], ['exam', 'Exam'], ['id', 'Tests', id => S.data.tests.filter(t => t.seriesId === id).length]], order: (a, b) => (a.order || 0) - (b.order || 0), fields: [['title', 'Series title', 'text', { req: 1 }], ['exam', 'Exam / label', 'text', { ph: 'e.g. JEE Main' }], ['desc', 'Description', 'textarea'], ['order', 'Display order', 'number', { def: () => 1 }]] },
  assignments: { label: 'Assignment', icon: 'task', cols: [['title', 'Title'], ['subject', 'Subject'], ['due', 'Due', fmtDT], ['maxMarks', 'Marks'], ['id', 'Submissions', id => S.subsAll.filter(s => (s.items || {})[id]).length]], order: (a, b) => (b.due || '').localeCompare(a.due || ''), fields: [['title', 'Title', 'text', { req: 1 }], ['courseId', 'Course', 'select', { opts: () => [['', '— none —'], ...S.data.courses.map(c => [c.id, c.title])] }], ['subject', 'Subject', 'select', { opts: subjOpts }], ['due', 'Due date', 'datetime', { def: () => new Date(Date.now() + 7 * 864e5).toISOString() }], ['maxMarks', 'Maximum marks', 'number', { def: () => 20 }], ['desc', 'Instructions & questions', 'textarea', { rows: 10 }], ['date', 'Posted on', 'datetime', { def: nowISO }]] },
  announcements: { label: 'Announcement', icon: 'megaphone', cols: [['title', 'Title'], ['date', 'Date', fmtDT], ['pinned', 'Top bar', v => v ? 'Pinned' : '—']], order: (a, b) => (b.date || '').localeCompare(a.date || ''), fields: [['title', 'Title', 'text', { req: 1 }], ['body', 'Message', 'textarea'], ['pinned', 'Pin to the top bar of every page', 'check'], ['date', 'Date', 'datetime', { def: nowISO }]] },
  testimonials: { label: 'Testimonial', icon: 'star', cols: [['name', 'Name'], ['text', 'Text', v => String(v || '').slice(0, 60) + '…'], ['rating', 'Rating']], order: (a, b) => (b.date || '').localeCompare(a.date || ''), fields: [['name', 'Student name', 'text', { req: 1 }], ['role', 'Class / result', 'text'], ['text', 'Feedback text', 'textarea'], ['rating', 'Rating (1–5)', 'number', { def: () => 5 }], ['published', 'Show on homepage', 'check', { def: () => true }]] },
};
const ADMIN_NAV = [['Overview', [['overview', 'grid', 'Dashboard']]], ['Content', [['courses', 'book', 'Courses'], ['lectures', 'video', 'Video Lectures'], ['materials', 'file', 'Study Materials'], ['assignments', 'task', 'Assignments']]], ['Assessment', [['quizzes', 'quiz', 'Quizzes'], ['tests', 'test', 'Online Tests'], ['series', 'layers', 'Test Series'], ['submissions', 'edit', 'Grade Submissions']]], ['People', [['students', 'users', 'Students'], ['feedback', 'msg', 'Feedback & Messages'], ['announcements', 'megaphone', 'Announcements']]], ['Site', [['homepage', 'home', 'Homepage & Branding'], ['testimonials', 'star', 'Testimonials'], ['taxonomy', 'tag', 'Categories & Subjects']]]];

Pages.admin = (sec = 'overview') => {
  if (S.mode === 'loading') return `<div class="container page-body">${skeletonGrid(3)}</div>`;
  if (!S.isAdmin) return pageHead('Admin', '', [['Admin']]) + `<div class="container page-body">${emptyState('lock', 'Admins only', 'This area is for the teacher who manages the platform.', '<a href="#home" class="btn btn-primary">Back to home</a>')}</div>`;
  const body = SCHEMAS[sec] ? adminCrud(sec) : (AdminSec[sec] || AdminSec.overview)();
  return `<div class="admin-layout"><aside class="admin-side">${ADMIN_NAV.map(([g, items]) => `<div class="grp">${g}</div>${items.map(([k, ic, l]) => `<a href="#admin-${k}" class="${sec === k ? 'active' : ''}">${icon(ic, 17)} ${l}</a>`).join('')}`).join('')}</aside><main class="admin-main">${body}</main></div>`;
};
function adminHead(title, sub, actions = '') { return `<div class="admin-hd"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div><div class="flex wrap">${actions}</div></div>`; }
const AQ = {};
function adminCrud(col) {
  const sc = SCHEMAS[col]; const q = (AQ[col] || '').toLowerCase();
  const rows = S.data[col].filter(d => !q || JSON.stringify([d.title, d.name, d.subject, d.chapter]).toLowerCase().includes(q)).sort(sc.order || (() => 0));
  return adminHead(sc.label === 'Study material' ? 'Study Materials' : sc.label + 's', `${S.data[col].length} total`, `<button class="btn btn-primary" data-act="a-new" data-col="${col}">${icon('plus', 16)} New ${sc.label.toLowerCase()}</button>`) +
    `<div class="toolbar"><div class="input-ic">${icon('search', 17)}<input class="input" id="a-q-${col}" data-aq="${col}" placeholder="Search ${sc.label.toLowerCase()}s…" value="${h(AQ[col] || '')}"></div></div>` +
    (rows.length ? `<div class="table-wrap"><table class="t"><thead><tr>${sc.cols.map(c => `<th>${c[1]}</th>`).join('')}<th></th></tr></thead><tbody>${rows.map(d => `<tr>${sc.cols.map(([k, , fmt], i) => `<td>${i === 0 ? '<b>' : ''}${h(fmt ? fmt(k === 'id' ? d.id : d[k]) : d[k] ?? '')}${i === 0 ? '</b>' : ''}</td>`).join('')}<td><div class="acts">${sc.questions ? `<button class="btn btn-sm btn-soft" data-act="a-qs" data-col="${col}" data-id="${h(d.id)}">${icon('list', 14)} Questions</button>` : ''}${col === 'lectures' ? `<a class="btn btn-sm btn-ghost btn-icon" href="#lecture-${h(d.id)}" title="View">${icon('eye', 15)}</a>` : col === 'materials' ? `<a class="btn btn-sm btn-ghost btn-icon" href="#material-${h(d.id)}" title="View">${icon('eye', 15)}</a>` : col === 'courses' ? `<a class="btn btn-sm btn-ghost btn-icon" href="#course-${h(d.id)}" title="View">${icon('eye', 15)}</a>` : ''}<button class="btn btn-sm btn-ghost btn-icon" data-act="a-edit" data-col="${col}" data-id="${h(d.id)}" title="Edit">${icon('edit', 15)}</button><button class="btn btn-sm btn-danger btn-icon" data-act="a-del" data-col="${col}" data-id="${h(d.id)}" title="Delete">${icon('trash', 15)}</button></div></td></tr>`).join('')}</tbody></table></div>`
      : emptyState(sc.icon, q ? 'Nothing matches' : `No ${sc.label.toLowerCase()}s yet`, q ? 'Try a different search.' : `Create your first ${sc.label.toLowerCase()} to get started.`, `<button class="btn btn-primary" data-act="a-new" data-col="${col}">${icon('plus', 16)} New ${sc.label.toLowerCase()}</button>`));
}
const toLocalDT = iso => { if (!iso) return ''; const d = new Date(iso); if (isNaN(d)) return ''; const p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; };
function fieldHTML([k, label, type, o = {}], d) {
  const v = d[k] ?? (o.def ? o.def() : type === 'check' ? false : '');
  const opts = o.opts ? (typeof o.opts === 'function' ? o.opts() : o.opts) : [];
  const opt = x => Array.isArray(x) ? x : [x, x];
  switch (type) {
    case 'textarea': return `<div class="field"><label>${label}</label><textarea class="textarea" name="${k}" rows="${o.rows || 4}" style="${o.rows > 8 ? 'font-family:ui-monospace,monospace;font-size:13px' : ''}">${h(v)}</textarea></div>`;
    case 'select': return `<div class="field"><label>${label}</label><select class="select" name="${k}">${opts.map(x => { const [val, l] = opt(x); return `<option value="${h(val)}" ${String(v) === String(val) ? 'selected' : ''}>${h(l)}</option>`; }).join('')}${v && !opts.some(x => String(opt(x)[0]) === String(v)) ? `<option selected>${h(v)}</option>` : ''}</select></div>`;
    case 'check': return `<label class="check mb16"><input type="checkbox" name="${k}" ${v ? 'checked' : ''}> ${label}</label>`;
    case 'number': return `<div class="field"><label>${label}</label><input class="input" type="number" step="any" name="${k}" value="${h(v)}"></div>`;
    case 'datetime': return `<div class="field"><label>${label}</label><input class="input" type="datetime-local" name="${k}" value="${h(toLocalDT(v))}"></div>`;
    case 'tags': return `<div class="field"><label>${label}</label><div class="flex wrap">${opts.map(t => `<label class="check"><input type="checkbox" name="${k}" value="${h(t)}" ${(v || []).includes(t) ? 'checked' : ''}> ${h(t)}</label>`).join('')}</div></div>`;
    case 'timestamps': return `<div class="field"><label>${label}</label><textarea class="textarea" name="${k}" rows="5">${h((v || []).map(t => t.t + ' ' + t.label).join('\n'))}</textarea></div>`;
    case 'file': return `<div class="field"><label>${label}</label>${S.assets ? `<label class="drop" data-drop="${k}">${icon('upload', 22)}<div class="mt8" data-fname>${v ? 'File attached · choose another to replace' : 'Click to choose or drop a file'}</div><input type="file" accept="${o.accept || ''}" hidden data-file="${k}" data-kind="${o.kind}"></label><input type="hidden" name="${k}" value="${h(v)}">${v ? `<button type="button" class="btn btn-sm btn-ghost mt8" data-clear-file="${k}">Remove file</button>` : ''}` : `<div class="notice warn">${icon('alert', 16)}<div>File uploads are available to editors when the platform's storage is enabled.</div></div><input type="hidden" name="${k}" value="${h(v)}">`}</div>`;
    default: return `<div class="field"><label>${label}</label><input class="input" name="${k}" value="${h(v)}" ${o.ph ? `placeholder="${h(o.ph)}"` : ''} ${o.list ? `list="dl-${k}"` : ''}>${o.list ? `<datalist id="dl-${k}">${o.list().map(x => `<option value="${h(x)}">`).join('')}</datalist>` : ''}</div>`;
  }
}
function readFields(fields, form, base) {
  const out = { ...base };
  for (const [k, , type, o = {}] of fields) {
    const el = form.elements[k];
    if (type === 'check') out[k] = !!(el && el.checked);
    else if (type === 'number') out[k] = el.value === '' ? '' : +el.value;
    else if (type === 'datetime') out[k] = el.value ? new Date(el.value).toISOString() : '';
    else if (type === 'tags') out[k] = $$(`input[name="${k}"]:checked`, form).map(i => i.value);
    else if (type === 'timestamps') out[k] = el.value.split('\n').map(l => l.trim()).filter(Boolean).map(l => { const m = l.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–]?\s*(.*)$/); return m ? { t: m[1], label: m[2] || '' } : { t: '00:00', label: l }; });
    else out[k] = (el?.value ?? '').trim();
    if (o.req && !out[k]) throw new Error(`"${fields.find(f => f[0] === k)[1]}" is required`);
  }
  return out;
}
function openEditor(col, id) {
  const sc = SCHEMAS[col]; const cur = id ? clone(byId(col, id)) : {}; delete cur?.id;
  const m = openModal({ title: (id ? 'Edit ' : 'New ') + sc.label.toLowerCase(), size: 'wide', body: `<form autocomplete="off">${sc.fields.map(f => fieldHTML(f, cur || {})).join('')}</form>`, foot: `<button class="btn btn-ghost" data-c>Cancel</button><button class="btn btn-primary" data-s>${icon('check', 16)} ${id ? 'Save changes' : 'Create'}</button>` });
  const form = m.querySelector('form');
  wireUploads(m, cur);
  m.querySelector('[data-c]').onclick = closeModal;
  m.querySelector('[data-s]').onclick = async e => {
    const btn = e.currentTarget;
    try {
      const data = readFields(sc.fields, form, cur || {});
      if (col === 'materials') { data.fileName = cur.fileName || ''; data.size = cur.size || 0; if (!data.assetId && !data.content) throw new Error('Upload a PDF or write the notes content.'); }
      if (col === 'lectures' && data.videoType === 'youtube' && !ytId(data.videoUrl)) throw new Error('That doesn\'t look like a YouTube link.');
      if (col === 'lectures' && data.videoType === 'link' && !safeUrl(data.videoUrl)) throw new Error('Hosting links must start with https://');
      if (col === 'lectures' && data.videoType === 'upload' && !data.assetId) throw new Error('Upload the video file first.');
      if (col === 'tests' && data.start && data.end && data.end < data.start) throw new Error('"Available until" must be after "Available from".');
      if (sc.questions && !data.questions) data.questions = [];
      btn.disabled = true; btn.textContent = 'Saving…';
      await saveDoc(col, id || genId(), data); closeModal(); toast(sc.label + (id ? ' updated' : ' created'));
    } catch (err) { btn.disabled = false; btn.innerHTML = (id ? 'Save changes' : 'Create'); if (err && err.message) toast(err.message, 'err'); }
  };
}
function wireUploads(m, cur) {
  m.querySelectorAll('[data-file]').forEach(inp => {
    const k = inp.dataset.file; const drop = inp.closest('.drop');
    const go = async file => {
      if (!file) return; const lbl = drop.querySelector('[data-fname]'); lbl.textContent = 'Uploading ' + file.name + '…';
      try { const r = await uploadAsset(file); m.querySelector(`input[name="${k}"]`).value = r.id; lbl.innerHTML = `${icon('checkc', 16)} ${h(file.name)} · ${fmtSize(r.sizeBytes)} uploaded`; if (inp.dataset.kind === 'pdf') { cur.fileName = file.name; cur.size = r.sizeBytes; } if (inp.dataset.kind === 'video') { const sel = m.querySelector('select[name="videoType"]'); if (sel) sel.value = 'upload'; } }
      catch (e) { lbl.textContent = e.message; toast(e.message, 'err'); }
    };
    inp.onchange = () => go(inp.files[0]);
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('over'));
    drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('over'); go(e.dataTransfer.files[0]); });
  });
  m.querySelectorAll('[data-clear-file]').forEach(b => b.onclick = () => { m.querySelector(`input[name="${b.dataset.clearFile}"]`).value = ''; b.previousElementSibling.querySelector('[data-fname]').textContent = 'File removed — save to apply'; b.remove(); });
}

/* ===== Question manager ===== */
function openQuestions(col, id) {
  const doc = byId(col, id); if (!doc) return;
  let qs = clone(doc.questions || []);
  const save = async () => { const d = clone(byId(col, id)); delete d.id; d.questions = qs; await saveDoc(col, id, d); };
  const m = openModal({ title: `Questions · ${h(doc.title)}`, size: 'xl', body: '<div data-body></div>', foot: `<button class="btn btn-ghost" data-import>${icon('upload', 15)} Bulk import (CSV / Excel)</button><button class="btn btn-primary" data-add>${icon('plus', 15)} Add question</button>` });
  const paint = () => {
    m.querySelector('[data-body]').innerHTML = qs.length ? qs.map((q, i) => `<div class="q-edit"><div class="flex between" style="align-items:flex-start"><div class="grow"><b class="small muted">Q${i + 1} · ${q.type === 'multi' ? 'Multiple correct' : 'Single correct'}</b><div style="font-weight:600;margin-top:4px;white-space:pre-wrap">${h(q.text)}</div><div class="small mt8">${q.options.map((o, j) => `<span class="badge ${q.answer.includes(j) ? 'b-green' : ''}" style="margin:0 6px 6px 0">${KEYS[j]}. ${h(o)}</span>`).join('')}</div></div>
      <div class="flex"><button class="btn btn-sm btn-ghost btn-icon" data-up="${i}" title="Move up" ${i === 0 ? 'disabled' : ''}>${icon('down', 14, 'style="transform:rotate(180deg)"')}</button><button class="btn btn-sm btn-ghost btn-icon" data-edit="${i}">${icon('edit', 14)}</button><button class="btn btn-sm btn-danger btn-icon" data-del="${i}">${icon('trash', 14)}</button></div></div></div>`).join('') : emptyState('quiz', 'No questions yet', 'Add questions one by one or import a CSV / Excel file.');
    m.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => editQ(+b.dataset.edit));
    m.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => { if (await confirmBox('Delete question?', 'This cannot be undone.', 'Delete', true)) { qs.splice(+b.dataset.del, 1); await save(); paint(); } });
    m.querySelectorAll('[data-up]').forEach(b => b.onclick = async () => { const i = +b.dataset.up; [qs[i - 1], qs[i]] = [qs[i], qs[i - 1]]; await save(); paint(); });
  };
  const editQ = i => {
    const q = i == null ? { id: genId(), text: '', type: 'single', options: ['', '', '', ''], answer: [], explanation: '' } : clone(qs[i]);
    const e = openModal({
      title: i == null ? 'Add question' : 'Edit question', size: 'wide', body: `<form><div class="field"><label>Question</label><textarea class="textarea" name="text" rows="3">${h(q.text)}</textarea></div><div class="field"><label>Answer type</label><select class="select" name="type"><option value="single" ${q.type !== 'multi' ? 'selected' : ''}>Single correct answer</option><option value="multi" ${q.type === 'multi' ? 'selected' : ''}>Multiple correct answers</option></select></div>
      <label class="small muted" style="font-weight:600">Options — tick the correct answer(s)</label><div data-opts class="mt8">${q.options.map((o, j) => `<div class="row" style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><input type="checkbox" name="ans" value="${j}" ${q.answer.includes(j) ? 'checked' : ''} style="width:20px;height:20px;accent-color:var(--green)"><b style="width:18px">${KEYS[j]}</b><input class="input" name="opt" value="${h(o)}" style="height:40px"></div>`).join('')}</div>
      <button type="button" class="btn btn-sm btn-ghost mb16" data-more>${icon('plus', 14)} Add option</button><div class="field"><label>Explanation (shown after submission)</label><textarea class="textarea" name="explanation" rows="3">${h(q.explanation || '')}</textarea></div></form>`,
      foot: `<button class="btn btn-ghost" data-c>Cancel</button><button class="btn btn-primary" data-s>Save question</button>`
    });
    e.querySelector('[data-more]').onclick = () => { const n = e.querySelectorAll('[name=opt]').length; if (n >= 6) return; e.querySelector('[data-opts]').insertAdjacentHTML('beforeend', `<div class="row" style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><input type="checkbox" name="ans" value="${n}" style="width:20px;height:20px;accent-color:var(--green)"><b style="width:18px">${KEYS[n]}</b><input class="input" name="opt" style="height:40px"></div>`); };
    e.querySelector('[data-c]').onclick = closeModal;
    e.querySelector('[data-s]').onclick = async () => {
      const f = e.querySelector('form'); const opts = $$('[name=opt]', f).map(x => x.value.trim()); const ans = $$('[name=ans]:checked', f).map(x => +x.value);
      const keep = opts.map((o, j) => [o, j]).filter(([o]) => o); const map = {}; keep.forEach(([, j], n) => map[j] = n);
      const nq = { ...q, text: f.text.value.trim(), type: f.type.value, options: keep.map(([o]) => o), answer: ans.filter(j => map[j] != null).map(j => map[j]), explanation: f.explanation.value.trim() };
      if (!nq.text) return toast('Write the question text.', 'err'); if (nq.options.length < 2) return toast('Add at least two options.', 'err'); if (!nq.answer.length) return toast('Tick the correct answer.', 'err'); if (nq.type === 'single' && nq.answer.length > 1) return toast('Single-correct questions need exactly one answer — or switch to multiple correct.', 'err');
      if (i == null) qs.push(nq); else qs[i] = nq;
      try { await save(); closeModal(); paint(); toast('Question saved'); } catch { }
    };
  };
  m.querySelector('[data-add]').onclick = () => editQ(null);
  m.querySelector('[data-import]').onclick = () => openImport(async added => { qs = qs.concat(added); await save(); paint(); });
  paint();
}
function openImport(onDone) {
  const sample = 'question,type,optionA,optionB,optionC,optionD,answer,explanation\n"What is the SI unit of force?",single,Joule,Newton,Watt,Pascal,B,"1 N = 1 kg m/s²"\n"Which are vectors?",multi,Velocity,Speed,Force,Mass,A;C,"Velocity and force have direction"';
  let parsed = [];
  const m = openModal({
    title: 'Bulk import questions', size: 'wide', body: `<p class="muted small">Upload a <b>.csv</b> or <b>.xlsx</b> file, or paste CSV below. Columns: <code>question, type (single/multi), optionA…optionF, answer (e.g. B or A;C), explanation</code>.</p>
    <label class="drop mt16">${icon('upload', 22)}<div class="mt8" data-fname>Choose a CSV or Excel file</div><input type="file" accept=".csv,.xlsx,.xls" hidden data-imp></label>
    <div class="field mt16"><label>…or paste CSV</label><textarea class="textarea" rows="6" data-paste style="font-family:ui-monospace,monospace;font-size:12.5px" placeholder="${h(sample)}"></textarea></div>
    <div class="flex"><button class="btn btn-sm btn-ghost" data-parse>Preview pasted CSV</button><button class="btn btn-sm btn-ghost" data-sample>${icon('copy', 14)} Copy sample CSV</button></div><div data-prev class="mt16"></div>`,
    foot: `<button class="btn btn-ghost" data-c>Cancel</button><button class="btn btn-primary" data-s disabled>Import</button>`
  });
  const show = () => { m.querySelector('[data-prev]').innerHTML = parsed.length ? `<div class="notice ok">${icon('checkc', 18)}<div><b>${parsed.length} questions ready.</b> ${parsed.slice(0, 3).map(q => h(q.text.slice(0, 60))).join(' · ')}${parsed.length > 3 ? '…' : ''}</div></div>` : `<div class="notice err">${icon('alert', 18)}<div>No valid questions found. Each row needs a question, at least two options and an answer letter.</div></div>`; m.querySelector('[data-s]').disabled = !parsed.length; };
  m.querySelector('[data-imp]').onchange = async e => {
    const f = e.target.files[0]; if (!f) return; m.querySelector('[data-fname]').textContent = f.name;
    try {
      if (/\.xlsx?$/i.test(f.name)) { if (!window.XLSX) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'); const wb = XLSX.read(await f.arrayBuffer()); const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '' }); parsed = rowsToQuestions(rows); }
      else parsed = rowsToQuestions(parseCSV(await f.text()));
    } catch (err) { parsed = []; toast('Could not read that file.', 'err'); }
    show();
  };
  m.querySelector('[data-parse]').onclick = () => { parsed = rowsToQuestions(parseCSV(m.querySelector('[data-paste]').value)); show(); };
  m.querySelector('[data-sample]').onclick = async () => { try { await navigator.clipboard.writeText(sample); toast('Sample copied — paste it into a spreadsheet.'); } catch { m.querySelector('[data-paste]').value = sample; } };
  m.querySelector('[data-c]').onclick = closeModal;
  m.querySelector('[data-s]').onclick = async () => { try { await onDone(parsed); closeModal(); toast(parsed.length + ' questions imported'); } catch { } };
}

/* ===== Other admin sections ===== */
const AdminSec = {
  overview() {
    const atts = allAttempts(); const pend = S.subsAll.reduce((n, s) => n + Object.values(s.items || {}).filter(i => i.grade == null || i.grade === '').length, 0);
    const recent = atts.sort((a, b) => (b.at || '').localeCompare(a.at || '')).slice(0, 8);
    const fbN = S.fbAll.reduce((n, f) => n + (f.items || []).length, 0);
    const week = Date.now() - 7 * 864e5; const active = S.results.filter(r => r.lastSeen && new Date(r.lastSeen) > week).length;
    return adminHead(`Welcome back${site().instructor ? ', ' + h(site().instructor) : ''}`, 'Here\'s what\'s happening on your platform.', `<a class="btn btn-ghost" href="#home">${icon('eye', 15)} View site</a><button class="btn btn-primary" data-act="a-new" data-col="lectures">${icon('plus', 15)} New lecture</button>`) +
      (S.mode === 'offline' ? `<div class="notice warn mb24">${icon('alert', 18)}<div>Preview mode — the database isn't connected in this view, so changes are not saved.</div></div>` : '') +
      (!site().brand && S.mode === 'live' ? `<div class="notice info mb24">${icon('db', 18)}<div><b>Your database is empty.</b> <button class="link" data-act="a-seed">Load the sample content</button> to see the platform in action, or start creating your own.</div></div>` : '') +
      `<div class="grid g4">${[['users', S.results.length, 'Registered students', active + ' active this week'], ['video', S.data.lectures.length, 'Video lectures', S.data.courses.length + ' courses'], ['test', atts.length, 'Quiz & test attempts', totalQuestions() + ' questions in bank'], ['edit', pend, 'Submissions to grade', fbN + ' feedback messages']].map(([ic, n, l, s]) => `<div class="card mini-stat"><div class="ic" style="background:var(--royal-50);color:var(--royal)">${icon(ic, 22)}</div><div><b>${n}</b><span>${l}</span><div class="small muted">${s}</div></div></div>`).join('')}</div>
      <div class="grid mt24" style="grid-template-columns:minmax(0,1.5fr) minmax(0,1fr)"><div class="card"><div class="card-hd"><h3>Recent student activity</h3><a class="link small" href="#admin-students">All students</a></div>${recent.length ? recent.map(a => `<div class="list-row"><span class="avatar" style="width:32px;height:32px;font-size:12px">${h(initials(a.name))}</span><div class="grow"><b>${h(a.name || 'Student')} · ${h(a.title)}</b><span>${a.kind === 'test' ? 'Test' : 'Quiz'} · ${ago(a.at)}</span></div><b>${a.score}/${a.max}</b></div>`).join('') : '<p class="muted small card-pad">Student attempts will show up here.</p>'}</div>
      <div class="card"><div class="card-hd"><h3>Quick actions</h3></div><div class="card-pad" style="display:grid;gap:10px">${[['courses', 'book', 'Create a course'], ['materials', 'upload', 'Upload PDF notes'], ['quizzes', 'quiz', 'Create a quiz'], ['tests', 'test', 'Schedule a test'], ['announcements', 'megaphone', 'Post an announcement']].map(([c, ic, l]) => `<button class="btn btn-ghost" style="justify-content:flex-start" data-act="a-new" data-col="${c}">${icon(ic, 16)} ${l}</button>`).join('')}<a class="btn btn-ghost" style="justify-content:flex-start" href="#admin-homepage">${icon('home', 16)} Edit homepage</a></div></div></div>
      <div class="notice info mt24">${icon('shield', 18)}<div><b>Access & roles.</b> You (and anyone you share this platform with as an <b>Editor</b>) can manage content here. Share it with students as <b>Contributor</b> so they can save progress, attempt tests and submit assignments — Viewers can browse but nothing they do is saved.</div></div>`;
  },
  students() {
    const ap = access().approved || {}; const restricted = S.data.courses.filter(c => c.restricted);
    const rows = S.results.slice().sort((a, b) => (b.lastSeen || '').localeCompare(a.lastSeen || ''));
    return adminHead('Students', `${rows.length} registered`) + (rows.length ? `<div class="table-wrap"><table class="t"><thead><tr><th>Student</th><th>Class / Goal</th><th>Joined</th><th>Last active</th><th>Attempts</th><th>Avg</th>${restricted.length ? '<th>Restricted access</th>' : ''}<th></th></tr></thead><tbody>${rows.map(r => { const at = r.attempts || []; const avg = at.length ? Math.round(at.reduce((s, a) => s + pct(Math.max(0, a.score), a.max), 0) / at.length) : null; return `<tr><td><div class="flex"><span class="avatar" style="width:32px;height:32px;font-size:12px">${h(initials(r.name))}</span><b>${h(r.name)}</b></div></td><td class="small">${h(r.cls || '—')}<br><span class="muted">${h(r.goal || '')}</span></td><td class="small">${fmtDate(r.joined)}</td><td class="small">${r.lastSeen ? ago(r.lastSeen) : '—'}</td><td>${at.length}</td><td>${avg == null ? '—' : avg + '%'}</td>${restricted.length ? `<td class="small">${(ap[r.id] || []).length ? (ap[r.id] || []).map(id => h(byId('courses', id)?.title || '')).join(', ') : '<span class="muted">None</span>'}</td>` : ''}<td><div class="acts"><button class="btn btn-sm btn-soft" data-act="a-student" data-id="${h(r.id)}">View</button>${restricted.length ? `<button class="btn btn-sm btn-ghost" data-act="a-access" data-id="${h(r.id)}">${icon('key', 14)}</button>` : ''}<button class="btn btn-sm btn-danger btn-icon" data-act="a-del-student" data-id="${h(r.id)}">${icon('trash', 14)}</button></div></td></tr>`; }).join('')}</tbody></table></div>` : emptyState('users', 'No students yet', 'Students appear here after they create their profile. Share the platform with them as Contributors.'));
  },
  submissions() {
    const rows = []; for (const s of S.subsAll) for (const [aid, it] of Object.entries(s.items || {})) rows.push({ uid: s.id, name: s.name, aid, ...it });
    rows.sort((a, b) => ((a.grade == null || a.grade === '') ? 0 : 1) - ((b.grade == null || b.grade === '') ? 0 : 1) || (b.at || '').localeCompare(a.at || ''));
    return adminHead('Grade Submissions', `${rows.filter(r => r.grade == null || r.grade === '').length} waiting for grading`) + (rows.length ? `<div class="table-wrap"><table class="t"><thead><tr><th>Student</th><th>Assignment</th><th>Submitted</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(r => { const a = byId('assignments', r.aid); return `<tr><td><b>${h(r.name)}</b></td><td>${h(a?.title || r.title || 'Removed assignment')}</td><td class="small">${fmtDT(r.at)}${a && a.due && r.at > a.due ? ' <span class="badge b-red">Late</span>' : ''}</td><td>${r.grade != null && r.grade !== '' ? `<span class="badge b-green">${h(r.grade)}/${h(a?.maxMarks ?? '')}</span>` : '<span class="badge b-amber">To grade</span>'}</td><td><button class="btn btn-sm btn-primary" data-act="a-grade" data-uid="${h(r.uid)}" data-aid="${h(r.aid)}">${r.grade != null && r.grade !== '' ? 'Review' : 'Grade'}</button></td></tr>`; }).join('')}</tbody></table></div>` : emptyState('task', 'No submissions yet', 'Student submissions will appear here for grading.'));
  },
  feedback() {
    const items = []; for (const f of S.fbAll) for (const it of (f.items || [])) items.push({ uid: f.id, name: f.name, ...it });
    items.sort((a, b) => (b.at || '').localeCompare(a.at || ''));
    return adminHead('Feedback & Messages', `${items.length} total`) + (items.length ? `<div class="grid g2">${items.map(it => `<div class="card card-pad"><div class="flex between"><div class="flex"><span class="avatar" style="width:34px;height:34px;font-size:12px">${h(initials(it.name))}</span><div><b>${h(it.name)}</b><div class="small muted">${fmtDT(it.at)}</div></div></div><span class="badge ${it.kind === 'contact' ? 'b-royal' : 'b-gold'}">${it.kind === 'contact' ? 'Message' : 'Review'}</span></div>
      ${it.kind === 'contact' ? `<p class="mt16"><b>${h(it.subject)}</b></p><p class="small muted">Reply to: ${h(it.contact)}</p>` : `<div class="stars mt16">${Array.from({ length: it.rating || 5 }, () => icon('star', 14)).join('')}</div>`}
      <p class="mt8" style="white-space:pre-wrap">${h(it.text || it.message)}</p>
      ${it.kind === 'review' ? (it.allowPublish ? (S.data.testimonials.some(t => t.sourceId === it.id) ? `<span class="badge b-green mt16">${icon('check', 12)} Featured on homepage</span>` : `<button class="btn btn-sm btn-soft mt16" data-act="a-feature" data-uid="${h(it.uid)}" data-id="${h(it.id)}">${icon('star', 14)} Feature on homepage</button>`) : '<p class="small muted mt16">Student asked not to publish this.</p>') : ''}</div>`).join('')}</div>` : emptyState('msg', 'No feedback yet', 'Student reviews and contact-form messages arrive here.'));
  },
  homepage() {
    const s = site();
    const F2 = [['brand', 'Platform name', 'text'], ['tagline', 'Tagline under the logo', 'text'], ['heroTitle', 'Hero headline (a full stop splits it into two lines)', 'text'], ['heroSub', 'Hero subtitle', 'textarea'], ['heroBadge', 'Hero badge label', 'text'], ['heroBadgeText', 'Hero badge text (leave empty to hide)', 'text'], ['instructor', 'Lead educator name', 'text'], ['instructorRole', 'Educator title', 'text'], ['instructorBio', 'Educator bio', 'textarea'], ['about', 'About Us text (blank line between paragraphs)', 'textarea', { rows: 8 }], ['mission', 'Mission statement', 'textarea'], ['email', 'Contact email', 'text'], ['phone', 'Contact phone', 'text'], ['whatsapp', 'WhatsApp number with country code (digits only, e.g. 919876543210)', 'text'], ['address', 'Address / location', 'text'], ['youtube', 'YouTube URL', 'text'], ['instagram', 'Instagram URL', 'text'], ['telegram', 'Telegram URL', 'text'], ['facebook', 'Facebook URL', 'text'], ['linkedin', 'LinkedIn URL', 'text']];
    return adminHead('Homepage & Branding', 'Hero text, contact details, social links and About page content.', `<button class="btn btn-primary" data-act="a-save-site">${icon('check', 16)} Save changes</button>`) + `<form data-site class="card card-pad" style="max-width:860px">${F2.map(f => fieldHTML(f, s)).join('')}<p class="small muted">Banners and announcements: pinned announcements appear as a bar at the top of every page — manage them under <a class="link" href="#admin-announcements">Announcements</a>.</p></form>`;
  },
  taxonomy() {
    const t = tax();
    return adminHead('Categories & Subjects', 'These lists power the filters and dropdowns across the site.', `<button class="btn btn-primary" data-act="a-save-tax">${icon('check', 16)} Save</button>`) + `<form data-tax class="card card-pad" style="max-width:860px"><div class="field"><label>Classes (comma separated)</label><input class="input" name="classes" value="${h((t.classes || []).join(', '))}"></div><div class="field"><label>Subjects (comma separated)</label><input class="input" name="subjects" value="${h((t.subjects || []).join(', '))}"></div><div class="field"><label>Chapters & topics — one subject per line: <code>Subject: Chapter 1, Chapter 2</code></label><textarea class="textarea" name="chapters" rows="10" style="font-family:ui-monospace,monospace;font-size:13px">${h(Object.entries(t.chapters || {}).map(([k, v]) => k + ': ' + v.join(', ')).join('\n'))}</textarea></div></form>`;
  },
};

/* ===== Admin actions ===== */
const AdminAct = {
  async del(col, id) { const d = byId(col, id); if (!(await confirmBox('Delete ' + SCHEMAS[col].label.toLowerCase() + '?', `“${d?.title || d?.name || ''}” will be removed for everyone. This cannot be undone.`, 'Delete', true))) return; try { await deleteDoc(col, id); toast('Deleted'); } catch { } },
  async saveSite() { const f = $('[data-site]'); const fields = Array.from(f.elements).filter(e => e.name); const d = clone(site()); delete d.id; fields.forEach(e => d[e.name] = e.value.trim()); for (const k of ['youtube', 'instagram', 'telegram', 'facebook', 'linkedin']) if (d[k] && !safeUrl(d[k])) return toast(k + ' link must start with https://', 'err'); d.whatsapp = String(d.whatsapp || '').replace(/\D/g, ''); try { await saveDoc('settings', 'site', d); toast('Homepage updated'); } catch { } },
  async saveTax() { const f = $('[data-tax]'); const split = s => s.split(',').map(x => x.trim()).filter(Boolean); const chapters = {}; f.chapters.value.split('\n').forEach(l => { const i = l.indexOf(':'); if (i > 0) chapters[l.slice(0, i).trim()] = split(l.slice(i + 1)); }); try { await saveDoc('settings', 'taxonomy', { classes: split(f.classes.value), subjects: split(f.subjects.value), chapters }); toast('Categories saved'); } catch { } },
  student(uid) {
    const r = S.results.find(x => x.id === uid); if (!r) return; const at = (r.attempts || []).slice().reverse(); const sub = S.subsAll.find(s => s.id === uid);
    openModal({ title: h(r.name), size: 'wide', body: `<div class="flex wrap mb16"><span class="badge">${h(r.cls || '')}</span><span class="badge b-royal">${h(r.goal || '')}</span><span class="badge">Joined ${fmtDate(r.joined)}</span><span class="badge">Last active ${r.lastSeen ? ago(r.lastSeen) : '—'}</span></div>
      <h4 class="mb16">Enrolled courses</h4><p class="small">${(r.enrolled || []).map(id => h(byId('courses', id)?.title || '')).filter(Boolean).join(', ') || '<span class="muted">None</span>'}</p>
      ${at.length ? `<h4 class="mt24 mb16">Performance</h4>${lineChart(at.slice(0, 12).reverse().map((a, i) => ({ v: pct(Math.max(0, a.score), a.max), label: a.title, short: String(i + 1) })))}` : ''}
      <h4 class="mt24 mb16">Attempts (${at.length})</h4>${at.length ? `<div class="table-wrap"><table class="t"><thead><tr><th>Title</th><th>Score</th><th>Accuracy</th><th>Date</th></tr></thead><tbody>${at.map(a => `<tr><td>${h(a.title)}${a.practice ? ' <span class="badge">practice</span>' : ''}</td><td><b>${a.score}</b>/${a.max}</td><td>${pct(a.correct, a.correct + a.wrong)}%</td><td class="small muted">${fmtDT(a.at)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">No attempts yet.</p>'}
      <h4 class="mt24 mb16">Assignment submissions</h4><p class="small">${sub ? Object.keys(sub.items || {}).length + ' submitted' : 'None'}</p>` });
  },
  access(uid) {
    const r = S.results.find(x => x.id === uid); const ap = clone(access()); delete ap.id; ap.approved = ap.approved || {}; const mine = ap.approved[uid] || [];
    const m = openModal({ title: 'Course access · ' + h(r?.name), body: `<p class="muted mb16">Approve this student for restricted courses.</p>${S.data.courses.filter(c => c.restricted).map(c => `<label class="check mb16"><input type="checkbox" value="${h(c.id)}" ${mine.includes(c.id) ? 'checked' : ''}> ${h(c.title)}</label>`).join('')}`, foot: `<button class="btn btn-ghost" data-c>Cancel</button><button class="btn btn-primary" data-s>Save access</button>` });
    m.querySelector('[data-c]').onclick = closeModal;
    m.querySelector('[data-s]').onclick = async () => { ap.approved[uid] = $$('input:checked', m).map(i => i.value); try { await saveDoc('settings', 'access', ap); closeModal(); toast('Access updated'); } catch { } };
  },
  async delStudent(uid) { const r = S.results.find(x => x.id === uid); if (!(await confirmBox('Remove student profile?', `${r?.name}'s profile, scores and leaderboard entries will be deleted. They can register again.`, 'Remove', true))) return; try { await deleteDoc('results', uid); toast('Student removed'); } catch { } },
  grade(uid, aid) {
    const s = S.subsAll.find(x => x.id === uid); const it = (s?.items || {})[aid]; const a = byId('assignments', aid); if (!it) return;
    const m = openModal({ title: `${h(s.name)} · ${h(a?.title || it.title || '')}`, size: 'wide', body: `<p class="small muted mb16">Submitted ${fmtDT(it.at)}</p><div style="white-space:pre-wrap;background:var(--surface-2);padding:16px;border-radius:12px;max-height:320px;overflow:auto">${h(it.text || '(no text)')}</div>${safeUrl(it.link) ? `<a class="link mt12" href="${h(safeUrl(it.link))}" target="_blank" rel="noopener">${icon('external', 14)} Open attached link</a>` : it.link ? `<p class="small muted mt12">Link: ${h(it.link)}</p>` : ''}
      <div class="form-row mt24"><div class="field"><label>Marks (out of ${h(a?.maxMarks ?? '')})</label><input class="input" type="number" name="grade" value="${h(it.grade ?? '')}"></div></div><div class="field"><label>Feedback for the student</label><textarea class="textarea" name="fb">${h(it.feedback || '')}</textarea></div>`, foot: `<button class="btn btn-ghost" data-c>Cancel</button><button class="btn btn-primary" data-s>Save grade</button>`
    });
    m.querySelector('[data-c]').onclick = closeModal;
    m.querySelector('[data-s]').onclick = async () => { const g = m.querySelector('[name=grade]').value; if (g === '') return toast('Enter marks', 'err'); if (a && +g > +a.maxMarks) return toast('Marks exceed the maximum', 'err'); const d = clone(s); delete d.id; d.items[aid] = { ...d.items[aid], grade: +g, feedback: m.querySelector('[name=fb]').value.trim(), gradedAt: nowISO() }; try { await saveDoc('submissions', uid, d); closeModal(); toast('Grade saved — the student can see it now'); } catch { } };
  },
  async feature(uid, id) { const f = S.fbAll.find(x => x.id === uid); const it = (f?.items || []).find(x => x.id === id); if (!it) return; const r = S.results.find(x => x.id === uid); try { await saveDoc('testimonials', genId(), { name: f.name || r?.name || 'Student', role: [r?.cls, r?.goal].filter(Boolean).join(' · '), text: it.text, rating: it.rating || 5, published: true, sourceId: it.id, date: nowISO() }); toast('Featured on the homepage'); } catch { } },
};
