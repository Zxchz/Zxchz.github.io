# Zach Krivis — personal site (Next.js)

Personal website rebuilt on **Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion**, designed to deploy on Vercel.

## Highlights

- **Pinned hero** with a **ColorBends** WebGL background (scroll-scrubbed unpack via Framer Motion `useScroll`).
- **Readable card-stack** for the content sections — each section is `position: sticky` and slides up to cover the previous like a deck of cards. The sticky offset is computed from each card's height, so reading-heavy sections (Experience, Writing) are **never covered before they can be read**.
- Close-to-the-metal palette: `black → zinc-950 → zinc-900 → #0a0a0a` with subtle deep tints, top borders, and heavy top shadows for physical card depth.
- **Spring-physics entrances** (`stiffness: 100, damping: 20`) staggered per section.
- **iOS-style glassmorphism** coursework chips (`bg-white/5`, `backdrop-blur-md`, `border-white/10`, `rounded-2xl`).
- **Aurora** WebGL background strictly behind the Contact section.
- `⌘K` command palette, reduced-motion fallbacks, and no horizontal overflow on mobile.

The two WebGL backgrounds are dependency-free shaders (single fullscreen triangle each), gated by `IntersectionObserver` so only the on-screen one runs.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Deploy (Vercel)

1. Import this repository into Vercel and select the **`nextjs-vercel`** branch.
2. Framework preset: **Next.js** (auto-detected). No env vars required.
3. Add the custom domain (e.g. via Cloudflare) in Vercel → Project → Domains.

No GitHub Pages workflow is included — this branch is intended for Vercel.
