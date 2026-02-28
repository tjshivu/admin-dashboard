<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-FF0050?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

<h1 align="center">🧱 BrikUp</h1>

<p align="center">
  <strong>Find Trusted Local Professionals</strong>
  <br />
  Discover, compare, and book verified service professionals in your neighborhood.
  <br />
  <br />
  <a href="https://brikuptech.com"><strong>🌐 Live Site »</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#-getting-started">Quick Start</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#-tech-stack">Tech Stack</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#-project-structure">Structure</a>
</p>

---

## ✨ Overview

BrikUp is a modern, performance-first landing page for a service discovery platform connecting users with trusted local professionals — from home cleaning and AC repair to lawyers and tattoo artists. Built with **Next.js 16** (App Router), **React 19**, and **Tailwind CSS v4**, it delivers a premium user experience with cinematic scroll animations, responsive layouts, and SEO-ready architecture.

### Key Highlights

- 🎬 **Cinematic Scrollytelling Hero** — Spring-physics scroll animations with a phone mockup that centers, cycles through carousel slides, and exits — all synced to scroll position
- 📱 **Fully Responsive** — Tested on iPhone SE (375px), iPhone 14 Pro, iPad (768px), small laptops, and desktops (1440px+)
- ⚡ **Performance-First** — Static generation, optimized images via `next/image`, font preloading, and minimal client-side JavaScript
- 🔍 **SEO-Ready** — Structured JSON-LD data, dynamic `robots.txt`, `sitemap.xml`, proper meta tags, and semantic HTML
- 🎨 **Premium Design** — Clean monochrome palette, Titillium Web + Inter typography, micro-animations, and glassmorphism effects

---

## 🖼️ Features

### Hero Section
- Scroll-driven phone mockup animation powered by Framer Motion + `useSpring`
- Carousel of service illustrations synced to scroll position
- "FIND PROS" / "GET DONE" watermark text with parallax effect
- Trust badge with user avatars, star rating, and social proof
- Search bar with location inputs and CTA buttons

### How It Works
- **Trust Psychology Section** — Verified Professionals, Authentic Reviews, Community Vetted cards with SVG illustrations
- **Most Used Services** — Bento-grid layout on desktop, responsive 2-col grid on mobile with service cards (Home Cleaning, AC Repair, Appliance Repair, Plumbing, etc.)
- **Top Rated Professionals** — Horizontal scrolling card layout with ratings and profile previews
- **Customer Reviews** — Dual-direction marquee testimonial wall with color-coded cards

