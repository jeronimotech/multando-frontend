# Multando Frontend

![License: BSL 1.1](https://img.shields.io/badge/License-BSL_1.1-blue.svg)
![Next.js 14](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)

Open-source frontend for the **Multando** traffic infraction reporting platform. Citizens report violations, earn rewards, and governments gain transparency — all through a modern, accessible web interface.

## Features

- **Internationalization** — Full English and Spanish support (i18n)
- **Real-time Map** — Leaflet-based violation mapping with geolocation
- **AI Chatbot** — Conversational assistant for report guidance
- **Marketplace** — Redeem rewards from the MULTA token ecosystem
- **Transparency Dashboard** — Public statistics on city-level enforcement
- **Custodial Wallet** — Balance, staking, and transaction history
- **Authority Portal** — Government data access and bulk management

## Quick Start

```bash
git clone https://github.com/multando/multando-frontend.git
cd multando-frontend
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Self-Hosting

### Docker

```bash
docker build -t multando-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://your-backend.example.com/api/v1 multando-frontend
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_APP_ENV` | App environment | `production` |

## Architecture

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Data Fetching | React Query |
| Maps | Leaflet / React-Leaflet |
| State | React Context + custom hooks |
| i18n | Custom EN/ES translation layer |
| Animation | Framer Motion |
| Charts | Recharts |

### Project Structure

```
app/              # Next.js App Router pages
components/       # 53+ reusable UI components
contexts/         # React context providers
hooks/            # Custom React hooks
i18n/             # Translation files (en.json, es.json)
lib/              # Utilities, API client, helpers
public/           # Static assets
types/            # TypeScript type definitions
```

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, code style, i18n guidelines, and PR process.

## License

This project is licensed under the [Business Source License 1.1](./LICENSE).

- **Licensor:** Jeronimo Technologies S.A.S. (DBA Multando)
- **Additional Use Grant:** Non-commercial and governmental production use permitted. Commercial SaaS offerings are not allowed.
- **Change Date:** 2030-04-20 (converts to Apache License 2.0)
