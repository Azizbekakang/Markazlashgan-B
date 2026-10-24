# Supabase + Netlify backend

This project uses Supabase Auth to validate bearer access tokens and Supabase PostgREST with the caller's token. Database row-level security remains the authorization boundary; the function never accepts a client-provided user ID and never uses a service-role key.

## Configure Supabase

1. Create a Supabase project.
2. In SQL Editor, apply `migrations/20261024000000_initial_schema.sql`.
3. Enable the desired sign-in providers in Supabase Auth and configure allowed redirect URLs for the Netlify production and preview URLs.
4. Test with two separate users and confirm each can only see their own profile/progress/quiz records.
5. Configure backups, retention, monitoring, and student-data privacy controls before production use.

## Netlify environment variables

Set these in **Site configuration → Environment variables**, then trigger a new deploy:

- `SUPABASE_URL`: project URL, e.g. `https://YOUR_PROJECT_REF.supabase.co`
- `SUPABASE_ANON_KEY`: project publishable/anon key

Do not set the service-role key for this API. Never expose private keys in frontend code or `VITE_*` variables.

## API routes

- `GET /api/health` — service health, no credentials required.
- `GET /api/subjects` — static subject catalogue, no credentials required.
- `GET /api/me` — current authenticated user.
- `GET /api/progress` — caller's lesson progress.
- `POST /api/progress` — idempotently mark a lesson complete; JSON: `{"lesson_id":"math-intro-01"}`.
- `GET /api/quiz-attempts` — caller's recent quiz attempts.
- `POST /api/quiz-attempts` — save a quiz result; JSON: `{"subject_id":"math","score":4,"total_questions":5,"answers":[1,0,2,3,1]}`.

Protected routes require `Authorization: Bearer <Supabase access_token>`. The current React UI is not yet wired to Supabase Auth or these routes; configure the database and environment variables before testing protected endpoints. This backend foundation does not by itself mean the app is fully production-ready.
