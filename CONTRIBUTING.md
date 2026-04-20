# Contributing to Multando Frontend

Thank you for your interest in contributing to Multando! This guide will help you get started.

## Prerequisites

- **Node.js** 18+ (we recommend using [nvm](https://github.com/nvm-sh/nvm))
- **pnpm** (install via `npm install -g pnpm`)

## Development Setup

```bash
# Clone the repository
git clone https://github.com/multando/multando-frontend.git
cd multando-frontend

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start the development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Code Style

We use **ESLint** and **Prettier** to maintain consistent code quality.

```bash
# Lint
pnpm lint

# Format
pnpm format
```

Please ensure your code passes linting before submitting a PR.

## Internationalization (i18n)

Multando supports English and Spanish. When adding or modifying user-facing strings:

- **Both** `i18n/en.json` and `i18n/es.json` must be updated together.
- Never submit a PR that adds keys to one language file but not the other.
- Use descriptive, namespaced keys (e.g., `dashboard.stats.totalReports`).

## Pull Request Process

1. Fork the repository and create a feature branch from `main`.
2. Make your changes following the code style guidelines.
3. Ensure all i18n strings are present in both language files.
4. Run `pnpm lint` and `pnpm build` to verify nothing is broken.
5. Write a clear PR description explaining *what* and *why*.
6. Submit your PR against the `main` branch.

A maintainer will review your PR. Please be patient and responsive to feedback.

## Contributor License Agreement (CLA)

By submitting a pull request, you agree that your contributions are licensed under the same **Business Source License 1.1 (BSL 1.1)** that covers this project. You confirm that you have the right to grant this license for your contributions.

## Reporting Issues

- Use GitHub Issues for bug reports and feature requests.
- Include reproduction steps, expected vs. actual behavior, and environment details.

## Code of Conduct

Be respectful, constructive, and inclusive. We are building software for the public good.
