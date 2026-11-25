/* ===== Public pages ===== */
const F = { courses: { cls: 'All', subject: 'All', q: '' }, lectures: { subject: 'All', chapter: 'All', course: 'All', q: '', view: 'all' }, materials: { cls: 'All', subject: 'All', chapter: 'All', tag: 'All', type: 'All', q: '' }, quizzes: { kind: 'All', subject: 'All', diff: 'All', q: '' }, homeQuiz: 'All' };
const byDate = (a, b) => (b.date || '').localeCompare(a.date || '');

function statsBlock() {
  const items = [['users', S.results.length, 'Registered Students', 'var(--royal-50)', 'var(--royal)'], ['book', S.data.courses.length, 'Available Courses', 'var(--gold-50)', 'var(--gold-600)'], ['video', S.data.lectures.length, 'Video Lectures', 'var(--green-50)', 'var(--green)'], ['quiz', totalQuestions(), 'Practice Questions', 'var(--violet-50)', 'var(--violet)']];
  return `<div class="stats">${items.map(([ic, n, l, bg, fg]) => `<div class="stat"><div class="ic" style="background:${bg};color:${fg}">${icon(ic, 24)}</div><div><b data-count="${n}">${ready('courses') ? fmtNum(n) : '–'}</b><span>${l}</span></div></div>`).join('')}</div>`;
}

