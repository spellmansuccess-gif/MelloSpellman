# MelloSpellman

Headless storefront for [mellospellman.com](https://mellospellman.com) — Next.js 14 (App Router) + TypeScript + Tailwind, talking to a Shopify Storefront API.

## Stack
- **Next.js 14** App Router, React 18, TypeScript strict
- **Tailwind** with a small luxury palette (ink `#0A0A0A`, ivory `#F5F0E6`, gold `#B8985A`)
- **Cormorant Garamond** (display) + **Inter** (body) via `next/font`
- **Shopify Storefront API** (`2024-07`) via vanilla `fetch` — no SDK
- **Render** Node deploy

## Run locally
```bash
cp .env.example .env.local   # paste your Storefront token
npm install
npm run dev                  # http://localhost:3000
```

## Deploy
Pushes to `main` auto-deploy on Render. Build cmd: `npm install && npm run build`. Start cmd: `npm start`.

## Layout
- `lib/shopify.ts` — fetch helper + Storefront types
- `lib/queries.ts` — products, productByHandle, cart create / add / update / remove
- `components/CartProvider.tsx` — client cart context with persisted `cartId` in localStorage
- `app/` — routes (`/`, `/shop`, `/products/[handle]`, `/lookbook`, `/story`, `/contact`)

See `REPORT.md` for the build-out notes (this repo started as empty stubs).
