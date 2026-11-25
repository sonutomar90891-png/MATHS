/* ===== Question bank, step-by-step test generator & student practice generator ===== */
const DIFFS = ['Easy', 'Moderate', 'Difficult'];
const EXAMS = () => (tax().exams && tax().exams.length ? tax().exams : ['JEE Main', 'JEE Advanced', 'MHT CET']);
const qSubj = q => q.subject || 'Mathematics';
const qCh = q => q.chapter || 'Untagged';
const qTp = q => q.topic || 'General';
const tpKey = q => qCh(q) + '||' + qTp(q);
const normQ = t => String(t || '').toLowerCase().replace(/\s+/g, ' ').trim();
const bankById = id => S.bank.find(b => b.id === id);
const allSubjects = () => uniq([...(tax().subjects || []), ...S.bank.map(qSubj)]);
const chaptersOf = subj => uniq([...((tax().chapters || {})[subj] || []), ...S.bank.filter(q => qSubj(q) === subj).map(q => q.chapter)]);
const bankChapters = () => uniq([...chapOpts(), ...S.bank.map(b => b.chapter)]);
const countBy = (list, f) => list.reduce((m, x) => { const k = f(x) || 'Untagged'; m[k] = (m[k] || 0) + 1; return m; }, {});
const qCopy = q => { const o = { text: q.text, options: q.options.slice(), answer: q.answer.slice(), explanation: q.explanation || '', type: q.type || (q.answer.length > 1 ? 'multi' : 'single') }; if (q.imageId) o.imageId = q.imageId; return o; };
const normExam = e => { e = String(e || '').trim(); return /adv/i.test(e) ? 'JEE Advanced' : /main/i.test(e) ? 'JEE Main' : /cet|mht/i.test(e) ? 'MHT CET' : e; };
function qImg(q) { return q && q.imageId ? `<img class="q-img" src="/_blob/${h(q.imageId)}" alt="Figure for this question" loading="lazy">` : ''; }

function ensureBank() {
  if (S.bankSub || !S.db) return; S.bankSub = true;
  const timer = setTimeout(() => { if (!S.loaded.bank) { S.loaded.bank = true; scheduleRender(); } }, 10000);
  S.db.collection('bank').onSnapshot(snap => { clearTimeout(timer); S.bank = snap.docs.map(d => ({ id: d.id, ...d.data() })); S.loaded.bank = true; scheduleRender(); },
    () => { clearTimeout(timer); S.loaded.bank = true; scheduleRender(); });
}
function usedBankIds() { const s = new Set(); for (const c of ['quizzes', 'tests']) for (const d of S.data[c]) for (const q of d.questions || []) if (q.bankId) s.add(q.bankId); return s; }
/* Round-robin across groups (chapters), optionally interleaving an inner key (topics); unused questions first */
function spreadPick(list, n, used, keyFn = qCh, exclude, inner) {
  const groups = {};
  for (const q of shuffle(list)) { if (exclude && exclude.has(q.id)) continue; const k = keyFn(q); (groups[k] = groups[k] || []).push(q); }
  for (const k in groups) { if (used) groups[k].sort((a, b) => (used.has(a.id) ? 1 : 0) - (used.has(b.id) ? 1 : 0)); if (inner) groups[k] = spreadPick(groups[k], groups[k].length, used, inner); }
  const keys = shuffle(Object.keys(groups)); const out = [];
  while (out.length < n && keys.some(k => groups[k].length)) for (const k of keys) { if (out.length >= n) break; const q = groups[k].shift(); if (q) out.push(q); }
  return out;
}
const balancedPick = (list, n, used, exclude) => spreadPick(list, n, used, qCh, exclude, qTp);
async function bulkAddToBank(items) {
  const have = new Set(S.bank.map(b => normQ(b.text))); let added = 0, skipped = 0;
  toast(`Adding ${items.length} questions…`, 'info');
  for (const it of items) {
    const k = normQ(it.text); if (!k || have.has(k)) { skipped++; continue; } have.add(k);
    try { await S.db.collection('bank').doc(genId()).set({ ...it, subject: it.subject || 'Mathematics', createdAt: nowISO() }); added++; }
    catch (e) { handleWriteErr(e, 'questions').catch(() => { }); break; }
  }
  toast(`${added} question${added === 1 ? '' : 's'} added to the bank${skipped ? ` · ${skipped} duplicate${skipped === 1 ? '' : 's'} skipped` : ''}.`);
  return added;
}

