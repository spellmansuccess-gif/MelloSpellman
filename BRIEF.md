# MelloSpellman — Finish & Ship Brief (for Claude CLI)

## Context
- Repo: spellmansuccess-gif/MelloSpellman (default branch: main)
- Stack: Next.js 14 (App Router) + TypeScript + Tailwind + Shopify Storefront API (headless)
- Target domain: mellospellman.com (registrar: Namecheap)
- Host: Render (project name: MelloSpellman, project id: prj-d8bio5p9rddc73ccf5u0)
- Shopify store: mellospellmans-clothing.myshopify.com
- Brand: Luxury / heritage. Palette #0A0A0A ink, #F5F0E6 ivory, #B8985A gold. Type: Cormorant Garamond (display) + Inter (body).

## Public env vars (set in Render dashboard, not in repo)
```
NEXT_PUBLIC_SHOPIFY_DOMAIN=mellospellmans-clothing.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=f3318dcac18faea9bdef8526c82c4d36
```

## Files already in repo (25 source files)
- Config: package.json, tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.mjs, .gitignore, .env.example
- Lib: lib/shopify.ts, lib/queries.ts
- Layout: app/layout.tsx, app/globals.css
- Components: components/{CartProvider,Header,Footer,CartDrawer,AddToCartButton,ProductCard,ProductGrid,Hero,Section}.tsx
- Pages: app/page.tsx, app/shop/page.tsx, app/products/[handle]/page.tsx, app/lookbook/page.tsx, app/story/page.tsx, app/contact/page.tsx

## Task 1 — Bug & quality scan of the repo
Clone the repo and produce a written report covering:

1. Build correctness
   - Run `npm install` then `npm run build`. Fix any TS errors, missing imports, missing peer deps, or Tailwind config issues.
   - Verify next.config.mjs allows Shopify CDN images (images.remotePatterns includes cdn.shopify.com).
2. Type safety
   - `tsc --noEmit` must pass cleanly. Replace any `any`s in lib/shopify.ts and lib/queries.ts with proper Shopify Storefront types.
3. Shopify integration
   - Confirm lib/shopify.ts POSTs to https://${domain}/api/2024-07/graphql.json with header X-Shopify-Storefront-Access-Token.
   - Confirm cart mutations use cartCreate, cartLinesAdd, cartLinesUpdate, cartLinesRemove, and that cart.checkoutUrl is used by CartDrawer.
4. Routing & data fetching
   - app/shop/page.tsx should fetch products(first: 24) with `export const revalidate = 60`.
   - app/products/[handle]/page.tsx should use productByHandle, generate metadata, and 404 cleanly when missing.
5. Client/server boundaries
   - Any file using useState/useEffect/useContext or event handlers must start with "use client". Flag any leaks.
6. Accessibility & SEO
   - All <Image> tags have alt text. Header nav is a real <nav>. Each page exports metadata. app/layout.tsx sets metadataBase, OpenGraph, theme-color.
7. Performance
   - Use next/font for Cormorant + Inter (no <link> to Google Fonts).
   - Images use next/image with sizes set.
8. Security
   - No secrets in repo. Only NEXT_PUBLIC_* Shopify vars referenced in client code. .env.example must not contain real tokens.
9. Lint
   - Add ESLint + `next lint` if missing. Fix all warnings.

Deliverable: open one PR titled `chore: bug scan + fixes` with all fixes, plus a REPORT.md at repo root summarizing findings.

## Task 2 — Logo assets
Add four PNG files to /public (user supplies binaries):
- public/logo-ivory.png (used in Header.tsx)
- public/logo-gold.png (used in Footer.tsx, Hero.tsx)
- public/logo-black.png
- public/logo-ivory-on-black.png

Also add public/favicon.ico (from logo-black.png, 64x64) and app/icon.png (512x512 ivory-on-black).

## Task 3 — Render deploy
1. In Render project MelloSpellman, create a Web Service from spellmansuccess-gif/MelloSpellman, branch main.
2. Settings:
   - Environment: Node
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Instance: Starter (or Free)
   - Auto-deploy: On
3. Add env vars listed above.
4. Trigger deploy. Confirm the *.onrender.com URL returns 200 and homepage renders.

## Task 4 — Custom domain
1. In Render service → Settings → Custom Domains, add mellospellman.com and www.mellospellman.com. Capture the DNS records Render shows.
2. In Namecheap Advanced DNS for mellospellman.com:
   - ALIAS/ANAME @ → Render apex target
   - CNAME www → Render *.onrender.com host
   - Remove Namecheap parking records.
3. Wait for Render to verify and issue the SSL cert. Confirm https://mellospellman.com loads.

## Task 5 — Shopify verification
1. In Shopify admin, publish one test product (variant + price + image). Enable the Headless channel (id 246949) on it.
2. Confirm it appears on /shop.
3. Product page → Add to Cart → Checkout. Confirm Shopify checkout opens at mellospellmans-clothing.myshopify.com with the line item.

## Acceptance criteria
- `npm run build` is green locally and on Render.
- https://mellospellman.com resolves over HTTPS with the gold M-crest on ink-black homepage.
- /shop lists the test product. Add to Cart → Checkout completes end-to-end on Shopify.
- REPORT.md at repo root lists every bug found and how it was fixed.
- No secrets in the repo. .env.example is a template only.

## Guard rails
- User must paste binary logo PNGs themselves — do not synthesize them.
- Do not touch the private Shopify admin token (shpat_…); only the public Storefront token belongs on the client.
- Do not modify Shopify product images programmatically.