const Pages = {
  home() {
    const s = site();
    const featured = S.data.courses.filter(c => c.featured !== false).sort((a, b) => (a.order || 0) - (b.order || 0)).slice(0, 6);
    const lecs = S.data.lectures.slice().sort(byDate).slice(0, 4);
    const mats = S.data.materials.slice().sort(byDate).slice(0, 6);
    const kinds = ['All', 'Daily', 'Chapter-wise', 'Topic-wise'];
    const quizzes = S.data.quizzes.filter(q => F.homeQuiz === 'All' || q.kind === F.homeQuiz).sort(byDate).slice(0, 6);
    const series = S.data.series.slice().sort((a, b) => (a.order || 0) - (b.order || 0)).slice(0, 2);
    const tests = S.data.tests; const cnt = st => tests.filter(t => testStatus(t) === st).length;
    const testi = S.data.testimonials.filter(t => t.published !== false);
    const title = s.heroTitle || 'Learn Smarter. Achieve More.';
    const tparts = title.split('. ');
    const titleHTML = tparts.length > 1 ? h(tparts[0]) + '.<br><em>' + h(tparts.slice(1).join('. ')) + '</em>' : h(title);
    return `
    <section class="hero"><div class="container">
      <div class="reveal in">${s.heroBadgeText ? `<a href="#series" class="hero-eyebrow"><span>${h(s.heroBadge || 'New')}</span>${h(s.heroBadgeText)} ${icon('arrow', 14)}</a>` : ''}
        <h1>${titleHTML}</h1><p class="sub">${h(s.heroSub || 'Video lectures, notes, quizzes and exam-grade tests — everything you need in one place.')}</p>
        <div class="hero-cta"><a href="#courses" class="btn btn-gold btn-lg">Explore Courses ${icon('arrow', 18)}</a><a href="${isRegistered() ? '#dashboard' : '#login'}" class="btn btn-outline-white btn-lg">${icon('play', 16)} Start Learning</a></div>
        <div class="hero-trust"><span class="flex" style="gap:6px">${icon('shield', 16)} Concept-first teaching</span><i class="sep"></i><span class="flex" style="gap:6px">${icon('chart', 16)} Real performance analytics</span><i class="sep"></i><span class="flex" style="gap:6px">${icon('award', 16)} Detailed solutions</span></div></div>
      <div class="hero-art">${heroArt()}</div></div></section>
    <div class="container stats-wrap reveal">${statsBlock()}</div>

    <section class="section"><div class="container">
      <div class="sec-head reveal"><div><div class="eyebrow">Featured Courses</div><h2>Programs built for results</h2><p>Chapter-wise courses that combine lectures, notes and practice into one clear path.</p></div><a href="#courses" class="link">View all courses ${icon('arrow', 16)}</a></div>
      ${!ready('courses') ? skeletonGrid(3) : featured.length ? `<div class="grid g3">${featured.map(c => `<div class="reveal">${courseCard(c)}</div>`).join('')}</div>` : emptyState('book', 'No courses yet', 'Courses created in the admin panel will appear here.')}
    </div></section>

    <section class="section alt"><div class="container">
      <div class="sec-head reveal"><div><div class="eyebrow">Latest Lectures</div><h2>Fresh from the classroom</h2><p>Recently uploaded lectures, organised by subject and chapter.</p></div><a href="#lectures" class="link">Open lecture library ${icon('arrow', 16)}</a></div>
      ${!ready('lectures') ? skeletonGrid(4, 'g4') : lecs.length ? `<div class="grid g4">${lecs.map(l => `<div class="reveal">${lectureCard(l)}</div>`).join('')}</div>` : emptyState('video', 'No lectures yet', 'New lectures will show up here as soon as they are published.')}
    </div></section>

    <section class="section"><div class="container">
      <div class="sec-head reveal"><div><div class="eyebrow">Study Materials</div><h2>Notes you'll actually revise from</h2><p>PDF notes, handouts, formula sheets and worksheets — preview in the browser or download.</p></div><a href="#materials" class="link">Browse the library ${icon('arrow', 16)}</a></div>
      ${!ready('materials') ? skeletonGrid(3) : mats.length ? `<div class="grid g3">${mats.map(m => `<div class="reveal">${materialCard(m)}</div>`).join('')}</div>` : emptyState('file', 'No materials yet', 'Uploaded notes will appear here.')}
    </div></section>

    <section class="section alt"><div class="container">
      <div class="sec-head reveal"><div><div class="eyebrow">Quiz & Practice</div><h2>Practice a little every day</h2><p>Timed quizzes with instant scoring, explanations and a leaderboard.</p></div><div class="chips">${kinds.map(k => `<button class="chip ${F.homeQuiz === k ? 'active' : ''}" data-act="home-quiz" data-v="${k}">${k}</button>`).join('')}</div></div>
      ${!ready('quizzes') ? skeletonGrid(3) : quizzes.length ? `<div class="grid g3">${quizzes.map(q => `<div class="reveal in">${quizCard(q)}</div>`).join('')}</div>` : emptyState('quiz', 'No quizzes in this category', 'Try another category or check back soon.')}
      <div class="center mt32 flex wrap" style="justify-content:center"><a href="#practice" class="btn btn-gold">${icon('sparkle', 15)} Create your own practice test</a><a href="#quizzes" class="btn btn-ghost">See all quizzes ${icon('arrow', 15)}</a></div>
    </div></section>

    <section class="section"><div class="container">
      <div class="sec-head reveal"><div><div class="eyebrow">Test Series</div><h2>Exam-grade mock tests</h2><p>A real exam interface with question palette, review marking, negative marking and rank analysis.</p></div><a href="#series" class="link">All test series ${icon('arrow', 16)}</a></div>
      <div class="grid g4 mb24 reveal">${[['zap', 'Live now', cnt('active'), 'var(--green-50)', 'var(--green)'], ['clock', 'Upcoming', cnt('upcoming'), 'var(--amber-50)', '#B57605'], ['checkc', 'Completed', cnt('completed'), 'var(--surface-2)', 'var(--muted)'], ['chart', 'Your attempts', myAttempts('test').length, 'var(--royal-50)', 'var(--royal)']].map(([ic, l, n, bg, fg]) => `<div class="card mini-stat"><div class="ic" style="background:${bg};color:${fg}">${icon(ic, 22)}</div><div><b>${n}</b><span>${l}</span></div></div>`).join('')}</div>
      ${!ready('series', 'tests') ? skeletonGrid(2, 'g2') : series.length ? `<div class="grid g2">${series.map(sr => `<div class="reveal">${seriesCard(sr)}</div>`).join('')}</div>` : emptyState('layers', 'No test series yet', 'Test series will appear here once published.')}
    </div></section>

    <section class="section alt"><div class="container center">
      <div class="sec-head reveal"><div><div class="eyebrow">Why Choose Us</div><h2>Everything a serious learner needs</h2><p>A complete system — not just videos — designed around how students actually improve.</p></div></div>
      <div class="grid g3" style="text-align:left">${[['grad', 'Expert Teaching', 'Concept-first lectures that build intuition before shortcuts, planned chapter by chapter.'], ['file', 'Quality Study Materials', 'Crisp notes, formula sheets and worksheets designed for fast, effective revision.'], ['test', 'Regular Practice Tests', 'Daily quizzes, chapter tests and full mocks keep your preparation exam-ready.'], ['bulb', 'Detailed Solutions', 'Every question comes with a clear explanation so each mistake becomes a lesson.'], ['chart', 'Performance Analytics', 'Scores, accuracy, rank and percentile trends show exactly where to focus.'], ['compass', 'Structured Learning', 'Courses, targets and progress tracking give your preparation a clear direction.']].map(([ic, t, d]) => `<div class="card hover feature reveal"><div class="ic">${icon(ic, 24)}</div><h4>${t}</h4><p>${d}</p></div>`).join('')}</div>
    </div></section>

    <section class="section"><div class="container">
      <div class="sec-head reveal"><div><div class="eyebrow">Testimonials</div><h2>What students say</h2><p>Feedback shared by students on the platform.</p></div>${isRegistered() ? `<a href="#dashboard" class="link" data-act="feedback">Share your feedback ${icon('arrow', 16)}</a>` : ''}</div>
      ${testi.length ? `<div class="grid g3">${testi.slice(0, 6).map(t => `<div class="card testi reveal"><div class="stars">${Array.from({ length: Math.max(1, Math.min(5, t.rating || 5)) }, () => icon('star', 16)).join('')}</div><p class="q">“${h(t.text)}”</p><div class="instructor"><span class="avatar">${h(initials(t.name))}</span><div><b style="display:block;font-size:14px">${h(t.name)}</b><span class="muted small">${h(t.role || 'Student')}</span></div></div></div>`).join('')}</div>`
        : emptyState('msg', 'Student reviews will appear here', 'Reviews are published from real student feedback submitted on the platform.', isRegistered() ? `<button class="btn btn-primary" data-act="feedback">Share your feedback</button>` : `<a href="#login" class="btn btn-primary">Join and share feedback</a>`)}
    </div></section>

    <section class="section tight"><div class="container"><div class="cta-band reveal"><div><h3>Your next rank starts with today's lesson.</h3><p>Create your free student profile and start tracking your progress.</p></div><div class="flex wrap"><a href="${isRegistered() ? '#dashboard' : '#login'}" class="btn btn-gold btn-lg">${isRegistered() ? 'Go to dashboard' : 'Get started'} ${icon('arrow', 18)}</a><a href="#contact" class="btn btn-outline-white btn-lg">Talk to us</a></div></div></div></section>`;
  },

  about() {
    const s = site();
    return pageHead('About Us', s.mission, [['About Us']]) + `<div class="container page-body">
      <div class="split"><div><div class="eyebrow">Our Story</div><h2 style="font-size:32px">Teaching that turns effort into results</h2><div class="prose mt16">${String(s.about || '').split('\n').filter(Boolean).map(p => `<p>${h(p)}</p>`).join('')}</div>
        <div class="flex wrap mt24"><a href="#courses" class="btn btn-primary">Explore courses</a><a href="#contact" class="btn btn-ghost">Contact us</a></div></div>
      <div class="card card-pad" style="padding:30px"><div class="flex" style="gap:18px"><span class="avatar lg">${h(initials(s.instructor))}</span><div><h3 style="font-size:21px">${h(s.instructor || 'Lead Educator')}</h3><p class="muted small">${h(s.instructorRole || '')}</p></div></div><p class="prose mt16">${h(s.instructorBio || '')}</p>
        <div class="grid g2 mt24" style="gap:12px">${[['book', S.data.courses.length, 'Courses'], ['video', S.data.lectures.length, 'Lectures'], ['file', S.data.materials.length, 'Study materials'], ['quiz', totalQuestions(), 'Practice questions']].map(([ic, n, l]) => `<div class="kpi"><b>${fmtNum(n)}</b><span>${l}</span></div>`).join('')}</div></div></div>
      <div class="section tight"><div class="grid g3">${[['target', 'Our mission', s.mission || ''], ['compass', 'Our approach', 'Clear concepts first, then deliberate practice, then honest measurement. Every resource on the platform serves one of these three.'], ['shield', 'Our promise', 'No shortcuts, no clutter — only material that has been planned, checked and refined with student feedback.']].map(([ic, t, d]) => `<div class="card feature"><div class="ic">${icon(ic, 24)}</div><h4>${t}</h4><p>${h(d)}</p></div>`).join('')}</div></div></div>`;
  },

  contact() {
    const s = site(); const wa = String(s.whatsapp || '').replace(/\D/g, '');
    const can = isRegistered() && canSaveOwn();
    return pageHead('Contact Us', 'Questions about courses, tests or your account? We usually reply within a day.', [['Contact Us']]) + `<div class="container page-body"><div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:28px">
      <div class="flex" style="flex-direction:column;align-items:stretch;gap:14px">
        ${[['mail', 'Email', s.email], ['phone', 'Phone', s.phone], ['map', 'Location', s.address]].filter(x => x[2]).map(([ic, l, v]) => `<div class="card mini-stat"><div class="ic" style="background:var(--royal-50);color:var(--royal)">${icon(ic, 22)}</div><div><span>${l}</span><b style="font-size:16px">${h(v)}</b></div></div>`).join('')}
        ${wa ? `<a class="card mini-stat hover" href="https://wa.me/${h(wa)}" target="_blank" rel="noopener"><div class="ic" style="background:#25D36622;color:#1DA851">${icon('wa', 22)}</div><div><span>WhatsApp</span><b style="font-size:16px">Chat with us ${icon('external', 14)}</b></div></a>` : ''}
      </div>
      <div class="card card-pad" style="padding:28px"><h3>Send a message</h3><p class="muted small mt8">${can ? 'Your message goes straight to the teacher\'s admin inbox.' : 'Register your student profile to send messages from here — or reach us through any of the channels on the left.'}</p>
        <form data-form="contact" class="mt24"><div class="form-row"><div class="field"><label>Your name</label><input class="input" name="name" required value="${h(myResult()?.name || '')}"></div><div class="field"><label>Email or phone</label><input class="input" name="contact" required></div></div>
        <div class="field"><label>Subject</label><input class="input" name="subject" required placeholder="e.g. Doubt in Mock Test 2"></div>
        <div class="field"><label>Message</label><textarea class="textarea" name="message" required></textarea></div>
        <button class="btn btn-primary" ${can ? '' : 'disabled'}>${icon('msg', 16)} Send message</button>${can ? '' : ` <a href="#login" class="btn btn-ghost">Register first</a>`}</form></div></div></div>`;
  },

  privacy() { return legal('Privacy Policy', [['Information we collect', 'When you create a student profile we store the name and class you enter, your quiz and test attempts, assignment submissions and feedback you send. Lecture progress, favourites and bookmarks are stored privately for your account.'], ['How we use it', 'Your data is used to show your dashboard, calculate scores, ranks and percentiles, and help the teacher understand class performance. Your name and scores may appear on leaderboards.'], ['Who can see it', 'The teacher (administrator) can see student profiles, attempts, submissions and feedback. Other students can see leaderboard names and scores only.'], ['Your choices', 'Contact us to correct your name or remove your profile and attempts.']]); },
  terms() { return legal('Terms & Conditions', [['Use of content', 'All lectures, notes, quizzes and tests are for personal learning. Do not redistribute or resell course material.'], ['Fair practice', 'Attempt tests honestly and without assistance. Ranks and percentiles are meaningful only when everyone follows the same rules.'], ['Accounts', 'Keep your account to yourself. The teacher may remove profiles that misuse the platform.'], ['Changes', 'Courses, schedules and test windows may change. Announcements on the platform are the official source of updates.']]); },

  courses() {
    const t = tax(); const f = F.courses;
    const classes = ['All', ...uniq([...(t.classes || []), ...S.data.courses.map(c => c.cls)])];
    const subjects = ['All', ...uniq([...(t.subjects || []), ...S.data.courses.map(c => c.subject)])];
    const list = S.data.courses.filter(c => (f.cls === 'All' || c.cls === f.cls) && (f.subject === 'All' || c.subject === f.subject) && (!f.q || (c.title + ' ' + c.desc + ' ' + c.subject).toLowerCase().includes(f.q.toLowerCase()))).sort((a, b) => (a.order || 0) - (b.order || 0));
    return pageHead('Courses', 'Structured, chapter-wise programs combining lectures, notes and practice.', [['Courses']]) + `<div class="container page-body">
      <div class="toolbar"><div class="input-ic">${icon('search', 17)}<input class="input" id="f-courses-q" data-filter="courses.q" placeholder="Search courses…" value="${h(f.q)}"></div>
      <select class="select" data-filter="courses.cls">${classes.map(c => `<option ${f.cls === c ? 'selected' : ''}>${h(c)}</option>`).join('')}</select></div>
      ${subjects.length > 2 ? `<div class="chips scroll mb24">${subjects.map(s => `<button class="chip ${f.subject === s ? 'active' : ''}" data-act="filter" data-k="courses.subject" data-v="${h(s)}">${h(s)}</button>`).join('')}</div>` : ''}
      ${!ready('courses') ? skeletonGrid(6) : list.length ? `<div class="grid g3">${list.map(courseCard).join('')}</div>` : emptyState('book', 'No courses match', 'Try clearing the filters or searching for a different subject.', `<button class="btn btn-ghost" data-act="clear-filters" data-k="courses">Clear filters</button>`)}</div>`;
  },

  course(id) {
    const c = byId('courses', id);
    if (!c) return notFound('Course');
    const lecs = S.data.lectures.filter(l => l.courseId === id).sort((a, b) => (a.order || 0) - (b.order || 0) || (a.date || '').localeCompare(b.date || ''));
    const chapters = uniq(lecs.map(l => l.chapter));
    const mats = S.data.materials.filter(m => m.courseId === id || (!m.courseId && m.subject === c.subject && m.cls === c.cls));
    const quizzes = S.data.quizzes.filter(q => q.subject === c.subject).slice(0, 3);
    const assigns = S.data.assignments.filter(a => a.courseId === id);
    const enrolled = (myResult()?.enrolled || []).includes(id);
    const done = lecs.filter(l => myState().completed.includes(l.id)).length;
    const ok = hasCourseAccess(c);
    return pageHead(c.title, c.desc, [['Courses', 'courses'], [c.title]]) + `<div class="container page-body"><div class="lec-layout">
      <div>
        ${!ok ? `<div class="notice warn mb24">${icon('lock', 18)}<div><b>This course is restricted.</b> Ask the teacher to approve your access. Lectures and notes unlock as soon as you're approved.</div></div>` : ''}
        <div class="card"><div class="card-hd"><h3>Course curriculum</h3><span class="muted small">${lecs.length} lectures · ${chapters.length} chapters</span></div>
        ${chapters.length ? chapters.map(ch => `<div class="card-pad" style="border-bottom:1px solid var(--border)"><h4 style="font-size:15px" class="mb16">${icon('layers', 15)} ${h(ch)}</h4><div class="playlist">${lecs.filter(l => l.chapter === ch).map((l, i) => `<a class="pl ${myState().completed.includes(l.id) ? 'done' : ''}" href="#lecture-${h(l.id)}"><span class="n">${myState().completed.includes(l.id) ? icon('check', 13) : i + 1}</span><div class="grow"><b>${h(l.title)}</b><span>${h(l.duration || '')} · ${h(l.topic || '')}</span></div>${ok ? icon('play', 14) : icon('lock', 14)}</a>`).join('')}</div></div>`).join('') : `<div class="card-pad">${emptyState('video', 'No lectures yet', 'Lectures for this course will be added soon.')}</div>`}</div>
        ${mats.length ? `<h3 class="mt32 mb16">Study materials</h3><div class="grid g2">${mats.map(materialCard).join('')}</div>` : ''}
        ${assigns.length ? `<h3 class="mt32 mb16">Assignments</h3><div class="card">${assigns.map(a => `<a href="#assignments" class="list-row"><span class="ic">${icon('task')}</span><div class="grow"><b>${h(a.title)}</b><span>Due ${fmtDT(a.due)} · ${h(a.maxMarks)} marks</span></div>${icon('right')}</a>`).join('')}</div>` : ''}
      </div>
      <aside class="sidebar" style="top:calc(var(--nav-h) + 20px)"><div class="card" style="overflow:hidden"><div class="thumb" style="border-radius:0">${thumbFor(c, c.cls)}</div><div class="card-pad">
        <div class="flex wrap">${subjBadge(c.subject)}<span class="badge">${h(c.cls)}</span>${lockBadge(c)}</div>
        <div class="instructor mt16"><span class="avatar">${h(initials(c.instructor))}</span><div><b style="display:block">${h(c.instructor)}</b><span class="muted small">Instructor</span></div></div>
        ${lecs.length ? `<div class="mt16"><div class="flex between small"><span>Your progress</span><b>${pct(done, lecs.length)}%</b></div><div class="progress mt8"><i style="width:${pct(done, lecs.length)}%"></i></div></div>` : ''}
        <div class="mt24" style="display:flex;flex-direction:column;gap:10px">
          ${isRegistered() ? `<button class="btn ${enrolled ? 'btn-ghost' : 'btn-primary'} btn-block" data-act="enroll" data-id="${h(c.id)}">${enrolled ? icon('check', 16) + ' Enrolled' : 'Enroll in this course'}</button>` : `<a href="#login" class="btn btn-primary btn-block">Register to enroll</a>`}
          ${lecs[0] && ok ? `<a href="#lecture-${h((lecs.find(l => !myState().completed.includes(l.id)) || lecs[0]).id)}" class="btn btn-soft btn-block">${icon('play', 14)} ${done ? 'Continue learning' : 'Start first lecture'}</a>` : ''}
        </div>
        <div class="meta mt24" style="flex-direction:column;align-items:flex-start;gap:8px"><span>${icon('video', 15)} ${lecs.length} video lectures</span><span>${icon('file', 15)} ${mats.length} study materials</span><span>${icon('task', 15)} ${assigns.length} assignments</span><span>${icon('award', 15)} ${h(c.level || 'All levels')}</span></div>
      </div></div>
      ${quizzes.length ? `<div class="card mt16"><div class="card-hd"><h3>Practice ${h(c.subject)}</h3></div>${quizzes.map(q => `<a class="list-row" href="#quiz-${h(q.id)}"><div class="grow"><b>${h(q.title)}</b><span>${(q.questions || []).length} questions · ${h(q.duration)} min</span></div>${diffBadge(q.difficulty)}</a>`).join('')}</div>` : ''}
      </aside></div></div>`;
  },

  lectures() {
    const f = F.lectures; const st = myState(); const t = tax();
    const subjects = ['All', ...uniq([...(t.subjects || []), ...S.data.lectures.map(l => l.subject)])];
    const chapters = ['All', ...uniq(S.data.lectures.filter(l => f.subject === 'All' || l.subject === f.subject).map(l => l.chapter))];
    let list = S.data.lectures.filter(l => (f.subject === 'All' || l.subject === f.subject) && (f.chapter === 'All' || l.chapter === f.chapter) && (f.course === 'All' || l.courseId === f.course) && (!f.q || [l.title, l.topic, l.chapter, l.desc].join(' ').toLowerCase().includes(f.q.toLowerCase())));
    if (f.view === 'fav') list = list.filter(l => st.favs.includes(l.id));
    if (f.view === 'done') list = list.filter(l => st.completed.includes(l.id));
    if (f.view === 'todo') list = list.filter(l => !st.completed.includes(l.id));
    list.sort(byDate);
    return pageHead('Video Lectures', 'Organised by subject, chapter and topic. Mark lectures complete and save favourites as you go.', [['Video Lectures']]) + `<div class="container page-body"><div class="layout-side">
      <aside class="sidebar">${subjects.length > 2 ? `<div class="side-grp"><h6>Subject</h6>${subjects.map(s => `<button class="side-link ${f.subject === s ? 'active' : ''}" data-act="filter" data-k="lectures.subject" data-v="${h(s)}" data-reset="lectures.chapter">${h(s)}<small>${s === 'All' ? S.data.lectures.length : S.data.lectures.filter(l => l.subject === s).length}</small></button>`).join('')}</div>` : `<div class="side-grp"><h6>Chapter</h6>${chapters.map(c => `<button class="side-link ${f.chapter === c ? 'active' : ''}" data-act="filter" data-k="lectures.chapter" data-v="${h(c)}">${h(c)}<small>${c === 'All' ? S.data.lectures.length : S.data.lectures.filter(l => l.chapter === c).length}</small></button>`).join('')}</div>`}
        <div class="side-grp"><h6>Course</h6><select class="select" data-filter="lectures.course"><option value="All">All courses</option>${S.data.courses.map(c => `<option value="${h(c.id)}" ${f.course === c.id ? 'selected' : ''}>${h(c.title)}</option>`).join('')}</select></div></aside>
      <div><div class="toolbar"><div class="input-ic">${icon('search', 17)}<input class="input" id="f-lec-q" data-filter="lectures.q" placeholder="Search lectures by title or topic…" value="${h(f.q)}"></div>
        <select class="select" data-filter="lectures.chapter">${chapters.map(c => `<option ${f.chapter === c ? 'selected' : ''}>${h(c)}</option>`).join('')}</select></div>
        <div class="seg mb24">${[['all', 'All'], ['todo', 'Not started'], ['done', 'Completed'], ['fav', 'Favourites']].map(([k, l]) => `<button class="${f.view === k ? 'active' : ''}" data-act="filter" data-k="lectures.view" data-v="${k}">${l}</button>`).join('')}</div>
        ${!ready('lectures') ? skeletonGrid(6) : list.length ? `<div class="grid g3">${list.map(lectureCard).join('')}</div>` : emptyState(f.view === 'fav' ? 'heart' : 'video', f.view === 'fav' ? 'No favourites yet' : 'No lectures found', f.view === 'fav' ? 'Tap the heart on any lecture to save it here.' : 'Try a different subject, chapter or search term.', `<button class="btn btn-ghost" data-act="clear-filters" data-k="lectures">Clear filters</button>`)}
      </div></div></div>`;
  },

  lecture(id) {
    const l = byId('lectures', id); if (!l) return notFound('Lecture');
    const c = byId('courses', l.courseId); const st = myState();
    const siblings = S.data.lectures.filter(x => l.courseId ? x.courseId === l.courseId : x.subject === l.subject).sort((a, b) => (a.order || 0) - (b.order || 0) || (a.date || '').localeCompare(b.date || ''));
    const idx = siblings.findIndex(x => x.id === id), prev = siblings[idx - 1], next = siblings[idx + 1];
    const related = S.data.materials.filter(m => m.subject === l.subject && (m.chapter === l.chapter || (l.materialIds || []).includes(m.id)));
    const relQuiz = S.data.quizzes.filter(q => q.subject === l.subject && q.chapter === l.chapter);
    const done = st.completed.includes(id), fav = st.favs.includes(id);
    if (!hasCourseAccess(c)) return pageHead(l.title, '', [['Video Lectures', 'lectures'], [l.title]]) + `<div class="container page-body">${emptyState('lock', 'This lecture is restricted', 'It belongs to a restricted course. Ask the teacher to approve your access.', `<a href="#contact" class="btn btn-primary">Contact the teacher</a>`)}</div>`;
    return pageHead(l.title, '', [['Video Lectures', 'lectures'], [l.chapter || 'Lecture', ''], [l.title]]) + `<div class="container page-body"><div class="lec-layout">
      <div>${playerHTML(l)}
        <div class="flex between wrap mt24" style="gap:14px"><div class="flex wrap">${subjBadge(l.subject)}<span class="badge">${h(l.chapter)}</span>${l.topic ? `<span class="badge">${h(l.topic)}</span>` : ''}<span class="muted small">${icon('cal', 14)} ${fmtDate(l.date)} · ${icon('clock', 14)} ${h(l.duration || '')}</span></div>
          <div class="flex"><button class="btn btn-sm ${fav ? 'btn-danger' : 'btn-ghost'}" data-act="fav" data-id="${h(id)}">${icon(fav ? 'heartf' : 'heart', 15)} ${fav ? 'Saved' : 'Favourite'}</button><button class="btn btn-sm ${done ? 'btn-success' : 'btn-primary'}" data-act="complete" data-id="${h(id)}">${icon('check', 15)} ${done ? 'Completed' : 'Mark as completed'}</button></div></div>
        ${l.desc ? `<div class="card card-pad mt24"><h3 class="mb16" style="font-size:17px">About this lecture</h3><p class="prose">${h(l.desc)}</p></div>` : ''}
        ${(l.timestamps || []).length ? `<div class="card card-pad mt16"><h3 class="mb16" style="font-size:17px">${icon('list', 17)} Timestamps</h3><div class="ts-list">${l.timestamps.map(t => `<button class="ts" data-act="seek" data-t="${h(t.t)}"><code>${h(t.t)}</code><span>${h(t.label)}</span></button>`).join('')}</div></div>` : ''}
        <div class="card card-pad mt16"><h3 class="mb16" style="font-size:17px">${icon('file', 17)} Related notes</h3>${related.length ? `<div class="grid g2">${related.map(materialCard).join('')}</div>` : '<p class="muted">No notes linked to this chapter yet.</p>'}</div>
        <div class="flex between mt24" style="gap:12px">${prev ? `<a href="#lecture-${h(prev.id)}" class="btn btn-ghost">${icon('left', 16)} <span class="hide-sm">Previous</span></a>` : '<span></span>'}${next ? `<a href="#lecture-${h(next.id)}" class="btn btn-primary"><span class="hide-sm">Next lecture</span> ${icon('right', 16)}</a>` : '<span></span>'}</div>
      </div>
      <aside><div class="card"><div class="card-hd"><h3>${h(c ? c.title : l.subject + ' lectures')}</h3><span class="muted small">${idx + 1}/${siblings.length}</span></div><div class="playlist card-pad" style="padding:10px;max-height:520px;overflow-y:auto">${siblings.map((x, i) => `<a class="pl ${x.id === id ? 'cur' : ''} ${st.completed.includes(x.id) ? 'done' : ''}" href="#lecture-${h(x.id)}"><span class="n">${st.completed.includes(x.id) && x.id !== id ? icon('check', 13) : i + 1}</span><div class="grow"><b>${h(x.title)}</b><span>${h(x.duration || '')}</span></div></a>`).join('')}</div></div>
        ${relQuiz.length ? `<div class="card mt16"><div class="card-hd"><h3>Test yourself</h3></div>${relQuiz.map(q => `<a class="list-row" href="#quiz-${h(q.id)}"><div class="grow"><b>${h(q.title)}</b><span>${(q.questions || []).length} questions</span></div>${icon('arrow', 16)}</a>`).join('')}</div>` : ''}</aside>
    </div></div>`;
  },

  materials() {
    const f = F.materials; const t = tax();
    const all = S.data.materials;
    const classes = ['All', ...uniq([...(t.classes || []), ...all.map(m => m.cls)])];
    const subjects = ['All', ...uniq([...(t.subjects || []), ...all.map(m => m.subject)])];
    const chapters = ['All', ...uniq(all.filter(m => f.subject === 'All' || m.subject === f.subject).map(m => m.chapter))];
    const tags = ['All', 'Important', 'Revision', 'Practice', 'Formula Sheet'];
    const types = ['All', ...uniq(all.map(m => m.type))];
    const list = all.filter(m => (f.cls === 'All' || m.cls === f.cls) && (f.subject === 'All' || m.subject === f.subject) && (f.chapter === 'All' || m.chapter === f.chapter) && (f.tag === 'All' || (m.tags || []).includes(f.tag)) && (f.type === 'All' || m.type === f.type) && (!f.q || [m.title, m.topic, m.chapter, m.subject].join(' ').toLowerCase().includes(f.q.toLowerCase()))).sort(byDate);
    return pageHead('Study Materials', 'Notes, handouts, formula sheets and worksheets — preview right here or download as PDF.', [['Study Materials']]) + `<div class="container page-body"><div class="layout-side">
      <aside class="sidebar"><div class="side-grp"><h6>Class</h6>${classes.map(s => `<button class="side-link ${f.cls === s ? 'active' : ''}" data-act="filter" data-k="materials.cls" data-v="${h(s)}">${h(s)}</button>`).join('')}</div>
      <div class="side-grp"><h6>Type</h6>${types.map(s => `<button class="side-link ${f.type === s ? 'active' : ''}" data-act="filter" data-k="materials.type" data-v="${h(s)}">${h(s)}<small>${s === 'All' ? all.length : all.filter(m => m.type === s).length}</small></button>`).join('')}</div></aside>
      <div><div class="toolbar"><div class="input-ic">${icon('search', 17)}<input class="input" id="f-mat-q" data-filter="materials.q" placeholder="Search notes…" value="${h(f.q)}"></div>
        ${subjects.length > 2 ? `<select class="select" data-filter="materials.subject" data-reset="materials.chapter">${subjects.map(c => `<option ${f.subject === c ? 'selected' : ''}>${h(c)}</option>`).join('')}</select>` : ''}
        <select class="select" data-filter="materials.chapter">${chapters.map(c => `<option ${f.chapter === c ? 'selected' : ''}>${h(c)}</option>`).join('')}</select></div>
        <div class="chips mb24">${tags.map(s => `<button class="chip ${f.tag === s ? 'active' : ''}" data-act="filter" data-k="materials.tag" data-v="${h(s)}">${icon('tag', 13)} ${h(s)}</button>`).join('')}</div>
        ${!ready('materials') ? skeletonGrid(4, 'g2') : list.length ? `<div class="grid g2">${list.map(materialCard).join('')}</div>` : emptyState('file', 'No materials found', 'Try a different filter combination.', `<button class="btn btn-ghost" data-act="clear-filters" data-k="materials">Clear filters</button>`)}
      </div></div></div>`;
  },

  material(id) {
    const m = byId('materials', id); if (!m) return notFound('Material');
    const c = byId('courses', m.courseId);
    if (!hasCourseAccess(c)) return pageHead(m.title, '', [['Study Materials', 'materials'], [m.title]]) + `<div class="container page-body">${emptyState('lock', 'This material is restricted', 'Ask the teacher to approve your access.')}</div>`;
    const saved = myState().savedNotes.includes(id);
    const related = S.data.lectures.filter(l => l.subject === m.subject && l.chapter === m.chapter);
    const viewer = m.assetId ? `<div class="reader"><div class="reader-bar">${icon('pdf', 16)} <b style="color:var(--text)">${h(m.fileName || m.title + '.pdf')}</b><span>${fmtSize(m.size)}</span><a class="link" style="margin-left:auto" href="/_blob/${h(m.assetId)}" target="_blank" rel="noopener">Open in new tab ${icon('external', 14)}</a></div><iframe class="pdf-frame" src="/_blob/${h(m.assetId)}" title="${h(m.title)}"></iframe></div>`
      : `<div class="reader"><div class="reader-bar">${icon('pdf', 16)} <b style="color:var(--text)">${h(m.title)}.pdf</b><span>· ${h(m.pages || 1)} pages</span><span style="margin-left:auto">Preview</span></div><div class="reader-wrap"><div class="reader-page"><div class="pdf-head"><span>${h(site().brand || 'OnlyMaths')}</span><span>${h(m.subject)} · ${h(m.cls || '')}</span></div>${md(m.content || '')}</div></div></div>`;
    return pageHead(m.title, '', [['Study Materials', 'materials'], [m.title]]) + `<div class="container page-body"><div class="lec-layout"><div>${viewer}</div>
      <aside><div class="card card-pad"><div class="flex" style="gap:14px">${docIcon(m.type)}<div><b>${h(m.type || 'Notes')}</b><div class="muted small">${h(m.subject)} · ${h(m.chapter || '')}</div></div></div>
        <div class="flex wrap mt16" style="gap:6px">${(m.tags || []).map(t => `<span class="badge b-royal">${h(t)}</span>`).join('')}</div>
        <table class="t mt16" style="font-size:13.5px"><tr><td class="muted">Class</td><td>${h(m.cls || '—')}</td></tr><tr><td class="muted">Topic</td><td>${h(m.topic || '—')}</td></tr><tr><td class="muted">Uploaded</td><td>${fmtDate(m.date)}</td></tr><tr><td class="muted">File</td><td>${m.assetId ? h(fmtSize(m.size) || 'PDF') : 'PDF · ' + h(m.pages || 1) + ' pages'}</td></tr></table>
        <div class="mt16" style="display:flex;flex-direction:column;gap:10px"><button class="btn btn-primary btn-block" data-act="dl-mat" data-id="${h(id)}">${icon('download', 16)} Download PDF</button><button class="btn btn-ghost btn-block" data-act="save-note" data-id="${h(id)}">${icon(saved ? 'bookmarkf' : 'bookmark', 16)} ${saved ? 'Saved to library' : 'Save to my library'}</button></div></div>
        ${related.length ? `<div class="card mt16"><div class="card-hd"><h3>Watch the lectures</h3></div>${related.map(l => `<a class="list-row" href="#lecture-${h(l.id)}"><span style="color:var(--royal)">${icon('play', 14)}</span><div class="grow"><b>${h(l.title)}</b><span>${h(l.duration)}</span></div></a>`).join('')}</div>` : ''}</aside></div></div>`;
  },
};
function legal(title, secs) { return pageHead(title, 'Last updated ' + fmtDate(site().seededAt || nowISO()), [[title]]) + `<div class="container page-body" style="max-width:820px"><div class="card card-pad prose" style="padding:34px">${secs.map(([t, d]) => `<h3>${h(t)}</h3><p>${h(d)}</p>`).join('')}<h3>Contact</h3><p>${h(site().email || '')}</p></div></div>`; }
function notFound(what = 'Page') { return pageHead(what + ' not found', '', [[what]]) + `<div class="container page-body">${!ready('courses', 'lectures') ? skeletonGrid(3) : emptyState('compass', `This ${what.toLowerCase()} doesn't exist`, 'It may have been removed or the link is incorrect.', `<a href="#home" class="btn btn-primary">Back to home</a>`)}</div>`; }

function playerHTML(l) {
  const yid = l.videoType === 'youtube' ? ytId(l.videoUrl) : '';
  if (l.videoType === 'upload' && l.assetId) return `<div class="player"><video id="lec-video" controls preload="metadata" src="/_blob/${h(l.assetId)}" controlslist="nodownload"></video></div>`;
  if (yid) return `<div class="player" id="yt-player" data-yid="${h(yid)}"><div class="player-ph"><button class="pbtn" data-act="yt-play" aria-label="Play">${icon('play', 30)}</button><b style="font-size:18px;max-width:560px">${h(l.title)}</b><p>Streams from YouTube.</p></div></div><p class="small muted mt8">Video not loading? <a class="link" href="https://www.youtube.com/watch?v=${h(yid)}" target="_blank" rel="noopener">Watch on YouTube ${icon('external', 13)}</a></p>`;
  const link = l.videoType === 'link' ? safeUrl(l.videoUrl) : '';
  if (link) return `<div class="player"><div class="player-ph"><a class="pbtn" href="${h(link)}" target="_blank" rel="noopener" aria-label="Open video">${icon('play', 30)}</a><b style="font-size:18px">${h(l.title)}</b><p>This lecture is hosted on a secure video platform. It opens in a new tab.</p><a href="${h(link)}" target="_blank" rel="noopener" class="btn btn-white btn-sm">Open lecture video ${icon('external', 14)}</a></div></div>`;
  return `<div class="player"><div class="player-ph"><div class="pbtn" style="opacity:.6">${icon('video', 30)}</div><b style="font-size:18px">${h(l.title)}</b><p>The video for this lecture hasn't been attached yet.${S.isAdmin ? ' Add a YouTube link or upload a video from the admin panel.' : ' Notes and timestamps are available below.'}</p>${S.isAdmin ? `<a href="#admin-lectures" class="btn btn-white btn-sm">Attach video</a>` : ''}</div></div>`;
}