/* ===== Shared step-by-step selector (used by admin generator and student practice) ===== */
const newSel = () => ({ subject: 'Mathematics', exam: 'Any', chapters: new Set(), topics: new Set(), diffs: new Set(), n: 20, dist: 'balanced', per: {}, avoid: true });
const GEN = Object.assign(newSel(), { target: 'test', title: '', duration: 60, durTouched: false, markCorrect: 4, markWrong: 1, seriesId: '', start: '', end: '', kind: 'Chapter-wise', difficulty: 'Moderate', preview: null, short: 0 });
const PR = Object.assign(newSel(), { n: 10 });
const TG = { gen: GEN, pr: PR };
function tgPool(st, skip = {}) {
  return S.bank.filter(q => qSubj(q) === st.subject
    && (st.exam === 'Any' || !(q.exams && q.exams.length) || q.exams.includes(st.exam))
    && (skip.ch || !st.chapters.size || st.chapters.has(qCh(q)))
    && (skip.tp || !st.topics.size || st.topics.has(tpKey(q)))
    && (skip.df || !st.diffs.size || st.diffs.has(q.difficulty)));
}
function tgChapterList(st) { if (st.chapters.size) return [...st.chapters]; const c = countBy(tgPool(st, { ch: true }), qCh); return Object.keys(c).sort(); }
function tgWant(st) { return st.dist === 'custom' ? tgChapterList(st).reduce((s, c) => s + Math.max(0, +st.per[c] || 0), 0) : Math.max(0, +st.n || 0); }
function tgPick(st, used) {
  const pool = tgPool(st); let qs = [];
  if (st.dist === 'custom') for (const c of tgChapterList(st)) qs = qs.concat(spreadPick(pool.filter(q => qCh(q) === c), Math.max(0, +st.per[c] || 0), used, qTp));
  else if (st.dist === 'random') qs = spreadPick(pool, tgWant(st), used, () => 'all');
  else qs = balancedPick(pool, tgWant(st), used);
  return qs;
}
const EXAM_RATE = (exam, subj) => ({ 'JEE Main': 2.4, 'JEE Advanced': 3, 'MHT CET': subj === 'Mathematics' ? 1.8 : 0.9 }[exam] || 2);
function examPreset(st) { if (st.exam === 'JEE Main') return [4, 1]; if (st.exam === 'JEE Advanced') return [3, 1]; if (st.exam === 'MHT CET') return [st.subject === 'Mathematics' ? 2 : 1, 0]; return [4, 1]; }
function tgForm(st, ns) {
  const chip = (act, v, on, label, n, extra = '') => `<button class="chip ${on ? 'active' : ''}" data-act="${act}" data-ns="${ns}" data-v="${h(v)}" ${extra}>${on ? icon('check', 13) : ''} ${h(label)}${n != null ? ` <span class="${on ? '' : 'muted'}" style="opacity:.75">· ${n}</span>` : ''}</button>`;
  const step = (num, title, hint, body) => `<div class="tg-step"><div class="tg-num">${num}</div><div class="grow" style="min-width:0"><h4>${title}${hint ? ` <span class="muted small" style="font-weight:500">${hint}</span>` : ''}</h4><div class="mt12">${body}</div></div></div>`;
  const subjC = countBy(S.bank, qSubj);
  const inSubj = S.bank.filter(q => qSubj(q) === st.subject);
  const examC = n => n === 'Any' ? inSubj.length : inSubj.filter(q => !(q.exams && q.exams.length) || q.exams.includes(n)).length;
  const chC = countBy(tgPool(st, { ch: true, tp: true }), qCh);
  const chapters = [...chaptersOf(st.subject).filter(c => chC[c]), ...Object.keys(chC).filter(c => !chaptersOf(st.subject).includes(c))];
  const tpPool = tgPool(st, { tp: true }); const tpC = countBy(tpPool, tpKey);
  const dfC = countBy(tgPool(st, { df: true }), q => q.difficulty);
  const avail = tgPool(st).length; const want = tgWant(st);
  const allOn = chapters.length && chapters.every(c => st.chapters.has(c));
  const topicsHTML = !st.chapters.size ? `<p class="muted small">Select chapters above to narrow by sub-topic. Leave empty to include every sub-topic.</p>`
    : [...st.chapters].map(c => { const tps = Object.keys(tpC).filter(k => k.startsWith(c + '||')).sort(); return tps.length ? `<div class="mb16"><div class="small" style="font-weight:600;margin-bottom:8px">${h(c)}</div><div class="chips">${tps.map(k => chip('tg-tp', k, st.topics.has(k), k.split('||')[1], tpC[k])).join('')}</div></div>` : ''; }).join('') + `<p class="muted small">None selected = all sub-topics of the chosen chapters.</p>`;
  const perHTML = st.dist === 'custom' ? `<div class="mt16" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px">${tgChapterList(st).map((c, i) => `<label class="kpi" style="display:flex;align-items:center;gap:10px;padding:10px 12px"><span class="grow small" style="font-weight:600">${h(c)}<br><span class="muted" style="font-weight:400">${countBy(tgPool(st), qCh)[c] || 0} available</span></span><input class="input" style="width:72px;height:38px" type="number" min="0" id="${ns}-per-${i}" data-tg="per" data-ns="${ns}" data-ch="${h(c)}" value="${h(st.per[c] || 0)}"></label>`).join('')}</div>` : '';
  return `<div class="tg">
    ${step(1, 'Subject', '', `<div class="chips">${allSubjects().map(s => chip('tg-subj', s, st.subject === s, s, subjC[s] || 0)).join('')}</div>`)}
    ${step(2, 'Exam', '', `<div class="chips">${['Any', ...EXAMS()].map(e => chip('tg-exam', e, st.exam === e, e === 'Any' ? 'Any exam' : e, examC(e))).join('')}</div>`)}
    ${step(3, 'Chapters', '(pick one or many)', chapters.length ? `<div class="chips">${chapters.map(c => chip('tg-ch', c, st.chapters.has(c), c, chC[c])).join('')}<button class="chip" data-act="tg-ch-all" data-ns="${ns}">${allOn ? 'Clear all' : 'Select all'}</button></div>${st.chapters.size ? `<p class="small mt12"><b>${st.chapters.size}</b> chapter${st.chapters.size === 1 ? '' : 's'} selected</p>` : `<p class="muted small mt12">None selected = all chapters.</p>`}` : `<p class="muted small">No questions for ${h(st.subject)}${st.exam !== 'Any' ? ' · ' + h(st.exam) : ''} yet.</p>`)}
    ${step(4, 'Sub-topics', '(optional)', topicsHTML)}
    ${step(5, 'Difficulty', '(pick one or more)', `<div class="chips">${DIFFS.map(d => chip('tg-diff', d, st.diffs.has(d), d, dfC[d] || 0)).join('')}</div><p class="muted small mt12">None selected = mixed difficulty.</p>`)}
    ${step(6, 'Number of questions', '', `<div class="flex wrap" style="gap:14px;align-items:flex-end">${st.dist === 'custom' ? `<div class="kpi" style="padding:10px 16px"><span>Total</span><b style="font-size:20px">${want}</b></div>` : `<div class="field" style="margin:0;width:130px"><label>Questions</label><input class="input" type="number" min="1" max="300" id="${ns}-n" data-tg="n" data-ns="${ns}" value="${h(st.n)}"></div>`}
      <div><div class="small muted mb16" style="margin-bottom:6px;font-weight:600">Spread across chapters</div><div class="seg">${[['balanced', 'Evenly'], ['random', 'Randomly'], ['custom', 'Set per chapter']].map(([k, l]) => `<button class="${st.dist === k ? 'active' : ''}" data-act="tg-dist" data-ns="${ns}" data-v="${k}">${l}</button>`).join('')}</div></div></div>${perHTML}
      <div class="notice ${want > avail ? 'warn' : 'info'} mt16">${icon(want > avail ? 'alert' : 'info', 18)}<div><b>${avail}</b> matching question${avail === 1 ? '' : 's'} in the bank.${want > avail ? ` You asked for ${want} — only ${avail} can be used. Widen your choices or add more questions.` : st.dist === 'balanced' ? ' Questions are shared out evenly across the chosen chapters and their sub-topics.' : st.dist === 'random' ? ' Questions are drawn at random, so some chapters may get more than others.' : ''}</div></div>`)}
  </div>`;
}

