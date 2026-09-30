# ScanConnect — Phase-Wise Implementation Plans

Detailed build guides for each MVP phase. Read the master plan first: [`PLAN.md`](../../PLAN.md).

---

## North Star (all phases)

> **One QR → one URL → single source of truth for all restaurant links + menu.**

The public page at `/b/{slug}` is a **Business Hub**, not a menu-only page. Menu is one section; links are primary.

---

## Overview

| Phase | Name | Duration | Goal |
|-------|------|----------|------|
| [Phase 0](./phase-0-foundation.md) | Foundation & Database | 1–2 days | Project scaffold, Supabase schema, RLS |
| [Phase 1](./phase-1-public-menu-onboarding.md) | Public Hub + Onboarding | Week 1 | Business hub page, links + menu, owner can publish |
| [Phase 2](./phase-2-qr-posters-whatsapp.md) | QR + Posters + WhatsApp | Week 2 | **One hub QR**, posters, share link, notifications |
| [Phase 3](./phase-3-analytics-admin-launch.md) | Analytics + Admin + Launch | Week 3 | Business ops, admin panel, landing page, sell-ready |
| [Phase 4](./phase-4-post-mvp.md) | Post-MVP Growth | Month 2–6 | Monetization, subscriptions, scale features |

---

## Build Order (Critical)

```
Phase 0 → Phase 1 (public HUB first) → Phase 2 (hub QR) → Phase 3 → Phase 4
```

**Never build dashboard before the public hub page.** The customer-facing hub is the product.

---

## Dependency Graph

```
Phase 0 (Foundation)
    │
    ▼
Phase 1 (Public Business Hub + Onboarding + Menu CRUD)
    │
    ├──► Phase 2 (Hub QR + Posters + WhatsApp)
    │         │
    │         ▼
    └──► Phase 3 (Analytics + Admin + Launch)
              │
              ▼
         Phase 4 (Post-MVP)
```

---

## Quick Reference

### Tech stack (all phases)

- **Frontend:** Next.js 15, Tailwind, shadcn/ui
- **Backend:** Supabase (Postgres, Auth, Storage)
- **Hosting:** Vercel
- **Image compression:** sharp
- **QR generation:** qrcode npm package

### Target customer

Cafes and bakeries first. Every feature decision: *"Does this help put ALL links in ONE place?"*

### MVP success metric

> A restaurant owner publishes **one hub link** with all customer-facing links + menu in under 5 minutes.

---

## How to Use These Docs

1. Complete phases **in order** — each doc lists prerequisites.
2. Check off tasks as you go — each phase has a task checklist.
3. Run the **Definition of Done** checklist before moving to the next phase.
4. Run the **Testing Checklist** on a real phone with Slow 3G throttling.

---

## Document Structure

Each phase document includes:

- **Goal & success criteria**
- **Duration & prerequisites**
- **Task checklist** (ordered)
- **Files to create/modify**
- **Database & server actions**
- **UI/UX requirements**
- **Testing checklist**
- **Definition of done**
- **Out of scope** (what NOT to build in this phase)
