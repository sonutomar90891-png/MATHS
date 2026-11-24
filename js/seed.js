/* Sample content written into the database on the owner's first visit. Everything is editable from the admin panel. */
function makeSeed() {
  const D = 86400000, now = Date.now();
  const ago = d => new Date(now - d * D).toISOString();
  const ahead = d => new Date(now + d * D).toISOString();
  const T = 'Dr. A. Mehta';
  const q = (text, options, answer, explanation, type) => ({ id: genId(), text, options, answer, explanation, type: type || (answer.length > 1 ? 'multi' : 'single') });

  const site = {
    brand: 'OnlyMaths', tagline: 'Academy', seededAt: nowISO(),
    heroBadge: 'New', heroBadgeText: 'JEE Main 2027 mock test series is live',
    heroTitle: 'Learn Smarter. Achieve More.',
    heroSub: 'Structured video lectures, beautifully crafted notes, chapter-wise quizzes and exam-grade mock tests for Class 11–12, JEE and NEET — all in one place, taught by an educator who cares about your progress.',
    instructor: T, instructorRole: 'Founder & Lead Educator · Physics, Chemistry & Mathematics',
    instructorBio: 'Over 12 years of teaching experience preparing Class 11–12 students for board exams, JEE and NEET. Focused on concept-first teaching, exam strategy and consistent practice.',
    about: 'OnlyMaths is an online academy built around one idea: every student deserves clear concepts, quality material and honest feedback on their progress.\n\nEvery lecture is planned chapter by chapter, every note is written to be revised in minutes, and every test comes with detailed solutions so mistakes turn into lessons.\n\nWhether you are strengthening your basics for the boards or pushing for a top rank in JEE or NEET, the platform tracks your journey and shows you exactly where to focus next.',
    mission: 'Make high-quality, structured exam preparation accessible, measurable and motivating for every student.',
    email: 'hello@onlymaths.in', phone: '+91 98765 43210', whatsapp: '919876543210', address: 'Online classes · India',
    youtube: 'https://www.youtube.com/', instagram: 'https://www.instagram.com/', telegram: 'https://telegram.org/', facebook: 'https://www.facebook.com/', linkedin: '',
  };
  const taxonomy = {
    classes: ['Class 11', 'Class 12', 'JEE / NEET'],
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
    chapters: {
      Physics: ['Kinematics', 'Laws of Motion', 'Work, Energy & Power', 'Electrostatics', 'Current Electricity'],
      Chemistry: ['Mole Concept', 'Atomic Structure', 'Chemical Bonding', 'General Organic Chemistry'],
      Mathematics: ['Trigonometry', 'Limits & Derivatives', 'Integration', 'Matrices & Determinants'],
      Biology: ['Cell Biology', 'Genetics'],
    },
  };

  const courses = {
    cmech: { title: 'Mechanics Mastery', subject: 'Physics', cls: 'Class 11', instructor: T, level: 'Beginner → Advanced', featured: true, order: 1, restricted: false, desc: 'Kinematics, Newton\'s laws, work–energy and rotational basics built from first principles, with 300+ graded problems.' },
    celec: { title: 'Electrostatics & Current Electricity', subject: 'Physics', cls: 'Class 12', instructor: T, level: 'Intermediate', featured: true, order: 2, restricted: false, desc: 'Coulomb\'s law to Kirchhoff\'s rules — field lines, Gauss\'s law, capacitors and circuits made visual and intuitive.' },
    cpchem: { title: 'Physical Chemistry Foundations', subject: 'Chemistry', cls: 'Class 11', instructor: T, level: 'Beginner', featured: true, order: 3, restricted: false, desc: 'Mole concept, atomic structure and chemical bonding — the numerical backbone of chemistry, explained step by step.' },
    ccalc: { title: 'Calculus Complete', subject: 'Mathematics', cls: 'Class 12', instructor: T, level: 'Intermediate', featured: true, order: 4, restricted: false, desc: 'Limits, continuity, differentiation and integration with board-pattern and JEE-pattern problem solving.' },
    corg: { title: 'Organic Reaction Mechanisms', subject: 'Chemistry', cls: 'Class 12', instructor: T, level: 'Advanced', featured: true, order: 5, restricted: false, desc: 'Electronic effects, reaction intermediates and named reactions — understand why reactions happen, not just what happens.' },
    calg: { title: 'Algebra & Trigonometry', subject: 'Mathematics', cls: 'Class 11', instructor: T, level: 'Beginner', featured: true, order: 6, restricted: false, desc: 'Identities, equations, sequences and quadratic theory — sharpen the tools you will use in every later chapter.' },
  };

  const L = (title, courseId, subject, chapter, topic, duration, d, desc, ts, order) => ({ title, courseId, subject, chapter, topic, duration, date: ago(d), desc, timestamps: ts, videoType: 'none', videoUrl: '', assetId: '', order });
  const lectures = {
    l1: L('Introduction to Kinematics: Distance, Displacement & Speed', 'cmech', 'Physics', 'Kinematics', 'Basics of motion', '48:20', 1, 'We build the language of motion — frame of reference, scalar vs vector quantities, and the difference between distance and displacement, with plenty of board-level examples.', [{ t: '00:00', label: 'Why kinematics matters' }, { t: '06:40', label: 'Frame of reference' }, { t: '15:10', label: 'Distance vs displacement' }, { t: '29:30', label: 'Average speed and velocity' }, { t: '41:00', label: 'Practice problems' }], 1),
    l2: L('Equations of Motion with Graphical Derivation', 'cmech', 'Physics', 'Kinematics', 'Equations of motion', '56:05', 2, 'Derive all three equations of motion from velocity–time graphs and learn when each one is the fastest route to the answer.', [{ t: '00:00', label: 'Recap of v–t graphs' }, { t: '10:15', label: 'First equation' }, { t: '22:40', label: 'Second equation (area under graph)' }, { t: '35:00', label: 'Third equation' }, { t: '46:30', label: 'Distance in nth second' }], 2),
    l3: L('Projectile Motion — Range, Height and Time of Flight', 'cmech', 'Physics', 'Kinematics', 'Projectile motion', '62:30', 4, 'Split motion into independent horizontal and vertical components and derive range, maximum height and time of flight.', [{ t: '00:00', label: 'Independence of motion' }, { t: '14:00', label: 'Time of flight' }, { t: '27:20', label: 'Maximum height' }, { t: '38:45', label: 'Horizontal range & 45°' }, { t: '52:00', label: 'JEE-level problems' }], 3),
    l4: L('Newton\'s Laws and Free-Body Diagrams', 'cmech', 'Physics', 'Laws of Motion', 'Newton\'s laws', '51:10', 6, 'Master free-body diagrams — the single most important skill in mechanics — and apply Newton\'s laws to blocks, pulleys and inclines.', [{ t: '00:00', label: 'Inertia and the first law' }, { t: '12:30', label: 'F = dp/dt' }, { t: '24:00', label: 'Drawing FBDs' }, { t: '39:10', label: 'Pulley systems' }], 4),
    l5: L('Coulomb\'s Law and Superposition', 'celec', 'Physics', 'Electrostatics', 'Coulomb\'s law', '44:45', 3, 'Charge quantisation, conservation of charge, Coulomb\'s law in vector form and the superposition principle.', [{ t: '00:00', label: 'Properties of charge' }, { t: '11:20', label: 'Coulomb\'s law' }, { t: '23:00', label: 'Effect of medium' }, { t: '31:40', label: 'Superposition' }], 1),
    l6: L('Electric Field and Field Lines', 'celec', 'Physics', 'Electrostatics', 'Electric field', '49:00', 5, 'Define the electric field, calculate it for point charges and dipoles, and read field-line diagrams like a pro.', [{ t: '00:00', label: 'Field as force per unit charge' }, { t: '15:30', label: 'Field of a dipole' }, { t: '30:10', label: 'Properties of field lines' }], 2),
    l7: L('Mole Concept — From Atoms to Grams', 'cpchem', 'Chemistry', 'Mole Concept', 'Mole & molar mass', '40:15', 2, 'The bridge between the microscopic and macroscopic world: Avogadro\'s number, molar mass and converting between mass, moles and particles.', [{ t: '00:00', label: 'What is a mole?' }, { t: '09:45', label: 'Molar mass' }, { t: '20:30', label: 'Mass–mole–particle conversions' }, { t: '32:00', label: 'Percentage composition' }], 1),
    l8: L('Stoichiometry and Limiting Reagent', 'cpchem', 'Chemistry', 'Mole Concept', 'Stoichiometry', '46:50', 7, 'Balance equations, use mole ratios and identify the limiting reagent in multi-step numerical problems.', [{ t: '00:00', label: 'Balanced equations' }, { t: '13:15', label: 'Mole ratios' }, { t: '27:40', label: 'Limiting reagent' }], 2),
    l9: L('Derivatives from First Principles', 'ccalc', 'Mathematics', 'Limits & Derivatives', 'First principles', '53:40', 3, 'Understand the derivative as a limit, compute derivatives of standard functions from first principles and interpret them geometrically.', [{ t: '00:00', label: 'Slope of a tangent' }, { t: '14:30', label: 'Definition as a limit' }, { t: '28:10', label: 'Standard derivatives' }, { t: '44:00', label: 'Product & quotient rules' }], 1),
    l10: L('Integration by Substitution', 'ccalc', 'Mathematics', 'Integration', 'Substitution', '58:25', 8, 'Recognise the pattern f(g(x))·g\'(x) and use substitution to crack integrals that look impossible at first glance.', [{ t: '00:00', label: 'Integration as anti-derivative' }, { t: '12:00', label: 'The substitution idea' }, { t: '30:45', label: 'Trigonometric substitutions' }, { t: '47:10', label: 'Practice set' }], 2),
    l11: L('Electronic Effects: Inductive, Resonance & Hyperconjugation', 'corg', 'Chemistry', 'General Organic Chemistry', 'Electronic effects', '65:00', 9, 'The three effects that explain acidity, basicity and stability of intermediates across all of organic chemistry.', [{ t: '00:00', label: 'Inductive effect' }, { t: '20:00', label: 'Resonance' }, { t: '42:30', label: 'Hyperconjugation' }], 1),
    l12: L('Trigonometric Identities Toolkit', 'calg', 'Mathematics', 'Trigonometry', 'Identities', '45:30', 10, 'Compound angles, multiple angles and transformation formulae — with the tricks that save time in exams.', [{ t: '00:00', label: 'Fundamental identities' }, { t: '13:40', label: 'Compound angles' }, { t: '28:15', label: 'Multiple angles' }], 1),
  };

  const M = (title, cls, subject, chapter, topic, type, tags, d, content, pages) => ({ title, cls, subject, chapter, topic, type, tags, date: ago(d), content, assetId: '', fileName: '', size: 0, pages });
  const materials = {
    m1: M('Kinematics — Complete Chapter Notes', 'Class 11', 'Physics', 'Kinematics', 'Equations of motion', 'Notes', ['Important', 'Revision'], 1, `# Kinematics — Chapter Notes
## 1. Basic terms
- **Distance** is the total path length travelled. It is a scalar and never negative.
- **Displacement** is the shortest straight-line vector from initial to final position.
- **Speed** = distance / time (scalar). **Velocity** = displacement / time (vector).
> Distance >= |Displacement|. They are equal only for straight-line motion without reversal.
## 2. Equations of motion (constant acceleration)
- v = u + at
- s = ut + (1/2)at²
- v² = u² + 2as
- Distance in nth second: s_n = u + (a/2)(2n − 1)
## 3. Graphs
- Slope of a position–time graph = velocity.
- Slope of a velocity–time graph = acceleration.
- Area under a velocity–time graph = displacement.
## 4. Motion under gravity
- Take a = −g (upwards positive). For a body thrown up with speed u:
- Maximum height H = u²/2g, time to reach top t = u/g.
- Total time of flight = 2u/g (same launch and landing level).
## 5. Projectile motion
- Time of flight T = 2u sinθ / g
- Maximum height H = u² sin²θ / 2g
- Range R = u² sin2θ / g, maximum at θ = 45°.
> Complementary angles (θ and 90° − θ) give the same range.
## 6. Exam tips
- Always fix a sign convention before writing equations.
- Use the v–t graph when acceleration changes in stages.
- Check units and order of magnitude in the final answer.`, 4),
    m2: M('Laws of Motion — Formula Sheet', 'Class 11', 'Physics', 'Laws of Motion', 'Newton\'s laws', 'Formula Sheet', ['Formula Sheet', 'Revision'], 3, `# Laws of Motion — Formula Sheet
## Newton's laws
- First law: a body stays at rest or in uniform motion unless acted upon by a net external force.
- Second law: F = dp/dt = ma (for constant mass).
- Third law: forces occur in equal and opposite action–reaction pairs acting on different bodies.
## Momentum & impulse
- p = mv
- Impulse J = F·Δt = Δp
- Conservation of momentum: if net external force = 0, total p is constant.
## Friction
- Static friction: f_s <= μ_s N
- Kinetic friction: f_k = μ_k N
- Angle of repose: tanθ = μ_s
## Circular motion
- Centripetal acceleration a = v²/r = ω²r
- Banking of roads (no friction): tanθ = v²/rg
## Connected bodies
- Atwood machine: a = (m1 − m2)g / (m1 + m2), T = 2 m1 m2 g / (m1 + m2)`, 2),
    m3: M('Electrostatics — Coulomb\'s Law & Electric Field', 'Class 12', 'Physics', 'Electrostatics', 'Coulomb\'s law', 'Notes', ['Important'], 2, `# Electrostatics — Part 1
## Properties of charge
- Charge is quantised: q = ne, where e = 1.6 × 10⁻¹⁹ C.
- Charge is conserved and additive.
## Coulomb's law
- F = k q1 q2 / r², with k = 1/(4πε₀) = 9 × 10⁹ N m² C⁻²
- In a medium of dielectric constant K the force becomes F/K.
> Doubling the separation reduces the force to one quarter (inverse-square law).
## Electric field
- E = F/q₀ (force per unit positive test charge). Unit: N/C or V/m.
- Point charge: E = kq/r², directed away from a positive charge.
- On the axis of a dipole: E = 2kp/r³. On the equatorial line: E = kp/r³.
## Field lines
- Start on positive and end on negative charges.
- Never intersect each other.
- Closer lines mean a stronger field.
- Field inside a charged conductor is zero in electrostatic equilibrium.`, 3),
    m4: M('Mole Concept — Practice Worksheet', 'Class 11', 'Chemistry', 'Mole Concept', 'Mole & molar mass', 'Worksheet', ['Practice'], 4, `# Mole Concept — Practice Worksheet
## Key relations
- Number of moles n = mass / molar mass
- Number of particles = n × 6.022 × 10²³
- Volume of 1 mol of an ideal gas at STP (273 K, 1 atm) = 22.4 L
## Section A — Basic
- 1. Calculate the number of moles in 36 g of water.
- 2. Find the mass of 0.5 mol of CO2.
- 3. How many molecules are present in 4.4 g of CO2?
## Section B — Intermediate
- 4. Calculate the percentage of carbon in glucose (C6H12O6).
- 5. What volume does 8 g of O2 occupy at STP?
- 6. How many oxygen atoms are present in 0.1 mol of H2SO4?
## Section C — Challenge
- 7. 10 g of H2 reacts with 64 g of O2. Identify the limiting reagent and the mass of water formed.
- 8. An oxide of nitrogen contains 30.4% N by mass. Find its empirical formula.
> Answers: 1) 2 mol 2) 22 g 3) 6.022 × 10²² 4) 40% 5) 5.6 L 6) 2.4 × 10²³ 7) O2, 72 g 8) NO2`, 2),
    m5: M('Differentiation — Formula Sheet', 'Class 12', 'Mathematics', 'Limits & Derivatives', 'Standard derivatives', 'Formula Sheet', ['Formula Sheet', 'Important'], 2, `# Differentiation — Formula Sheet
## Standard derivatives
- d/dx (xⁿ) = n xⁿ⁻¹
- d/dx (sin x) = cos x, d/dx (cos x) = −sin x
- d/dx (tan x) = sec² x
- d/dx (eˣ) = eˣ, d/dx (aˣ) = aˣ ln a
- d/dx (ln x) = 1/x
## Rules
- Product rule: (uv)' = u'v + uv'
- Quotient rule: (u/v)' = (u'v − uv') / v²
- Chain rule: d/dx f(g(x)) = f'(g(x)) · g'(x)
## Applications
- Slope of tangent at x = a is f'(a).
- f increasing where f'(x) > 0, decreasing where f'(x) < 0.
- Local maximum: f'(a) = 0 and f''(a) < 0. Local minimum: f'(a) = 0 and f''(a) > 0.
> |x| is continuous at 0 but not differentiable there.`, 2),
    m6: M('Integration — Methods Handout', 'Class 12', 'Mathematics', 'Integration', 'Substitution', 'Handout', ['Revision'], 6, `# Integration — Methods Handout
## Standard integrals
- ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C, n ≠ −1
- ∫ 1/x dx = ln|x| + C
- ∫ eˣ dx = eˣ + C
- ∫ sin x dx = −cos x + C, ∫ cos x dx = sin x + C
## Substitution
- Look for a function and its derivative: ∫ f(g(x)) g'(x) dx — put t = g(x).
- Example: ∫ 2x cos(x²) dx, put t = x², dt = 2x dx, answer sin(x²) + C.
## Integration by parts
- ∫ u v dx = u ∫v dx − ∫ (u' ∫v dx) dx
- Choose u by ILATE: Inverse, Logarithmic, Algebraic, Trigonometric, Exponential.
## Definite integrals
- ∫ from a to b f(x) dx = F(b) − F(a)
- ∫ from 0 to a f(x) dx = ∫ from 0 to a f(a − x) dx`, 3),
    m7: M('General Organic Chemistry — Electronic Effects', 'Class 11', 'Chemistry', 'General Organic Chemistry', 'Electronic effects', 'Handout', ['Important', 'Revision'], 8, `# GOC — Electronic Effects
## Inductive effect (I)
- Permanent displacement of sigma electrons along a chain due to electronegativity difference.
- −I groups: −NO2 > −CN > −COOH > −F > −Cl > −Br > −I
- +I groups: alkyl groups, e.g. −C(CH3)3 > −CH(CH3)2 > −CH2CH3 > −CH3
## Resonance (M / R)
- Delocalisation of pi electrons or lone pairs in conjugated systems.
- +M: −OH, −OR, −NH2. −M: −NO2, −CHO, −COOH.
## Hyperconjugation
- Delocalisation of sigma C–H electrons into an adjacent empty p orbital or pi bond.
- Explains carbocation stability: 3° > 2° > 1° > methyl.
> Acid strength rises with −I and −M groups; base strength rises with +I groups.`, 2),
    m8: M('Trigonometry — Identities Formula Sheet', 'Class 11', 'Mathematics', 'Trigonometry', 'Identities', 'Formula Sheet', ['Formula Sheet'], 10, `# Trigonometry — Identities
## Fundamental
- sin²θ + cos²θ = 1
- 1 + tan²θ = sec²θ
- 1 + cot²θ = cosec²θ
## Compound angles
- sin(A ± B) = sinA cosB ± cosA sinB
- cos(A ± B) = cosA cosB ∓ sinA sinB
- tan(A + B) = (tanA + tanB) / (1 − tanA tanB)
## Multiple angles
- sin2A = 2 sinA cosA
- cos2A = cos²A − sin²A = 1 − 2sin²A = 2cos²A − 1
- sin3A = 3sinA − 4sin³A, cos3A = 4cos³A − 3cosA`, 2),
  };

  const quizzes = {
    qzdaily: {
      title: 'Daily Quiz — Mixed Bag', kind: 'Daily', subject: 'General', chapter: 'Mixed', topic: 'Daily practice', difficulty: 'Easy', duration: 5, randomize: true, date: ago(0), questions: [
        q('What is the SI unit of power?', ['Joule', 'Watt', 'Newton', 'Pascal'], [1], 'Power is the rate of doing work: 1 watt = 1 joule per second.'),
        q('What is the pH of pure water at 25 °C?', ['0', '5', '7', '14'], [2], 'Pure water has [H⁺] = 10⁻⁷ M at 25 °C, so pH = −log(10⁻⁷) = 7.'),
        q('∫ 2x dx equals:', ['x + C', '2x² + C', 'x² + C', '2 + C'], [2], 'Using ∫xⁿ dx = xⁿ⁺¹/(n+1): ∫2x dx = 2·x²/2 = x² + C.'),
        q('Newton\'s second law states that force equals:', ['Rate of change of momentum', 'Mass × velocity', 'Work / time', 'Momentum × time'], [0], 'F = dp/dt. For constant mass this reduces to F = ma.'),
        q('Which pair of species are isotopes?', ['¹⁴C and ¹⁴N', '¹²C and ¹⁴C', 'O₂ and O₃', '⁴⁰Ar and ⁴⁰Ca'], [1], 'Isotopes have the same atomic number but different mass numbers: ¹²C and ¹⁴C both have Z = 6.'),
      ]
    },
    qzkin: {
      title: 'Kinematics — Chapter Quiz', kind: 'Chapter-wise', subject: 'Physics', chapter: 'Kinematics', topic: 'Equations of motion', difficulty: 'Moderate', duration: 10, randomize: true, date: ago(1), questions: [
        q('A body starts from rest with a uniform acceleration of 2 m/s². How far does it travel in 5 s?', ['10 m', '20 m', '25 m', '50 m'], [2], 's = ut + ½at² = 0 + ½ × 2 × 5² = 25 m.'),
        q('The slope of a velocity–time graph gives:', ['Displacement', 'Acceleration', 'Speed', 'Jerk'], [1], 'Slope = Δv/Δt, which is acceleration. The area under the v–t graph gives displacement.'),
        q('A ball is thrown vertically up at 20 m/s. Taking g = 10 m/s², its maximum height is:', ['10 m', '20 m', '40 m', '80 m'], [1], 'At the top v = 0, so H = u²/2g = 400/20 = 20 m.'),
        q('Which of the following are vector quantities? (Select all that apply)', ['Displacement', 'Speed', 'Velocity', 'Acceleration'], [0, 2, 3], 'Displacement, velocity and acceleration have direction. Speed is the magnitude of velocity and is a scalar.'),
        q('For a fixed launch speed, the horizontal range of a projectile on level ground is maximum at:', ['30°', '45°', '60°', '90°'], [1], 'R = u² sin2θ / g is maximum when sin2θ = 1, i.e. θ = 45°.'),
        q('A body starts from rest with acceleration 4 m/s². The distance covered in the 3rd second is:', ['6 m', '8 m', '10 m', '18 m'], [2], 's_n = u + (a/2)(2n − 1) = 0 + 2 × 5 = 10 m.'),
      ]
    },
    qzcoul: {
      title: 'Coulomb\'s Law — Topic Practice', kind: 'Topic-wise', subject: 'Physics', chapter: 'Electrostatics', topic: 'Coulomb\'s law', difficulty: 'Moderate', duration: 8, randomize: true, date: ago(2), questions: [
        q('If the distance between two point charges is doubled, the force between them becomes:', ['2F', 'F/2', 'F/4', '4F'], [2], 'F ∝ 1/r². Doubling r makes the force (1/2)² = 1/4 of the original.'),
        q('Which are valid SI units of electric field? (Select all that apply)', ['N/C', 'V/m', 'C/N', 'J/C'], [0, 1], 'E = F/q gives N/C, and E = V/d gives V/m. These are equivalent. J/C is the volt, a unit of potential.'),
        q('The electric field inside a charged conducting sphere in electrostatic equilibrium is:', ['Maximum at the centre', 'Zero', 'Equal to the field at the surface', 'Inversely proportional to r'], [1], 'Free charges rearrange on the surface until the field inside the conductor becomes zero.'),
        q('Two charges are moved from air into a medium of dielectric constant K at the same separation. The force becomes:', ['KF', 'F/K', 'F/K²', 'F'], [1], 'In a medium, F = (1/4πε₀K)·q₁q₂/r², so the force is reduced by a factor of K.'),
        q('The smallest magnitude of free charge that can exist in nature is:', ['1 C', '1.6 × 10⁻¹⁹ C', '9.1 × 10⁻³¹ C', '6.02 × 10²³ C'], [1], 'Charge is quantised: q = ne, where e = 1.6 × 10⁻¹⁹ C.'),
        q('Two electric field lines can never intersect because:', ['They are always parallel', 'The field would have two directions at one point', 'Charges repel each other', 'Field lines are closed loops'], [1], 'At an intersection the tangent would give two directions of the field at the same point, which is impossible.'),
      ]
    },
    qzmole: {
      title: 'Mole Concept — Quick Check', kind: 'Chapter-wise', subject: 'Chemistry', chapter: 'Mole Concept', topic: 'Mole & molar mass', difficulty: 'Easy', duration: 8, randomize: true, date: ago(3), questions: [
        q('How many moles are present in 36 g of water (H₂O)?', ['1', '2', '3', '18'], [1], 'Molar mass of H₂O = 18 g/mol, so n = 36/18 = 2 mol.'),
        q('The molar mass of CO₂ is:', ['28 g/mol', '32 g/mol', '44 g/mol', '46 g/mol'], [2], '12 + 2 × 16 = 44 g/mol.'),
        q('Avogadro\'s number is approximately:', ['6.022 × 10²³', '6.022 × 10⁻²³', '1.6 × 10⁻¹⁹', '3 × 10⁸'], [0], 'One mole contains 6.022 × 10²³ particles.'),
        q('At STP (273 K, 1 atm), one mole of an ideal gas occupies:', ['11.2 L', '22.4 L', '24.8 L', '1 L'], [1], 'Using PV = nRT at 273 K and 1 atm gives approximately 22.4 L.'),
        q('How many moles of oxygen atoms are present in 1 mole of H₂SO₄?', ['1', '2', '4', '7'], [2], 'Each H₂SO₄ molecule contains four O atoms.'),
        q('The mass percentage of carbon in methane (CH₄) is:', ['25%', '50%', '75%', '80%'], [2], '12 / 16 × 100 = 75%.'),
      ]
    },
    qzdiff: {
      title: 'Differentiation — Speed Drill', kind: 'Topic-wise', subject: 'Mathematics', chapter: 'Limits & Derivatives', topic: 'Standard derivatives', difficulty: 'Difficult', duration: 10, randomize: true, date: ago(4), questions: [
        q('d/dx (x³) equals:', ['x²', '3x²', '3x³', 'x⁴/4'], [1], 'Power rule: d/dx xⁿ = n xⁿ⁻¹.'),
        q('d/dx (e^{2x}) equals:', ['e^{2x}', '2e^{x}', '2e^{2x}', 'e^{2x}/2'], [2], 'Chain rule: derivative of e^{u} is e^{u}·u\', with u = 2x giving 2e^{2x}.'),
        q('d/dx (ln x) for x > 0 equals:', ['1/x', 'x', 'ln x / x', 'eˣ'], [0], 'Standard result: the derivative of ln x is 1/x.'),
        q('If y = x² sin x, then dy/dx is:', ['2x cos x', '2x sin x + x² cos x', 'x² cos x', '2x sin x − x² cos x'], [1], 'Product rule: (x²)\' sin x + x² (sin x)\' = 2x sin x + x² cos x.'),
        q('Which of these functions are differentiable at x = 0? (Select all that apply)', ['x²', '|x|', 'sin x', 'x^{1/3}'], [0, 2], '|x| has a corner at 0 and x^{1/3} has a vertical tangent at 0, so neither is differentiable there.'),
        q('The slope of the tangent to y = x² at x = 3 is:', ['3', '6', '9', '2'], [1], 'dy/dx = 2x, so the slope at x = 3 is 6.'),
      ]
    },
  };

  const P = {
    p1: q('A force F = (3î + 4ĵ) N displaces a body by s = (2î + ĵ) m. The work done is:', ['5 J', '7 J', '10 J', '11 J'], [2], 'W = F·s = 3×2 + 4×1 = 10 J.'),
    p2: q('If the length of a simple pendulum is made four times, its time period becomes:', ['Half', 'Double', 'Four times', 'Unchanged'], [1], 'T = 2π√(l/g) ∝ √l, so √4 = 2: the period doubles.'),
    p3: q('The escape velocity from the surface of the Earth is approximately:', ['7.9 km/s', '11.2 km/s', '3 × 10⁵ km/s', '42 km/s'], [1], 'vₑ = √(2gR) ≈ 11.2 km/s.'),
    p4: q('A wire of resistance R is stretched to twice its length at constant volume. Its new resistance is:', ['R/2', '2R', '4R', 'R'], [2], 'Length doubles and area halves, so R = ρl/A becomes 2 × 2 = 4 times.'),
    p5: q('Two 6 Ω resistors are connected in parallel. The equivalent resistance is:', ['12 Ω', '6 Ω', '3 Ω', '1.5 Ω'], [2], '1/R = 1/6 + 1/6 = 1/3, so R = 3 Ω.'),
    p6: q('For a particle in uniform circular motion, which statements are correct? (Select all that apply)', ['Its speed is constant', 'Its velocity is constant', 'Its acceleration points toward the centre', 'The net force on it is zero'], [0, 2], 'Speed is constant but direction changes, so velocity is not constant; the centripetal acceleration (and net force) points toward the centre.'),
    c1: q('The hybridisation of each carbon atom in ethyne (C₂H₂) is:', ['sp', 'sp²', 'sp³', 'dsp²'], [0], 'Each carbon forms a triple bond and one single bond: two σ bonds means sp hybridisation.'),
    c2: q('Which element has the highest electronegativity?', ['Oxygen', 'Chlorine', 'Fluorine', 'Nitrogen'], [2], 'Fluorine is the most electronegative element (3.98 on the Pauling scale).'),
    c3: q('The oxidation state of Mn in KMnO₄ is:', ['+2', '+4', '+6', '+7'], [3], '+1 + x + 4(−2) = 0, so x = +7.'),
    c4: q('At constant temperature, the pressure of a fixed mass of gas is inversely proportional to its volume. This is:', ['Charles\'s law', 'Boyle\'s law', 'Avogadro\'s law', 'Dalton\'s law'], [1], 'Boyle\'s law: PV = constant at constant T and n.'),
    c5: q('Which of the following are aromatic? (Select all that apply)', ['Benzene', 'Cyclohexane', 'Pyridine', 'Cyclooctatetraene'], [0, 2], 'Benzene and pyridine are planar, cyclic, conjugated systems with 6 π electrons (Hückel 4n+2). Cyclohexane is not conjugated and COT is non-planar with 8 π electrons.'),
    m1: q('The value of lim (x→0) sin x / x is:', ['0', '1', '∞', 'Does not exist'], [1], 'A standard limit: sin x / x → 1 as x → 0.'),
    m2: q('If A is a 3 × 3 matrix with |A| = 2, then |2A| equals:', ['4', '8', '16', '32'], [2], '|kA| = kⁿ|A| for an n × n matrix: 2³ × 2 = 16.'),
    m3: q('The number of distinct arrangements of the letters of the word LEVEL is:', ['120', '60', '30', '20'], [2], '5! / (2! × 2!) = 120 / 4 = 30, since L and E each repeat twice.'),
    m4: q('∫₀^{π/2} sin x dx equals:', ['0', '1', 'π/2', '2'], [1], '[−cos x] from 0 to π/2 = −0 + 1 = 1.'),
    m5: q('The sum of the roots of 2x² − 6x + 3 = 0 is:', ['−3', '3', '3/2', '6'], [1], 'Sum of roots = −b/a = 6/2 = 3.'),
    m6: q('The distance between the points (1, 2) and (4, 6) is:', ['3', '4', '5', '7'], [2], '√((4−1)² + (6−2)²) = √(9 + 16) = 5.'),
  };
  const pick = (...k) => k.map(x => ({ ...P[x], id: genId() }));
  const series = {
    sjee: { title: 'JEE Main 2027 Mock Test Series', exam: 'JEE Main', desc: 'Full-length pattern mock tests with Physics, Chemistry and Mathematics, NTA-style interface and all-India style ranking.', order: 1 },
    sbrd: { title: 'Class 12 Boards Practice Series', exam: 'CBSE Boards', desc: 'Chapter-wise objective practice tests aligned to the latest board pattern.', order: 2 },
  };
  const Tst = (title, seriesId, subject, start, end, duration, qs, order, instr) => ({ title, seriesId, subject, start, end, duration, markCorrect: 4, markWrong: 1, randomize: false, order, instructions: instr || 'This test contains objective questions. Each correct answer carries +4 marks and each wrong answer carries −1 mark. Unanswered questions carry 0 marks.\nMultiple-correct questions are awarded marks only if all correct options and no wrong options are selected.\nUse "Mark for Review" to revisit questions. Answers marked for review are evaluated.\nThe test is submitted automatically when the timer reaches zero.', questions: qs });
  const tests = {
    tj1: Tst('JEE Main Mock Test 1', 'sjee', 'PCM', ago(14), ago(7), 30, pick('p1', 'p2', 'p3', 'c1', 'c2', 'c3', 'm1', 'm2', 'm3', 'm4'), 1),
    tj2: Tst('JEE Main Mock Test 2', 'sjee', 'PCM', ago(1), ahead(6), 30, pick('p4', 'p5', 'p6', 'c4', 'c5', 'c2', 'm5', 'm6', 'm4', 'm1'), 2),
    tj3: Tst('JEE Main Mock Test 3', 'sjee', 'PCM', ahead(9), ahead(16), 30, pick('p1', 'p4', 'p6', 'c1', 'c3', 'c5', 'm2', 'm3', 'm5', 'm6'), 3),
    tb1: Tst('Boards Practice — Physics Unit Test', 'sbrd', 'Physics', ago(2), ahead(12), 15, pick('p1', 'p2', 'p4', 'p5', 'p6'), 1),
    tb2: Tst('Boards Practice — Mathematics Unit Test', 'sbrd', 'Mathematics', ahead(5), ahead(20), 15, pick('m1', 'm2', 'm4', 'm5', 'm6'), 2),
  };
  const assignments = {
    a1: { title: 'Kinematics Problem Set 1', courseId: 'cmech', subject: 'Physics', due: ahead(5), maxMarks: 20, date: ago(2), desc: 'Solve all problems with complete steps. Write the given data, the formula used and units in every answer.\n\n1. A car accelerates from 10 m/s to 30 m/s in 5 s. Find its acceleration and the distance covered.\n2. A stone is dropped from a 45 m tower. Find the time to reach the ground and its final speed (g = 10 m/s²).\n3. A projectile is launched at 30° with 40 m/s. Find its range and maximum height.\n4. Draw the v–t graph of a body that accelerates, moves uniformly and then decelerates to rest.' },
    a2: { title: 'Electric Field — Conceptual Questions', courseId: 'celec', subject: 'Physics', due: ahead(9), maxMarks: 15, date: ago(1), desc: 'Answer in 3–5 lines each.\n\n1. Why can two electric field lines never cross?\n2. Explain why the electric field inside a conductor is zero.\n3. Compare the field of a dipole on its axial and equatorial lines.' },
    a3: { title: 'Integration Practice Sheet', courseId: 'ccalc', subject: 'Mathematics', due: ago(2), maxMarks: 25, date: ago(10), desc: 'Evaluate:\n1. ∫ x eˣ dx\n2. ∫ 2x cos(x²) dx\n3. ∫₀^π sin x dx\n4. ∫ ln x dx\n5. ∫ 1/(x² + 1) dx' },
  };
  const announcements = {
    an1: { title: 'JEE Main Mock Test 2 is now live', body: 'Attempt it before the window closes. Detailed solutions and your rank will be available right after you submit.', date: ago(1), pinned: true },
    an2: { title: 'New notes uploaded: Kinematics & Electrostatics', body: 'Complete chapter notes and formula sheets are now available in Study Materials.', date: ago(2), pinned: false },
  };
  return { settings: { site, taxonomy, access: { approved: {} } }, courses, lectures, materials, quizzes, tests, series, assignments, announcements };
}
