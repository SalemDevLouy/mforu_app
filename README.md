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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Prisma (Neon) and TanStack setup

This project includes Prisma for ORM and examples for using Neon (Postgres) and TanStack packages.

Quick steps to get started:

1. Copy the example environment file and set your Neon connection string:

```bash
cp .env.example .env
# then edit .env and replace DATABASE_URL with your Neon connection string
```

2. If you haven't already, install dependencies (done for you in this repo session):

```bash
npm install
```

3. Generate the Prisma client (this reads `prisma/schema.prisma`):

```bash
npx prisma generate
```

4. To apply schema changes to your Neon DB (once DATABASE_URL is set):

```bash
# push schema without creating a migration
npx prisma db push

# or use migrations (recommended for app dev):
npx prisma migrate dev --name init
```

Files added in this setup:

- `prisma/schema.prisma` — the Prisma schema with an example `User` model.
- `prisma.config.ts` — Prisma config (reads `DATABASE_URL` from env).
- `src/lib/prisma.ts` — PrismaClient singleton for use in the app.
- `src/app/api/users/route.ts` — example API route returning users.
- `src/hooks/useUsers.ts` — small `react-query` hook that fetches `/api/users`.
- `.env.example` — placeholder for your Neon DATABASE_URL.

Notes:
- The Prisma CLI generated a `prisma.config.ts` that reads `DATABASE_URL` from the environment. Set the variable in `.env` before running migrations or database introspection.
- I installed `@tanstack/react-query`, `@tanstack/react-table`, and `@tanstack/react-virtual`. Import and configure React Query's `QueryClient` in your app (for example in a `Providers` component) before using `useUsers`.
