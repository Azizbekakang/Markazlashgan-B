# Markazlashgan B

O'zbek tilidagi 8-sinf CHSB/BSB tayyorgarlik platformasi. React, TypeScript, Vite va Netlify Functions asosida qurilgan.

## Imkoniyatlar

- Fanlar va mavzular bo'yicha o'quv paneli
- Interaktiv testlar, javobni tekshirish va natijani hisoblash
- Progress va kundalik maqsadlar uchun dashboard
- Responsive interfeys va qulay navigatsiya
- Netlify Functions uchun API endpoint
- TypeScript va Vite build pipeline

## Ishga tushirish

Node.js 20+ talab qilinadi.

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Netlify deploy

Repository'ni Netlify'ga ulang. Build command: `npm run build`, publish directory: `dist`. `netlify.toml` redirect va Functions sozlamalarini o'z ichiga oladi.

## API

- `/.netlify/functions/api/health` — health check
- `/.netlify/functions/api/subjects` — fanlar ro'yxati

## Arxitektura

- `src/App.tsx` — dashboard va test tajribasi
- `src/styles.css` — responsive design system
- `netlify/functions/api.ts` — serverless API
- `netlify.toml` — deploy konfiguratsiyasi

## Hozirgi holat

Bu repository boshlang'ich production-oriented MVP hisoblanadi. Haqiqiy foydalanuvchi akkauntlari, ma'lumotlar bazasi, server-side progress saqlash va admin kontent boshqaruvi uchun alohida auth/database integratsiyasi kerak bo'ladi.