### Footer
- Newsletter email subscription
- Platform & Company link columns
- Social media icons (responsive — icon row on mobile, full list on desktop)
- Large "BRIKUP" watermark with responsive sizing

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | [Next.js](https://nextjs.org/) (App Router) | 16.1.6 |
| **UI Library** | [React](https://react.dev/) | 19.2.3 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 4.1.18 |
| **Animations** | [Framer Motion](https://motion.dev/) | 12.34.0 |
| **Icons** | [Lucide React](https://lucide.dev/) | 0.564.0 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.x |
| **Linting** | [ESLint](https://eslint.org/) | 9.x |
| **Utilities** | [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | — |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17+ (recommended: 20+)
- **npm** 9+ (or yarn/pnpm)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/brikup-landing.git
cd brikup-landing

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |

---

## 📁 Project Structure

```
brikup-landing/
├── public/
│   └── svg/                    # SVG illustrations (Storyset)
│       ├── location-search-pana.svg
│       ├── barbershop-full-of-clients-bro.svg
│       ├── tattoo-artist-bro.svg
│       ├── Lawyer-cuate.svg
│       ├── Conversation-pana.svg
│       ├── Group Chat-cuate.svg
│       ├── Life in a city-amico.svg
│       ├── Feeling sorry-pana.svg
│       └── 404 error lost in space-cuate.svg
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (fonts, metadata, JSON-LD)
│   │   ├── page.tsx            # Home page (composes all sections)
│   │   ├── globals.css         # Global styles, theme tokens, animations
│   │   ├── loading.tsx         # Route transition loading UI
│   │   ├── error.tsx           # Error boundary UI
│   │   ├── not-found.tsx       # Custom 404 page
│   │   ├── robots.ts           # Dynamic robots.txt generation
│   │   └── sitemap.ts          # Dynamic sitemap.xml generation
│   │
│   ├── components/
│   │   ├── Header.tsx          # Sticky navigation with responsive menu
│   │   ├── HowItWorks.tsx      # Main content: trust, services, pros, reviews
│   │   ├── Footer.tsx          # Footer with links, newsletter, watermark
│   │   ├── ui/
│   │   │   └── blur-fade.tsx   # BlurFade animation wrapper (Framer Motion)
│   │   └── magicui/
│   │       └── marquee.tsx     # Infinite scroll marquee component
│   │
│   └── lib/
│       └── utils.ts            # Utility functions (cn helper)
│
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── postcss.config.mjs          # PostCSS config (Tailwind plugin)
├── components.json             # shadcn/ui configuration
├── eslint.config.mjs           # ESLint flat config
└── package.json
```

---

## 🎨 Design System

### Typography

| Token | Font | Usage |
|-------|------|-------|
| `font-display` | **Titillium Web** (300–900) | Headings, brand text, hero titles |
| `font-sans` | **Inter** (variable) | Body text, UI elements, buttons |

### Color Palette

Built on Tailwind's `zinc` scale for a clean monochrome aesthetic:

| Role | Color | Token |
|------|-------|-------|
| Background | `#FFFFFF` | `bg-white` |
| Primary Text | `#09090B` | `text-zinc-950` |
| Secondary Text | `#71717A` | `text-zinc-500` |
| Borders | `#E4E4E7` | `border-zinc-200` |
| Accent/CTA | `#18181B` | `bg-zinc-900` |
| Card Background | `#F4F4F5` | `bg-zinc-100` |

### Animations

- **Scroll-linked** — Spring-smoothed transforms via `useSpring` + `useTransform`
- **Marquee** — CSS keyframe-based infinite horizontal/vertical scroll
- **BlurFade** — Intersection Observer-triggered fade + blur entrance
- **Float** — Subtle CSS keyframe hover animation

---

## 🔍 SEO

The site implements comprehensive SEO best practices:

- **Structured Data** — Organization + WebSite JSON-LD schemas in `layout.tsx`
- **Dynamic `robots.txt`** — Generated via Next.js route handler (`robots.ts`)
- **Dynamic `sitemap.xml`** — Auto-generated sitemap (`sitemap.ts`)
- **Meta Tags** — Open Graph, Twitter Cards, canonical URLs
- **Semantic HTML** — Proper heading hierarchy, landmark elements
- **Font Optimization** — `next/font` with `display: swap` for zero FOIT

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Behavior |
|-----------|-------|----------|
| **Mobile S** | 320–374px | Single column, compact text |
| **Mobile** | 375–639px | 2-col service grid, stacked trust cards |
| **Tablet** | 640–767px | Expanded search bar, 3-col service grid |
| **iPad** | 768–1023px | Multi-column layouts, tablet-specific sizing |
| **Desktop** | 1024px+ | Full scroll animations, bento grid, side-by-side layouts |
| **Wide** | 1440px+ | Max-width container (`max-w-7xl`), spacious padding |

---

## ⚙️ Configuration

### Next.js (`next.config.ts`)

```typescript
const nextConfig = {
  experimental: {
    webpackMemoryOptimizations: true,
  },
  images: {
    remotePatterns: [
      { hostname: "randomuser.me" },
      { hostname: "api.qrserver.com" },
    ],
  },
};
```

### Environment

No environment variables are required for development. The site is fully static and generates at build time.

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules (`npm run lint`)
- Use Tailwind CSS utility classes (avoid custom CSS where possible)
- Components should be in `src/components/` with PascalCase filenames

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

<p align="center">
  Built with ❤️ by the <strong>BrikUp</strong> team
  <br />
  <sub>Bangalore, India · 2026</sub>
</p>
