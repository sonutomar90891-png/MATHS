/* ===== Quizzes, tests, series, assignments, results ===== */
const QZ = { run: null };
const EX = { run: null };
const KEYS = 'ABCDEFGH';
const isCorrect = (q, sel) => { const a = (q.answer || []).slice().sort().join(','), b = (sel || []).slice().sort().join(','); return !!b && a === b; };
function evaluate(questions, answers, mc = 1, mw = 0) {
  let correct = 0, wrong = 0, skipped = 0;
  for (const q of questions) { const s = answers[q.id]; if (!s || !s.length) skipped++; else if (isCorrect(q, s)) correct++; else wrong++; }
  return { correct, wrong, skipped, score: correct * mc - wrong * mw, max: questions.length * mc };
}
function bookmarkBtn(kind, refId, q) {
  const key = refId + ':' + q.id; const on = myState().bookmarks.some(b => b.key === key);
  return `<button class="btn btn-sm ${on ? 'btn-soft' : 'btn-ghost'}" data-act="bm-q" data-kind="${kind}" data-ref="${h(refId)}" data-q="${h(q.id)}">${icon(on ? 'bookmarkf' : 'bookmark', 14)} ${on ? 'Bookmarked' : 'Bookmark'}</button>`;
}
function reviewList(questions, answers, kind, refId) {
  return questions.map((q, i) => {
    const sel = answers[q.id] || []; const ok = isCorrect(q, sel); const skip = !sel.length;
    return `<div class="card q-card mt16"><div class="q-num flex between"><span>Question ${i + 1} ${q.type === 'multi' ? '<span class="badge b-violet">Multiple correct</span>' : ''}</span><span class="flex">${skip ? '<span class="badge">Not answered</span>' : ok ? `<span class="badge b-green">${icon('check', 12)} Correct</span>` : `<span class="badge b-red">${icon('x', 12)} Incorrect</span>`}${bookmarkBtn(kind, refId, q)}</span></div>
      <div class="q-text">${h(q.text)}</div>${qImg(q)}<div class="opts">${q.options.map((o, j) => { const right = q.answer.includes(j), picked = sel.includes(j); return `<div class="opt ${q.type === 'multi' ? 'multi' : ''} ${right ? 'right' : picked ? 'wrong' : ''}" disabled><span class="k">${right ? icon('check', 15) : picked ? icon('x', 15) : KEYS[j]}</span><span class="grow">${h(o)}</span>${picked ? '<span class="badge">Your answer</span>' : ''}</div>`; }).join('')}</div>
      ${q.explanation ? `<div class="explain"><b>${icon('bulb', 15)} Explanation</b><div class="mt8">${h(q.explanation)}</div></div>` : ''}</div>`;
  }).join('');
}
function resultHero(r, label, extra = '') {
  const p = pct(Math.max(0, r.score), r.max);
  return `<div class="card result-hero">${ring(p, 150, label, p >= 75 ? '#14A06B' : p >= 40 ? '#2952E3' : '#E0475A')}<div><h2 style="font-size:26px">${p >= 75 ? 'Excellent work!' : p >= 40 ? 'Good effort — keep going!' : 'Keep practising — you\'ll get there!'}</h2><p class="muted mt8">You scored <b style="color:var(--text)">${r.score} / ${r.max}</b> in ${fmtSecs(r.time)}.</p>
    <div class="kpis mt24"><div class="kpi"><b style="color:var(--green)">${r.correct}</b><span>Correct</span></div><div class="kpi"><b style="color:var(--red)">${r.wrong}</b><span>Incorrect</span></div><div class="kpi"><b>${r.skipped}</b><span>Skipped</span></div><div class="kpi"><b>${pct(r.correct, r.correct + r.wrong)}%</b><span>Accuracy</span></div></div>${extra}</div></div>`;
}
function leaderTable(rows, unit = '%') {
  if (!rows.length) return `<p class="muted small card-pad">No attempts yet — be the first on the board.</p>`;
  return `<div class="table-wrap" style="border:0;border-radius:0"><table class="t"><thead><tr><th>#</th><th>Student</th><th>Score</th><th>Time</th></tr></thead><tbody>${rows.slice(0, 10).map((r, i) => `<tr ${r.uid === S.uid ? 'style="background:var(--royal-50)"' : ''}><td class="${i === 0 ? 'rank-1' : ''}">${i === 0 ? icon('trophy', 15) : i + 1}</td><td><div class="flex"><span class="avatar" style="width:28px;height:28px;font-size:11px">${h(initials(r.name))}</span>${h(r.name || 'Student')}${r.uid === S.uid ? ' <span class="badge b-royal">You</span>' : ''}</div></td><td><b>${unit === '%' ? Math.round(r.p * 100) + '%' : h(r.score)}</b></td><td class="muted">${fmtSecs(r.time)}</td></tr>`).join('')}</tbody></table></div>`;
}
const regNotice = () => isRegistered() ? '' : `<div class="notice info mb24">${icon('info', 18)}<div>You're practising as a guest. <a class="link" href="#login">Create your student profile</a> to save scores, appear on leaderboards and track progress.</div></div>`;

