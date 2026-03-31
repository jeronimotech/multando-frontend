# Multando Web App

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

> Citizen-facing web application for reporting traffic violations and earning **MULTA** tokens. Built with Next.js 14 App Router and a custom design system powered by the Multando brand color <span style="color:#3b5eef">**#3b5eef**</span>.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| UI | React 18, Tailwind CSS |
| Charts | Recharts |
| Animation | Framer Motion |
| Maps | Leaflet / React-Leaflet |
| State | React Context + hooks |
| i18n | Custom EN/ES translation layer |
| Deployment | Railway (Docker) |

## Key Features

- **20 pages** across citizen, authority, developer, and admin portals
- **53 reusable components** with consistent design tokens
- **Design system** powered by `@multando/design-tokens` (brand primary: `#3b5eef`)
- **Custodial wallet UI** — balance, transactions, staking dashboard
- **Internationalization** — full English and Spanish support
- **Developer portal** — API key management, SDK docs, usage analytics
- **Responsive** — mobile-first design with adaptive layouts
- **Dark mode** support via Tailwind CSS

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Hero, features, CTA |
| Login / Register | `/login`, `/register` | Auth flows with social login |
| Dashboard | `/dashboard` | Stats, recent reports, quick actions |
| Reports | `/reports` | List, filter, and search violations |
| Report Detail | `/reports/[id]` | Evidence, map, status timeline |
| New Report | `/reports/new` | 3-step creation wizard |
| Achievements | `/achievements` | Badges, streaks, leaderboard |
| Wallet | `/wallet` | MULTA balance, staking, transactions |
| Profile | `/profile` | User settings, preferences |
| Developers | `/developers` | API docs, key management |
| Developer Dashboard | `/developers/dashboard` | Usage analytics, rate limits |
| Authority Portal | `/authority` | Government data access |
| Authority Reports | `/authority/reports` | Bulk report management |
| Admin Dashboard | `/admin` | Platform analytics |
| Admin Users | `/admin/users` | User management, moderation |
| Admin Reports | `/admin/reports` | Report moderation queue |
| Cities | `/cities` | Supported city list |
| City Detail | `/cities/[slug]` | Per-city stats and map |
| Privacy / Terms | `/privacy`, `/terms` | Legal pages |
| 404 | `/*` | Custom not-found page |

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app runs at `http://localhost:3000`.

### Build for Production

```bash
pnpm build
pnpm start
```

## Environment Variables

Create a `.env.local` file in the project root:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://api.multando.com` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox / tile provider token | `pk.eyJ...` |
| `NEXT_PUBLIC_SOLANA_RPC` | Solana RPC for wallet display | `https://api.devnet.solana.com` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics tracking ID | `G-XXXXXXXXXX` |
| `NEXTAUTH_SECRET` | NextAuth session secret | `your-secret` |
| `NEXTAUTH_URL` | Canonical app URL | `https://multando.com` |

## Design System

The UI is built on a shared design token system ensuring brand consistency across all Multando products.

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#3b5eef` | Buttons, links, active states |
| Primary Dark | `#2d4abd` | Hover states, focus rings |
| Primary Light | `#e8edfd` | Backgrounds, badges |
| Success | `#10b981` | Verified reports, positive actions |
| Warning | `#f59e0b` | Pending states |
| Danger | `#ef4444` | Errors, destructive actions |
| Border Radius | `0.5rem` | Cards, inputs, buttons |
| Font Family | `Inter` | All text |

## Project Structure

```
apps/web/
  app/              # Next.js App Router pages
    (dashboard)/    # Authenticated layout group
    (auth)/         # Login/register layout group
    (public)/       # Public pages
  components/       # Reusable UI components
    ui/             # Primitives (Button, Card, Input, etc.)
    reports/        # Report-specific components
    wallet/         # Wallet and staking components
    maps/           # Map and geospatial components
  contexts/         # React context providers
  hooks/            # Custom React hooks
  i18n/             # Translation files (en.json, es.json)
  lib/              # Utilities, API client, helpers
  public/           # Static assets
  types/            # TypeScript type definitions
```

## Deployment

The project includes a `Dockerfile.railway` and `railway.toml` for one-click Railway deployment. The Docker build produces an optimized standalone Next.js output.

```bash
# Build Docker image locally
docker build -f Dockerfile.railway -t multando-web .
docker run -p 3000:3000 multando-web
```

## Screenshots

<!-- Add screenshots here -->
| Dashboard | Report Flow | Wallet |
|-----------|-------------|--------|
| *Coming soon* | *Coming soon* | *Coming soon* |

## License

All rights reserved. Proprietary software.
