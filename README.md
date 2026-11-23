# IRONVEX FITNESS & GYM — PLATFORM DOCUMENTATION

> High-Performance Athletic Training, Biomechanics, & Luxury Recovery Platform.

![IRONVEX Emblem](/ironvex-logo.png)

## Overview
IRONVEX is an enterprise-grade, fully interactive web application built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Vite**. The platform embodies a luxury **Black & Gold** aesthetic and features 14 complete interactive subsystems with zero non-functional or decorative-only controls.

---

## Interactive Capabilities

1. **Interactive Homepage & Hero**
   - Synthesized Web Audio API sound effects (Plate clanks, UI clicks, countdown beeps, success chimes).
   - Real-time animated counters for Athletes, Coaches, and Success Rates.
   - Sticky header with active section tracking via `IntersectionObserver`.

2. **Membership System & 4-Step Checkout**
   - Monthly and 20% Discount Annual billing terms.
   - 3 Athletic Tiers (*Iron Access*, *Pro Athlete*, *Black Gold VIP*).
   - 4-Step checkout modal validating user details, preferred start date, and instant VIP digital pass minting with barcode generation.

3. **Biometric BMI & Composition Engine**
   - Dual Metric (`cm`/`kg`) and Imperial (`ft`, `in`/`lbs`) computation.
   - Dynamic SVG visual range gauge with live marker.
   - Targeted training protocols and nutritional guidance based on result.

4. **Dynamic Split & Workout Planner**
   - 5 Goal types (Strength, Hypertrophy, Shred, Endurance, Functional).
   - 3 Experience levels and 3-to-6 day splits.
   - Day-by-day routines with sets, reps, coaching cues, and completion checkboxes.
   - Integrated Barbell Rest Timer (30s, 60s, 90s, 180s) with audio cues.

5. **Master Trainer Booking System**
   - Coach cards with ratings, verified reviews, and specialties.
   - Date and slot reservation modal issuing booking codes (`IV-BK-XXXX`).

6. **Architectural Apparatus Lightbox Gallery**
   - Filter tabs (Cast Iron, Olympic, Cardio, Recovery).
   - Full-screen lightbox with previous/next and keyboard arrow navigation.

7. **Member Testimonials Carousel**
   - Verified athlete transformation proof, star ratings, and auto-play with hover pause.

8. **Concierge Dispatch & Accordion FAQ**
   - Form validation, loading state, and toast feedback.
   - Expandable FAQ addressing 24/7 access, guest passes, and guarantee policies.

9. **Athlete Member Dashboard**
   - Digital VIP barcode card with printable action.
   - Personal Records (PRs) logger for Bench, Squat, Deadlift, and OHP.
   - Profile contact updater and upcoming coach bookings.

10. **Executive Admin Command Center**
    - PIN protected (`8888` or Quick Unlock).
    - KPI cards: Total Members, Monthly Recurring Revenue (MRR), Booking Queue, Messages.
    - Member management table with status toggles (Active / On Hold).
    - Booking approval and message resolution queues.

---

## Running Locally

```bash
# Navigate to directory
cd C:\Users\USER\Downloads\ironvex

# Start development server
npm run dev
```

App runs on: `http://localhost:5174`

---

## Production Build

```bash
npm run build
```

The optimized assets will be compiled into the `dist/` directory.

---

## Supabase Integration

1. Create a project at [supabase.com](https://supabase.com).
2. Execute the SQL script in `supabase/schema.sql` within the Supabase SQL Editor.
3. Copy `.env.example` to `.env` and provide your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. If credentials are not present, the platform operates seamlessly using persistent `localStorage` synchronization.
