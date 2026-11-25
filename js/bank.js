/* ===== Question bank, test generator & student practice generator ===== */
const DIFFS = ['Easy', 'Moderate', 'Difficult'];
const normQ = t => String(t || '').toLowerCase().replace(/\s+/g, ' ').trim();
const bankById = id => S.bank.find(b => b.id === id);
const bankChapters = () => uniq([...chapOpts(), ...S.bank.map(b => b.chapter)]);
function ensureBank() {
  if (S.bankSub || !S.db) return; S.bankSub = true;
  const timer = setTimeout(() => { if (!S.loaded.bank) { S.loaded.bank = true; scheduleRender(); } }, 10000);
  S.db.collection('bank').onSnapshot(snap => { clearTimeout(timer); S.bank = snap.docs.map(d => ({ id: d.id, ...d.data() })); S.loaded.bank = true; scheduleRender(); },
    () => { clearTimeout(timer); S.loaded.bank = true; scheduleRender(); });
}
function usedBankIds() { const s = new Set(); for (const c of ['quizzes', 'tests']) for (const d of S.data[c]) for (const q of d.questions || []) if (q.bankId) s.add(q.bankId); return s; }
/* Spread picks evenly across chapters; prefer questions not used before */
function balancedPick(list, n, used, exclude) {
  const groups = {};
  for (const q of shuffle(list)) { if (exclude && exclude.has(q.id)) continue; (groups[q.chapter || 'Untagged'] = groups[q.chapter || 'Untagged'] || []).push(q); }
  if (used) for (const k in groups) groups[k].sort((a, b) => (used.has(a.id) ? 1 : 0) - (used.has(b.id) ? 1 : 0));
  const keys = shuffle(Object.keys(groups)); const out = [];
  while (out.length < n && keys.some(k => groups[k].length)) for (const k of keys) { if (out.length >= n) break; const q = groups[k].shift(); if (q) out.push(q); }
  return out;
}
function bankPool(chapters, cls, type) {
  return S.bank.filter(q => (!chapters.size || chapters.has(q.chapter || 'Untagged')) && (!cls || cls === 'All' || q.cls === cls) && (!type || type === 'any' || q.type === type));
}
const countBy = (list, f) => list.reduce((m, x) => { const k = f(x) || 'Untagged'; m[k] = (m[k] || 0) + 1; return m; }, {});
const qCopy = q => ({ text: q.text, options: q.options.slice(), answer: q.answer.slice(), explanation: q.explanation || '', type: q.type || (q.answer.length > 1 ? 'multi' : 'single') });
async function bulkAddToBank(items, label) {
  const have = new Set(S.bank.map(b => normQ(b.text))); let added = 0, skipped = 0;
  const t = toast(`Adding ${items.length} questions…`, 'info');
  for (const it of items) {
    const k = normQ(it.text); if (!k || have.has(k)) { skipped++; continue; } have.add(k);
    try { await S.db.collection('bank').doc(genId()).set({ ...it, subject: 'Mathematics', createdAt: nowISO() }); added++; }
    catch (e) { handleWriteErr(e, 'questions').catch(() => { }); break; }
  }
  toast(`${added} question${added === 1 ? '' : 's'} added to the bank${skipped ? ` · ${skipped} duplicate${skipped === 1 ? '' : 's'} skipped` : ''}.`);
  return added;
}

