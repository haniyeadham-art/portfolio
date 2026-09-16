# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site for Adham, bootstrapped with `create-next-app` (App Router). Currently ships the default starter content — `src/app/page.tsx` is the template landing page and has not yet been replaced with portfolio content.

## Common Commands

All commands are run from the repository root.

- `npm run dev` — start the Next.js dev server on http://localhost:3000
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint (uses the flat config in `eslint.config.mjs`, extending `eslint-config-next` core-web-vitals + typescript rules)

There is no test suite configured.

## Architecture & Stack

- **Framework:** Next.js 16.3.4 with App Router. All application code lives strictly under `src/`.
- **Runtime:** React 19.2.8, TypeScript 5 with `strict: true`.
- **Path alias:** `@/*` maps to `./src/*` (see `tsconfig.json`), e.g., `import x from "@/components/..."` resolves to `src/components/...`.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/postcss`. Tailwind v4 is configured through `@theme inline` directives inside `src/app/globals.css`. PostCSS config is `postcss.config.mjs`.
- **Fonts:** `Geist` and `Geist Mono` loaded via `next/font/google` in `src/app/layout.tsx` (CSS variables `--font-geist-sans` / `--font-geist-mono`). `Vazirmatn` (Persian) is loaded and dynamically applied for `--font-sans` when active locale is `fa`.
- **Theming:** Forced ultra-modern **Light Mode** (#FFFFFF background, slate/zinc neutral borders, soft shadows). Dark mode styles in `src/app/globals.css` must be disabled or overridden.
- **i18n & RTL:** A client-side `LanguageProvider` (`src/context/LanguageContext.tsx`) controls active locale (`en` / `fa`), persists choice in `localStorage`, and updates `<html lang>`, `dir`, and font family. Content is stored in `src/data/portfolio-data.json` and consumed via `usePortfolioData()` (`src/hooks/usePortfolioData.ts`).
- **Static assets:** Static assets live in `public/`. `src/app/favicon.ico` is served from the App Router root.
- **Type generation:** Route types generated under `.next/types/**/*.ts` and `.next/dev/types/**/*.ts` are included in `tsconfig.json`.

## Important Layout


The project root holds configuration files only: `package.json`, `tsconfig.json`, `eslint.config.mjs`, `next.config.ts`, `postcss.config.mjs`, `components.json`, `next-env.d.ts`.

# Project Guidelines: Senior UI/UX Designer Portfolio

## Code & Syntax Standards
- All code comments, log messages, commit messages, and internal variables must strictly be in English.
- Use TypeScript strictly with proper typing (no `any`).

## Design System & Theme (UI/UX Pro Max)
- Theme: Ultra-modern, high-end Light Mode (dominant #FFFFFF, zinc/slate neutrals, soft shadows, subtle micro-gradients).
- Animations: Smooth, refined motion via Framer Motion. Add interactive hover states, magnetic buttons, staggered entrance animations, and scroll-linked reveals.
- Typography: Inter/Geist for English, Vazirmatn for Persian (with seamless RTL/LTR switching).

## Architecture & SSG
- Directory Structure: Strictly adhere to `src/` structure.
  - Data file: `src/data/portfolio-data.json`
  - Components: `src/components/home/` and `src/components/ui/`
  - Contexts/Hooks: `src/context/` and `src/hooks/`
  - Route Pages: `src/app/`
- Multi-language: Content served dynamically from `src/data/portfolio-data.json`.
- Output: Must support static site generation (`output: 'export'` inside `next.config.ts` with `images: { unoptimized: true }`).
- Component architecture: Atomic, decoupled sections inside `src/components/home/`.