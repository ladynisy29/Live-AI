# learnwithladynisy

An interactive online programming learning platform MVP built with React + Vite + TypeScript.

## Included in this MVP

- Searchable tutorial catalog
- Tutorial page layout with left navigation, lesson content, and right-side editor
- In-browser try-it-yourself HTML/CSS/JavaScript editor with live preview
- Exercises with instant validation and lesson completion tracking
- Quiz section with score and answer feedback
- Learning paths and developer reference guides
- Code templates library (portfolio, landing page, login form, dashboard)
- Playground with save, load, delete, and share-link snippet workflows
- Timed certification exam with pass/fail result and generated certificate ID
- Backend API for users, progress, snippets, exam submission, and certificate verification
- Account system: register, login, session token, profile check, logout
- Content bootstrap API and admin CMS endpoint for adding tutorials
- Language selector (English, Spanish, French)
- Responsive UI optimized for desktop and mobile
- URL-based routing for main sections and tutorial slugs (e.g. /tutorial/html-foundations)
- SEO starter assets: robots.txt, sitemap.xml, and enriched meta tags

## Run locally

```bash
npm install
npm run dev
```

## Run full stack (frontend + backend)

```bash
npm install
npm run dev:full
```

Backend API default URL: `http://localhost:4000`

Core API groups:

- `/api/auth/*` for register/login/me/logout
- `/api/auth/dev-seed-admin` for local admin bootstrap (development)
- `/api/content/bootstrap` for platform content payload
- `/api/users/*` for progress and snippets
- `/api/exams/*` and `/api/certificates/*` for certification flows
- `/api/admin/tutorials` for CMS tutorial CRUD (admin role)

## Admin Notes

- The first registered non-guest account becomes `admin` automatically.
- Admin users can create, edit, and delete custom tutorials from the in-app Admin page.
- Local admin bootstrap endpoint returns a reusable admin token and dev credentials.
- If port `4000` is already in use, stop the existing server process before running `npm run dev:server` again.

## Command Tip

Use `npm run dev:full` (not `dev:ful`).

Optional frontend API override:

```bash
VITE_API_BASE=http://localhost:4000
```

## Build

```bash
npm run build
npm run preview
```

## Backend only

```bash
npm run dev:server
```
