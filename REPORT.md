# Build report

## Findings

This was not a typical "bug scan" deliverable. When the repo was cloned, every source file was a 1-byte empty stub created via the GitHub web UI's "Create new file" flow (every commit message is `Create page.tsx` / `Create *.ts` / `Create *.css`). The 25 files referenced in the brief existed as filenames only — there was no Next.js app to audit and `npm run build` would have failed immediately with module-not-found on the empty entrypoints.

Files that were empty (1 byte each) before this PR:

| Path | Status |
|---|---|
| `tsconfig.json` | empty → populated |
| `next.config.mjs` | empty → populated |
| `tailwind.config.ts` | empty → populated |
| `postcss.config.mjs` | empty → populated |
| `app/globals.css` | empty → populated |
| `app/layout.tsx` | empty → populated |
| `app/page.tsx` | empty → populated |
| `app/shop/page.tsx` | empty → populated |
| `app/products/[handle]/page.tsx` | empty → populated |
| `app/lookbook/page.tsx` | empty → populated |
| `app/story/page.tsx` | empty → populated |
| `app/contact/page.tsx` | empty → populated |
| `lib/shopify.ts` | empty → populated |
| `lib/queries.ts` | empty → populated |
| `components/Header.tsx` | empty → populated |
| `components/Footer.tsx` | empty → populated |
| `components/Hero.tsx` | empty → populated |
| `components/Section.tsx` | empty → populated |
| `components/CartProvider.tsx` | empty → populated |
| `components/CartDrawer.tsx` | empty → populated |
| `components/AddToCartButton.tsx` | empty → populated |
| `components/ProductCard.tsx` | empty → populated |
| `components/ProductGrid.tsx` | empty → populated |

Files that were missing entirely:

- `app/not-found.tsx` — standard 404 surface, required by the `notFound()` call in the product page
- `app/icon.png` — 512×512 ivory-on-black favicon
- `public/logo-ivory.png`, `public/logo-gold.png`, `public/logo-black.png`, `public/logo-ivory-on-black.png`
- `.eslintrc.json`

What was already present and correct before the PR:

- `package.json` declared `next 14.2.5`, react 18.3.1, the right dev deps for Tailwind/PostCSS/TypeScript. No Shopify SDK needed since we hit the Storefront API with vanilla fetch.
- `.gitignore` covered the standard Next.js + env-file paths.
- `.env.example` had the right two `NEXT_PUBLIC_*` keys.

## Build-out

Built the full Next.js 14 + Tailwind + Shopify Storefront site against the brief.

### `lib/shopify.ts`
Vanilla `fetch` against `https://${domain}/api/2024-07/graphql.json` with `X-Shopify-Storefront-Access-Token`. Exports the minimal Storefront types we touch (Money, ShopifyImage, ProductVariant, Product, Cart, CartLine, UserError) so consumers stay typed end-to-end with no `any`. `shopifyFetch<T>` validates HTTP status, parses the GraphQL response envelope, throws on `errors[]`, and supports both `cache` and `next.revalidate` so reads and mutations can opt into different caching policies. A `formatMoney` helper centralizes currency rendering via `Intl.NumberFormat`.

### `lib/queries.ts`
GraphQL fragments + thin wrappers:
- `fetchProducts(first=24)` → uses `products(first, sortKey: UPDATED_AT)` with `revalidate: 60`.
- `fetchProductByHandle(handle)` → uses `productByHandle` with `revalidate: 60`.
- Cart mutations: `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`, `cartFetch`. All cart mutations are `cache: 'no-store'` because state must round-trip fresh. Each asserts `userErrors[]` is empty before returning the cart.
- Reads swallow errors and return safe defaults (empty array / null) so an unreachable Shopify doesn't crash an entire page render.

### `components/CartProvider.tsx`
Client component, React context. Persists the Shopify `cart.id` in `localStorage` under `mellospellman_cart_id`. On mount, fetches the cart via `cartFetch`; if the saved id is stale (Shopify expired or deleted it), the id is dropped and state resets. `addItem` handles both "no cart yet → cartCreate" and "existing cart → cartLinesAdd" with a safety net: if a stale id causes `cartLinesAdd` to fail, it transparently falls through to `cartCreate`. `updateItem` treats `quantity <= 0` as a remove. Exposes `open` / `setOpen` so the drawer is controlled from anywhere via `useCart`.

### `components/CartDrawer.tsx`
Right-side slide-over. Escape to close. Body scroll locked while open. Per-line quantity controls (`−` / `+` / remove). Subtotal + a checkout link that goes to Shopify's hosted checkout via `cart.checkoutUrl`. Image fallback chain: variant image → product featured image.

