# OnlyMaths

Online learning platform: courses, video lectures, study materials (PDF), quizzes, online tests with question palette and negative marking, test series, assignments, results and leaderboards, student dashboard and an admin panel.

## Structure

- `index.html` — entry page (single-page app with hash routing)
- `css/app.css` — design system (navy / royal blue / gold, light & dark mode)
- `js/` — app code: `store.js` (data layer), `pages.js`, `practice.js` (quiz & exam engines), `dashboard.js`, `admin.js`, `seed.js` (sample content)
- `supabase/leads.sql` — schema of the `leads` table in the Supabase project **OnlyMaths**

## Run locally

Open `index.html` in a browser, or serve the folder with any static server, e.g. `npx serve .`

## Deploy

It's a static site — on Vercel or Netlify, import this repository with no build command and `/` as the output directory.

Student accounts, progress and the admin panel use the database of the Claude-hosted version. When hosted elsewhere, the site runs with sample content and nothing is saved.