/* ===== Admin: Question Bank ===== */
const BQ = { q: '', subject: 'All', exam: 'All', chapter: 'All', diff: 'All', limit: 60, sel: new Set() };
AdminSec.bank = () => {
  if (!S.loaded.bank) return adminHead('Question Bank', 'Loading…') + skeletonGrid(3);
  const all = S.bank; const inSubj = all.filter(q => BQ.subject === 'All' || qSubj(q) === BQ.subject);
  const byCh = countBy(inSubj, qCh); const byD = countBy(all, q => q.difficulty); const bySub = countBy(all, qSubj);
  const list = inSubj.filter(q => (BQ.chapter === 'All' || qCh(q) === BQ.chapter) && (BQ.diff === 'All' || q.difficulty === BQ.diff) && (BQ.exam === 'All' || (q.exams || []).includes(BQ.exam) || (BQ.exam === 'Untagged' && !(q.exams || []).length)) && (!BQ.q || normQ(q.text + ' ' + (q.topic || '') + ' ' + (q.year || '')).includes(normQ(BQ.q))))
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  const shown = list.slice(0, BQ.limit); const nSel = [...BQ.sel].filter(id => bankById(id)).length;
  return adminHead('Question Bank', `${all.length} questions · ${Object.entries(bySub).map(([s, n]) => `${n} ${h(s)}`).join(' · ') || 'empty'}`,
    `<button class="btn btn-ghost" data-act="bq-from-existing">${icon('copy', 15)} Copy from quizzes & tests</button><button class="btn btn-ghost" data-act="bq-import">${icon('upload', 15)} Bulk import</button><button class="btn btn-primary" data-act="bq-new">${icon('plus', 15)} Add question</button>`) +
    `<div class="grid g4 mb24">${[['db', all.length, 'Total questions', 'var(--royal-50)', 'var(--royal)'], ['checkc', byD.Easy || 0, 'Easy', 'var(--green-50)', 'var(--green)'], ['target', byD.Moderate || 0, 'Moderate', 'var(--amber-50)', '#B57605'], ['fire', byD.Difficult || 0, 'Difficult', 'var(--red-50)', 'var(--red)']].map(([ic, n, l, bg, fg]) => `<div class="card mini-stat"><div class="ic" style="background:${bg};color:${fg}">${icon(ic, 22)}</div><div><b>${n}</b><span>${l}</span></div></div>`).join('')}</div>
    <div class="card card-pad mb24"><div class="flex between wrap mb16"><div class="seg">${['All', ...allSubjects()].map(s => `<button class="${BQ.subject === s ? 'active' : ''}" data-act="bq-subj" data-v="${h(s)}">${h(s)}${s !== 'All' ? ` · ${bySub[s] || 0}` : ''}</button>`).join('')}</div><a class="btn btn-sm btn-gold" href="#admin-generator">${icon('sparkle', 14)} Generate a test</a></div>
    <div class="chips"><button class="chip ${BQ.chapter === 'All' ? 'active' : ''}" data-act="bq-chip" data-v="All">All chapters · ${inSubj.length}</button>${Object.entries(byCh).sort((a, b) => b[1] - a[1]).map(([c, n]) => `<button class="chip ${BQ.chapter === c ? 'active' : ''}" data-act="bq-chip" data-v="${h(c)}">${h(c)} · ${n}</button>`).join('')}</div></div>
    <div class="toolbar"><div class="input-ic">${icon('search', 17)}<input class="input" id="bq-q" data-bq="q" placeholder="Search question text, topic or year…" value="${h(BQ.q)}"></div>
      <select class="select" data-bq="exam">${['All', ...EXAMS(), 'Untagged'].map(d => `<option value="${h(d)}" ${BQ.exam === d ? 'selected' : ''}>${d === 'All' ? 'All exams' : d === 'Untagged' ? 'No exam tag' : h(d)}</option>`).join('')}</select>
      <select class="select" data-bq="diff">${['All', ...DIFFS].map(d => `<option value="${d}" ${BQ.diff === d ? 'selected' : ''}>${d === 'All' ? 'All difficulties' : d}</option>`).join('')}</select>
      ${nSel ? `<button class="btn btn-danger" data-act="bq-del-sel">${icon('trash', 15)} Delete ${nSel} selected</button>` : ''}</div>
    ${list.length ? `<div class="table-wrap"><table class="t"><thead><tr><th style="width:36px"><input type="checkbox" data-act="bq-sel-all" ${shown.length && shown.every(q => BQ.sel.has(q.id)) ? 'checked' : ''} aria-label="Select all"></th><th>Question</th><th>Chapter</th><th>Exam</th><th>Level</th><th></th></tr></thead><tbody>
    ${shown.map(q => `<tr><td><input type="checkbox" data-act="bq-sel" data-id="${h(q.id)}" ${BQ.sel.has(q.id) ? 'checked' : ''} aria-label="Select"></td><td style="max-width:480px"><div style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-weight:500">${q.imageId ? icon('image', 14, 'style="vertical-align:-2px;color:var(--royal)"') + ' ' : ''}${h(q.text)}</div><div class="small muted">${h([qSubj(q), q.topic, q.type === 'multi' ? 'Multi-correct' : ''].filter(Boolean).join(' · '))}</div></td><td class="small">${h(qCh(q))}</td><td class="small">${(q.exams || []).length ? h(q.exams.join(', ')) : '<span class="muted">Any</span>'}${q.year ? `<br><span class="muted">${h(q.year)}</span>` : ''}</td><td>${diffBadge(q.difficulty)}</td><td><div class="acts"><button class="btn btn-sm btn-ghost btn-icon" data-act="bq-edit" data-id="${h(q.id)}" title="Edit">${icon('edit', 15)}</button><button class="btn btn-sm btn-danger btn-icon" data-act="bq-del" data-id="${h(q.id)}" title="Delete">${icon('trash', 15)}</button></div></td></tr>`).join('')}</tbody></table></div>
    ${list.length > shown.length ? `<div class="center mt16"><button class="btn btn-ghost" data-act="bq-more">Show more (${list.length - shown.length} remaining)</button></div>` : ''}`
      : emptyState('db', all.length ? 'No questions match' : 'Your question bank is empty', all.length ? 'Try a different subject, chapter, exam or search.' : 'Add questions one by one, import a CSV/Excel file, or copy the questions from your existing quizzes and tests.', `<button class="btn btn-primary" data-act="bq-new">${icon('plus', 15)} Add question</button>`)}
    <p class="small muted mt16">Tip: write maths in LaTeX between dollar signs, e.g. <code>$\\int_0^1 x^2\\,dx$</code> or <code>$\\frac{a}{b}$</code> — it is shown as proper notation to students.</p>`;
};
function bankEditor(id, preset = {}) {
  const q = id ? clone(bankById(id)) : { text: '', type: 'single', options: ['', '', '', ''], answer: [], explanation: '', subject: preset.subject || (BQ.subject !== 'All' ? BQ.subject : 'Mathematics'), exams: preset.exams || [], year: '', chapter: preset.chapter || (BQ.chapter !== 'All' ? BQ.chapter : ''), topic: preset.topic || '', difficulty: preset.difficulty || 'Moderate', cls: preset.cls || '', imageId: '' };
  if (!q) return; q.subject = qSubj(q);
  const optRow = (o, j, on) => `<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><input type="checkbox" name="ans" value="${j}" ${on ? 'checked' : ''} style="width:20px;height:20px;accent-color:var(--green)" aria-label="Correct"><b style="width:18px">${KEYS[j]}</b><input class="input" name="opt" value="${h(o)}" style="height:40px"></div>`;
  const chList = s => chaptersOf(s).map(c => `<option value="${h(c)}">`).join('');
  const m = openModal({
    title: id ? 'Edit question' : 'Add question to bank', size: 'wide',
    body: `<form autocomplete="off"><div class="field"><label>Question <span class="muted small">— use $…$ for maths, e.g. $x^2$, $\\sqrt{3}$</span></label><textarea class="textarea" name="text" rows="3">${h(q.text)}</textarea></div>
      <div class="field"><label>Figure / diagram (optional)</label>${S.assets ? `<label class="drop" style="padding:14px">${icon('image', 20)}<div class="mt8 small" data-imgname>${q.imageId ? 'Image attached — choose another to replace' : 'Click to add an image (PNG/JPG)'}</div><input type="file" accept="image/*" hidden data-img></label>${q.imageId ? `<img src="/_blob/${h(q.imageId)}" alt="" style="max-height:140px;margin-top:10px;border-radius:10px;border:1px solid var(--border)" data-imgprev><button type="button" class="btn btn-sm btn-ghost mt8" data-imgclear>Remove image</button>` : ''}` : '<p class="small muted">Image upload is available to editors.</p>'}<input type="hidden" name="imageId" value="${h(q.imageId || '')}"></div>
      <div class="form-row r3"><div class="field"><label>Subject</label><select class="select" name="subject">${allSubjects().map(s => `<option ${q.subject === s ? 'selected' : ''}>${h(s)}</option>`).join('')}</select></div><div class="field"><label>Chapter</label><input class="input" name="chapter" list="dl-bch" value="${h(q.chapter || '')}"><datalist id="dl-bch">${chList(q.subject)}</datalist></div><div class="field"><label>Sub-topic</label><input class="input" name="topic" value="${h(q.topic || '')}"></div></div>
      <div class="field"><label>Exams this question suits <span class="muted small">(none = all exams)</span></label><div class="flex wrap" style="gap:16px">${EXAMS().map(e => `<label class="check"><input type="checkbox" name="exams" value="${h(e)}" ${(q.exams || []).includes(e) ? 'checked' : ''}> ${h(e)}</label>`).join('')}</div></div>
      <div class="form-row r3"><div class="field"><label>Difficulty</label><select class="select" name="difficulty">${DIFFS.map(d => `<option ${q.difficulty === d ? 'selected' : ''}>${d}</option>`).join('')}</select></div><div class="field"><label>Year (for PYQs)</label><input class="input" name="year" value="${h(q.year || '')}" placeholder="e.g. 2023 Jan Shift 1"></div><div class="field"><label>Answer type</label><select class="select" name="type"><option value="single" ${q.type !== 'multi' ? 'selected' : ''}>Single correct</option><option value="multi" ${q.type === 'multi' ? 'selected' : ''}>Multiple correct</option></select></div></div>
      <label class="small muted" style="font-weight:600">Options — tick the correct answer(s)</label><div data-opts class="mt8">${q.options.map((o, j) => optRow(o, j, q.answer.includes(j))).join('')}</div>
      <button type="button" class="btn btn-sm btn-ghost mb16" data-more>${icon('plus', 14)} Add option</button>
      <div class="field"><label>Explanation / solution</label><textarea class="textarea" name="explanation" rows="3">${h(q.explanation || '')}</textarea></div></form>`,
    foot: `<button class="btn btn-ghost" data-c>Cancel</button>${id ? '' : `<button class="btn btn-ghost" data-s2>Save & add another</button>`}<button class="btn btn-primary" data-s>Save question</button>`
  });
  const f = m.querySelector('form');
  f.subject.onchange = () => { m.querySelector('#dl-bch').innerHTML = chList(f.subject.value); };
  m.querySelector('[data-more]').onclick = () => { const n = m.querySelectorAll('[name=opt]').length; if (n < 6) m.querySelector('[data-opts]').insertAdjacentHTML('beforeend', optRow('', n, false)); };
  const img = m.querySelector('[data-img]');
  if (img) img.onchange = async () => { const file = img.files[0]; if (!file) return; const lbl = m.querySelector('[data-imgname]'); lbl.textContent = 'Uploading…'; try { const r = await uploadAsset(file); f.imageId.value = r.id; lbl.textContent = file.name + ' uploaded'; } catch (e) { lbl.textContent = e.message; toast(e.message, 'err'); } };
  m.querySelector('[data-imgclear]')?.addEventListener('click', e => { f.imageId.value = ''; m.querySelector('[data-imgprev]')?.remove(); e.currentTarget.remove(); m.querySelector('[data-imgname]').textContent = 'Image removed — save to apply'; });
  m.querySelector('[data-c]').onclick = closeModal;
  const save = async again => {
    const opts = $$('[name=opt]', f).map(x => x.value.trim()); const ans = $$('[name=ans]:checked', f).map(x => +x.value);
    const keep = opts.map((o, j) => [o, j]).filter(([o]) => o); const map = {}; keep.forEach(([, j], n) => map[j] = n);
    const d = { text: f.text.value.trim(), type: f.type.value, options: keep.map(([o]) => o), answer: ans.filter(j => map[j] != null).map(j => map[j]), explanation: f.explanation.value.trim(), subject: f.subject.value, exams: $$('[name=exams]:checked', f).map(x => x.value), year: f.year.value.trim(), chapter: f.chapter.value.trim(), topic: f.topic.value.trim(), difficulty: f.difficulty.value, cls: q.cls || '', imageId: f.imageId.value };
    if (!d.text && !d.imageId) return toast('Write the question text.', 'err'); if (d.options.length < 2) return toast('Add at least two options.', 'err'); if (!d.answer.length) return toast('Tick the correct answer.', 'err');
    if (d.type === 'single' && d.answer.length > 1) return toast('Single-correct questions need exactly one answer — or switch to multiple correct.', 'err');
    if (!id && d.text && S.bank.some(b => normQ(b.text) === normQ(d.text))) return toast('This question is already in the bank.', 'err');
    d.createdAt = (id && bankById(id)?.createdAt) || nowISO(); if (id && bankById(id)?.source) d.source = bankById(id).source;
    try { await saveDoc('bank', id || genId(), d); closeModal(); toast('Question saved'); if (again) bankEditor(null, { subject: d.subject, exams: d.exams, chapter: d.chapter, topic: d.topic, difficulty: d.difficulty }); } catch { }
  };
  m.querySelector('[data-s]').onclick = () => save(false);
  m.querySelector('[data-s2]')?.addEventListener('click', () => save(true));
}

