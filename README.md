# learnwithladynisy

An interactive online programming learning platform MVP built with React + Vite + TypeScript.
<img width="1277" height="574" alt="Screenshot 2026-03-16 143050" src="https://github.com/user-attachments/assets/df6045a6-9515-40c5-891d-56b2ecfce5ef" />
<img width="1307" height="670" alt="Screenshot 2026-03-16 155748" src="https://github.com/user-attachments/assets/04b64168-8b09-4417-8581-d92b9a7d5a63" />
<img width="1310" height="713" alt="Screenshot 2026-03-16 142710" src="https://github.com/user-attachments/assets/ca146d28-d083-46e9-932a-6720e12851f8" />

<img width="1300" height="681" alt="Screenshot 2026-03-16 142943" src="https://github.com/user-attachments/assets/cf36dce3-b704-48a8-811a-d1182c1c9ea9" />





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
