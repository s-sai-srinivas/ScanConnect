# ScanConnect

Digital business hub for restaurants — **one QR, one page, every link.**

## North Star

> Restaurants maintain a **single source of truth** at `scanconnect.com/b/{slug}`:
> menu, WhatsApp, Instagram, website, delivery apps, maps, reviews — one scan, everything.

## Repository structure

```
QRcode/                    ← clean root (docs + config only)
├── PLAN.md                ← master plan (hub-first vision)
├── README.md
├── docs/phases/
├── .cursor/mcp.json
└── scanconnect/           ← Next.js app — run all commands here
    ├── app/
    ├── components/
    │   └── public/
    │       ├── links-hub.tsx    ← quick links grid
    │       └── public-menu.tsx  ← BusinessHub layout
    ├── lib/
    └── supabase/
```

## Quick start

```bash
cd scanconnect
cp .env.local.example .env.local   # fill in Supabase keys
npm install
npm run dev
```

- **Demo hub:** http://localhost:3000/b/demo-cafe
- **Landing:** http://localhost:3000

## Public page layout

```
Header (logo, name, hours)
Quick Links (WhatsApp, Call, Maps, Instagram, Website, Swiggy, Zomato, Reviews)
Menu section (categories + items)
Action bar + viral CTA
```
