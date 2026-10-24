# Markazlashgan B

O'zbek tilidagi 8-sinf CHSB/BSB tayyorgarlik platformasi. React, TypeScript, Vite, Netlify Functions va Supabase PostgreSQL/Auth asosida qurilgan.

## Imkoniyatlar

- Fanlar katalogi va o'quv dashboard'i
- Namuna savollar asosidagi interaktiv test oqimi
- Netlify serverless API: health, subjects, current user, lesson progress va quiz attempts
- Supabase Auth access token validation va user-scoped RLS persistence
- PostgreSQL schema, owner-scoped policies va indekslar
- Netlify security headers va GitHub Actions CI

> **Muhim:** backend endpointlari va migratsiya kodi repository'da tayyorlangan, ammo Supabase loyihasi yaratish, migration'ni qo'llash, Netlify environment variables o'rnatish va frontendga auth flow ulash alohida bajarilishi kerak. Bu amallar tugamaguncha ilovani production-ready deb hisoblamang; hozirgi React UI demo/local state ishlatadi.

## Deploy (Netlify)

1. Netlify'da GitHub repository'ni ulang.
2. Build command: `npm run build`; publish directory: `dist`.
3. Functions directory `netlify/functions` (`netlify.toml` orqali).
4. Supabase SQL Editor'da `supabase/migrations/20261024000000_initial_schema.sql` migratsiyasini qo'llang.
5. Netlify Site configuration → Environment variables bo'limiga `SUPABASE_URL` va `SUPABASE_ANON_KEY` kiriting.
6. Yangi deploy qiling va `/api/health` ni tekshiring.
7. Supabase Auth provider/redirect URL sozlamalarini Netlify production va preview domenlariga moslang.

## API

- `GET /api/health` — public health check.
- `GET /api/subjects` — public fanlar ro'yxati.
- `GET /api/me` — autentifikatsiya qilingan foydalanuvchi.
- `GET /api/progress` — foydalanuvchining dars progressi.
- `POST /api/progress` — darsni bajarilgan deb belgilash; `{"lesson_id":"math-intro-01"}`.
- `GET /api/quiz-attempts` — foydalanuvchining test natijalari.
- `POST /api/quiz-attempts` — test natijasini saqlash; `{"subject_id":"math","score":4,"total_questions":5,"answers":[1,0,2,3,1]}`.

Himoyalangan endpointlar `Authorization: Bearer <Supabase access_token>` talab qiladi. Har bir so'rov Supabase Auth orqali tekshiriladi va PostgREST'ga foydalanuvchining tokeni yuboriladi; RLS userlar orasidagi ma'lumotlarni ajratadi.

## Environment variables

Netlify'da server-side environment variables sifatida sozlang:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` (yoki Supabase project'ning publishable key'i)

Service-role/secret key'ni frontendga, `VITE_*` o'zgaruvchisiga yoki Git repository'ga joylamang. `.env.example` faqat placeholder qiymatlarni o'z ichiga oladi.

## Development checks

```bash
npm install
npm run typecheck
npm test
npm run build
```

## Project structure

- `src/App.tsx` — React demo UI (hali Supabase Auth bilan ulanmagan)
- `netlify/functions/api.ts` — API va server-side auth validation
- `supabase/migrations/` — PostgreSQL schema va RLS policies
- `supabase/README.md` — Supabase/Netlify sozlash bo'yicha yo'riqnoma
- `netlify.toml` — build, routing va security headers
- `.github/workflows/ci.yml` — avtomatik tekshiruvlar
- `tests/` — configuration/API contract checks

Security reporting: [SECURITY.md](SECURITY.md).