/* ===== Admin: Test Generator ===== */
AdminSec.generator = () => {
  if (!S.loaded.bank) return adminHead('Test Generator', 'Loading…') + skeletonGrid(2, 'g2');
  if (!S.bank.length) return adminHead('Test Generator', '') + emptyState('db', 'Add questions to the bank first', 'The generator builds tests from your question bank. Add or import questions, then come back here.', '<a class="btn btn-primary" href="#admin-bank">Open Question Bank</a>');
  if (!GEN.start) { GEN.start = new Date().toISOString(); GEN.end = new Date(Date.now() + 7 * 864e5).toISOString(); }
  const P = GEN.preview;
  const settings = `<div class="card card-pad mt16"><h3 style="font-size:16px" class="mb16">Test settings</h3>
    <div class="seg mb16">${[['test', 'Online test'], ['quiz', 'Quiz']].map(([k, l]) => `<button class="${GEN.target === k ? 'active' : ''}" data-act="gen-target" data-v="${k}">${l}</button>`).join('')}</div>
    <div class="field"><label>Title <span class="muted small">(optional — we'll name it for you)</span></label><input class="input" id="gen-title" data-gen="title" value="${h(GEN.title)}" placeholder="e.g. JEE Main Full Syllabus Test 1"></div>
    <div class="form-row"><div class="field"><label>Duration (minutes)</label><input class="input" type="number" min="1" id="gen-dur" data-gen="duration" value="${h(GEN.duration)}"><span class="hint">${GEN.durTouched ? 'Set by you' : 'Auto-set from the exam pattern when you generate'}</span></div>
    ${GEN.target === 'test' ? `<div class="field"><label>Test series</label><select class="select" data-gen="seriesId"><option value="">— standalone —</option>${S.data.series.map(s => `<option value="${h(s.id)}" ${GEN.seriesId === s.id ? 'selected' : ''}>${h(s.title)}</option>`).join('')}</select></div>` : `<div class="field"><label>Quiz type</label><select class="select" data-gen="kind">${['Daily', 'Chapter-wise', 'Topic-wise'].map(k => `<option ${GEN.kind === k ? 'selected' : ''}>${k}</option>`).join('')}</select></div>`}</div>
    ${GEN.target === 'test' ? `<div class="form-row"><div class="field"><label>Marks per correct</label><input class="input" type="number" step="any" id="gen-mc" data-gen="markCorrect" value="${h(GEN.markCorrect)}"></div><div class="field"><label>Negative marks per wrong</label><input class="input" type="number" step="any" min="0" id="gen-mw" data-gen="markWrong" value="${h(GEN.markWrong)}"><span class="hint">Preset from the exam; change if needed</span></div></div>
    <div class="form-row"><div class="field"><label>Available from</label><input class="input" type="datetime-local" data-gen="start" value="${h(toLocalDT(GEN.start))}"></div><div class="field"><label>Available until</label><input class="input" type="datetime-local" data-gen="end" value="${h(toLocalDT(GEN.end))}"></div></div>`
      : `<div class="field"><label>Difficulty label shown to students</label><select class="select" data-gen="difficulty">${DIFFS.map(d => `<option ${GEN.difficulty === d ? 'selected' : ''}>${d}</option>`).join('')}</select></div>`}
    <label class="check mb16"><input type="checkbox" data-gen="avoid" ${GEN.avoid ? 'checked' : ''}> Prefer questions not used in earlier tests and quizzes</label>
    <button class="btn btn-gold btn-block btn-lg" data-act="gen-run">${icon('sparkle', 17)} ${P ? 'Regenerate' : 'Generate'} ${tgWant(GEN)} questions</button></div>`;
  const byCh = P ? countBy(P, qCh) : {};
  const preview = P ? `<div class="card"><div class="card-hd"><h3>Preview · ${P.length} questions${GEN.target === 'test' ? ` · ${P.length * (+GEN.markCorrect || 4)} marks · ${h(GEN.duration)} min` : ''}</h3><div class="flex wrap">${Object.entries(countBy(P, q => q.difficulty)).map(([d, n]) => `<span class="badge ${DIFF[d] || ''}">${n} ${h(d)}</span>`).join('')}</div></div>
    <div class="card-pad" style="border-bottom:1px solid var(--border);padding-top:14px;padding-bottom:14px"><div class="small muted mb16" style="margin-bottom:8px;font-weight:600">Questions per chapter</div><div class="chips">${Object.entries(byCh).sort((a, b) => b[1] - a[1]).map(([c, n]) => `<span class="chip" style="cursor:default">${h(c)} <b>${n}</b></span>`).join('')}</div></div>
    ${GEN.short ? `<div class="notice warn" style="margin:16px 22px 0">${icon('alert', 16)}<div>Only ${P.length} matching questions were found, ${GEN.short} fewer than requested. Add more questions or widen your choices.</div></div>` : ''}
    <div style="max-height:720px;overflow-y:auto">${P.map((q, i) => `<div class="list-row" style="align-items:flex-start"><b class="muted small" style="width:26px;padding-top:2px">${i + 1}.</b><div class="grow"><div style="font-weight:500;white-space:pre-wrap">${h(q.text)}</div>${qImg(q)}<div class="flex wrap mt8" style="gap:6px"><span class="badge">${h(qCh(q))}</span>${q.topic ? `<span class="badge">${h(q.topic)}</span>` : ''}${diffBadge(q.difficulty)}${q.type === 'multi' ? '<span class="badge b-violet">Multi</span>' : ''}${q.year ? `<span class="badge b-gold">${h(q.year)}</span>` : ''}</div></div><div class="flex"><button class="btn btn-sm btn-ghost btn-icon" data-act="gen-swap" data-i="${i}" title="Swap for another question">${icon('shuffle', 14)}</button><button class="btn btn-sm btn-ghost btn-icon" data-act="gen-rm" data-i="${i}" title="Remove">${icon('x', 14)}</button></div></div>`).join('')}</div>
    <div class="card-pad" style="border-top:1px solid var(--border)"><button class="btn btn-primary btn-block btn-lg" data-act="gen-create" ${P.length ? '' : 'disabled'}>${icon('check', 17)} Create ${GEN.target === 'test' ? 'online test' : 'quiz'} with these ${P.length} questions</button></div></div>`
    : `<div class="empty"><div class="ic">${icon('sparkle', 28)}</div><h4>Your test will appear here</h4><p>Work through the steps on the left, then click Generate. You can swap or remove any question before creating the test.</p></div>`;
  return adminHead('Test Generator', `Build a test from ${S.bank.length} questions in your bank`, `<a class="btn btn-ghost" href="#admin-bank">${icon('db', 15)} Question Bank</a>`) + `<div class="grid" style="grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);align-items:start"><div><div class="card card-pad">${tgForm(GEN, 'gen')}</div>${settings}</div><div style="position:sticky;top:calc(var(--nav-h) + 16px)">${preview}</div></div>`;
};
function genRun() {
  const want = tgWant(GEN); if (!want) return toast('Choose how many questions you want.', 'err');
  const out = tgPick(GEN, GEN.avoid ? usedBankIds() : null);
  GEN.preview = out; GEN.short = want - out.length;
  if (!GEN.durTouched) GEN.duration = Math.max(5, Math.round(out.length * (GEN.target === 'quiz' ? 1.5 : EXAM_RATE(GEN.exam, GEN.subject))));
  App.render();
}
function genSwap(i) {
  const cur = GEN.preview[i]; const taken = new Set(GEN.preview.map(q => q.id));
  const pool = tgPool(GEN).filter(q => q.difficulty === cur.difficulty || !GEN.diffs.size);
  const tiers = [pool.filter(q => tpKey(q) === tpKey(cur) && q.difficulty === cur.difficulty), pool.filter(q => qCh(q) === qCh(cur)), pool];
  let pick; for (const t of tiers) { pick = spreadPick(t, 1, GEN.avoid ? usedBankIds() : null, () => 'x', taken)[0]; if (pick) break; }
  if (!pick) return toast('No other matching question in the bank.', 'info');
  GEN.preview[i] = pick; App.render();
}
async function genCreate(btn) {
  const P = GEN.preview || []; if (!P.length) return;
  const chs = uniq(P.map(qCh)); const exam = GEN.exam !== 'Any' ? GEN.exam + ' ' : '';
  const title = GEN.title.trim() || `${exam}${GEN.subject} ${GEN.target === 'test' ? 'Test' : 'Quiz'} — ${chs.length === 1 ? chs[0] : chs.length + ' chapters'} (${fmtDate(nowISO())})`;
  const questions = P.map(q => ({ id: genId(), bankId: q.id, ...qCopy(q) }));
  const mc = +GEN.markCorrect || 4, mw = Math.max(0, +GEN.markWrong || 0);
  if (GEN.target === 'test' && GEN.end && GEN.start && GEN.end < GEN.start) return toast('"Available until" must be after "Available from".', 'err');
  const doc = GEN.target === 'test'
    ? { title, seriesId: GEN.seriesId, subject: GEN.subject, exam: GEN.exam === 'Any' ? '' : GEN.exam, start: GEN.start, end: GEN.end, duration: +GEN.duration || 30, markCorrect: mc, markWrong: mw, randomize: false, order: S.data.tests.filter(t => t.seriesId === GEN.seriesId).length + 1, instructions: `This ${exam}${GEN.subject} test has ${questions.length} objective questions from ${chs.length <= 4 ? chs.join(', ') : chs.length + ' chapters'}. Each correct answer carries +${mc} mark${mc === 1 ? '' : 's'}${mw ? ` and each wrong answer carries −${mw} mark${mw === 1 ? '' : 's'}` : ' and there is no negative marking'}. Unanswered questions carry 0 marks.\nMultiple-correct questions are awarded marks only if all correct options and no wrong options are selected.\nUse "Mark for Review" to revisit questions. Answers marked for review are evaluated.\nThe test is submitted automatically when the timer reaches zero.`, questions, generated: true }
    : { title, kind: GEN.kind, subject: GEN.subject, chapter: chs.length === 1 ? chs[0] : 'Mixed', topic: chs.length === 1 ? (uniq(P.map(q => q.topic))[0] || '') : chs.slice(0, 3).join(', '), difficulty: GEN.difficulty, duration: +GEN.duration || 10, randomize: true, date: nowISO(), questions, generated: true };
  btn.disabled = true;
  try { await saveDoc(GEN.target === 'test' ? 'tests' : 'quizzes', genId(), doc); toast(`${GEN.target === 'test' ? 'Test' : 'Quiz'} “${title}” created with ${questions.length} questions.`); GEN.preview = null; GEN.title = ''; location.hash = GEN.target === 'test' ? 'admin-tests' : 'admin-quizzes'; }
  catch { btn.disabled = false; }
}