/* ===== Admin: Question Bank ===== */
const BQ = { q: '', chapter: 'All', diff: 'All', cls: 'All', limit: 60, sel: new Set() };
AdminSec.bank = () => {
  if (!S.loaded.bank) return adminHead('Question Bank', 'Loading…') + skeletonGrid(3);
  const all = S.bank; const byCh = countBy(all, q => q.chapter); const byD = countBy(all, q => q.difficulty);
  const list = all.filter(q => (BQ.chapter === 'All' || (q.chapter || 'Untagged') === BQ.chapter) && (BQ.diff === 'All' || q.difficulty === BQ.diff) && (BQ.cls === 'All' || q.cls === BQ.cls) && (!BQ.q || normQ(q.text + ' ' + (q.topic || '')).includes(normQ(BQ.q))))
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  const shown = list.slice(0, BQ.limit); const nSel = [...BQ.sel].filter(id => bankById(id)).length;
  return adminHead('Question Bank', `${all.length} questions · tag them by chapter and difficulty, then generate tests in seconds`,
    `<button class="btn btn-ghost" data-act="bq-from-existing">${icon('copy', 15)} Copy from quizzes & tests</button><button class="btn btn-ghost" data-act="bq-import">${icon('upload', 15)} Bulk import</button><button class="btn btn-primary" data-act="bq-new">${icon('plus', 15)} Add question</button>`) +
    `<div class="grid g4 mb24">${[['db', all.length, 'Total questions', 'var(--royal-50)', 'var(--royal)'], ['checkc', byD.Easy || 0, 'Easy', 'var(--green-50)', 'var(--green)'], ['target', byD.Moderate || 0, 'Moderate', 'var(--amber-50)', '#B57605'], ['fire', byD.Difficult || 0, 'Difficult', 'var(--red-50)', 'var(--red)']].map(([ic, n, l, bg, fg]) => `<div class="card mini-stat"><div class="ic" style="background:${bg};color:${fg}">${icon(ic, 22)}</div><div><b>${n}</b><span>${l}</span></div></div>`).join('')}</div>
    ${all.length ? `<div class="card card-pad mb24"><div class="flex between wrap mb16"><h3 style="font-size:16px">Chapter coverage</h3><a class="btn btn-sm btn-gold" href="#admin-generator">${icon('sparkle', 14)} Generate a test</a></div><div class="chips"><button class="chip ${BQ.chapter === 'All' ? 'active' : ''}" data-act="bq-chip" data-v="All">All · ${all.length}</button>${Object.entries(byCh).sort((a, b) => b[1] - a[1]).map(([c, n]) => `<button class="chip ${BQ.chapter === c ? 'active' : ''}" data-act="bq-chip" data-v="${h(c)}">${h(c)} · ${n}</button>`).join('')}</div></div>` : ''}
    <div class="toolbar"><div class="input-ic">${icon('search', 17)}<input class="input" id="bq-q" data-bq="q" placeholder="Search question text or topic…" value="${h(BQ.q)}"></div>
      <select class="select" data-bq="diff">${['All', ...DIFFS].map(d => `<option value="${d}" ${BQ.diff === d ? 'selected' : ''}>${d === 'All' ? 'All difficulties' : d}</option>`).join('')}</select>
      <select class="select" data-bq="cls">${['All', ...clsOpts()].map(d => `<option value="${h(d)}" ${BQ.cls === d ? 'selected' : ''}>${d === 'All' ? 'All classes' : h(d)}</option>`).join('')}</select>
      ${nSel ? `<button class="btn btn-danger" data-act="bq-del-sel">${icon('trash', 15)} Delete ${nSel} selected</button>` : ''}</div>
    ${list.length ? `<div class="table-wrap"><table class="t"><thead><tr><th style="width:36px"><input type="checkbox" data-act="bq-sel-all" ${shown.length && shown.every(q => BQ.sel.has(q.id)) ? 'checked' : ''} aria-label="Select all"></th><th>Question</th><th>Chapter</th><th>Level</th><th>Type</th><th></th></tr></thead><tbody>
    ${shown.map(q => `<tr><td><input type="checkbox" data-act="bq-sel" data-id="${h(q.id)}" ${BQ.sel.has(q.id) ? 'checked' : ''} aria-label="Select"></td><td style="max-width:520px"><div style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-weight:500">${h(q.text)}</div><div class="small muted">${h([q.topic, q.cls].filter(Boolean).join(' · '))}</div></td><td class="small">${h(q.chapter || 'Untagged')}</td><td>${diffBadge(q.difficulty)}</td><td class="small">${q.type === 'multi' ? 'Multi' : 'Single'}</td><td><div class="acts"><button class="btn btn-sm btn-ghost btn-icon" data-act="bq-edit" data-id="${h(q.id)}" title="Edit">${icon('edit', 15)}</button><button class="btn btn-sm btn-danger btn-icon" data-act="bq-del" data-id="${h(q.id)}" title="Delete">${icon('trash', 15)}</button></div></td></tr>`).join('')}</tbody></table></div>
    ${list.length > shown.length ? `<div class="center mt16"><button class="btn btn-ghost" data-act="bq-more">Show more (${list.length - shown.length} remaining)</button></div>` : ''}`
      : emptyState('db', all.length ? 'No questions match' : 'Your question bank is empty', all.length ? 'Try a different chapter, difficulty or search.' : 'Add questions one by one, import a CSV/Excel file, or copy the questions from your existing quizzes and tests.', `<button class="btn btn-primary" data-act="bq-new">${icon('plus', 15)} Add question</button>`)}`;
};
function bankEditor(id, preset = {}) {
  const q = id ? clone(bankById(id)) : { text: '', type: 'single', options: ['', '', '', ''], answer: [], explanation: '', chapter: preset.chapter || (BQ.chapter !== 'All' ? BQ.chapter : ''), topic: preset.topic || '', difficulty: preset.difficulty || 'Moderate', cls: preset.cls || '' };
  if (!q) return;
  const optRow = (o, j, on) => `<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><input type="checkbox" name="ans" value="${j}" ${on ? 'checked' : ''} style="width:20px;height:20px;accent-color:var(--green)" aria-label="Correct"><b style="width:18px">${KEYS[j]}</b><input class="input" name="opt" value="${h(o)}" style="height:40px"></div>`;
  const m = openModal({
    title: id ? 'Edit question' : 'Add question to bank', size: 'wide',
    body: `<form autocomplete="off"><div class="field"><label>Question</label><textarea class="textarea" name="text" rows="3">${h(q.text)}</textarea></div>
      <div class="form-row"><div class="field"><label>Chapter</label><input class="input" name="chapter" list="dl-bch" value="${h(q.chapter || '')}"><datalist id="dl-bch">${bankChapters().map(c => `<option value="${h(c)}">`).join('')}</datalist></div><div class="field"><label>Topic</label><input class="input" name="topic" value="${h(q.topic || '')}"></div></div>
      <div class="form-row r3"><div class="field"><label>Difficulty</label><select class="select" name="difficulty">${DIFFS.map(d => `<option ${q.difficulty === d ? 'selected' : ''}>${d}</option>`).join('')}</select></div><div class="field"><label>Class</label><select class="select" name="cls"><option value="">—</option>${clsOpts().map(c => `<option ${q.cls === c ? 'selected' : ''}>${h(c)}</option>`).join('')}</select></div><div class="field"><label>Answer type</label><select class="select" name="type"><option value="single" ${q.type !== 'multi' ? 'selected' : ''}>Single correct</option><option value="multi" ${q.type === 'multi' ? 'selected' : ''}>Multiple correct</option></select></div></div>
      <label class="small muted" style="font-weight:600">Options — tick the correct answer(s)</label><div data-opts class="mt8">${q.options.map((o, j) => optRow(o, j, q.answer.includes(j))).join('')}</div>
      <button type="button" class="btn btn-sm btn-ghost mb16" data-more>${icon('plus', 14)} Add option</button>
      <div class="field"><label>Explanation / solution</label><textarea class="textarea" name="explanation" rows="3">${h(q.explanation || '')}</textarea></div></form>`,
    foot: `<button class="btn btn-ghost" data-c>Cancel</button>${id ? '' : `<button class="btn btn-ghost" data-s2>Save & add another</button>`}<button class="btn btn-primary" data-s>Save question</button>`
  });
  m.querySelector('[data-more]').onclick = () => { const n = m.querySelectorAll('[name=opt]').length; if (n < 6) m.querySelector('[data-opts]').insertAdjacentHTML('beforeend', optRow('', n, false)); };
  m.querySelector('[data-c]').onclick = closeModal;
  const save = async again => {
    const f = m.querySelector('form'); const opts = $$('[name=opt]', f).map(x => x.value.trim()); const ans = $$('[name=ans]:checked', f).map(x => +x.value);
    const keep = opts.map((o, j) => [o, j]).filter(([o]) => o); const map = {}; keep.forEach(([, j], n) => map[j] = n);
    const d = { text: f.text.value.trim(), type: f.type.value, options: keep.map(([o]) => o), answer: ans.filter(j => map[j] != null).map(j => map[j]), explanation: f.explanation.value.trim(), chapter: f.chapter.value.trim(), topic: f.topic.value.trim(), difficulty: f.difficulty.value, cls: f.cls.value, subject: 'Mathematics' };
    if (!d.text) return toast('Write the question text.', 'err'); if (d.options.length < 2) return toast('Add at least two options.', 'err'); if (!d.answer.length) return toast('Tick the correct answer.', 'err');
    if (d.type === 'single' && d.answer.length > 1) return toast('Single-correct questions need exactly one answer — or switch to multiple correct.', 'err');
    if (!id && S.bank.some(b => normQ(b.text) === normQ(d.text))) return toast('This question is already in the bank.', 'err');
    d.createdAt = (id && bankById(id)?.createdAt) || nowISO(); if (id && bankById(id)?.source) d.source = bankById(id).source;
    try { await saveDoc('bank', id || genId(), d); closeModal(); toast('Question saved'); if (again) bankEditor(null, { chapter: d.chapter, topic: d.topic, difficulty: d.difficulty, cls: d.cls }); } catch { }
  };
  m.querySelector('[data-s]').onclick = () => save(false);
  m.querySelector('[data-s2]')?.addEventListener('click', () => save(true));
}