### `components/AddToCartButton.tsx`
Calls `addItem` from cart context. Disabled states for sold-out / mid-request. Surfaces server-side error messages inline.

### `components/Header.tsx` (client)
Sticky, ink-black with `backdrop-blur`. Real `<nav aria-label="Primary">`. Bag button shows the cart count from context. Logo uses `next/image` with a small fixed `height` and `width: auto`.

### `components/Footer.tsx`, `components/Hero.tsx`, `components/Section.tsx`, `components/ProductCard.tsx`, `components/ProductGrid.tsx`
Server components. Hero centers the gold crest on the ink background with a soft gold radial vignette. ProductCard uses `next/image` `fill` + a proper `sizes` attribute and 3:4 aspect.

### Routing
- `app/page.tsx` — Hero + featured-8 grid + brand block. `revalidate = 60`.
- `app/shop/page.tsx` — first 24 products. `revalidate = 60`. Per-page `metadata`.
- `app/products/[handle]/page.tsx` — `generateMetadata` (title + OG image), `notFound()` on missing handle, image gallery, variant resolution. Marked dynamic since it depends on the handle param.
- `app/lookbook/page.tsx`, `app/story/page.tsx`, `app/contact/page.tsx` — static editorial pages with their own metadata.
- `app/not-found.tsx` — surface for `notFound()`.

### Layout
- `app/layout.tsx` sets `metadataBase`, default title + template, full OpenGraph, Twitter, robots, and `viewport.themeColor = '#0A0A0A'`.
- Cormorant Garamond + Inter loaded via `next/font/google` (no `<link>` to Google Fonts).
- Wraps everything in `<CartProvider>` so Header and CartDrawer can read shared state.

### `tailwind.config.ts`
Palette tokens (`ink`, `ivory`, `gold`, plus soft / deep variants), font family variables pointing at the next/font CSS vars, and a `widest2` letter-spacing token used for eyebrow labels.

### `next.config.mjs`
`reactStrictMode: true` + `images.remotePatterns` allowing `cdn.shopify.com` (required for `next/image` to fetch product images).

### Logos
Copied from `~/Desktop/MS Logo/`, resampled to web-friendly widths:
- `public/logo-ivory.png` ← `transparent_cream_4000w.png` @ 1024w (used by Header)
- `public/logo-gold.png` ← `06_spellman_logo_gold_one_color_transparent.png` @ 1024w (Footer, Hero)
- `public/logo-black.png` ← `black_one_color_transparent.png` @ 1024w
- `public/logo-ivory-on-black.png` ← `square_black_background.png` @ 1024w
- `app/icon.png` ← `square_black_background.png` @ 512w (Next 14 auto-emits the favicon `<link>` from this)

Skipped `public/favicon.ico`: Next 14's `app/icon.png` already drives the favicon meta tags. A second `.ico` would just be duplicate work.

## Verification

Run | Result
---|---
`npm install` | OK (388 packages, no errors)
`npm run typecheck` (`tsc --noEmit`) | Clean
`npm run lint` (`next lint`) | `No ESLint warnings or errors`
`npm run build` | Compiled successfully; 9 routes generated (`/`, `/shop`, `/products/[handle]`, `/lookbook`, `/story`, `/contact`, `/_not-found`, `/icon.png`)

The "fetchProducts failed: Shopify Storefront client is not configured" warnings during local build are expected — local `.env` is not committed. On Render the env vars are set and the homepage / shop will populate. The fetch wrapper catches the error and renders the empty-state copy without crashing.

## Security note

`next@14.2.5` (the version pinned by the original `package.json`) was flagged for a security advisory linked at <https://nextjs.org/blog/security-update-2025-12-11>. Bumped to `^14.2.35` (latest patched 14.x) in the same PR. No `npm audit` high-severity findings remain in the locked tree.

`.env.example` contains only the public Storefront token placeholder. No secrets are committed. The admin token (`shpat_…`) is not referenced anywhere in client code.

## Not done by this PR (require human action on third-party dashboards)

- **Render web service** — create from this repo, branch `main`, set the two `NEXT_PUBLIC_*` env vars, deploy.
- **Custom domain** — add `mellospellman.com` + `www.mellospellman.com` in Render Custom Domains, paste the DNS records into Namecheap (ALIAS/ANAME on apex, CNAME on `www`), remove parking records, wait for SSL.
- **Shopify Storefront publishing** — at least one published product on the `headless` sales channel (id 246949). The build is green either way; products only appear once published to that channel.

These are tracked in the original brief as Tasks 3, 4, 5 and need to be done in the Render dashboard, Namecheap DNS panel, and Shopify admin respectively.