/* ===== Student: practice test generator ===== */
Pages.practice = () => {
  const head = pageHead('Create Your Own Test', 'Choose subject, exam, chapters, sub-topics and difficulty — get a fresh set of questions every time.', [['Create Test']]);
  if (!S.loaded.bank) return head + `<div class="container page-body">${skeletonGrid(2, 'g2')}</div>`;
  if (!S.bank.length) return head + `<div class="container page-body">${emptyState('db', 'Practice tests are coming soon', 'Questions are being added. Meanwhile, try the ready-made quizzes.', '<a class="btn btn-primary" href="#quizzes">Browse quizzes</a>')}</div>`;
  const avail = tgPool(PR).length; const n = Math.min(tgWant(PR), avail);
  const past = myAttempts('practice').slice(-8).reverse();
  return head + `<div class="container page-body">${regNotice()}<div class="lec-layout"><div class="card card-pad" style="padding:26px 30px">${tgForm(PR, 'pr')}
    <div class="notice info mt16">${icon('clock', 18)}<div><b>${n} question${n === 1 ? '' : 's'} · ${Math.max(1, Math.round(n * EXAM_RATE(PR.exam, PR.subject)))} minutes.</b> 1 mark each, no negative marking. Step-by-step solutions after you submit.</div></div>
    <button class="btn btn-gold btn-lg mt24" data-act="pr-go" ${n ? '' : 'disabled'}>${icon('sparkle', 17)} Generate & start</button></div>
    <aside><div class="card"><div class="card-hd"><h3>Your practice history</h3></div>${past.length ? past.map(a => `<a class="list-row" href="#review-${h(a.id)}"><div class="grow"><b>${h(a.title)}</b><span>${fmtDT(a.at)}</span></div><b>${pct(a.score, a.max)}%</b></a>`).join('') : `<p class="muted small card-pad">${isRegistered() ? 'Your practice tests will appear here.' : 'Create your student profile to keep a history of practice tests.'}</p>`}</div>
    <div class="card card-pad mt16"><h3 style="font-size:16px">Tip</h3><p class="muted small mt8">Do short 10-question sets on your weakest chapters every day, then a mixed full-length test at the weekend. Track accuracy by subject on the <a class="link" href="#results">Results</a> page.</p></div></aside></div></div>`;
};
function practiceGo() {
  const picked = tgPick(PR, null); if (!picked.length) return toast('No questions match — change your choices.', 'err');
  const chs = uniq(picked.map(qCh)); const exam = PR.exam !== 'Any' ? PR.exam + ' · ' : '';
  const label = chs.length <= 2 ? chs.join(' & ') : chs.length + ' chapters';
  QuizEngine.start('practice', { id: 'practice', title: `Practice · ${exam}${PR.subject} · ${label}`, kind: 'Practice', subject: PR.subject, chapter: chs.length === 1 ? chs[0] : 'Mixed', difficulty: PR.diffs.size === 1 ? [...PR.diffs][0] : 'Moderate', duration: Math.max(1, Math.round(picked.length * EXAM_RATE(PR.exam, PR.subject))), randomize: true, questions: picked.map(q => ({ id: q.id, ...qCopy(q) })) });
}

