# Maison Morrow Café

A Vercel-ready cafe site with a React frontend and a small serverless backend.

## Project structure

- `frontend/` — Vite + React site
- `backend/api/contact.ts` — contact-form API handler
- `api/contact.ts` — Vercel function entry point

## Run locally

```bash
npm install
npm --prefix frontend install
npm run dev
```

For the contact endpoint locally, use `vercel dev` after installing the Vercel CLI. The site gracefully falls back to the visitor's email client when the API is unavailable.

## Deploy to Vercel

Import this repository into Vercel. The included `vercel.json` builds the frontend and serves it as a SPA, while `/api/contact` is deployed as a serverless function.

Set `CONTACT_RECIPIENT` in Vercel Environment Variables before connecting a mail provider. The current API validates requests and returns a safe success response; it does not persist messages.

Replace the sample address, contact details, menu, and social link before launch.
