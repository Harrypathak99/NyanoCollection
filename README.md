# Nyano Collection — candle shop

Next.js 16 (App Router, Cache Components) + Supabase. Cash on delivery only.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Environment variables are in `.env.local` (see `.env.example`).

## Make yourself an admin

1. Register at `/account/register` and confirm your email.
2. In Supabase → SQL Editor, run:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

3. Open `/admin`.

## Where things live

| What | Where |
| --- | --- |
| Header menus, footer links, social links | `src/lib/site.ts` |
| Currency, free-shipping threshold, delivery fee | `src/lib/format.ts` (fee rule is also in the `place_order` SQL function) |
| Blog posts | `src/lib/blog.ts` |
| Colors and fonts | `src/app/globals.css`, `src/app/layout.tsx` |
| Catalog queries (cached) | `src/lib/data.ts` |
| Checkout | `src/app/(shop)/checkout` → `place_order` database function |
| Admin panel | `src/app/admin` |

## Supabase settings to check before going live

- Authentication → URL Configuration: set **Site URL** to your live domain and add
  `https://your-domain/auth/confirm` to **Redirect URLs**.
- Set `NEXT_PUBLIC_SITE_URL` to your live domain on your host.
