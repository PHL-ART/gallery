This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Docker Compose

Проект поддерживает деплой через `docker compose` (Next.js + Prisma migrations).

```bash
docker compose up --build
```

В `.env` должны быть заданы переменные:
- `DATABASE_URL` (или `POSTGRES_*`, чтобы он мог быть построен приложением)
- `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET` (и при необходимости `S3_FORCE_PATH_STYLE`)
- OAuth для админки: `ADMIN_ALLOWLIST`, `NEXTAUTH_SECRET`, а также `GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET` или `GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_SITE_URL` (для `sitemap.xml`/canonical)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