Object.assign(Pages, {
  quizzes() {
    const f = F.quizzes; const all = S.data.quizzes;
    const subjects = ['All', ...uniq(all.map(q => q.subject))];
    const list = all.filter(q => (f.kind === 'All' || q.kind === f.kind) && (f.subject === 'All' || q.subject === f.subject) && (f.diff === 'All' || q.difficulty === f.diff) && (!f.q || [q.title, q.chapter, q.topic].join(' ').toLowerCase().includes(f.q.toLowerCase()))).sort(byDate);
    const lb = leaderboard('quiz');
    return pageHead('Quizzes', 'Daily, chapter-wise and topic-wise MCQ practice with instant scoring and detailed explanations.', [['Quizzes']]) + `<div class="container page-body">
      <div class="toolbar"><div class="input-ic">${icon('search', 17)}<input class="input" id="f-qz-q" data-filter="quizzes.q" placeholder="Search quizzes…" value="${h(f.q)}"></div>
      ${subjects.length > 2 ? `<select class="select" data-filter="quizzes.subject">${subjects.map(s => `<option ${f.subject === s ? 'selected' : ''}>${h(s)}</option>`).join('')}</select>` : ''}
      <select class="select" data-filter="quizzes.diff">${['All', 'Easy', 'Moderate', 'Difficult'].map(s => `<option value="${s}" ${f.diff === s ? 'selected' : ''}>${s === 'All' ? 'All levels' : s}</option>`).join('')}</select></div>
      <div class="chips mb24">${['All', 'Daily', 'Chapter-wise', 'Topic-wise'].map(k => `<button class="chip ${f.kind === k ? 'active' : ''}" data-act="filter" data-k="quizzes.kind" data-v="${k}">${k}</button>`).join('')}</div>
      <div class="lec-layout"><div>${!ready('quizzes') ? skeletonGrid(4, 'g2') : list.length ? `<div class="grid g2">${list.map(quizCard).join('')}</div>` : emptyState('quiz', 'No quizzes found', 'Try another filter.', `<button class="btn btn-ghost" data-act="clear-filters" data-k="quizzes">Clear filters</button>`)}</div>
      <aside><div class="card"><div class="card-hd"><h3>${icon('trophy', 17)} Overall leaderboard</h3></div>${overallBoard()}</div>
      <div class="card mt16"><div class="card-hd"><h3>Your quiz history</h3></div>${myAttempts('quiz').slice(-6).reverse().map(a => `<a class="list-row" href="#review-${h(a.id)}"><div class="grow"><b>${h(a.title)}</b><span>${ago(a.at)}</span></div><b>${pct(a.score, a.max)}%</b></a>`).join('') || '<p class="muted small card-pad">Your attempts will appear here.</p>'}</div></aside></div></div>`;
  },

  quiz(id) {
    const run = QZ.run && QZ.run.quizId === id ? QZ.run : null;
    const qz = byId('quizzes', id) || (run && run.quiz); if (!qz) return id === 'practice' ? Pages.practice() : notFound('Quiz');
    const isPr = qz.kind === 'Practice';
    const head = pageHead(qz.title, '', isPr ? [['Practice Test', 'practice'], ['Practice']] : [['Quizzes', 'quizzes'], [qz.title]]);
    if (!run) {
      const hist = myAttempts('quiz', id).slice().reverse();
      return head + `<div class="container page-body">${regNotice()}<div class="lec-layout"><div class="card card-pad" style="padding:32px">
        <div class="flex wrap">${subjBadge(qz.subject)}<span class="badge b-royal">${h(qz.kind)}</span>${diffBadge(qz.difficulty)}</div>
        <h2 class="mt16" style="font-size:26px">${h(qz.title)}</h2><p class="muted mt8">${h([qz.chapter, qz.topic].filter(Boolean).join(' · '))}</p>
        <div class="kpis mt24"><div class="kpi"><b>${(qz.questions || []).length}</b><span>Questions</span></div><div class="kpi"><b>${h(qz.duration)} min</b><span>Time limit</span></div><div class="kpi"><b>${(qz.questions || []).filter(q => q.type === 'multi').length}</b><span>Multi-correct</span></div><div class="kpi"><b>${hist.length}</b><span>Your attempts</span></div></div>
        <div class="notice info mt24">${icon('info', 18)}<div>Each correct answer earns 1 mark — no negative marking. ${qz.randomize !== false ? 'Questions and options are shuffled on every attempt. ' : ''}Multiple-correct questions need every right option selected. The quiz submits automatically when time runs out.</div></div>
        <button class="btn btn-primary btn-lg mt24" data-act="quiz-start" data-id="${h(id)}" ${(qz.questions || []).length ? '' : 'disabled'}>${icon('play', 16)} Start quiz</button></div>
        <aside><div class="card"><div class="card-hd"><h3>${icon('trophy', 17)} Leaderboard</h3></div>${leaderTable(leaderboard('quiz', id))}</div>
        <div class="card mt16"><div class="card-hd"><h3>Your attempts</h3></div>${hist.map(a => `<a class="list-row" href="#review-${h(a.id)}"><div class="grow"><b>${a.score}/${a.max} · ${pct(a.score, a.max)}%</b><span>${fmtDT(a.at)} · ${fmtSecs(a.time)}</span></div><span class="link small">Review</span></a>`).join('') || '<p class="muted small card-pad">No attempts yet.</p>'}</div></aside></div></div>`;
    }
    if (run.result) {
      const r = run.result;
      return head + `<div class="container page-body"><div class="quiz-shell">${regNotice()}${resultHero(r, 'Score', `<div class="flex wrap mt24">${isPr ? `<a class="btn btn-primary" href="#practice">${icon('sparkle', 15)} New practice test</a>` : `<button class="btn btn-primary" data-act="quiz-start" data-id="${h(id)}">${icon('refresh', 15)} Retry quiz</button>`}<a class="btn btn-ghost" href="#quizzes">More quizzes</a><a class="btn btn-ghost" href="#results">My performance</a></div>`)}
        <h3 class="mt32">Answer analysis</h3>${reviewList(run.qs, run.answers, isPr ? 'practice' : 'quiz', id)}</div></div>`;
    }
    const q = run.qs[run.cur]; const sel = run.answers[q.id] || []; const answered = Object.values(run.answers).filter(a => a && a.length).length;
    return head + `<div class="container page-body"><div class="quiz-shell">
      <div class="q-top"><div><b>Question ${run.cur + 1}</b> <span class="muted">of ${run.qs.length}</span></div><div class="flex"><span class="muted small">${answered} answered</span><span class="timer" id="qz-timer">${icon('clock', 17)} <span>${fmtSecs((run.end - Date.now()) / 1000)}</span></span></div></div>
      <div class="progress mb24"><i style="width:${(run.cur + 1) / run.qs.length * 100}%"></i></div>
      <div class="card q-card"><div class="q-num">${h(qz.subject)} · ${q.type === 'multi' ? '<span class="badge b-violet">Select all that apply</span>' : '<span class="badge">Single correct</span>'}</div>
        <div class="q-text">${h(q.text)}</div>${qImg(q)}
        <div class="opts">${run.optOrder[q.id].map(j => `<button class="opt ${q.type === 'multi' ? 'multi' : ''} ${sel.includes(j) ? 'sel' : ''}" data-act="quiz-pick" data-j="${j}"><span class="k">${q.type === 'multi' && sel.includes(j) ? icon('check', 15) : KEYS[run.optOrder[q.id].indexOf(j)]}</span><span>${h(q.options[j])}</span></button>`).join('')}</div>
        <div class="q-nav"><button class="btn btn-ghost" data-act="quiz-nav" data-d="-1" ${run.cur === 0 ? 'disabled' : ''}>${icon('left', 16)} Previous</button>
        ${run.cur < run.qs.length - 1 ? `<button class="btn btn-primary" data-act="quiz-nav" data-d="1">Next ${icon('right', 16)}</button>` : `<button class="btn btn-gold" data-act="quiz-submit">${icon('check', 16)} Submit quiz</button>`}</div></div>
      <div class="flex wrap mt24" style="gap:8px">${run.qs.map((x, i) => `<button class="pal ${i === run.cur ? 'cur' : ''} ${(run.answers[x.id] || []).length ? 'ans' : ''}" style="width:40px" data-act="quiz-go" data-i="${i}">${i + 1}</button>`).join('')}<button class="btn btn-sm btn-ghost" style="margin-left:auto" data-act="quiz-submit">Submit now</button></div>
    </div></div>`;
  },

  review(attemptId) {
    const r = myResult(); const a = (r?.attempts || []).find(x => x.id === attemptId);
    if (!a) return notFound('Attempt');
    if (a.kind === 'practice') {
      ensureBank(); const ids = a.qids || Object.keys(a.answers || {});
      const pq = ids.map(id => S.bank.find(b => b.id === id)).filter(Boolean);
      const hd = pageHead('Review: ' + a.title, fmtDT(a.at), [['Practice Test', 'practice'], ['Review']]);
      if (!S.loaded.bank) return hd + `<div class="container page-body">${skeletonGrid(1, 'g2')}</div>`;
      return hd + `<div class="container page-body"><div class="quiz-shell">${resultHero(a, 'Score', `<div class="mt16"><a class="btn btn-primary" href="#practice">${icon('sparkle', 15)} New practice test</a></div>`)}<h3 class="mt32">Detailed solutions</h3>${pq.length ? reviewList(pq, a.answers || {}, 'practice', 'practice') : '<p class="muted mt16">These questions have since been removed from the question bank.</p>'}</div></div>`;
    }
    const src = byId(a.kind === 'test' ? 'tests' : 'quizzes', a.refId);
    if (!src) return pageHead('Attempt review', '', [['Results', 'results'], ['Review']]) + `<div class="container page-body">${emptyState('alert', 'The original ' + a.kind + ' was removed', 'Your score is still saved in your history, but the questions are no longer available.')}</div>`;
    const qs = (src.questions || []).filter(q => a.answers && Object.prototype.hasOwnProperty.call(a.answers, q.id) || true);
    let extra = '';
    if (a.kind === 'test') { const rk = rankFor(a.refId, S.uid); if (rk && !a.practice) extra = `<div class="flex wrap mt16"><span class="badge b-gold">${icon('trophy', 12)} Rank ${rk.rank} of ${rk.of}</span><span class="badge b-royal">Percentile ${rk.percentile}</span></div>`; if (a.practice) extra = '<div class="mt16"><span class="badge">Practice attempt — not ranked</span></div>'; }
    return pageHead('Review: ' + a.title, fmtDT(a.at), [['Results', 'results'], ['Review']]) + `<div class="container page-body"><div class="quiz-shell">${resultHero(a, 'Score', extra)}<h3 class="mt32">Detailed solutions</h3>${reviewList(qs, a.answers || {}, a.kind, a.refId)}</div></div>`;
  },

  tests() {
    const groups = { active: [], upcoming: [], completed: [] };
    S.data.tests.forEach(t => groups[testStatus(t)].push(t));
    groups.upcoming.sort((a, b) => (a.start || '').localeCompare(b.start || ''));
    const sec = (k, title, ic) => `<h3 class="mt32 mb16 flex">${icon(ic, 20)} ${title} <span class="badge">${groups[k].length}</span></h3>${groups[k].length ? `<div class="grid g3">${groups[k].map(testCard).join('')}</div>` : `<p class="muted">No ${k} tests right now.</p>`}`;
    return pageHead('Online Tests', 'Exam-grade timed tests with a question palette, mark-for-review, negative marking and instant results.', [['Online Tests']]) + `<div class="container page-body">${regNotice()}
      ${!ready('tests') ? skeletonGrid(3) : S.data.tests.length ? sec('active', 'Live tests', 'zap') + sec('upcoming', 'Upcoming tests', 'clock') + sec('completed', 'Completed tests', 'checkc') : emptyState('test', 'No tests yet', 'Tests created by the teacher will appear here.')}</div>`;
  },

  test(id) {
    const t = byId('tests', id); if (!t) return notFound('Test');
    const st = testStatus(t); const sr = byId('series', t.seriesId); const mine = myAttempts('test', id);
    const ranked = mine.find(a => !a.practice); const rk = rankFor(id, S.uid);
    const mc = +t.markCorrect || 4, mw = +t.markWrong || 0, n = (t.questions || []).length;
    const canStart = n && (st === 'active' ? !ranked : st === 'completed');
    return pageHead(t.title, sr ? sr.title : '', [['Online Tests', 'tests'], ...(sr ? [[sr.title, 'series-' + sr.id]] : []), [t.title]]) + `<div class="container page-body">${regNotice()}<div class="lec-layout"><div>
      <div class="card card-pad" style="padding:30px"><div class="flex wrap">${statusBadge(st)}${subjBadge(t.subject)}</div><h2 class="mt16" style="font-size:26px">${h(t.title)}</h2>
        <div class="kpis mt24"><div class="kpi"><b>${n}</b><span>Questions</span></div><div class="kpi"><b>${h(t.duration)} min</b><span>Duration</span></div><div class="kpi"><b>${n * mc}</b><span>Total marks</span></div><div class="kpi"><b>+${mc} / −${mw}</b><span>Marking</span></div></div>
        <div class="grid g2 mt24" style="gap:12px"><div class="kpi"><span>Opens</span><b style="font-size:15px">${fmtDT(t.start)}</b></div><div class="kpi"><span>Closes</span><b style="font-size:15px">${fmtDT(t.end)}</b></div></div>
        <h3 class="mt32 mb16" style="font-size:17px">Instructions</h3><div class="prose" style="font-size:14.5px">${String(t.instructions || '').split('\n').filter(Boolean).map(l => `<p class="flex" style="align-items:flex-start;gap:10px">${icon('checkc', 16, 'style="margin-top:4px;color:var(--royal)"')}<span>${h(l)}</span></p>`).join('')}</div>
        <div class="mt24">${st === 'upcoming' ? `<button class="btn btn-lg btn-ghost" disabled>${icon('clock', 16)} Opens ${fmtDT(t.start)}</button>` : ranked && st === 'active' ? `<a class="btn btn-lg btn-primary" href="#review-${h(ranked.id)}">${icon('eye', 16)} View result & solutions</a> <span class="muted small">One ranked attempt per student. Practice re-attempts open after the test closes.</span>` : canStart ? `<button class="btn btn-lg ${st === 'active' ? 'btn-gold' : 'btn-primary'}" data-act="exam-start" data-id="${h(id)}">${icon('maximize', 16)} ${st === 'active' ? 'Start test (full screen)' : 'Attempt for practice'}</button>${st === 'completed' ? ' <span class="muted small">This test has closed — practice attempts are not ranked.</span>' : ''}` : `<button class="btn btn-lg" disabled>No questions yet</button>`}</div>
      </div></div>
      <aside>${rk ? `<div class="card card-pad"><h3 style="font-size:16.5px">Your rank</h3><div class="flex mt16" style="gap:18px">${ring(Math.round(rk.percentile), 110, 'Percentile', '#C9A24A')}<div><b style="font-size:28px;font-family:var(--font-display)">#${rk.rank}</b><div class="muted small">of ${rk.of} students</div><div class="small mt8">Topper: <b>${rk.topper.score}</b> · Avg: <b>${rk.avg.toFixed(1)}</b></div></div></div></div>` : ''}
        <div class="card ${rk ? 'mt16' : ''}"><div class="card-hd"><h3>${icon('trophy', 17)} Top scores</h3></div>${leaderTable((rk ? rk.list : (rankFor(id, '__') || { list: [] }).list).map(a => ({ ...a, p: a.max ? a.score / a.max : 0 })), 'marks')}</div>
        ${mine.length ? `<div class="card mt16"><div class="card-hd"><h3>Your attempts</h3></div>${mine.slice().reverse().map(a => `<a class="list-row" href="#review-${h(a.id)}"><div class="grow"><b>${a.score} / ${a.max}${a.practice ? ' · practice' : ''}</b><span>${fmtDT(a.at)}</span></div><span class="link small">Solutions</span></a>`).join('')}</div>` : ''}</aside></div></div>`;
  },

  series() {
    return pageHead('Test Series', 'Complete mock test series with schedules, marking schemes and performance reports.', [['Test Series']]) + `<div class="container page-body">
      ${!ready('series') ? skeletonGrid(2, 'g2') : S.data.series.length ? `<div class="grid g2">${S.data.series.slice().sort((a, b) => (a.order || 0) - (b.order || 0)).map(seriesCard).join('')}</div>` : emptyState('layers', 'No test series yet', 'Test series will appear here once the teacher publishes them.')}</div>`;
  },

  seriesDetail(id) {
    const sr = byId('series', id); if (!sr) return notFound('Test series');
    const ts = S.data.tests.filter(t => t.seriesId === id).sort((a, b) => (a.order || 0) - (b.order || 0));
    const rows = ts.map(t => { const a = myAttempts('test', t.id).find(x => !x.practice) || myAttempts('test', t.id)[0]; const rk = rankFor(t.id, S.uid); return { t, a, rk }; });
    const attempted = rows.filter(r => r.a);
    const avgP = attempted.length ? Math.round(attempted.reduce((s, r) => s + pct(Math.max(0, r.a.score), r.a.max), 0) / attempted.length) : 0;
    return pageHead(sr.title, sr.desc, [['Test Series', 'series'], [sr.title]]) + `<div class="container page-body">${regNotice()}
      <div class="grid g4 mb24">${[['test', ts.length, 'Tests in series'], ['checkc', attempted.length, 'Attempted'], ['target', avgP + '%', 'Average score'], ['trophy', attempted.filter(r => r.rk).length ? '#' + Math.min(...attempted.filter(r => r.rk).map(r => r.rk.rank)) : '—', 'Best rank']].map(([ic, n, l]) => `<div class="card mini-stat"><div class="ic" style="background:var(--royal-50);color:var(--royal)">${icon(ic, 22)}</div><div><b>${n}</b><span>${l}</span></div></div>`).join('')}</div>
      <div class="progress mb24"><i style="width:${pct(attempted.length, ts.length)}%"></i></div>
      <div class="table-wrap"><table class="t"><thead><tr><th>Test</th><th>Status</th><th>Window</th><th>Marks</th><th>Your score</th><th>Rank</th><th></th></tr></thead><tbody>
      ${rows.map(({ t, a, rk }) => `<tr><td><b>${h(t.title)}</b><div class="muted small">${(t.questions || []).length} Q · ${h(t.duration)} min · +${h(t.markCorrect)}/−${h(t.markWrong)}</div></td><td>${statusBadge(testStatus(t))}</td><td class="small">${fmtDT(t.start)}<br><span class="muted">to ${fmtDT(t.end)}</span></td><td>${(t.questions || []).length * (+t.markCorrect || 4)}</td><td>${a ? `<b>${a.score}</b>` : '—'}</td><td>${rk ? `#${rk.rank}/${rk.of}` : '—'}</td><td><a class="btn btn-sm btn-soft" href="#test-${h(t.id)}">${a ? 'Details' : testStatus(t) === 'active' ? 'Start' : 'Open'}</a></td></tr>`).join('') || `<tr><td colspan="7" class="muted">No tests added yet.</td></tr>`}</tbody></table></div>
      ${attempted.length ? `<div class="grid g2 mt24"><div class="card card-pad"><h3 class="mb16" style="font-size:17px">Score trend (%)</h3>${lineChart(attempted.map((r, i) => ({ v: pct(Math.max(0, r.a.score), r.a.max), label: r.t.title, short: 'T' + (i + 1) })))}</div>
        <div class="card card-pad"><h3 class="mb16" style="font-size:17px">You vs topper vs average</h3>${barChart(attempted.filter(r => r.rk).flatMap(r => [{ label: r.t.title + ' — you', v: pct(Math.max(0, r.a.score), r.a.max) }, { label: 'Topper', v: pct(Math.max(0, r.rk.topper.score), r.a.max) }, { label: 'Average', v: pct(Math.max(0, Math.round(r.rk.avg)), r.a.max) }]).slice(0, 9)) || '<p class="muted">Ranks appear after ranked attempts.</p>'}</div></div>` : ''}
    </div>`;
  },

  assignments() {
    const list = S.data.assignments.slice().sort((a, b) => (a.due || '').localeCompare(b.due || ''));
    const subs = (S.mySub && S.mySub.items) || {};
    const status = a => { const s = subs[a.id]; if (s && s.grade != null && s.grade !== '') return ['graded', `<span class="badge b-green">Graded: ${h(s.grade)}/${h(a.maxMarks)}</span>`]; if (s) return ['submitted', `<span class="badge b-royal">${icon('check', 12)} Submitted</span>`]; if (a.due && new Date(a.due) < new Date()) return ['overdue', '<span class="badge b-red">Overdue</span>']; return ['pending', '<span class="badge b-amber">Pending</span>']; };
    return pageHead('Assignments', 'Submit written work and get graded feedback from the teacher.', [['Assignments']]) + `<div class="container page-body">${regNotice()}
      ${!ready('assignments') ? skeletonGrid(3) : list.length ? `<div class="grid g3">${list.map(a => { const [k, b] = status(a); const c = byId('courses', a.courseId); const s = subs[a.id]; return `<article class="card hover quiz-card"><div class="flex between">${subjBadge(a.subject)}${b}</div><h4>${h(a.title)}</h4><p class="muted small">${h(c ? c.title : '')}</p>
        <div class="qstats"><div><b>${h(a.maxMarks)}</b><span>Marks</span></div><div><b style="font-size:13px">${fmtDate(a.due)}</b><span>Due</span></div><div><b>${s ? fmtDate(s.at).split(' ').slice(0, 2).join(' ') : '—'}</b><span>Submitted</span></div></div>
        ${s && s.feedback ? `<div class="explain" style="margin:0"><b>Teacher feedback</b><div class="mt8">${h(s.feedback)}</div></div>` : ''}
        <button class="btn ${k === 'pending' || k === 'overdue' ? 'btn-primary' : 'btn-ghost'} btn-block" data-act="assign-open" data-id="${h(a.id)}">${k === 'pending' || k === 'overdue' ? 'View & submit' : 'View submission'}</button></article>`; }).join('')}</div>` : emptyState('task', 'No assignments yet', 'Assignments from your courses will appear here.')}</div>`;
  },

  results() {
    const r = myResult(); const at = (r?.attempts || []).slice().sort((a, b) => (a.at || '').localeCompare(b.at || ''));
    const tests = S.data.tests.filter(t => allAttempts('test', t.id).length);
    const sel = F.lbTest && byId('tests', F.lbTest) ? F.lbTest : (tests[0] || {}).id;
    let mineHTML;
    if (!r) mineHTML = emptyState('chart', 'Track your performance', 'Create your student profile to save attempts and see score trends, accuracy and ranks.', `<a href="#login" class="btn btn-primary">Create profile</a>`);
    else if (!at.length) mineHTML = emptyState('chart', 'No attempts yet', 'Attempt a quiz or test and your performance analytics will appear here.', `<a href="#quizzes" class="btn btn-primary">Try a quiz</a>`);
    else {
      const totC = at.reduce((s, a) => s + a.correct, 0), totW = at.reduce((s, a) => s + a.wrong, 0);
      const bySub = {}; at.forEach(a => { const k = a.subject || 'General'; bySub[k] = bySub[k] || { c: 0, w: 0, n: 0 }; bySub[k].c += a.correct; bySub[k].w += a.wrong; bySub[k].n++; });
      const avg = Math.round(at.reduce((s, a) => s + pct(Math.max(0, a.score), a.max), 0) / at.length);
      mineHTML = `<div class="grid g4 mb24">${[['test', at.length, 'Total attempts'], ['target', avg + '%', 'Average score'], ['checkc', pct(totC, totC + totW) + '%', 'Accuracy'], ['trophy', at.filter(a => a.kind === 'test').length, 'Tests taken']].map(([ic, n, l]) => `<div class="card mini-stat"><div class="ic" style="background:var(--royal-50);color:var(--royal)">${icon(ic, 22)}</div><div><b>${n}</b><span>${l}</span></div></div>`).join('')}</div>
      <div class="grid g2"><div class="card card-pad"><h3 class="mb16" style="font-size:17px">Score trend</h3>${lineChart(at.slice(-12).map((a, i) => ({ v: pct(Math.max(0, a.score), a.max), label: a.title, short: String(i + 1) })))}</div>
      <div class="card card-pad"><h3 class="mb16" style="font-size:17px">Subject-wise accuracy</h3>${barChart(Object.entries(bySub).map(([k, v]) => ({ label: k, v: pct(v.c, v.c + v.w), note: v.n + ' attempts' })))}</div></div>
      <div class="table-wrap mt24"><table class="t"><thead><tr><th>Attempt</th><th>Type</th><th>Score</th><th>Accuracy</th><th>Time</th><th>Date</th><th></th></tr></thead><tbody>${at.slice().reverse().map(a => `<tr><td><b>${h(a.title)}</b></td><td><span class="badge ${a.kind === 'test' ? 'b-gold' : a.kind === 'practice' ? 'b-violet' : 'b-royal'}">${a.kind === 'test' ? 'Test' : a.kind === 'practice' ? 'Practice' : 'Quiz'}${a.practice ? ' · practice' : ''}</span></td><td><b>${a.score}</b>/${a.max}</td><td>${pct(a.correct, a.correct + a.wrong)}%</td><td>${fmtSecs(a.time)}</td><td class="muted">${fmtDT(a.at)}</td><td><a class="btn btn-sm btn-soft" href="#review-${h(a.id)}">Review</a></td></tr>`).join('')}</tbody></table></div>`;
    }
    return pageHead('Results & Performance', 'Your scores, accuracy, ranks and leaderboards in one place.', [['Results & Performance']]) + `<div class="container page-body">${mineHTML}
      <div class="grid g2 mt32"><div class="card"><div class="card-hd"><h3>${icon('trophy', 17)} Test leaderboard</h3>${tests.length ? `<select class="select" style="width:auto;height:36px" data-act-change="lb-test">${tests.map(t => `<option value="${h(t.id)}" ${t.id === sel ? 'selected' : ''}>${h(t.title)}</option>`).join('')}</select>` : ''}</div>${sel ? leaderTable(((rankFor(sel, '__') || { list: [] }).list.length ? (rankFor(sel, '__')).list : leaderboardFirst(sel)).map(a => ({ ...a, p: a.max ? a.score / a.max : 0 })), 'marks') : '<p class="muted small card-pad">Leaderboards appear after the first test attempts.</p>'}</div>
      <div class="card"><div class="card-hd"><h3>${icon('award', 17)} Quiz champions</h3></div>${overallBoard()}</div></div></div>`;
  },
});
function leaderboardFirst(testId) { const firsts = {}; for (const a of allAttempts('test', testId)) { if (a.practice) continue; if (!firsts[a.uid] || a.at < firsts[a.uid].at) firsts[a.uid] = a; } return Object.values(firsts).sort((a, b) => b.score - a.score || a.time - b.time); }
function overallBoard() {
  const agg = {}; for (const r of S.results) { const qa = (r.attempts || []).filter(a => a.kind === 'quiz'); if (!qa.length) continue; const best = {}; qa.forEach(a => { best[a.refId] = Math.max(best[a.refId] || 0, a.max ? a.score / a.max : 0); }); agg[r.id] = { uid: r.id, name: r.name, p: Object.values(best).reduce((s, v) => s + v, 0) / Object.keys(best).length, n: Object.keys(best).length, time: 0 }; }
  const rows = Object.values(agg).sort((a, b) => b.p - a.p || b.n - a.n);
  if (!rows.length) return `<p class="muted small card-pad">No quiz attempts yet.</p>`;
  return `<div class="table-wrap" style="border:0;border-radius:0"><table class="t"><thead><tr><th>#</th><th>Student</th><th>Avg best</th><th>Quizzes</th></tr></thead><tbody>${rows.slice(0, 8).map((r, i) => `<tr ${r.uid === S.uid ? 'style="background:var(--royal-50)"' : ''}><td class="${i === 0 ? 'rank-1' : ''}">${i === 0 ? icon('trophy', 15) : i + 1}</td><td>${h(r.name || 'Student')}</td><td><b>${Math.round(r.p * 100)}%</b></td><td>${r.n}</td></tr>`).join('')}</tbody></table></div>`;
}
function testCard(t) {
  const st = testStatus(t); const mine = myAttempts('test', t.id); const sr = byId('series', t.seriesId);
  return `<article class="card hover quiz-card"><div class="flex between">${statusBadge(st)}${subjBadge(t.subject)}</div><h4>${h(t.title)}</h4><p class="muted small">${h(sr ? sr.title : 'Standalone test')}</p>
    <div class="qstats"><div><b>${(t.questions || []).length}</b><span>Questions</span></div><div><b>${h(t.duration)}m</b><span>Duration</span></div><div><b>${mine.length ? mine[0].score : '—'}</b><span>Your score</span></div></div>
    <p class="small muted">${st === 'upcoming' ? 'Opens ' + fmtDT(t.start) : st === 'active' ? 'Closes ' + fmtDT(t.end) : 'Closed on ' + fmtDate(t.end)}</p>
    <a href="#test-${h(t.id)}" class="btn ${st === 'active' && !mine.length ? 'btn-gold' : 'btn-soft'} btn-block">${st === 'active' && !mine.length ? 'Start test' : mine.length ? 'View result' : 'View details'} ${icon('arrow', 15)}</a></article>`;
}

/* ===== Quiz engine ===== */
const QuizEngine = {
  start(id, obj) {
    const qz = obj || byId('quizzes', id); if (!qz) return;
    clearInterval(QZ.timer);
    const qs = qz.randomize !== false ? shuffle(qz.questions || []) : (qz.questions || []).slice();
    const optOrder = {}; qs.forEach(q => optOrder[q.id] = qz.randomize !== false ? shuffle(q.options.map((_, i) => i)) : q.options.map((_, i) => i));
    QZ.run = { quizId: id, quiz: qz, qs, optOrder, cur: 0, answers: {}, startAt: Date.now(), end: Date.now() + (+qz.duration || 10) * 60000 };
    QZ.timer = setInterval(() => QuizEngine.tick(), 1000);
    if (location.hash !== '#quiz-' + id) location.hash = 'quiz-' + id; else App.render();
    window.scrollTo({ top: 0 });
  },
  tick() {
    const run = QZ.run; if (!run || run.result) return clearInterval(QZ.timer);
    if (!location.hash.startsWith('#quiz-' + run.quizId)) return;
    const left = (run.end - Date.now()) / 1000; const el = $('#qz-timer');
    if (el) { el.querySelector('span').textContent = fmtSecs(left); el.classList.toggle('low', left < 60); }
    if (left <= 0) { toast('Time is up — your quiz was submitted.', 'info'); QuizEngine.submit(true); }
  },
  pick(j) { const run = QZ.run; const q = run.qs[run.cur]; let s = run.answers[q.id] || []; if (q.type === 'multi') s = s.includes(j) ? s.filter(x => x !== j) : [...s, j]; else s = [j]; run.answers[q.id] = s; App.render(); },
  nav(d) { const run = QZ.run; run.cur = Math.max(0, Math.min(run.qs.length - 1, run.cur + d)); App.render(); },
  go(i) { QZ.run.cur = i; App.render(); },
  async submit(force) {
    const run = QZ.run; if (!run || run.result) return;
    if (!force) { const un = run.qs.filter(q => !(run.answers[q.id] || []).length).length; if (!(await confirmBox('Submit quiz?', un ? `You have ${un} unanswered question${un > 1 ? 's' : ''}. Submit anyway?` : 'You have answered every question. Ready to see your score?', 'Submit'))) return; }
    clearInterval(QZ.timer);
    const qz = run.quiz; const ev = evaluate(run.qs, run.answers, 1, 0); const isPr = qz.kind === 'Practice';
    const attempt = { id: genId(), kind: isPr ? 'practice' : 'quiz', ...(isPr ? { qids: run.qs.map(q => q.id) } : {}), refId: run.quizId, title: qz.title, subject: qz.subject, ...ev, time: Math.min((Date.now() - run.startAt) / 1000, (+qz.duration || 10) * 60) | 0, at: nowISO(), answers: run.answers };
    run.result = attempt; App.render(); window.scrollTo({ top: 0, behavior: 'smooth' });
    if (isRegistered()) updateMyResult(r => { r.attempts = (r.attempts || []).concat([attempt]); return r; });
  },
};

/* ===== Exam engine (full-screen test) ===== */
const Exam = {
  async start(id) {
    const t = byId('tests', id); if (!t) return;
    const st = testStatus(t);
    if (st === 'upcoming') return toast('This test has not opened yet.', 'info');
    try { await document.documentElement.requestFullscreen?.(); } catch { }
    const qs = t.randomize ? shuffle(t.questions || []) : (t.questions || []).slice();
    EX.run = { testId: id, qs, cur: 0, ans: {}, status: {}, startAt: Date.now(), end: Date.now() + (+t.duration || 30) * 60000, practice: st === 'completed' };
    EX.run.status[qs[0].id] = 'na';
    clearInterval(EX.timer); EX.timer = setInterval(() => Exam.tick(), 1000);
    Exam.render();
  },
  tick() {
    const r = EX.run; if (!r) return clearInterval(EX.timer);
    const left = (r.end - Date.now()) / 1000; const el = $('#ex-timer');
    if (el) { el.querySelector('span').textContent = fmtSecs(left); el.classList.toggle('low', left < 300); }
    if (left <= 0) { Exam.submit(true); }
  },
  render() {
    const r = EX.run; const root = $('#overlay-root'); if (!r) { root.innerHTML = ''; return; }
    const t = byId('tests', r.testId) || {}; const q = r.qs[r.cur]; const sel = r.ans[q.id] || [];
    const cnt = k => r.qs.filter(x => (r.status[x.id] || 'nv') === k).length;
    root.innerHTML = `<div class="exam" id="exam"><div class="exam-top"><span class="brand-mark" style="width:32px;height:32px">${icon('grad', 17)}</span><h3>${h(t.title)}${r.practice ? ' · Practice' : ''}</h3><span class="timer" id="ex-timer">${icon('clock', 17)} <span>${fmtSecs((r.end - Date.now()) / 1000)}</span></span><button class="icon-btn" style="color:#fff" data-act="ex-pal" aria-label="Question palette">${icon('grid', 20)}</button><button class="btn btn-sm btn-outline-white" data-act="ex-exit">Exit</button></div>
      <div class="exam-body"><div class="exam-main"><div class="flex between wrap mb16"><b>Question ${r.cur + 1} of ${r.qs.length}</b><div class="flex"><span class="badge b-green">+${h(t.markCorrect || 4)}</span><span class="badge b-red">−${h(t.markWrong || 0)}</span>${q.type === 'multi' ? '<span class="badge b-violet">Multiple correct</span>' : '<span class="badge">Single correct</span>'}</div></div>
        <div class="q-text" style="margin-top:0">${h(q.text)}</div>${qImg(q)}
        <div class="opts" style="max-width:820px">${q.options.map((o, j) => `<button class="opt ${q.type === 'multi' ? 'multi' : ''} ${sel.includes(j) ? 'sel' : ''}" data-act="ex-pick" data-j="${j}"><span class="k">${KEYS[j]}</span><span>${h(o)}</span></button>`).join('')}</div></div>
      <aside class="exam-side"><div class="flex"><span class="avatar">${h(initials(myResult()?.name || 'Guest'))}</span><div><b>${h(myResult()?.name || 'Guest')}</b><div class="muted small">${r.practice ? 'Practice attempt' : 'Ranked attempt'}</div></div></div>
        <div class="legend"><span><i style="background:var(--green)">${cnt('ans')}</i>Answered</span><span><i style="background:var(--red)">${cnt('na')}</i>Not answered</span><span><i style="background:var(--surface-2);color:var(--text);border:1px solid var(--border-2)">${r.qs.length - Object.keys(r.status).length}</i>Not visited</span><span><i style="background:var(--violet);border-radius:50%">${cnt('mr')}</i>Marked</span><span style="grid-column:1/-1"><i style="background:var(--violet);border-radius:50%">${cnt('amr')}</i>Answered & marked (evaluated)</span></div>
        <div><b class="small muted" style="letter-spacing:.08em">QUESTION PALETTE</b><div class="palette mt12">${r.qs.map((x, i) => `<button class="pal ${r.status[x.id] || ''} ${i === r.cur ? 'cur' : ''}" data-act="ex-go" data-i="${i}">${i + 1}</button>`).join('')}</div></div>
        <button class="btn btn-gold btn-block" style="margin-top:auto" data-act="ex-submit">${icon('check', 16)} Submit test</button></aside></div>
      <div class="exam-foot"><div class="grp"><button class="btn btn-ghost" data-act="ex-mark">${icon('flag', 15)} <span class="hide-sm">Mark for review & next</span><span class="sr">Mark</span></button><button class="btn btn-ghost" data-act="ex-clear">Clear</button></div>
        <div class="grp"><button class="btn btn-ghost" data-act="ex-nav" data-d="-1" ${r.cur === 0 ? 'disabled' : ''}>${icon('left', 16)}<span class="hide-sm">Previous</span></button><button class="btn btn-primary" data-act="ex-save">Save & next ${icon('right', 16)}</button></div></div></div>`;
    typesetMath(root);
  },
  setStatus(q) { const r = EX.run; const has = (r.ans[q.id] || []).length; const cur = r.status[q.id]; if (cur === 'mr' || cur === 'amr') r.status[q.id] = has ? 'amr' : 'mr'; else r.status[q.id] = has ? 'ans' : 'na'; },
  visit(i) { const r = EX.run; r.cur = Math.max(0, Math.min(r.qs.length - 1, i)); const q = r.qs[r.cur]; if (!r.status[q.id]) r.status[q.id] = 'na'; $('#exam')?.classList.remove('pal-open'); Exam.render(); },
  pick(j) { const r = EX.run; const q = r.qs[r.cur]; let s = r.ans[q.id] || []; s = q.type === 'multi' ? (s.includes(j) ? s.filter(x => x !== j) : [...s, j]) : [j]; r.ans[q.id] = s; Exam.render(); },
  save() { const r = EX.run; const q = r.qs[r.cur]; const has = (r.ans[q.id] || []).length; r.status[q.id] = has ? 'ans' : 'na'; Exam.visit(r.cur + 1 < r.qs.length ? r.cur + 1 : r.cur); },
  mark() { const r = EX.run; const q = r.qs[r.cur]; r.status[q.id] = (r.ans[q.id] || []).length ? 'amr' : 'mr'; Exam.visit(r.cur + 1 < r.qs.length ? r.cur + 1 : r.cur); },
  clear() { const r = EX.run; const q = r.qs[r.cur]; delete r.ans[q.id]; r.status[q.id] = 'na'; Exam.render(); },
  async exit() { if (await confirmBox('Leave the test?', 'Your answers will be lost and this attempt will not be saved.', 'Leave test', true)) { Exam.close(); } },
  close() { clearInterval(EX.timer); EX.run = null; Exam.render(); try { document.fullscreenElement && document.exitFullscreen(); } catch { } },
  async submit(force) {
    const r = EX.run; if (!r || r.done) return;
    if (!force) {
      const ans = r.qs.filter(q => (r.ans[q.id] || []).length).length;
      if (!(await confirmBox('Submit test?', `Answered: ${ans} · Not answered: ${r.qs.length - ans} · Marked for review: ${r.qs.filter(q => ['mr', 'amr'].includes(r.status[q.id])).length}. You cannot change answers after submitting.`, 'Submit test'))) return;
    }
    r.done = true; clearInterval(EX.timer);
    const t = byId('tests', r.testId); const ev = evaluate(r.qs, r.ans, +t.markCorrect || 4, +t.markWrong || 0);
    const attempt = { id: genId(), kind: 'test', refId: r.testId, title: t.title, subject: t.subject, seriesId: t.seriesId || '', ...ev, time: Math.min((Date.now() - r.startAt) / 1000, (+t.duration || 30) * 60) | 0, at: nowISO(), answers: r.ans, practice: !!r.practice };
    Exam.close();
    if (force) toast('Time is up — your test was submitted automatically.', 'info');
    if (isRegistered()) {
      await updateMyResult(res => { res.attempts = (res.attempts || []).concat([attempt]); return res; });
      location.hash = 'review-' + attempt.id;
    } else {
      GuestAttempt = attempt; location.hash = 'guest-result';
    }
  },
};
let GuestAttempt = null;
Pages.guestResult = () => {
  const a = GuestAttempt; if (!a) return notFound('Result');
  const src = byId(a.kind === 'test' ? 'tests' : 'quizzes', a.refId);
  return pageHead('Your result', a.title, [['Online Tests', 'tests'], ['Result']]) + `<div class="container page-body"><div class="quiz-shell">${regNotice()}${resultHero(a, 'Score')}<h3 class="mt32">Detailed solutions</h3>${reviewList(src ? src.questions : [], a.answers, a.kind, a.refId)}</div></div>`;
};

/* ===== Assignment modal ===== */
function openAssignment(id) {
  const a = byId('assignments', id); if (!a) return;
  const s = ((S.mySub && S.mySub.items) || {})[id];
  const can = isRegistered() && canSaveOwn() && !(s && s.grade != null && s.grade !== '');
  const m = openModal({
    title: h(a.title), size: 'wide',
    body: `<div class="flex wrap mb16">${subjBadge(a.subject)}<span class="badge">${h(a.maxMarks)} marks</span><span class="badge ${a.due && new Date(a.due) < new Date() ? 'b-red' : 'b-amber'}">Due ${fmtDT(a.due)}</span></div>
      <div class="prose" style="white-space:pre-wrap;font-size:14.5px;background:var(--surface-2);padding:16px;border-radius:12px">${h(a.desc)}</div>
      ${s && s.feedback ? `<div class="explain"><b>Teacher feedback ${s.grade != null && s.grade !== '' ? `· ${h(s.grade)}/${h(a.maxMarks)}` : ''}</b><div class="mt8">${h(s.feedback)}</div></div>` : ''}
      ${!isRegistered() ? `<div class="notice info mt16">${icon('info', 18)}<div><a class="link" href="#login" data-close-modal>Create your student profile</a> to submit assignments.</div></div>` : `
      <form data-form="assignment" data-id="${h(id)}" class="mt24"><div class="field"><label>Your answer</label><textarea class="textarea" name="text" style="min-height:180px" ${can ? '' : 'disabled'} placeholder="Type your solutions here…">${h(s?.text || '')}</textarea></div>
      <div class="field"><label>Link to your work (optional)</label><input class="input" name="link" ${can ? '' : 'disabled'} placeholder="https://drive.google.com/… (scanned pages, doc, etc.)" value="${h(s?.link || '')}"><span class="hint">Share a link to photos or a document of your handwritten work.</span></div>
      ${s ? `<p class="small muted">Last submitted ${fmtDT(s.at)}</p>` : ''}</form>`}`,
    foot: isRegistered() && can ? `<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" data-submit-assign>${s ? 'Update submission' : 'Submit assignment'}</button>` : `<button class="btn btn-ghost" data-close>Close</button>`,
  });
  m.querySelectorAll('[data-close]').forEach(b => b.onclick = () => closeModal());
  m.querySelector('[data-close-modal]')?.addEventListener('click', () => closeModal());
  const btn = m.querySelector('[data-submit-assign]');
  if (btn) btn.onclick = async () => {
    const f = m.querySelector('form'); const text = f.text.value.trim(), link = f.link.value.trim();
    if (!text && !link) return toast('Write your answer or add a link first.', 'err');
    if (link && !safeUrl(link)) return toast('Links must start with https://', 'err');
    btn.disabled = true;
    try { await updateMyDoc('submissions', d => { d.name = myResult()?.name || d.name; d.items = d.items || {}; d.items[id] = { ...(d.items[id] || {}), text, link, at: nowISO(), title: a.title }; return d; }); closeModal(); toast('Assignment submitted.'); } catch { btn.disabled = false; }
  };
}
