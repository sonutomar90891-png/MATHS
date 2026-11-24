/* ===== Login / registration & student dashboard ===== */
Object.assign(Pages, {
  login() {
    const r = myResult();
    const head = pageHead('Student Login / Registration', 'Your account keeps your progress, scores and submissions in one place.', [['Login / Registration']]);
    let body;
    if (S.mode === 'loading') body = skeletonGrid(1, 'g2');
    else if (S.mode === 'offline' || !S.uid) body = `<div class="card card-pad" style="max-width:560px;margin:0 auto;padding:34px;text-align:center"><div class="empty" style="border:0;padding:0"><div class="ic">${icon('lock', 28)}</div><h4>Sign-in isn't available in this view</h4><p>Open this platform from the link your teacher shared while signed in to your account. You can still browse lectures, notes and quizzes as a guest.</p><a href="#courses" class="btn btn-primary">Browse courses</a></div></div>`;
    else if (r) body = `<div class="card card-pad" style="max-width:560px;margin:0 auto;padding:34px;text-align:center"><span class="avatar lg" style="margin:0 auto">${h(initials(r.name))}</span><h3 class="mt16" style="font-size:22px">You're signed in as ${h(r.name)}</h3><p class="muted mt8">${h(r.cls || '')}${r.goal ? ' · ' + h(r.goal) : ''}</p><div class="flex wrap mt24" style="justify-content:center"><a href="#dashboard" class="btn btn-primary">Go to my dashboard ${icon('arrow', 16)}</a><button class="btn btn-ghost" data-act="edit-profile">Edit profile</button></div></div>`;
    else body = `<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:0;max-width:980px;margin:0 auto;border-radius:24px;overflow:hidden;box-shadow:var(--shadow-lg);border:1px solid var(--border)">
      <div style="background:var(--grad-hero);color:#fff;padding:40px;display:flex;flex-direction:column;gap:18px" class="hide-sm"><span class="brand-mark" style="width:48px;height:48px">${icon('grad', 24)}</span><h2 style="color:#fff;font-size:28px">Welcome to ${h(site().brand || 'OnlyMaths')}</h2><p style="color:#C4CEE8">Create your student profile once — your account is already secure, so there's no extra password to remember.</p>
        ${['Track lecture progress & favourites', 'Save quiz and test scores with ranks', 'Submit assignments and get feedback', 'Personal targets and progress charts'].map(x => `<div class="flex" style="color:#DCE3F5">${icon('checkc', 18, 'style="color:#E2C47A"')} ${x}</div>`).join('')}</div>
      <div style="background:var(--surface);padding:40px"><h3 style="font-size:22px">Create your student profile</h3><p class="muted small mt8">You're signed in${S.accountName ? ' as <b>' + h(S.accountName) + '</b>' : ''}. Tell us a little about yourself.</p>
        <form data-form="register" class="mt24"><div class="field"><label>Full name</label><input class="input" name="name" required maxlength="60" value="${h(S.accountName)}" placeholder="Shown on leaderboards"></div>
        <div class="form-row"><div class="field"><label>Class</label><select class="select" name="cls">${(tax().classes || ['Class 11', 'Class 12']).map(c => `<option>${h(c)}</option>`).join('')}<option>Other</option></select></div>
        <div class="field"><label>Preparing for</label><select class="select" name="goal">${['JEE Main / Advanced', 'Board Exams', 'Olympiads', 'Other'].map(c => `<option>${c}</option>`).join('')}</select></div></div>
        <label class="check mb16"><input type="checkbox" name="agree" required> I agree to the <a class="link" href="#terms">terms</a> and <a class="link" href="#privacy">privacy policy</a></label>
        <button class="btn btn-primary btn-block btn-lg">Create profile ${icon('arrow', 16)}</button>
        ${S.isAdmin ? `<p class="small muted mt16">You're the teacher on this platform — the <a class="link" href="#admin">Admin panel</a> is where you manage content. Creating a student profile is optional (useful for testing).</p>` : ''}</form></div></div>`;
    return head + `<div class="container page-body">${body}</div>`;
  },

  dashboard() {
    const r = myResult();
    if (!r) return Pages.login();
    const st = myState(); const at = (r.attempts || []).slice().sort((a, b) => (a.at || '').localeCompare(b.at || ''));
    const today = todayKey();
    const watchedToday = uniq(st.watched.filter(w => todayKey(new Date(w.at)) === today).map(w => w.id)).length;
    const quizzesToday = at.filter(a => todayKey(new Date(a.at)) === today).length;
    const tg = st.target || { lectures: 2, quizzes: 1 };
    const tgP = Math.round((Math.min(1, watchedToday / Math.max(1, tg.lectures)) + Math.min(1, quizzesToday / Math.max(1, tg.quizzes))) / 2 * 100);
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(Date.now() - (6 - i) * 86400000); const k = todayKey(d); return { k, l: 'SMTWTFS'[d.getDay()], on: st.watched.some(w => todayKey(new Date(w.at)) === k) || at.some(a => todayKey(new Date(a.at)) === k) }; });
    const enrolled = (r.enrolled || []).map(id => byId('courses', id)).filter(Boolean);
    const recent = uniq(st.watched.slice().reverse().map(w => w.id)).map(id => byId('lectures', id)).filter(Boolean).slice(0, 4);
    const subs = (S.mySub && S.mySub.items) || {};
    const pending = S.data.assignments.filter(a => !subs[a.id]).sort((a, b) => (a.due || '').localeCompare(b.due || ''));
    const freshQuiz = S.data.quizzes.filter(q => !at.some(a => a.refId === q.id)).slice(0, 4);
    const upcoming = S.data.tests.filter(t => testStatus(t) !== 'completed' && !at.some(a => a.refId === t.id)).sort((a, b) => (a.start || '').localeCompare(b.start || '')).slice(0, 4);
    const favs = st.favs.map(id => byId('lectures', id)).filter(Boolean);
    const notes = st.savedNotes.map(id => byId('materials', id)).filter(Boolean);
    const dls = uniq(st.downloads.slice().reverse().map(d => d.id)).map(id => byId('materials', id)).filter(Boolean).slice(0, 5);
    const totC = at.reduce((s, a) => s + a.correct, 0), totW = at.reduce((s, a) => s + a.wrong, 0);
    const avg = at.length ? Math.round(at.reduce((s, a) => s + pct(Math.max(0, a.score), a.max), 0) / at.length) : 0;
    const bySub = {}; at.forEach(a => { const k = a.subject || 'General'; bySub[k] = bySub[k] || { c: 0, w: 0 }; bySub[k].c += a.correct; bySub[k].w += a.wrong; });
    const hr = new Date().getHours();
    const box = (title, ic, inner, link) => `<div class="card"><div class="card-hd"><h3 class="flex" style="gap:8px">${icon(ic, 17)} ${title}</h3>${link || ''}</div>${inner}</div>`;
    const none = t => `<p class="muted small card-pad">${t}</p>`;
    return `<div class="container page-body" style="padding-top:28px">
      ${S.readOnly ? `<div class="notice warn mb16">${icon('alert', 18)}<div>Your access is view-only, so new progress can't be saved. Ask the teacher to give you Contributor access.</div></div>` : ''}
      <div class="dash-hero"><span class="avatar lg">${h(initials(r.name))}</span><div class="grow"><p>${hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening'},</p><h2>${h(r.name)}</h2><p class="small mt8">${h(r.cls || '')}${r.goal ? ' · ' + h(r.goal) : ''} · Member since ${fmtDate(r.joined)}</p></div>
        <div class="flex wrap"><button class="btn btn-outline-white btn-sm" data-act="edit-profile">${icon('edit', 14)} Profile</button><button class="btn btn-outline-white btn-sm" data-act="feedback">${icon('msg', 14)} Feedback</button><a class="btn btn-gold btn-sm" href="#${recent[0] ? 'lecture-' + h(recent[0].id) : 'lectures'}">${icon('play', 13)} Continue learning</a></div></div>
      <div class="grid g4 mt24">${[['book', enrolled.length, 'Enrolled courses', 'var(--royal-50)', 'var(--royal)'], ['checkc', st.completed.length, 'Lectures completed', 'var(--green-50)', 'var(--green)'], ['test', at.length, 'Quizzes & tests', 'var(--gold-50)', 'var(--gold-600)'], ['target', avg + '%', 'Average score', 'var(--violet-50)', 'var(--violet)']].map(([ic, n, l, bg, fg]) => `<div class="card mini-stat"><div class="ic" style="background:${bg};color:${fg}">${icon(ic, 22)}</div><div><b>${n}</b><span>${l}</span></div></div>`).join('')}</div>

      <div class="grid mt24" style="grid-template-columns:minmax(0,1.6fr) minmax(0,1fr)">
        <div class="card card-pad"><div class="flex between mb16"><h3 style="font-size:17px">Progress chart</h3><a class="link small" href="#results">Full analytics ${icon('arrow', 14)}</a></div>${at.length ? lineChart(at.slice(-10).map((a, i) => ({ v: pct(Math.max(0, a.score), a.max), label: a.title, short: String(i + 1) }))) : emptyState('chart', 'No attempts yet', 'Your score trend appears after your first quiz.', `<a href="#quizzes" class="btn btn-primary btn-sm">Take a quiz</a>`)}
          ${Object.keys(bySub).length ? `<h4 class="mt24 mb16" style="font-size:15px">Accuracy by subject · overall ${pct(totC, totC + totW)}%</h4>${barChart(Object.entries(bySub).map(([k, v]) => ({ label: k, v: pct(v.c, v.c + v.w) })))}` : ''}</div>
        <div class="card card-pad"><div class="flex between"><h3 style="font-size:17px">${icon('target', 17)} Today's study target</h3><button class="btn btn-sm btn-ghost" data-act="edit-target">Edit</button></div>
          <div class="target-ring mt16">${ring(tgP, 120, 'Done', '#C9A24A')}<div style="flex:1"><div class="small flex between"><span>Lectures</span><b>${watchedToday}/${tg.lectures}</b></div><div class="progress mt8 gold"><i style="width:${pct(Math.min(watchedToday, tg.lectures), tg.lectures)}%"></i></div><div class="small flex between mt16"><span>Quizzes / tests</span><b>${quizzesToday}/${tg.quizzes}</b></div><div class="progress mt8 gold"><i style="width:${pct(Math.min(quizzesToday, tg.quizzes), tg.quizzes)}%"></i></div></div></div>
          <h4 class="mt24 mb16" style="font-size:14px">${icon('fire', 15)} Last 7 days</h4><div class="streak">${days.map(d => `<i class="${d.on ? 'on' : ''}" title="${d.k}">${d.l}</i>`).join('')}</div></div>
      </div>

      <div class="grid g2 mt24">
        ${box('Enrolled courses', 'book', enrolled.length ? enrolled.map(c => { const ls = S.data.lectures.filter(l => l.courseId === c.id); const d = ls.filter(l => st.completed.includes(l.id)).length; return `<a class="list-row" href="#course-${h(c.id)}"><div class="grow"><b>${h(c.title)}</b><div class="progress mt8"><i style="width:${pct(d, ls.length)}%"></i></div></div><span class="small muted">${pct(d, ls.length)}%</span></a>`; }).join('') : none('You haven\'t enrolled in a course yet. <a class="link" href="#courses">Browse courses</a>'), '<a class="link small" href="#courses">All courses</a>')}
        ${box('Recently watched', 'video', recent.length ? recent.map(l => `<a class="list-row" href="#lecture-${h(l.id)}"><span style="color:var(--royal)">${icon('play', 14)}</span><div class="grow"><b>${h(l.title)}</b><span>${h(l.subject)} · ${h(l.duration)}</span></div>${st.completed.includes(l.id) ? `<span class="badge b-green">${icon('check', 11)}</span>` : ''}</a>`).join('') : none('Lectures you open will show up here.'))}
        ${box('Pending assignments', 'task', pending.length ? pending.slice(0, 5).map(a => `<button class="list-row" style="width:100%;text-align:left" data-act="assign-open" data-id="${h(a.id)}"><div class="grow"><b>${h(a.title)}</b><span>Due ${fmtDT(a.due)}</span></div>${a.due && new Date(a.due) < new Date() ? '<span class="badge b-red">Overdue</span>' : '<span class="badge b-amber">Pending</span>'}</button>`).join('') : none('All caught up — no pending assignments.'), '<a class="link small" href="#assignments">View all</a>')}
        ${box('Upcoming & live tests', 'cal', upcoming.length ? upcoming.map(t => `<a class="list-row" href="#test-${h(t.id)}"><div class="grow"><b>${h(t.title)}</b><span>${testStatus(t) === 'active' ? 'Closes ' + fmtDT(t.end) : 'Opens ' + fmtDT(t.start)}</span></div>${statusBadge(testStatus(t))}</a>`).join('') : none('No upcoming tests right now.'), '<a class="link small" href="#tests">All tests</a>')}
        ${box('Available quizzes', 'quiz', freshQuiz.length ? freshQuiz.map(q => `<a class="list-row" href="#quiz-${h(q.id)}"><div class="grow"><b>${h(q.title)}</b><span>${(q.questions || []).length} questions · ${h(q.duration)} min</span></div>${diffBadge(q.difficulty)}</a>`).join('') : none('You\'ve attempted every quiz — great work!'), '<a class="link small" href="#quizzes">All quizzes</a>')}
        ${box('Test history', 'chart', at.filter(a => a.kind === 'test').length ? at.filter(a => a.kind === 'test').slice(-5).reverse().map(a => { const rk = rankFor(a.refId, S.uid); return `<a class="list-row" href="#review-${h(a.id)}"><div class="grow"><b>${h(a.title)}</b><span>${fmtDT(a.at)}${a.practice ? ' · practice' : ''}</span></div><b>${a.score}/${a.max}</b>${rk && !a.practice ? `<span class="badge b-gold">#${rk.rank}</span>` : ''}</a>`; }).join('') : none('Your test results will appear here.'), '<a class="link small" href="#results">Results</a>')}
        ${box('Saved lectures & notes', 'heart', favs.length + notes.length ? favs.map(l => `<a class="list-row" href="#lecture-${h(l.id)}"><span style="color:var(--red)">${icon('heartf', 15)}</span><div class="grow"><b>${h(l.title)}</b><span>Lecture</span></div></a>`).join('') + notes.map(m => `<a class="list-row" href="#material-${h(m.id)}"><span style="color:var(--royal)">${icon('bookmarkf', 15)}</span><div class="grow"><b>${h(m.title)}</b><span>${h(m.type)}</span></div></a>`).join('') : none('Tap the heart on lectures or save notes to build your library.'))}
        ${box('Downloaded materials', 'download', dls.length ? dls.map(m => `<a class="list-row" href="#material-${h(m.id)}"><div class="grow"><b>${h(m.title)}</b><span>${h(m.subject)} · ${h(m.type)}</span></div><button class="btn btn-sm btn-ghost" data-act="dl-mat" data-id="${h(m.id)}">${icon('download', 14)}</button></a>`).join('') : none('PDFs you download will be listed here for quick access.'))}
      </div>
      ${box('Bookmarked questions', 'bookmark', st.bookmarks.length ? st.bookmarks.slice().reverse().map(b => { const src = byId(b.kind === 'test' ? 'tests' : 'quizzes', b.refId); const q = src && (src.questions || []).find(x => x.id === b.qid); return q ? `<details class="list-row" style="display:block"><summary style="cursor:pointer;font-weight:600;font-size:14.5px">${h(q.text)}</summary><div class="mt12 small"><b style="color:var(--green)">Answer:</b> ${q.answer.map(i => h(q.options[i])).join(', ')}${q.explanation ? `<p class="muted mt8">${h(q.explanation)}</p>` : ''}<button class="btn btn-sm btn-ghost mt8" data-act="bm-q" data-kind="${h(b.kind)}" data-ref="${h(b.refId)}" data-q="${h(b.qid)}">Remove bookmark</button></div></details>` : ''; }).join('') : none('Bookmark tricky questions from quiz results to revise them here.')).replace('class="card"', 'class="card mt24"')}
    </div>`;
  },
});

function openProfile() {
  const r = myResult() || {};
  const m = openModal({
    title: 'Edit profile', body: `<form><div class="field"><label>Full name</label><input class="input" name="name" maxlength="60" value="${h(r.name || '')}"></div><div class="form-row"><div class="field"><label>Class</label><select class="select" name="cls">${[...(tax().classes || []), 'Other'].map(c => `<option ${r.cls === c ? 'selected' : ''}>${h(c)}</option>`).join('')}</select></div><div class="field"><label>Preparing for</label><select class="select" name="goal">${['JEE Main / Advanced', 'Board Exams', 'Olympiads', 'Other'].map(c => `<option ${r.goal === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div></div></form>`,
    foot: `<button class="btn btn-ghost" data-c>Cancel</button><button class="btn btn-primary" data-s>Save</button>`
  });
  m.querySelector('[data-c]').onclick = closeModal;
  m.querySelector('[data-s]').onclick = async () => { const f = m.querySelector('form'); const name = f.name.value.trim(); if (!name) return toast('Name is required', 'err'); try { await updateMyResult(d => { d.name = name; d.cls = f.cls.value; d.goal = f.goal.value; return d; }); closeModal(); toast('Profile updated'); } catch { } };
}
function openTarget() {
  const t = myState().target || {};
  const m = openModal({
    title: 'Daily study target', body: `<p class="muted mb16">Set realistic daily goals. Your dashboard tracks them automatically.</p><div class="form-row"><div class="field"><label>Lectures per day</label><input class="input" type="number" min="1" max="20" name="l" value="${h(t.lectures || 2)}"></div><div class="field"><label>Quizzes / tests per day</label><input class="input" type="number" min="1" max="20" name="q" value="${h(t.quizzes || 1)}"></div></div>`,
    foot: `<button class="btn btn-ghost" data-c>Cancel</button><button class="btn btn-primary" data-s>Save target</button>`
  });
  m.querySelector('[data-c]').onclick = closeModal;
  m.querySelector('[data-s]').onclick = async () => { const l = Math.max(1, Math.min(20, +m.querySelector('[name=l]').value || 1)), q = Math.max(1, Math.min(20, +m.querySelector('[name=q]').value || 1)); closeModal(); await updateMyState(s => { s.target = { ...s.target, lectures: l, quizzes: q }; return s; }); toast('Target saved'); };
}
function openFeedback() {
  if (!isRegistered()) { location.hash = 'login'; return; }
  let rating = 5;
  const m = openModal({
    title: 'Share your feedback', body: `<p class="muted mb16">How is your learning experience? Your feedback goes to the teacher and may be featured on the homepage with your name.</p><div class="field"><label>Rating</label><div class="flex" id="fb-stars" style="gap:4px">${[1, 2, 3, 4, 5].map(i => `<button type="button" data-r="${i}" style="color:var(--gold)">${icon('star', 26)}</button>`).join('')}</div></div><div class="field"><label>Your feedback</label><textarea class="textarea" name="text" maxlength="600" placeholder="What do you like? What could be better?"></textarea></div><label class="check"><input type="checkbox" name="pub" checked> The teacher may feature this on the homepage</label>`,
    foot: `<button class="btn btn-ghost" data-c>Cancel</button><button class="btn btn-primary" data-s>Send feedback</button>`
  });
  const paint = () => m.querySelectorAll('[data-r]').forEach(b => b.style.opacity = +b.dataset.r <= rating ? 1 : .25);
  m.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { rating = +b.dataset.r; paint(); }); paint();
  m.querySelector('[data-c]').onclick = closeModal;
  m.querySelector('[data-s]').onclick = async () => { const text = m.querySelector('[name=text]').value.trim(); if (text.length < 5) return toast('Please write a little more.', 'err'); const pub = m.querySelector('[name=pub]').checked; try { await updateMyDoc('feedback', d => { d.name = myResult()?.name; d.items = (d.items || []).concat([{ id: genId(), kind: 'review', rating, text, allowPublish: pub, at: nowISO() }]).slice(-30); return d; }); closeModal(); toast('Thank you! Your feedback was sent.'); } catch { } };
}