/* ===== Admin: Test Generator ===== */
const GEN = { target: 'test', title: '', chapters: new Set(), cls: 'All', type: 'any', counts: { Easy: 4, Moderate: 4, Difficult: 2 }, avoid: true, duration: 30, markCorrect: 4, markWrong: 1, seriesId: '', start: '', end: '', kind: 'Chapter-wise', difficulty: 'Moderate', preview: null, short: 0 };
AdminSec.generator = () => {
  if (!S.loaded.bank) return adminHead('Test Generator', 'Loading…') + skeletonGrid(2, 'g2');
  if (!S.bank.length) return adminHead('Test Generator', '') + emptyState('db', 'Add questions to the bank first', 'The generator builds tests from your question bank. Add or import questions, then come back here.', '<a class="btn btn-primary" href="#admin-bank">Open Question Bank</a>');
  if (!GEN.start) { GEN.start = new Date().toISOString(); GEN.end = new Date(Date.now() + 7 * 864e5).toISOString(); }
  const pool = bankPool(GEN.chapters, GEN.cls, GEN.type); const avail = countBy(pool, q => q.difficulty);
  const chCount = countBy(bankPool(new Set(), GEN.cls, GEN.type), q => q.chapter);
  const total = DIFFS.reduce((s, d) => s + (+GEN.counts[d] || 0), 0);
  const P = GEN.preview;
  const form = `<div class="card card-pad">
    <div class="seg mb16">${[['test', 'Online test'], ['quiz', 'Quiz']].map(([k, l]) => `<button class="${GEN.target === k ? 'active' : ''}" data-act="gen-target" data-v="${k}">${l}</button>`).join('')}</div>
    <div class="field"><label>Title</label><input class="input" id="gen-title" data-gen="title" value="${h(GEN.title)}" placeholder="${GEN.target === 'test' ? 'e.g. Weekly Test — Calculus' : 'e.g. Quick Quiz — Trigonometry'}"></div>
    <div class="field"><label>Chapters <span class="muted small">(none selected = all)</span></label><div class="chips">${Object.entries(chCount).sort().map(([c, n]) => `<button class="chip ${GEN.chapters.has(c) ? 'active' : ''}" data-act="gen-ch" data-v="${h(c)}">${h(c)} · ${n}</button>`).join('') || '<span class="muted small">No questions for this class/type.</span>'}</div></div>
    <div class="form-row"><div class="field"><label>Class</label><select class="select" data-gen="cls">${['All', ...clsOpts()].map(c => `<option value="${h(c)}" ${GEN.cls === c ? 'selected' : ''}>${c === 'All' ? 'All classes' : h(c)}</option>`).join('')}</select></div><div class="field"><label>Question type</label><select class="select" data-gen="type"><option value="any" ${GEN.type === 'any' ? 'selected' : ''}>Single & multiple correct</option><option value="single" ${GEN.type === 'single' ? 'selected' : ''}>Single correct only</option><option value="multi" ${GEN.type === 'multi' ? 'selected' : ''}>Multiple correct only</option></select></div></div>
    <div class="field"><label>Number of questions by difficulty</label><div class="form-row r3">${DIFFS.map(d => `<div><input class="input" type="number" min="0" max="200" id="gen-c-${d}" data-gen="count-${d}" value="${h(GEN.counts[d])}"><div class="small mt8 ${(+GEN.counts[d] || 0) > (avail[d] || 0) ? '' : 'muted'}" style="${(+GEN.counts[d] || 0) > (avail[d] || 0) ? 'color:var(--red)' : ''}">${d}: ${avail[d] || 0} available</div></div>`).join('')}</div></div>
    <label class="check mb16"><input type="checkbox" data-gen="avoid" ${GEN.avoid ? 'checked' : ''}> Prefer questions not used in earlier tests and quizzes</label>
    <div class="form-row"><div class="field"><label>Duration (minutes)</label><input class="input" type="number" min="1" data-gen="duration" value="${h(GEN.duration)}"></div>
    ${GEN.target === 'test' ? `<div class="field"><label>Test series</label><select class="select" data-gen="seriesId"><option value="">— standalone —</option>${S.data.series.map(s => `<option value="${h(s.id)}" ${GEN.seriesId === s.id ? 'selected' : ''}>${h(s.title)}</option>`).join('')}</select></div>` : `<div class="field"><label>Quiz type</label><select class="select" data-gen="kind">${['Daily', 'Chapter-wise', 'Topic-wise'].map(k => `<option ${GEN.kind === k ? 'selected' : ''}>${k}</option>`).join('')}</select></div>`}</div>
    ${GEN.target === 'test' ? `<div class="form-row"><div class="field"><label>Marks per correct</label><input class="input" type="number" step="any" data-gen="markCorrect" value="${h(GEN.markCorrect)}"></div><div class="field"><label>Negative marks per wrong</label><input class="input" type="number" step="any" min="0" data-gen="markWrong" value="${h(GEN.markWrong)}"></div></div>
    <div class="form-row"><div class="field"><label>Available from</label><input class="input" type="datetime-local" data-gen="start" value="${h(toLocalDT(GEN.start))}"></div><div class="field"><label>Available until</label><input class="input" type="datetime-local" data-gen="end" value="${h(toLocalDT(GEN.end))}"></div></div>`
      : `<div class="field"><label>Difficulty label shown to students</label><select class="select" data-gen="difficulty">${DIFFS.map(d => `<option ${GEN.difficulty === d ? 'selected' : ''}>${d}</option>`).join('')}</select></div>`}
    <button class="btn btn-gold btn-block btn-lg" data-act="gen-run">${icon('sparkle', 17)} ${P ? 'Regenerate' : 'Generate'} ${total} questions</button></div>`;
  const preview = P ? `<div class="card"><div class="card-hd"><h3>Preview · ${P.length} questions${GEN.target === 'test' ? ` · ${P.length * (+GEN.markCorrect || 4)} marks` : ''}</h3><div class="flex">${Object.entries(countBy(P, q => q.difficulty)).map(([d, n]) => `<span class="badge ${DIFF[d] || ''}">${n} ${h(d)}</span>`).join('')}</div></div>
    ${GEN.short ? `<div class="notice warn" style="margin:16px 22px 0">${icon('alert', 16)}<div>Only ${P.length} matching questions were found, ${GEN.short} fewer than requested. Add more questions to the bank or widen the chapters.</div></div>` : ''}
    <div style="max-height:640px;overflow-y:auto">${P.map((q, i) => `<div class="list-row" style="align-items:flex-start"><b class="muted small" style="width:26px;padding-top:2px">${i + 1}.</b><div class="grow"><div style="font-weight:500;white-space:pre-wrap">${h(q.text)}</div><div class="flex wrap mt8" style="gap:6px"><span class="badge">${h(q.chapter || 'Untagged')}</span>${diffBadge(q.difficulty)}${q.type === 'multi' ? '<span class="badge b-violet">Multi</span>' : ''}</div></div><div class="flex"><button class="btn btn-sm btn-ghost btn-icon" data-act="gen-swap" data-i="${i}" title="Swap for another question">${icon('shuffle', 14)}</button><button class="btn btn-sm btn-ghost btn-icon" data-act="gen-rm" data-i="${i}" title="Remove">${icon('x', 14)}</button></div></div>`).join('')}</div>
    <div class="card-pad" style="border-top:1px solid var(--border)"><button class="btn btn-primary btn-block btn-lg" data-act="gen-create" ${P.length ? '' : 'disabled'}>${icon('check', 17)} Create ${GEN.target === 'test' ? 'online test' : 'quiz'} with these ${P.length} questions</button></div></div>`
    : `<div class="empty"><div class="ic">${icon('sparkle', 28)}</div><h4>Your test will appear here</h4><p>Choose chapters and how many Easy, Moderate and Difficult questions you want, then click Generate. You can swap or remove any question before creating it.</p></div>`;
  return adminHead('Test Generator', `Build a test from ${S.bank.length} questions in your bank`, `<a class="btn btn-ghost" href="#admin-bank">${icon('db', 15)} Question Bank</a>`) + `<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);align-items:start">${form}${preview}</div>`;
};
function genRun() {
  const pool = bankPool(GEN.chapters, GEN.cls, GEN.type); const used = GEN.avoid ? usedBankIds() : null; let out = [], want = 0;
  for (const d of DIFFS) { const n = Math.max(0, +GEN.counts[d] || 0); want += n; out = out.concat(balancedPick(pool.filter(q => q.difficulty === d), n, used)); }
  if (!want) return toast('Set at least one question.', 'err');
  GEN.preview = out; GEN.short = want - out.length; App.render();
}
function genSwap(i) {
  const cur = GEN.preview[i]; const taken = new Set(GEN.preview.map(q => q.id));
  const pool = bankPool(GEN.chapters, GEN.cls, GEN.type).filter(q => q.difficulty === cur.difficulty);
  const sameCh = pool.filter(q => q.chapter === cur.chapter && !taken.has(q.id));
  const pick = balancedPick(sameCh.length ? sameCh : pool, 1, GEN.avoid ? usedBankIds() : null, taken)[0];
  if (!pick) return toast('No other matching question in the bank.', 'info');
  GEN.preview[i] = pick; App.render();
}
async function genCreate(btn) {
  const P = GEN.preview || []; if (!P.length) return;
  const title = GEN.title.trim() || (GEN.target === 'test' ? 'Generated Test' : 'Generated Quiz') + ' — ' + fmtDate(nowISO());
  const chs = uniq(P.map(q => q.chapter)); const questions = P.map(q => ({ id: genId(), bankId: q.id, ...qCopy(q) }));
  const mc = +GEN.markCorrect || 4, mw = Math.max(0, +GEN.markWrong || 0);
  if (GEN.target === 'test' && GEN.end && GEN.start && GEN.end < GEN.start) return toast('"Available until" must be after "Available from".', 'err');
  const doc = GEN.target === 'test'
    ? { title, seriesId: GEN.seriesId, subject: 'Mathematics', start: GEN.start, end: GEN.end, duration: +GEN.duration || 30, markCorrect: mc, markWrong: mw, randomize: false, order: S.data.tests.filter(t => t.seriesId === GEN.seriesId).length + 1, instructions: `This test contains ${questions.length} objective Mathematics questions${chs.length <= 3 ? ' from ' + chs.join(', ') : ''}. Each correct answer carries +${mc} marks${mw ? ` and each wrong answer carries −${mw} mark${mw === 1 ? '' : 's'}` : ' and there is no negative marking'}. Unanswered questions carry 0 marks.\nMultiple-correct questions are awarded marks only if all correct options and no wrong options are selected.\nUse "Mark for Review" to revisit questions. Answers marked for review are evaluated.\nThe test is submitted automatically when the timer reaches zero.`, questions, generated: true }
    : { title, kind: GEN.kind, subject: 'Mathematics', chapter: chs.length === 1 ? chs[0] : 'Mixed', topic: chs.length === 1 ? (uniq(P.map(q => q.topic))[0] || '') : chs.slice(0, 3).join(', '), difficulty: GEN.difficulty, duration: +GEN.duration || 10, randomize: true, date: nowISO(), questions, generated: true };
  btn.disabled = true;
  try { await saveDoc(GEN.target === 'test' ? 'tests' : 'quizzes', genId(), doc); toast(`${GEN.target === 'test' ? 'Test' : 'Quiz'} “${title}” created with ${questions.length} questions.`); GEN.preview = null; GEN.title = ''; location.hash = GEN.target === 'test' ? 'admin-tests' : 'admin-quizzes'; }
  catch { btn.disabled = false; }
}

