/* Sample content written into the database on the owner's first visit. Everything is editable from the admin panel. */
function makeSeed() {
  const D = 86400000, now = Date.now();
  const ago = d => new Date(now - d * D).toISOString();
  const ahead = d => new Date(now + d * D).toISOString();
  const T = 'ST';
  const q = (text, options, answer, explanation, type) => ({ id: genId(), text, options, answer, explanation, type: type || (answer.length > 1 ? 'multi' : 'single') });

  const site = {
    brand: 'OnlyMaths', tagline: 'Academy', seededAt: nowISO(), seedVersion: 2,
    heroBadge: 'New', heroBadgeText: 'JEE Main 2027 Maths mock test series is live',
    heroTitle: 'Learn Smarter. Achieve More.',
    heroSub: 'Structured maths video lectures, crisp formula sheets, chapter-wise quizzes and exam-grade mock tests for Class 11–12, Boards and JEE — all in one place, taught by ST.',
    instructor: T, instructorRole: 'Founder & Mathematics Educator',
    instructorBio: 'ST teaches Class 11–12 Mathematics for board exams and JEE, with a concept-first approach: understand the idea, see why it works, then practise until it becomes second nature.',
    about: 'OnlyMaths is an online academy that does one thing and does it well: mathematics. Every student deserves clear concepts, quality practice and honest feedback on their progress.\n\nEvery lecture is planned chapter by chapter, every formula sheet is written to be revised in minutes, and every test comes with step-by-step solutions so mistakes turn into lessons.\n\nWhether you are strengthening your basics for the boards or pushing for a top rank in JEE, the platform tracks your journey and shows you exactly which chapters need more work.',
    mission: 'Make mathematics clear, structured and confidence-building for every student.',
    email: 'Sonutomar90891@gmail.com', phone: '', whatsapp: '', address: 'Online classes · India',
    youtube: 'https://www.youtube.com/', instagram: 'https://www.instagram.com/', telegram: 'https://telegram.org/', facebook: 'https://www.facebook.com/', linkedin: '',
  };
  const taxonomy = {"classes": ["Class 11", "Class 12", "JEE"], "subjects": ["Mathematics", "Physics", "Chemistry"], "exams": ["JEE Main", "JEE Advanced", "MHT CET"], "chapters": {"Mathematics": ["Sets & Functions", "Complex Numbers", "Quadratic Equations", "Sequences & Series", "Permutations & Combinations", "Binomial Theorem", "Trigonometry", "Inverse Trigonometric Functions", "Coordinate Geometry", "Conic Sections", "Limits & Derivatives", "Continuity & Differentiability", "Application of Derivatives", "Integration", "Differential Equations", "Matrices & Determinants", "Vector Algebra", "3D Geometry", "Probability", "Statistics"], "Physics": ["Units & Measurements", "Kinematics", "Laws of Motion", "Work, Energy & Power", "Rotational Motion", "Gravitation", "Properties of Solids & Liquids", "Thermodynamics", "Kinetic Theory of Gases", "Oscillations & Waves", "Electrostatics", "Current Electricity", "Magnetic Effects of Current & Magnetism", "Electromagnetic Induction & AC", "Electromagnetic Waves", "Ray & Wave Optics", "Dual Nature of Matter & Radiation", "Atoms & Nuclei", "Semiconductor Electronics", "Experimental Physics"], "Chemistry": ["Some Basic Concepts of Chemistry", "Atomic Structure", "Classification of Elements & Periodicity", "Chemical Bonding", "States of Matter", "Chemical Thermodynamics", "Solutions", "Equilibrium", "Redox Reactions", "Electrochemistry", "Chemical Kinetics", "p-Block Elements", "d- & f-Block Elements", "Coordination Compounds", "General Organic Chemistry", "Hydrocarbons", "Haloalkanes & Haloarenes", "Alcohols, Phenols & Ethers", "Aldehydes, Ketones & Carboxylic Acids", "Amines", "Biomolecules", "Practical Chemistry"]}};

  const C = (title, cls, level, order, desc) => ({ title, subject: 'Mathematics', cls, instructor: T, level, featured: true, order, restricted: false, desc });
  const courses = {
    ccalc: C('Calculus Complete', 'Class 12', 'Intermediate', 1, 'Limits, continuity, differentiation and integration with board-pattern and JEE-pattern problem solving.'),
    calg: C('Algebra Essentials', 'Class 11', 'Beginner → Advanced', 2, 'Quadratic equations, sequences & series and permutations & combinations — the toolkit every later chapter depends on.'),
    ctrig: C('Trigonometry Mastery', 'Class 11', 'Beginner', 3, 'Ratios, identities, graphs and equations — learn the patterns so you stop memorising and start recognising.'),
    ccoord: C('Coordinate Geometry', 'Class 11', 'Intermediate', 4, 'Straight lines and circles from first principles, with the shortcuts that save minutes in competitive exams.'),
    cmat: C('Matrices & Determinants', 'Class 12', 'Beginner', 5, 'Matrix operations, determinants, inverses and solving linear systems — high-scoring and fully learnable.'),
    cprob: C('Probability', 'Class 12', 'Intermediate', 6, 'Sample spaces, conditional probability and Bayes\' theorem, built around intuition and plenty of solved examples.'),
  };

  const L = (title, courseId, chapter, topic, duration, d, desc, ts, order) => ({ title, courseId, subject: 'Mathematics', chapter, topic, duration, date: ago(d), desc, timestamps: ts, videoType: 'none', videoUrl: '', assetId: '', order });
  const t = (...p) => p.map(([a, b]) => ({ t: a, label: b }));
  const lectures = {
    l9: L('Derivatives from First Principles', 'ccalc', 'Limits & Derivatives', 'First principles', '53:40', 1, 'Understand the derivative as a limit, compute derivatives of standard functions from first principles and interpret them geometrically.', t(['00:00', 'Slope of a tangent'], ['14:30', 'Definition as a limit'], ['28:10', 'Standard derivatives'], ['44:00', 'Product & quotient rules']), 1),
    l10: L('Integration by Substitution', 'ccalc', 'Integration', 'Substitution', '58:25', 3, 'Recognise the pattern f(g(x))·g\'(x) and use substitution to crack integrals that look impossible at first glance.', t(['00:00', 'Integration as anti-derivative'], ['12:00', 'The substitution idea'], ['30:45', 'Trigonometric substitutions'], ['47:10', 'Practice set']), 2),
    l1: L('Quadratic Equations: Roots and their Nature', 'calg', 'Quadratic Equations', 'Nature of roots', '49:15', 2, 'Solve quadratics three ways, use the discriminant to predict the nature of roots, and master the sum and product of roots.', t(['00:00', 'Standard form'], ['09:30', 'Factorisation & formula'], ['22:15', 'Discriminant'], ['35:40', 'Sum and product of roots']), 1),
    l2: L('Arithmetic and Geometric Progressions', 'calg', 'Sequences & Series', 'AP & GP', '55:20', 5, 'nth term, sum of n terms, and the sum of an infinite GP — with the classic exam patterns for each.', t(['00:00', 'What is a sequence?'], ['11:00', 'AP: nth term & sum'], ['27:30', 'GP: nth term & sum'], ['43:10', 'Infinite GP']), 2),
    l3: L('Permutations and Combinations — The Counting Toolkit', 'calg', 'Permutations & Combinations', 'Fundamentals', '61:05', 8, 'The fundamental principle of counting, factorial notation, nPr and nCr, and arrangements with repeated objects.', t(['00:00', 'Counting principle'], ['15:20', 'Permutations'], ['33:00', 'Combinations'], ['48:45', 'Repeated objects']), 3),
    l12: L('Trigonometric Identities Toolkit', 'ctrig', 'Trigonometry', 'Identities', '45:30', 4, 'Compound angles, multiple angles and transformation formulae — with the tricks that save time in exams.', t(['00:00', 'Fundamental identities'], ['13:40', 'Compound angles'], ['28:15', 'Multiple angles']), 1),
    l4: L('Trigonometric Graphs and Equations', 'ctrig', 'Trigonometry', 'Equations', '47:50', 9, 'Sketch sin, cos and tan, read off periods and ranges, and write the general solution of trigonometric equations.', t(['00:00', 'Graphs of sin, cos, tan'], ['16:30', 'Period and range'], ['29:00', 'General solutions']), 2),
    l5: L('Straight Lines — Slope, Forms and Distance', 'ccoord', 'Coordinate Geometry', 'Straight lines', '52:10', 6, 'Slope, the five standard forms of a line, angle between lines and the distance of a point from a line.', t(['00:00', 'Slope'], ['12:20', 'Forms of a line'], ['30:05', 'Angle between lines'], ['41:30', 'Point-to-line distance']), 1),
    l6: L('Circles — Equation, Centre and Radius', 'ccoord', 'Coordinate Geometry', 'Circles', '44:35', 11, 'Standard and general equations of a circle, finding centre and radius, and the position of a point relative to a circle.', t(['00:00', 'Standard form'], ['14:10', 'General form'], ['27:45', 'Centre and radius'], ['36:20', 'Point & circle']), 2),
    l7: L('Matrices: Types and Operations', 'cmat', 'Matrices & Determinants', 'Matrix operations', '42:40', 7, 'Types of matrices, addition, scalar multiplication, matrix multiplication and the transpose.', t(['00:00', 'What is a matrix?'], ['10:15', 'Types of matrices'], ['21:30', 'Multiplication'], ['34:00', 'Transpose & symmetric matrices']), 1),
    l8: L('Determinants and the Inverse of a Matrix', 'cmat', 'Matrices & Determinants', 'Determinants', '56:00', 10, 'Evaluate determinants, use their properties, find the adjoint and inverse, and solve linear systems.', t(['00:00', '2×2 and 3×3 determinants'], ['17:45', 'Properties'], ['31:20', 'Adjoint and inverse'], ['45:00', 'Solving AX = B']), 2),
    l11: L('Probability Basics and Conditional Probability', 'cprob', 'Probability', 'Conditional probability', '58:30', 12, 'Sample spaces and events, the addition rule, conditional probability and independent events.', t(['00:00', 'Experiments & sample space'], ['13:30', 'Addition rule'], ['28:00', 'Conditional probability'], ['44:20', 'Independent events']), 1),
  };

  const M = (title, cls, chapter, topic, type, tags, d, content, pages, courseId) => ({ title, cls, subject: 'Mathematics', chapter, topic, type, tags, date: ago(d), content, assetId: '', fileName: '', size: 0, pages, courseId: courseId || '' });
  const materials = {
    m5: M('Differentiation — Formula Sheet', 'Class 12', 'Limits & Derivatives', 'Standard derivatives', 'Formula Sheet', ['Formula Sheet', 'Important'], 1, `# Differentiation — Formula Sheet
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
> |x| is continuous at 0 but not differentiable there.`, 2, 'ccalc'),
    m6: M('Integration — Methods Handout', 'Class 12', 'Integration', 'Substitution', 'Handout', ['Revision'], 3, `# Integration — Methods Handout
## Standard integrals
- ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C, n ≠ −1
- ∫ 1/x dx = ln|x| + C
- ∫ eˣ dx = eˣ + C
- ∫ sin x dx = −cos x + C, ∫ cos x dx = sin x + C
- ∫ 1/(1 + x²) dx = tan⁻¹x + C
## Substitution
- Look for a function and its derivative: ∫ f(g(x)) g'(x) dx — put t = g(x).
- Example: ∫ 2x cos(x²) dx, put t = x², dt = 2x dx, answer sin(x²) + C.
## Integration by parts
- ∫ u v dx = u ∫v dx − ∫ (u' ∫v dx) dx
- Choose u by ILATE: Inverse, Logarithmic, Algebraic, Trigonometric, Exponential.
## Definite integrals
- ∫ from a to b f(x) dx = F(b) − F(a)
- ∫ from 0 to a f(x) dx = ∫ from 0 to a f(a − x) dx`, 3, 'ccalc'),
    m1: M('Quadratic Equations — Complete Chapter Notes', 'Class 11', 'Quadratic Equations', 'Nature of roots', 'Notes', ['Important', 'Revision'], 2, `# Quadratic Equations — Chapter Notes
## 1. Standard form
- A quadratic equation is ax² + bx + c = 0 with a ≠ 0.
- Roots: x = (−b ± √(b² − 4ac)) / 2a
## 2. Discriminant D = b² − 4ac
- D > 0: two distinct real roots.
- D = 0: two equal real roots, x = −b/2a.
- D < 0: no real roots (two complex conjugate roots).
> If a, b, c are rational and D is a perfect square, the roots are rational.
## 3. Sum and product of roots
- α + β = −b/a
- αβ = c/a
- The equation with roots α and β: x² − (α + β)x + αβ = 0
## 4. Useful identities
- α² + β² = (α + β)² − 2αβ
- (α − β)² = (α + β)² − 4αβ
## 5. Exam tips
- Always check a ≠ 0 before treating an equation as quadratic.
- For "equal roots" problems, set D = 0 and solve for the parameter.`, 3, 'calg'),
    m2: M('Sequences & Series — Formula Sheet', 'Class 11', 'Sequences & Series', 'AP & GP', 'Formula Sheet', ['Formula Sheet', 'Revision'], 4, `# Sequences & Series — Formula Sheet
## Arithmetic progression (AP)
- nth term: aₙ = a + (n − 1)d
- Sum of n terms: Sₙ = n/2 [2a + (n − 1)d] = n/2 (first + last)
- Three numbers in AP: a − d, a, a + d
## Geometric progression (GP)
- nth term: aₙ = a rⁿ⁻¹
- Sum of n terms: Sₙ = a(rⁿ − 1)/(r − 1), r ≠ 1
- Sum to infinity (|r| < 1): S = a / (1 − r)
## Special sums
- 1 + 2 + … + n = n(n + 1)/2
- 1² + 2² + … + n² = n(n + 1)(2n + 1)/6
- 1³ + 2³ + … + n³ = [n(n + 1)/2]²
> AM ≥ GM for positive numbers: (a + b)/2 ≥ √(ab).`, 2, 'calg'),
    m8: M('Trigonometry — Identities Formula Sheet', 'Class 11', 'Trigonometry', 'Identities', 'Formula Sheet', ['Formula Sheet'], 5, `# Trigonometry — Identities
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
- sin3A = 3sinA − 4sin³A, cos3A = 4cos³A − 3cosA
## Maximum value
> The maximum of a sin x + b cos x is √(a² + b²).`, 2, 'ctrig'),
    m3: M('Matrices & Determinants — Chapter Notes', 'Class 12', 'Matrices & Determinants', 'Determinants', 'Notes', ['Important'], 6, `# Matrices & Determinants — Notes
## Matrices
- Order m × n: m rows and n columns.
- AB is defined only when columns of A = rows of B. In general AB ≠ BA.
- (A^T)^T = A, (AB)^T = B^T A^T
- A is symmetric if A^T = A, skew-symmetric if A^T = −A.
## Determinants
- For a 2 × 2 matrix [[a, b], [c, d]]: |A| = ad − bc
- |A^T| = |A|, |AB| = |A||B|
- For an n × n matrix: |kA| = kⁿ|A|
> Swapping two rows changes the sign of the determinant; two identical rows make it zero.
## Inverse
- A⁻¹ exists only if |A| ≠ 0.
- A⁻¹ = adj(A) / |A|
- For AX = B with |A| ≠ 0: X = A⁻¹B`, 3, 'cmat'),
    m4: M('Coordinate Geometry — Lines & Circles', 'Class 11', 'Coordinate Geometry', 'Straight lines', 'Handout', ['Revision'], 8, `# Coordinate Geometry — Lines & Circles
## Points
- Distance: √((x₂ − x₁)² + (y₂ − y₁)²)
- Midpoint: ((x₁ + x₂)/2, (y₁ + y₂)/2)
## Straight lines
- Slope m = (y₂ − y₁)/(x₂ − x₁)
- Slope–intercept form: y = mx + c
- Point–slope form: y − y₁ = m(x − x₁)
- Parallel lines: m₁ = m₂. Perpendicular lines: m₁m₂ = −1
- Distance of (x₁, y₁) from ax + by + c = 0: |ax₁ + by₁ + c| / √(a² + b²)
## Circles
- Centre (h, k), radius r: (x − h)² + (y − k)² = r²
- General form x² + y² + 2gx + 2fy + c = 0: centre (−g, −f), radius √(g² + f² − c)`, 2, 'ccoord'),
    m7: M('Probability — Practice Worksheet', 'Class 12', 'Probability', 'Conditional probability', 'Worksheet', ['Practice'], 10, `# Probability — Practice Worksheet
## Key results
- P(A) = favourable outcomes / total outcomes
- P(A ∪ B) = P(A) + P(B) − P(A ∩ B)
- P(A | B) = P(A ∩ B) / P(B)
- A and B are independent if P(A ∩ B) = P(A) P(B)
## Section A — Basic
- 1. A die is thrown. Find the probability of an even number.
- 2. Two coins are tossed. Find the probability of at least one head.
- 3. A card is drawn from a pack of 52. Find the probability that it is a king.
## Section B — Intermediate
- 4. Two dice are thrown. Find the probability that the sum is 7.
- 5. P(A) = 0.5, P(B) = 0.4, P(A ∩ B) = 0.2. Find P(A ∪ B) and P(A | B).
## Section C — Challenge
- 6. A bag has 3 red and 2 black balls. Two balls are drawn without replacement. Find the probability that both are red.
> Answers: 1) 1/2 2) 3/4 3) 1/13 4) 1/6 5) 0.7, 0.5 6) 3/10`, 2, 'cprob'),
  };

  const quizzes = {
    qzdaily: {
      title: 'Daily Maths Warm-up', kind: 'Daily', subject: 'Mathematics', chapter: 'Mixed', topic: 'Daily practice', difficulty: 'Easy', duration: 5, randomize: true, date: ago(0), questions: [
        q('The sum of the first 20 natural numbers is:', ['190', '200', '210', '400'], [2], 'n(n + 1)/2 = 20 × 21 / 2 = 210.'),
        q('The value of ⁵C₂ is:', ['5', '10', '20', '25'], [1], '⁵C₂ = 5! / (2! × 3!) = 10.'),
        q('tan 45° + cot 45° equals:', ['0', '1', '2', '√2'], [2], 'tan 45° = cot 45° = 1, so the sum is 2.'),
        q('The number of subsets of a set with 4 elements is:', ['4', '8', '16', '24'], [2], 'A set with n elements has 2ⁿ subsets: 2⁴ = 16.'),
        q('The midpoint of (2, 4) and (6, 8) is:', ['(4, 6)', '(3, 5)', '(8, 12)', '(4, 4)'], [0], 'Midpoint = ((2 + 6)/2, (4 + 8)/2) = (4, 6).'),
      ]
    },
    qztrig: {
      title: 'Trigonometry — Chapter Quiz', kind: 'Chapter-wise', subject: 'Mathematics', chapter: 'Trigonometry', topic: 'Identities', difficulty: 'Moderate', duration: 10, randomize: true, date: ago(1), questions: [
        q('The value of sin 75° is:', ['(√6 + √2)/4', '(√6 − √2)/4', '√3/2', '1/2'], [0], 'sin(45° + 30°) = sin45 cos30 + cos45 sin30 = (√6 + √2)/4.'),
        q('The fundamental period of sin x is:', ['π/2', 'π', '2π', '4π'], [2], 'sin(x + 2π) = sin x, and no smaller positive number works.'),
        q('cos 2A is equal to: (Select all that apply)', ['1 − 2sin²A', '2cos²A − 1', '2 sinA cosA', 'cos²A − sin²A'], [0, 1, 3], '2 sinA cosA is sin 2A. The other three are all forms of cos 2A.'),
        q('The maximum value of 3 sin x + 4 cos x is:', ['3', '4', '5', '7'], [2], 'The maximum of a sin x + b cos x is √(a² + b²) = √(9 + 16) = 5.'),
        q('sin(90° − θ) equals:', ['sin θ', 'cos θ', '−cos θ', 'tan θ'], [1], 'Complementary-angle identity: sin(90° − θ) = cos θ.'),
        q('If sin θ = 3/5 and θ is acute, then cos θ is:', ['4/5', '3/4', '5/4', '2/5'], [0], 'cos θ = √(1 − 9/25) = √(16/25) = 4/5.'),
      ]
    },
    qzquad: {
      title: 'Quadratic Equations — Topic Practice', kind: 'Topic-wise', subject: 'Mathematics', chapter: 'Quadratic Equations', topic: 'Nature of roots', difficulty: 'Moderate', duration: 8, randomize: true, date: ago(2), questions: [
        q('The sum of the roots of 2x² − 6x + 3 = 0 is:', ['−3', '3', '3/2', '6'], [1], 'Sum of roots = −b/a = 6/2 = 3.'),
        q('Which are roots of x² − 5x + 6 = 0? (Select all that apply)', ['1', '2', '3', '6'], [1, 2], 'x² − 5x + 6 = (x − 2)(x − 3), so the roots are 2 and 3.'),
        q('The roots of x² + x + 1 = 0 are:', ['Real and equal', 'Real and distinct', 'Not real', 'Rational'], [2], 'D = 1 − 4 = −3 < 0, so the roots are not real.'),
        q('If α and β are the roots of x² − 7x + 10 = 0, then αβ equals:', ['7', '−7', '10', '−10'], [2], 'Product of roots = c/a = 10.'),
        q('The quadratic equation with roots 2 and −3 is:', ['x² + x − 6 = 0', 'x² − x − 6 = 0', 'x² + 5x + 6 = 0', 'x² − x + 6 = 0'], [0], 'x² − (sum)x + product = x² − (−1)x + (−6) = x² + x − 6.'),
        q('For x² + kx + 9 = 0 to have equal roots, k must be:', ['±3', '±6', '±9', '0'], [1], 'Equal roots need D = k² − 36 = 0, so k = ±6.'),
      ]
    },
    qzdiff: {
      title: 'Differentiation — Speed Drill', kind: 'Topic-wise', subject: 'Mathematics', chapter: 'Limits & Derivatives', topic: 'Standard derivatives', difficulty: 'Difficult', duration: 10, randomize: true, date: ago(3), questions: [
        q('d/dx (x³) equals:', ['x²', '3x²', '3x³', 'x⁴/4'], [1], 'Power rule: d/dx xⁿ = n xⁿ⁻¹.'),
        q('d/dx (e^{2x}) equals:', ['e^{2x}', '2e^{x}', '2e^{2x}', 'e^{2x}/2'], [2], 'Chain rule: derivative of e^{u} is e^{u}·u\', with u = 2x giving 2e^{2x}.'),
        q('d/dx (ln x) for x > 0 equals:', ['1/x', 'x', 'ln x / x', 'eˣ'], [0], 'Standard result: the derivative of ln x is 1/x.'),
        q('If y = x² sin x, then dy/dx is:', ['2x cos x', '2x sin x + x² cos x', 'x² cos x', '2x sin x − x² cos x'], [1], 'Product rule: (x²)\' sin x + x² (sin x)\' = 2x sin x + x² cos x.'),
        q('Which of these functions are differentiable at x = 0? (Select all that apply)', ['x²', '|x|', 'sin x', 'x^{1/3}'], [0, 2], '|x| has a corner at 0 and x^{1/3} has a vertical tangent at 0, so neither is differentiable there.'),
        q('The slope of the tangent to y = x² at x = 3 is:', ['3', '6', '9', '2'], [1], 'dy/dx = 2x, so the slope at x = 3 is 6.'),
      ]
    },
    qzprob: {
      title: 'Probability — Quick Check', kind: 'Chapter-wise', subject: 'Mathematics', chapter: 'Probability', topic: 'Basics', difficulty: 'Easy', duration: 8, randomize: true, date: ago(4), questions: [
        q('Two dice are thrown. The probability that the sum is 7 is:', ['1/6', '1/12', '7/36', '1/9'], [0], 'Six of the 36 outcomes give 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1).'),
        q('Two coins are tossed. The probability of at least one head is:', ['1/4', '1/2', '3/4', '1'], [2], '1 − P(no heads) = 1 − 1/4 = 3/4.'),
        q('A card is drawn from a pack of 52. The probability that it is a king is:', ['1/52', '1/13', '1/4', '4/13'], [1], 'There are 4 kings: 4/52 = 1/13.'),
        q('For any event A, P(A) + P(not A) equals:', ['0', '1/2', '1', 'It depends on A'], [2], 'A and its complement together cover the whole sample space.'),
        q('If A and B are independent with P(A) = 0.5 and P(B) = 0.4, then P(A ∩ B) is:', ['0.9', '0.2', '0.1', '0.45'], [1], 'For independent events P(A ∩ B) = P(A) P(B) = 0.2.'),
      ]
    },
  };

  const P = {
    a1: q('The value of lim (x→0) sin x / x is:', ['0', '1', '∞', 'Does not exist'], [1], 'A standard limit: sin x / x → 1 as x → 0.'),
    a2: q('If A is a 3 × 3 matrix with |A| = 2, then |2A| equals:', ['4', '8', '16', '32'], [2], '|kA| = kⁿ|A| for an n × n matrix: 2³ × 2 = 16.'),
    a3: q('The number of distinct arrangements of the letters of the word LEVEL is:', ['120', '60', '30', '20'], [2], '5! / (2! × 2!) = 120 / 4 = 30, since L and E each repeat twice.'),
    a4: q('∫₀^{π/2} sin x dx equals:', ['0', '1', 'π/2', '2'], [1], '[−cos x] from 0 to π/2 = −0 + 1 = 1.'),
    a5: q('The 10th term of the AP 3, 7, 11, … is:', ['37', '39', '40', '43'], [1], 'a₁₀ = a + 9d = 3 + 9 × 4 = 39.'),
    a6: q('The distance between the points (1, 2) and (4, 6) is:', ['3', '4', '5', '7'], [2], '√((4−1)² + (6−2)²) = √(9 + 16) = 5.'),
    a7: q('The sum of the infinite GP 1 + 1/2 + 1/4 + … is:', ['1', '3/2', '2', '∞'], [2], 'S = a / (1 − r) = 1 / (1 − 1/2) = 2.'),
    a8: q('The radius of the circle x² + y² − 4x + 6y − 3 = 0 is:', ['2', '3', '4', '16'], [2], 'Centre (2, −3); r = √(4 + 9 + 3) = 4.'),
    a9: q('The slope of the line through (2, 3) and (4, 7) is:', ['1/2', '2', '4', '−2'], [1], 'm = (7 − 3)/(4 − 2) = 2.'),
    a10: q('The determinant of [[2, 3], [1, 4]] is:', ['5', '8', '11', '−5'], [0], '2 × 4 − 3 × 1 = 5.'),
    a11: q('∫ 1/(1 + x²) dx equals:', ['ln(1 + x²) + C', 'tan⁻¹x + C', 'sin⁻¹x + C', '1/x + C'], [1], 'A standard integral: d/dx tan⁻¹x = 1/(1 + x²).'),
    a12: q('∫₀¹ eˣ dx equals:', ['e', 'e − 1', '1', 'e + 1'], [1], '[eˣ] from 0 to 1 = e − 1.'),
    a13: q('Which functions are odd? (Select all that apply)', ['sin x', 'cos x', 'x³', 'x²'], [0, 2], 'f(−x) = −f(x) holds for sin x and x³; cos x and x² are even.'),
    a14: q('For any square matrix A, which statements are always true? (Select all that apply)', ['(A^T)^T = A', '|A^T| = |A|', 'A A^T = A^T A only if A is symmetric', 'A + A^T is symmetric'], [0, 1, 3], '(A^T)^T = A, a determinant is unchanged by transposing, and (A + A^T)^T = A^T + A. Statement C is false: orthogonal matrices, for example, satisfy A A^T = A^T A without being symmetric.'),
    a15: q('The domain of f(x) = √(x − 2) is:', ['x > 2', 'x ≥ 2', 'x ≤ 2', 'All real x'], [1], 'The expression under the root must be non-negative: x − 2 ≥ 0.'),
    a16: q('The derivative of tan x at x = 0 is:', ['0', '1', '−1', 'Undefined'], [1], 'd/dx tan x = sec²x, and sec²0 = 1.'),
    a17: q('In how many ways can 3 students be chosen from 7?', ['21', '35', '42', '210'], [1], '⁷C₃ = 7 × 6 × 5 / 6 = 35.'),
    a18: q('If P(A) = 0.5, P(B) = 0.4 and P(A ∩ B) = 0.2, then P(A ∪ B) is:', ['0.9', '0.7', '0.2', '0.5'], [1], 'P(A ∪ B) = 0.5 + 0.4 − 0.2 = 0.7.'),
  };
  const pick = (...k) => k.map(x => ({ ...P[x], id: genId() }));
  const series = {
    sjee: { title: 'JEE Main 2027 Mathematics Test Series', exam: 'JEE Main', desc: 'Full-pattern Mathematics mock tests with an NTA-style interface, negative marking and all-India style ranking.', order: 1 },
    sbrd: { title: 'Class 12 Boards Mathematics Practice', exam: 'CBSE Boards', desc: 'Chapter-wise objective practice tests aligned to the latest board pattern.', order: 2 },
  };
  const Tst = (title, seriesId, start, end, duration, qs, order) => ({ title, seriesId, subject: 'Mathematics', start, end, duration, markCorrect: 4, markWrong: 1, randomize: false, order, instructions: 'This test contains objective Mathematics questions. Each correct answer carries +4 marks and each wrong answer carries −1 mark. Unanswered questions carry 0 marks.\nMultiple-correct questions are awarded marks only if all correct options and no wrong options are selected.\nUse "Mark for Review" to revisit questions. Answers marked for review are evaluated.\nThe test is submitted automatically when the timer reaches zero.', questions: qs });
  const tests = {
    tj1: Tst('JEE Main Maths Mock Test 1', 'sjee', ago(14), ago(7), 30, pick('a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a13', 'a17'), 1),
    tj2: Tst('JEE Main Maths Mock Test 2', 'sjee', ago(1), ahead(6), 30, pick('a9', 'a10', 'a11', 'a12', 'a14', 'a15', 'a16', 'a18', 'a3', 'a7'), 2),
    tj3: Tst('JEE Main Maths Mock Test 3', 'sjee', ahead(9), ahead(16), 30, pick('a2', 'a5', 'a8', 'a10', 'a12', 'a13', 'a15', 'a16', 'a17', 'a1'), 3),
    tb1: Tst('Boards Practice — Calculus Unit Test', 'sbrd', ago(2), ahead(12), 15, pick('a1', 'a4', 'a11', 'a12', 'a16'), 1),
    tb2: Tst('Boards Practice — Algebra Unit Test', 'sbrd', ahead(5), ahead(20), 15, pick('a2', 'a10', 'a14', 'a17', 'a18'), 2),
  };
  const assignments = {
    a1: { title: 'Quadratic Equations Problem Set', courseId: 'calg', subject: 'Mathematics', due: ahead(5), maxMarks: 20, date: ago(2), desc: 'Solve all problems with complete steps.\n\n1. Solve 6x² − 7x − 3 = 0 by factorisation.\n2. Find the nature of the roots of 2x² − 4x + 3 = 0.\n3. If α and β are the roots of x² − 5x + 4 = 0, find α² + β².\n4. Find k so that kx² − 12x + 9 = 0 has equal roots.\n5. Form the quadratic equation whose roots are 3 + √2 and 3 − √2.' },
    a2: { title: 'Matrices & Determinants Worksheet', courseId: 'cmat', subject: 'Mathematics', due: ahead(9), maxMarks: 15, date: ago(1), desc: 'Show all working.\n\n1. If A = [[1, 2], [3, 4]], find A² and A^T.\n2. Evaluate the determinant of [[1, 2, 3], [0, 1, 4], [5, 6, 0]].\n3. Find the inverse of [[2, 1], [5, 3]].\n4. Solve using matrices: 2x + y = 5, x + 3y = 5.' },
    a3: { title: 'Integration Practice Sheet', courseId: 'ccalc', subject: 'Mathematics', due: ago(2), maxMarks: 25, date: ago(10), desc: 'Evaluate:\n1. ∫ x eˣ dx\n2. ∫ 2x cos(x²) dx\n3. ∫₀^π sin x dx\n4. ∫ ln x dx\n5. ∫ 1/(x² + 1) dx' },
  };
  const announcements = {
    an1: { title: 'JEE Main Maths Mock Test 2 is now live', body: 'Attempt it before the window closes. Step-by-step solutions and your rank are available right after you submit.', date: ago(1), pinned: true },
    an2: { title: 'New notes: Quadratic Equations & Matrices', body: 'Complete chapter notes and formula sheets are now available in Study Materials.', date: ago(2), pinned: false },
  };
  const CLS12 = ['Integration', 'Matrices & Determinants', 'Probability'];
  const bank = {}; let bn = 0;
  const addB = (qq, chapter, topic, difficulty) => { bn++; bank['b' + String(bn).padStart(3, '0')] = { text: qq.text, options: qq.options, answer: qq.answer, explanation: qq.explanation, type: qq.type, subject: 'Mathematics', cls: CLS12.includes(chapter) ? 'Class 12' : 'Class 11', chapter, topic, difficulty, source: 'Sample', createdAt: ago(1) }; };
  [['Sequences & Series', 'Special sums'], ['Permutations & Combinations', 'Combinations'], ['Trigonometry', 'Standard values'], ['Sets & Functions', 'Subsets'], ['Coordinate Geometry', 'Midpoint']].forEach(([c, tp], i) => addB(quizzes.qzdaily.questions[i], c, tp, 'Easy'));
  const lv = { qztrig: ['Moderate', 'Easy', 'Difficult', 'Moderate', 'Easy', 'Easy'], qzquad: ['Easy', 'Easy', 'Moderate', 'Easy', 'Moderate', 'Moderate'], qzdiff: ['Easy', 'Moderate', 'Easy', 'Moderate', 'Difficult', 'Easy'], qzprob: ['Easy', 'Easy', 'Easy', 'Easy', 'Moderate'] };
  for (const [k, levels] of Object.entries(lv)) quizzes[k].questions.forEach((qq, i) => addB(qq, quizzes[k].chapter, quizzes[k].topic, levels[i]));
  const PT = { a1: ['Limits & Derivatives', 'Standard limits', 'Easy'], a2: ['Matrices & Determinants', 'Properties of determinants', 'Difficult'], a3: ['Permutations & Combinations', 'Repeated objects', 'Moderate'], a4: ['Integration', 'Definite integrals', 'Easy'], a5: ['Sequences & Series', 'AP', 'Easy'], a6: ['Coordinate Geometry', 'Distance formula', 'Easy'], a7: ['Sequences & Series', 'Infinite GP', 'Easy'], a8: ['Coordinate Geometry', 'Circles', 'Moderate'], a9: ['Coordinate Geometry', 'Straight lines', 'Easy'], a10: ['Matrices & Determinants', 'Determinants', 'Easy'], a11: ['Integration', 'Standard integrals', 'Easy'], a12: ['Integration', 'Definite integrals', 'Moderate'], a13: ['Sets & Functions', 'Odd and even functions', 'Moderate'], a14: ['Matrices & Determinants', 'Transpose', 'Difficult'], a15: ['Sets & Functions', 'Domain', 'Easy'], a16: ['Limits & Derivatives', 'Standard derivatives', 'Moderate'], a17: ['Permutations & Combinations', 'Combinations', 'Easy'], a18: ['Probability', 'Addition rule', 'Easy'] };
  for (const [k, [c, tp, d]] of Object.entries(PT)) addB(P[k], c, tp, d);
  return { settings: { site, taxonomy, access: { approved: {} } }, courses, bank, lectures, materials, quizzes, tests, series, assignments, announcements };
}
