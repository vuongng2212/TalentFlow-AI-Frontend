# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Use `pnpm` as the primary package manager.

- **Start dev server**: `pnpm dev` (runs Next.js dev server on http://localhost:3000)
- **Build application**: `pnpm build` (compiles Next.js optimized production build)
- **Start production build**: `pnpm start` (runs built server)
- **Lint code**: `pnpm lint` (runs ESLint checks)

## Architecture & Code Style Guidelines

- **Core Stack**: Next.js 16 (App Router, Server Components by default), React 19, Tailwind CSS 4, TypeScript 5 (Strict mode enabled), ESLint 9.
- **Component Paradigm**: Default to React Server Components. Isolate client-side state / interactivity to leaf components using `'use client'`.
- **Data Fetching**: Fetch data securely in async Server Components or Server Actions. Do not use legacy Page Router patterns (`pages/` directory, `getServerSideProps`, etc.).
- **Security & Validation**: Ensure sensitive environment variables stay server-side (no `NEXT_PUBLIC_` unless necessary). Validate Server Action payload bounds using schema validators (like Zod) and assert user authorization inside the action.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan at:
[specs/009-landing-page-refactor/plan.md](specs/009-landing-page-refactor/plan.md)
<!-- SPECKIT END -->