/* ===== Student: practice test generator ===== */
const PR = { chapters: new Set(), n: 10, diff: 'Any' };
Pages.practice = () => {
  const head = pageHead('Create a Practice Test', 'Pick the chapters you want to work on and get a fresh set of questions every time.', [['Quizzes', 'quizzes'], ['Practice Test']]);
  if (!S.loaded.bank) return head + `<div class="container page-body">${skeletonGrid(2, 'g2')}</div>`;
  if (!S.bank.length) return head + `<div class="container page-body">${emptyState('db', 'Practice tests are coming soon', 'Questions are being added. Meanwhile, try the ready-made quizzes.', '<a class="btn btn-primary" href="#quizzes">Browse quizzes</a>')}</div>`;
  const byCh = countBy(S.bank.filter(q => PR.diff === 'Any' || q.difficulty === PR.diff), q => q.chapter);
  const pool = S.bank.filter(q => (!PR.chapters.size || PR.chapters.has(q.chapter || 'Untagged')) && (PR.diff === 'Any' || q.difficulty === PR.diff));
  const n = Math.min(PR.n, pool.length);
  const past = myAttempts('practice').slice(-8).reverse();
  return head + `<div class="container page-body">${regNotice()}<div class="lec-layout"><div class="card card-pad" style="padding:30px">
    <h3 style="font-size:19px">1. Choose chapters</h3><p class="muted small mt8">Leave all unselected to practise everything.</p>
    <div class="chips mt16">${Object.entries(byCh).sort().map(([c, k]) => `<button class="chip ${PR.chapters.has(c) ? 'active' : ''}" data-act="pr-ch" data-v="${h(c)}">${PR.chapters.has(c) ? icon('check', 13) : ''} ${h(c)} <span class="muted">· ${k}</span></button>`).join('')}</div>
    <h3 class="mt32" style="font-size:19px">2. Set it up</h3>
    <div class="form-row mt16"><div class="field"><label>Number of questions</label><select class="select" data-pr="n">${[5, 10, 15, 20, 25, 30].map(x => `<option value="${x}" ${PR.n === x ? 'selected' : ''}>${x} questions</option>`).join('')}</select></div>
    <div class="field"><label>Difficulty</label><select class="select" data-pr="diff">${['Any', ...DIFFS].map(d => `<option value="${d}" ${PR.diff === d ? 'selected' : ''}>${d === 'Any' ? 'Mixed difficulty' : d}</option>`).join('')}</select></div></div>
    <div class="notice info">${icon('info', 18)}<div><b>${n} question${n === 1 ? '' : 's'} · ${Math.max(1, Math.ceil(n * 1.5))} minutes.</b> 1 mark each, no negative marking. Explanations for every question after you submit.${pool.length < PR.n ? ` Only ${pool.length} questions match your choice right now.` : ''}</div></div>
    <button class="btn btn-gold btn-lg mt24" data-act="pr-go" ${n ? '' : 'disabled'}>${icon('sparkle', 17)} Generate & start</button></div>
    <aside><div class="card"><div class="card-hd"><h3>Your practice history</h3></div>${past.length ? past.map(a => `<a class="list-row" href="#review-${h(a.id)}"><div class="grow"><b>${h(a.title)}</b><span>${fmtDT(a.at)}</span></div><b>${pct(a.score, a.max)}%</b></a>`).join('') : `<p class="muted small card-pad">${isRegistered() ? 'Your practice tests will appear here.' : 'Create your student profile to keep a history of practice tests.'}</p>`}</div>
    <div class="card card-pad mt16"><h3 style="font-size:16px">Tip</h3><p class="muted small mt8">Do short 10-question sets on your weakest chapter every day. Check your accuracy by chapter on the <a class="link" href="#results">Results</a> page.</p></div></aside></div></div>`;
};
function practiceGo() {
  const pool = S.bank.filter(q => (!PR.chapters.size || PR.chapters.has(q.chapter || 'Untagged')) && (PR.diff === 'Any' || q.difficulty === PR.diff));
  const picked = balancedPick(pool, PR.n); if (!picked.length) return toast('No questions match — choose other chapters.', 'err');
  const chs = [...PR.chapters];
  const label = !chs.length ? 'All chapters' : chs.length <= 2 ? chs.join(' & ') : chs.length + ' chapters';
  QuizEngine.start('practice', { id: 'practice', title: 'Practice · ' + label, kind: 'Practice', subject: 'Mathematics', chapter: chs.length === 1 ? chs[0] : 'Mixed', difficulty: PR.diff === 'Any' ? 'Moderate' : PR.diff, duration: Math.max(1, Math.ceil(picked.length * 1.5)), randomize: true, questions: picked.map(q => ({ id: q.id, ...qCopy(q) })) });
}