/* ===== Actions & inputs ===== */
const tgSt = el => TG[el.dataset.ns];
function tgPrune(st) { if (!st.chapters.size) { st.topics.clear(); return; } for (const k of [...st.topics]) if (!st.chapters.has(k.split('||')[0])) st.topics.delete(k); }
function tgAfterExam(st) { if (st !== GEN) return; const [mc, mw] = examPreset(st); GEN.markCorrect = mc; GEN.markWrong = mw; }
const BANK_ACT = {
  'tg-subj': el => { const st = tgSt(el); st.subject = el.dataset.v; st.chapters.clear(); st.topics.clear(); st.per = {}; if (st === GEN) GEN.preview = null; tgAfterExam(st); App.render(); },
  'tg-exam': el => { const st = tgSt(el); st.exam = el.dataset.v; tgAfterExam(st); App.render(); },
  'tg-ch': el => { const st = tgSt(el); const c = el.dataset.v; st.chapters.has(c) ? st.chapters.delete(c) : st.chapters.add(c); tgPrune(st); App.render(); },
  'tg-ch-all': el => { const st = tgSt(el); const chs = Object.keys(countBy(tgPool(st, { ch: true, tp: true }), qCh)); if (chs.every(c => st.chapters.has(c))) st.chapters.clear(); else chs.forEach(c => st.chapters.add(c)); tgPrune(st); App.render(); },
  'tg-tp': el => { const st = tgSt(el); const k = el.dataset.v; st.topics.has(k) ? st.topics.delete(k) : st.topics.add(k); App.render(); },
  'tg-diff': el => { const st = tgSt(el); const d = el.dataset.v; st.diffs.has(d) ? st.diffs.delete(d) : st.diffs.add(d); App.render(); },
  'tg-dist': el => { const st = tgSt(el); st.dist = el.dataset.v; if (st.dist === 'custom') { const chs = tgChapterList(st); const each = Math.max(1, Math.floor((+st.n || chs.length) / Math.max(1, chs.length))); chs.forEach(c => { if (st.per[c] == null) st.per[c] = each; }); } App.render(); },
  'bq-new': () => bankEditor(null), 'bq-edit': el => bankEditor(el.dataset.id),
  'bq-del': async el => { const q = bankById(el.dataset.id); if (!q || !(await confirmBox('Delete this question?', 'It will be removed from the bank. Tests already created keep their copy.', 'Delete', true))) return; try { await deleteDoc('bank', q.id); BQ.sel.delete(q.id); toast('Question deleted'); } catch { } },
  'bq-sel': el => { el.checked ? BQ.sel.add(el.dataset.id) : BQ.sel.delete(el.dataset.id); App.render(); },
  'bq-sel-all': el => { const ids = $$('[data-act="bq-sel"]').map(x => x.dataset.id); ids.forEach(id => el.checked ? BQ.sel.add(id) : BQ.sel.delete(id)); App.render(); },
  'bq-del-sel': async () => { const ids = [...BQ.sel].filter(id => bankById(id)); if (!ids.length || !(await confirmBox(`Delete ${ids.length} questions?`, 'They will be removed from the bank. Tests already created keep their copies.', 'Delete', true))) return; let n = 0; for (const id of ids) { try { await deleteDoc('bank', id); BQ.sel.delete(id); n++; } catch { break; } } toast(n + ' questions deleted'); },
  'bq-more': () => { BQ.limit += 100; App.render(); },
  'bq-chip': el => { BQ.chapter = el.dataset.v; BQ.limit = 60; App.render(); },
  'bq-subj': el => { BQ.subject = el.dataset.v; BQ.chapter = 'All'; BQ.limit = 60; App.render(); },
  'bq-import': () => openImport(async (qs, def) => { await bulkAddToBank(qs.map(q => ({ ...qCopy(q), subject: q.subject || def.subject || 'Mathematics', exams: (q.exams && q.exams.length) ? q.exams : (def.exam ? [def.exam] : []), year: q.year || '', chapter: q.chapter || def.chapter || '', topic: q.topic || '', difficulty: q.difficulty || def.difficulty || 'Moderate', cls: q.cls || def.cls || '', source: 'Import' }))); }, { tags: true }),
  'bq-from-existing': async () => {
    const have = new Set(S.bank.map(b => normQ(b.text))); const items = [];
    for (const z of S.data.quizzes) for (const q of z.questions || []) if (!have.has(normQ(q.text))) { have.add(normQ(q.text)); items.push({ ...qCopy(q), subject: z.subject || 'Mathematics', chapter: z.chapter && z.chapter !== 'Mixed' ? z.chapter : '', topic: z.chapter && z.chapter !== 'Mixed' ? z.topic || '' : '', difficulty: DIFFS.includes(z.difficulty) ? z.difficulty : 'Moderate', exams: [], cls: '', source: 'Quiz: ' + z.title }); }
    for (const t of S.data.tests) for (const q of t.questions || []) if (!have.has(normQ(q.text))) { have.add(normQ(q.text)); items.push({ ...qCopy(q), subject: ['Physics', 'Chemistry', 'Mathematics'].includes(t.subject) ? t.subject : 'Mathematics', chapter: '', topic: '', difficulty: 'Moderate', exams: t.exam ? [t.exam] : [], cls: '', source: 'Test: ' + t.title }); }
    if (!items.length) return toast('Every quiz and test question is already in the bank.', 'info');
    if (!(await confirmBox(`Copy ${items.length} questions into the bank?`, 'Questions from tests have no chapter yet — they will show as "Untagged" so you can tag them.', 'Copy questions'))) return;
    await bulkAddToBank(items);
  },
  'gen-target': el => { GEN.target = el.dataset.v; GEN.durTouched = false; GEN.duration = el.dataset.v === 'test' ? 60 : 15; App.render(); },
  'gen-run': () => genRun(), 'gen-swap': el => genSwap(+el.dataset.i), 'gen-rm': el => { GEN.preview.splice(+el.dataset.i, 1); App.render(); }, 'gen-create': el => genCreate(el),
  'pr-go': () => practiceGo(),
};
function bankInput(el) {
  if (el.dataset.bq) { BQ[el.dataset.bq] = el.value; BQ.limit = 60; el.tagName === 'INPUT' ? rerenderSoon() : App.render(); return true; }
  if (el.dataset.tg) {
    const st = tgSt(el); const v = Math.max(0, Math.min(300, parseInt(el.value) || 0));
    if (el.dataset.tg === 'per') st.per[el.dataset.ch] = v; else st.n = v;
    rerenderSoon(); return true;
  }
  if (el.dataset.gen) {
    const k = el.dataset.gen;
    if (el.type === 'checkbox') GEN[k] = el.checked;
    else if (el.type === 'datetime-local') GEN[k] = el.value ? new Date(el.value).toISOString() : '';
    else if (el.type === 'number') GEN[k] = el.value === '' ? '' : +el.value;
    else GEN[k] = el.value;
    if (k === 'duration') GEN.durTouched = true;
    if (el.tagName === 'SELECT' || el.type === 'checkbox') App.render();
    return true;
  }
  return false;
}
