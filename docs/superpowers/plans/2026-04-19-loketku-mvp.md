# Loketku MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Loketku MVP end-to-end: create event, publish a public event page, sell tickets, show e-tickets, scan QR codes at the door, and surface a simple organizer dashboard summary.

**Architecture:** Keep the current Astro app as the shell, React islands for interactive flows, and the existing Supabase client for event/ticket data. The MVP should stay intentionally small: one public event flow, one ticket flow, one scanner flow, and one organizer summary view. No referral system, no billing complexity, and no extra admin surface beyond what is needed to run an event.

**Tech Stack:** Astro, React, Supabase JS, Tailwind CSS, shadcn/ui components, Lucide icons, qrcode.react, html5-qrcode.

---

### Task 1: Public event landing and ticket purchase

**Files:**
- Modify: `src/components/events/EventLanding.tsx`
- Modify: `src/pages/event/[id].astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Align the public event page with the MVP flow**

Replace the referral-based purchase UI with a simpler buyer flow: name, email, and ticket quantity. Remove referral lookups and any dependency on the `referrals` table so the page only depends on `events` and `tickets`.

- [ ] **Step 2: Keep the public page focused on conversion**

Ensure the event hero, price, and CTA are easy to scan. Show sold-out or remaining-ticket information when available, but do not add extra sections that distract from checkout.

- [ ] **Step 3: Update the homepage to point to the MVP flows**

Make the root page explain the UVP in plain language and link directly to the create-event dashboard, a sample public event page, and the scanner page.

- [ ] **Step 4: Verify the page builds cleanly**

Run:
```bash
npm run build
```

Expected: build succeeds with no TypeScript or Astro errors.

---

### Task 2: E-ticket result page

**Files:**
- Modify: `src/components/tickets/ETicket.tsx`
- Modify: `src/pages/ticket/[id].astro`

- [ ] **Step 1: Make the e-ticket page the receipt for one purchased ticket**

Keep the QR code, event details, buyer identity, and ticket status visible. Add a clearer check-in-ready presentation so the page works as the final result after purchase.

- [ ] **Step 2: Make the success state easy to follow**

If a ticket is already used, show that status prominently. If the ticket cannot be found, keep the error state simple and readable.

- [ ] **Step 3: Verify the page in the browser**

Open a valid ticket URL after purchasing and confirm the QR code renders and the metadata matches the purchased ticket.

---

### Task 3: QR check-in flow

**Files:**
- Modify: `src/components/tickets/QRScanner.tsx`
- Modify: `src/pages/dashboard/scanner/[id].astro`

- [ ] **Step 1: Keep scanner logic centered on one job**

Use the scanned QR value as a ticket ID, validate it against the current event, and mark it as used when valid. Remove any unused leaderboard or referral concerns from this flow.

- [ ] **Step 2: Improve the scan feedback states**

Keep three clear states: scanning, success, and failure. Make the success state obvious for door staff and ensure the reset action is easy to trigger.

- [ ] **Step 3: Verify scanner route rendering**

Run the scanner page in the browser, confirm the camera widget mounts, and confirm the validation UI appears after a scanned code is accepted.

---

### Task 4: Organizer dashboard summary

**Files:**
- Modify: `src/components/dashboard/OrganizerDashboard.tsx`
- Modify: `src/pages/dashboard/[id].astro`

- [ ] **Step 1: Remove the leaderboard dependency**

Delete the referral leaderboard section so the dashboard only reports MVP-relevant numbers: tickets sold, checked-in tickets, remaining capacity, and simple revenue.

- [ ] **Step 2: Show recent activity instead of extra admin features**

Keep a compact recent-tickets table so organizers can see the latest purchases and their current status without leaving the dashboard.

- [ ] **Step 3: Preserve the dashboard chrome**

Keep the shared top bar and route actions intact so the dashboard still feels like one product surface, not a set of disconnected pages.

- [ ] **Step 4: Verify summary data is computed from tickets only**

Use the existing `events` and `tickets` data as the only source of truth for this view.

---

### Task 5: Final verification and polish

**Files:**
- Modify: `src/pages/dashboard/create-event.astro`
- Modify: `src/components/events/CreateEventForm.tsx` if needed for MVP copy
- Modify: `src/pages/index.astro` if copy needs tightening

- [ ] **Step 1: Make sure create-event remains the entry point for organizers**

Keep the create-event page as the fastest way to start an event and link it clearly to the rest of the MVP flow.

- [ ] **Step 2: Run the production build**

Run:
```bash
npm run build
```

Expected: complete success.

- [ ] **Step 3: Verify the core browser flow end-to-end**

Use Playwright to confirm this path works:
1. log in as organizer
2. create event
3. open public event page
4. buy a ticket
5. open the e-ticket page
6. scan the ticket in the dashboard scanner

- [ ] **Step 4: Commit the MVP scope work**

```bash
git add docs/superpowers/plans/2026-04-19-loketku-mvp.md src/pages/index.astro src/components/events/EventLanding.tsx src/pages/event/[id].astro src/components/tickets/ETicket.tsx src/pages/ticket/[id].astro src/components/tickets/QRScanner.tsx src/pages/dashboard/scanner/[id].astro src/components/dashboard/OrganizerDashboard.tsx src/pages/dashboard/[id].astro src/pages/dashboard/create-event.astro
git commit -m "feat: focus loketku on the core ticketing MVP"
```

---

## Coverage check

- Public event landing and purchase flow → Task 1
- E-ticket receipt page → Task 2
- QR scanner / check-in → Task 3
- Organizer summary dashboard → Task 4
- Homepage copy and end-to-end verification → Task 5