/* ===== Actions & inputs ===== */
const BANK_ACT = {
  'bq-new': () => bankEditor(null), 'bq-edit': el => bankEditor(el.dataset.id),
  'bq-del': async el => { const q = bankById(el.dataset.id); if (!q || !(await confirmBox('Delete this question?', 'It will be removed from the bank. Tests already created keep their copy.', 'Delete', true))) return; try { await deleteDoc('bank', q.id); BQ.sel.delete(q.id); toast('Question deleted'); } catch { } },
  'bq-sel': el => { el.checked ? BQ.sel.add(el.dataset.id) : BQ.sel.delete(el.dataset.id); App.render(); },
  'bq-sel-all': el => { const ids = $$('[data-act="bq-sel"]').map(x => x.dataset.id); ids.forEach(id => el.checked ? BQ.sel.add(id) : BQ.sel.delete(id)); App.render(); },
  'bq-del-sel': async () => { const ids = [...BQ.sel].filter(id => bankById(id)); if (!ids.length || !(await confirmBox(`Delete ${ids.length} questions?`, 'They will be removed from the bank. Tests already created keep their copies.', 'Delete', true))) return; let n = 0; for (const id of ids) { try { await deleteDoc('bank', id); BQ.sel.delete(id); n++; } catch { break; } } toast(n + ' questions deleted'); },
  'bq-more': () => { BQ.limit += 100; App.render(); },
  'bq-chip': el => { BQ.chapter = el.dataset.v; BQ.limit = 60; App.render(); },
  'bq-import': () => openImport(async (qs, def) => { await bulkAddToBank(qs.map(q => ({ ...qCopy(q), chapter: q.chapter || def.chapter || '', topic: q.topic || '', difficulty: q.difficulty || def.difficulty || 'Moderate', cls: q.cls || def.cls || '', source: 'Import' })), 'import'); }, { tags: true }),
  'bq-from-existing': async () => {
    const have = new Set(S.bank.map(b => normQ(b.text))); const items = [];
    for (const z of S.data.quizzes) for (const q of z.questions || []) if (!have.has(normQ(q.text))) { have.add(normQ(q.text)); items.push({ ...qCopy(q), chapter: z.chapter && z.chapter !== 'Mixed' ? z.chapter : '', topic: z.chapter && z.chapter !== 'Mixed' ? z.topic || '' : '', difficulty: DIFFS.includes(z.difficulty) ? z.difficulty : 'Moderate', cls: '', source: 'Quiz: ' + z.title }); }
    for (const t of S.data.tests) for (const q of t.questions || []) if (!have.has(normQ(q.text))) { have.add(normQ(q.text)); items.push({ ...qCopy(q), chapter: '', topic: '', difficulty: 'Moderate', cls: '', source: 'Test: ' + t.title }); }
    if (!items.length) return toast('Every quiz and test question is already in the bank.', 'info');
    if (!(await confirmBox(`Copy ${items.length} questions into the bank?`, 'Questions from tests have no chapter yet — they will show as "Untagged" so you can tag them.', 'Copy questions'))) return;
    await bulkAddToBank(items);
  },
  'gen-target': el => { GEN.target = el.dataset.v; GEN.duration = el.dataset.v === 'test' ? 30 : 10; App.render(); },
  'gen-ch': el => { const c = el.dataset.v; GEN.chapters.has(c) ? GEN.chapters.delete(c) : GEN.chapters.add(c); App.render(); },
  'gen-run': () => genRun(), 'gen-swap': el => genSwap(+el.dataset.i), 'gen-rm': el => { GEN.preview.splice(+el.dataset.i, 1); App.render(); }, 'gen-create': el => genCreate(el),
  'pr-ch': el => { const c = el.dataset.v; PR.chapters.has(c) ? PR.chapters.delete(c) : PR.chapters.add(c); App.render(); },
  'pr-go': () => practiceGo(),
};
function bankInput(el) {
  if (el.dataset.bq) { BQ[el.dataset.bq] = el.value; BQ.limit = 60; el.tagName === 'INPUT' ? rerenderSoon() : App.render(); return true; }
  if (el.dataset.gen) {
    const k = el.dataset.gen;
    if (k.startsWith('count-')) GEN.counts[k.slice(6)] = Math.max(0, Math.min(200, parseInt(el.value) || 0));
    else if (el.type === 'checkbox') GEN[k] = el.checked;
    else if (el.type === 'datetime-local') GEN[k] = el.value ? new Date(el.value).toISOString() : '';
    else if (el.type === 'number') GEN[k] = el.value === '' ? '' : +el.value;
    else GEN[k] = el.value;
    if (el.tagName === 'SELECT' || el.type === 'checkbox') App.render(); else if (k.startsWith('count-')) rerenderSoon();
    return true;
  }
  if (el.dataset.pr) { PR[el.dataset.pr] = el.dataset.pr === 'n' ? +el.value : el.value; App.render(); return true; }
  return false;
}
