# Markazlashgan B

O'zbek tilidagi 8-sinf CHSB/BSB tayyorgarlik platformasi. React, TypeScript, Vite va Netlify Functions asosida qurilgan.

## Hozirgi imkoniyatlar

- Fanlar katalogi va o'quv dashboard'i
- Interaktiv, namuna savollarga asoslangan test oqimi
- Javoblarni tekshirish va test natijasini hisoblash
- Responsive interfeys va klaviatura focus holatlari
- Serverless API health-check va fanlar endpointlari
- Netlify deploy konfiguratsiyasi va xavfsizlik headerlari
- GitHub Actions orqali typecheck, konfiguratsiya testlari va production build

> **Production holati:** bu hozircha frontend MVP va read-only demo API. Haqiqiy foydalanuvchi akkauntlari, ishonchli server-side progress, pullik funksiyalar yoki shaxsiy ma'lumotlarni saqlash uchun autentifikatsiya, ma'lumotlar bazasi, migratsiyalar, monitoring va maxfiy kalitlarni boshqarish hali integratsiya qilinmagan. Demo ma'lumotlarni real o'quvchi natijalari sifatida talqin qilmang.

## Texnologiyalar

- React 18 + TypeScript
- Vite 6
- Netlify Functions
- GitHub Actions
- Node.js 20+

## Lokal ishga tushirish

```bash
npm install
npm run dev
```

## Tekshiruvlar

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

## Deploy (Netlify)

1. Netlify'da ushbu GitHub repository'ni ulang.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Functions directory: `netlify/functions` (`netlify.toml` orqali belgilanadi).
5. Deploy preview va production deploy'dan keyin health endpointni tekshiring.

## API

- `GET /api/health` — xizmat holati.
- `GET /api/subjects` — demo fanlar ro'yxati.
- Qo'llab-quvvatlanmaydigan yo'llar `404`, GET'dan boshqa metodlar `405` qaytaradi.

API hozircha faqat demo ma'lumotlarni beradi. CORS'ni kengaytirish yoki autentifikatsiyasiz yozish endpointlarini qo'shish tavsiya etilmaydi.

## Muhit o'zgaruvchilari

`.env.example` faqat namuna. Hech qachon haqiqiy token, parol yoki private key'ni Git'ga commit qilmang. Production secrets Netlify environment variables orqali boshqarilishi kerak.

## Arxitektura

- `src/App.tsx` — o'quv dashboard'i va test tajribasi
- `src/styles.css` — interfeys va responsive dizayn
- `netlify/functions/api.ts` — read-only API
- `supabase/migrations/` — RLS bilan himoyalangan DB schema boshlang'ich migratsiyasi (UI bilan hali ulanmagan)
- `netlify.toml` — deploy, routing va security headers
- `.github/workflows/ci.yml` — avtomatik tekshiruvlar
- `tests/` — loyiha konfiguratsiyasi testlari

## Xavfsizlik

Xavfsizlik muammolarini oshkor qilish tartibi uchun [SECURITY.md](SECURITY.md) fayliga qarang.
