<!--
### Sync Impact Report
- Version change: [CONSTITUTION_VERSION] -> 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] -> I. Next.js 16 App Router & Server-First Architecture
  - [PRINCIPLE_2_NAME] -> II. Strict TypeScript Type Safety
  - [PRINCIPLE_3_NAME] -> III. Clean Architecture & SOLID Principles
  - [PRINCIPLE_4_NAME] -> IV. Performance-First & Core Web Vitals Optimization
  - [PRINCIPLE_5_NAME] -> V. Security-First Boundary Validation
- Added sections:
  - Technology Stack & Strict Code Quality Standards
  - Development Workflow & Testing Discipline
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ Checked: matches gates dynamically)
  - .specify/templates/spec-template.md (✅ Checked: compatible with functional requirement format)
  - .specify/templates/tasks-template.md (✅ Checked: matches user story priorities)
  - .specify/templates/checklist-template.md (✅ Checked: aligned)
- Follow-up TODOs: None (All placeholders fully resolved, no TODOs left)
-->

# TalentFlow Frontend Constitution

## Core Principles

### I. Next.js 16 App Router & Server-First Architecture
Every feature MUST use App Router (`app/` directory) only. All components MUST be Server Components by default. Interactivity and client state MUST be isolated to leaf-level Client Components using the `'use client'` directive. Direct database/service queries and data fetching MUST run securely inside async Server Components or Server Actions.
*Rationale*: Maximizes server-side performance, keeps client-side JavaScript bundle sizes minimal, and simplifies state by leveraging the server.

### II. Strict TypeScript Type Safety
Strict TypeScript compilation mode MUST be enabled and enforced (`"strict": true`). The use of `any`, `unsafe` casts, or type assertions (`as`) without explicit justification is strictly forbidden. All API endpoints, component props, state objects, and Server Actions MUST have exhaustive, precise, and explicit type declarations.
*Rationale*: Prevents class of runtime execution bugs at compile time and ensures self-documenting code contracts.

### III. Clean Architecture & SOLID Principles
Codebases MUST adhere to a strict separation of concerns following SOLID and Clean Architecture guidelines. Components represent the presentation layer; business logic MUST reside in service layers, custom hooks, or Server Actions. Data fetching clients or helpers MUST be modular and decoupled from UI representation.
*Rationale*: Minimizes technical debt, ensures high modularity, and facilitates painless integration or component testing.

### IV. Performance-First & Core Web Vitals Optimization
Performance is treated as a core feature. All assets MUST be optimized using official components (`next/image`, `next/font`, `next/link`). Pages MUST score >90 in Core Web Vitals (LCP, CLS, INP) audits. Leverages Next.js 16's modern caching APIs (`import { refresh } from 'next/cache'`) for seamless real-time data refreshing after Server Actions.
*Rationale*: Directly impacts user satisfaction and SEO ranking through fast load speeds and responsive interfaces.

### V. Security-First Boundary Validation
A zero-trust model MUST be implemented across the client-server boundary. All environment variables containing secrets MUST stay server-only (`process.env` without `NEXT_PUBLIC_`). Every Server Action MUST validate its parameters using validation schemas (e.g., Zod) and perform strict authentication and authorization checks before executing transactions.
*Rationale*: Protects system resources and user data from unauthorized access or malicious payloads.

## Technology Stack & Strict Code Quality Standards
The application is built on top of Next.js 16, React 19, Tailwind CSS 4, ESLint 9, and TypeScript 5. 
- Outdated React APIs (e.g., `componentDidMount`, legacy context API) and outdated Next.js patterns (e.g., Pages Router `pages/` directory, legacy data fetching methods like `getServerSideProps`, `getStaticProps`, `getInitialProps`) MUST be rejected.
- All code MUST pass strict linting rules and formatting checks (`pnpm lint`) before merging.
- Standard React state logic should be minimized in favor of URL state (search params) or server state (caching/revalidation).

## Development Workflow & Testing Discipline
All development MUST follow a structured, specification-driven process:
1. Feature branch creation naming format `###-feature-name` using the command workflows.
2. Specification (`spec.md`) defining prioritized, independently testable user stories (P1/P2/P3).
3. Implementation planning (`plan.md`) verifying constraints, gates, and project structure before writing code.
4. Actionable task planning (`tasks.md`) detailing the exact dependency-ordered execution steps.
5. If testing is requested by the spec: unit and contract tests MUST be written and fail before implementing the actual logic.
6. Commit changes incrementally upon completing each individual task or logical unit of work.

## Governance
- This Constitution is the authoritative standard for all development in TalentFlow Frontend. Any deviation or code pattern that conflicts with these principles MUST be rejected during code reviews unless explicit business justification is documented in the feature's implementation plan under complexity tracking.
- Amendments to these principles require updating this file and updating the corresponding version.
- Governance dates and versioning policy:
  - Version bumps follow semantic rules: MAJOR for principle changes or removals, MINOR for additions, PATCH for clarifications.
  - Updates require full validation of all existing specifications and plans to ensure continuous compliance.

**Version**: 1.0.0 | **Ratified**: 2026-06-01 | **Last Amended**: 2026-06-01
