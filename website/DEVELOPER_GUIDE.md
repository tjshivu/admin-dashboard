# BrikUp Landing Page - Developer Guide

## Overview
This project is a high-performance, responsive landing page for **BrikUp**, a service professional discovery platform. It is built with **Next.js 15**, **Tailwind CSS v4**, and **Framer Motion**.

## Tech Stack
-   **Framework**: Next.js 15 (App Router)
-   **Styling**: Tailwind CSS v4
-   **Animations**: Framer Motion, MagicUI
-   **Icons**: Lucide React
-   **Fonts**: Inter (Body), Titillium Web (Display)

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Global layout (Fonts, SEO, Header)
│   ├── page.tsx         # Main landing page (Composes sections)
│   ├── globals.css      # Global styles & Tailwind theme config
│   ├── not-found.tsx    # Custom 404 page
│   └── error.tsx        # Global error boundary
├── components/
│   ├── Header.tsx       # Scroll-aware floating header
│   ├── HeroSection.tsx  # Hero with phone slideshow (Split 60/40)
│   ├── HowItWorks.tsx   # Trust, Services, and Reviews sections
│   ├── Footer.tsx       # Site footer
│   └── ui/              # Reusable UI components (buttons, cards)
└── lib/
    └── utils.ts         # Utility functions (cn, clsx)
```

## Key Architectural Decisions

### 1. Lazy Loading
To optimize "Time to Interactive" (TTI) and First Contentful Paint (FCP), heavy components are lazy-loaded.
-   **Implementation**: `src/app/page.tsx` uses `next/dynamic` to import `HowItWorks.tsx`.
-   **Why**: `HowItWorks` contains multiple Marquees (review walls) which are computationally expensive. Deferring them ensures the Hero section loads instantly.

### 2. Smart Header
The `Header` component (`src/components/Header.tsx`) listens to scroll events.
-   **Behavior**: Hides when scrolling *down* (to show content), appears when scrolling *up* (to make navigation accessible).
-   **Tech**: Uses `framer-motion`'s `useScroll` and `useMotionValueEvent`.

### 3. Mobile-First Optimization
The site provides distinct experiences for Mobile vs Desktop in several areas:
-   **Hero**: The 3D Phone Mockup is hidden on mobile to reduce clutter.
-   **Services**: Desktop uses a vertical scrolling marquee. Mobile uses a static, "Uber-style" grid of 6 icons for better usability.
-   **Reviews**: Desktop uses an infinite marquee. Mobile uses a horizontally scrolling snap-list.
-   **Images**: All `next/image` components have `sizes` props optimized for viewport width.

## Styling & Theming

### Colors
Colors are defined in `src/app/globals.css` using the **OKLCH** color space for vibrancy.
-   **Background**: White (`#ffffff`) for a clean, premium look.
-   **Text**: Zinc-950 (`#09090b`) for high contrast.
-   **Accents**: Zinc-100/200 for subtle borders and backgrounds.

### Typography
-   **Display**: `Titillium Web` (Headings) - Tech/Modern feel.
-   **Body**: `Inter` (Paragraphs) - Clean/Readable.

## Development Workflows

### Running Locally
```bash
npm run dev
```

### Checking Production Build
Always check the production build after making animation changes to ensure tree-shaking works and performance isn't degraded.
```bash
npm run build
npm start
```

## Common Tasks

### Adding a New Service
1.  Open `src/components/HowItWorks.tsx`.
2.  Add the service to `SERVICES_COL1` or `SERVICES_COL2` arrays.
3.  Ensure you have a suitable emoji or icon.

### Updating Reviews
1.  Open `src/components/HowItWorks.tsx`.
2.  Add a new object to the `reviews` array.
3.  Ensure the `avatar` URL is valid.

---

## Contact
For technical questions, please refer to the Git history or contact the lead developer.
