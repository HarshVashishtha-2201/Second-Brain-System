# Second Brain Backend

Minimal Express + MongoDB backend for Second Brain System.

Setup:

1. Copy `.env.example` to `.env` and set values.
2. Install dependencies: `npm install` inside `backend`.
3. Start: `npm run dev` (requires MongoDB running locally).

APIs:
- POST `/auth/register` { email, password }
- POST `/auth/login` { email, password }
- POST `/content/upload` (multipart form: `file` or `text` or `url`; must include `type` optionally)
- GET `/content/list`
- GET `/content/:id`
- DELETE `/content/:id`
- GET `/content/search?q=...&fromDate=&toDate=`
