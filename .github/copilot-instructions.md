---
description: "Project overview and coding instructions for Canon Creator"
---


# Canon Creator – AI Coding Agent Instructions

## 1. Big Picture Architecture

- **Hexagonal (Ports & Adapters) Architecture**:  
	- All core business logic lives in `packages/api/src/core` and is strictly dependency-free.
	- Core logic defines its needs via TypeScript interface "ports" (e.g., `core/ports/CharacterRepository.ts`).
	- All external integrations (DB, auth, frameworks) are implemented as adapters in `packages/api/src/adapters/`.
	- **Rule:** Core must never import from adapters.

- **Frontend/Backend Split**:  
	- Backend: TypeScript, NestJS, tRPC, Prisma, Firebase.  
	- Frontend: React + TypeScript, Vite, Zustand for state, tRPC for API.

## 2. Developer Workflows

- **Install dependencies:**  
	`pnpm install` (run at repo root or in any package)

- **Backend (API) commands:**  
	- Start dev server: `pnpm --filter api run start:dev`
	- Run tests: `pnpm --filter api run test` (unit), `pnpm --filter api run test:e2e` (e2e)
	- Coverage: `pnpm --filter api run test:cov`

- **Frontend (Web) commands:**  
	- Start dev server: `pnpm --filter web run dev`
	- Build: `pnpm --filter web run build`

- **Linting/Formatting:**  
	- Lint: `pnpm run lint`
	- Format: `pnpm run format`

## 3. Project-Specific Patterns

- **TDD for Core Logic:**  
	1. Write failing test in `packages/api/test/unit/`.
	2. Define a port in `core/ports/` if needed.
	3. Implement use case in `core/use-cases/`.
	4. Implement adapter in `adapters/`.
	5. Expose via tRPC router (`adapters/primary/trpc/`).

- **Frontend State:**  
	- All state and logic in `packages/web/src/store/` (Zustand).
	- UI components (`components/`, `features/`) are presentational only.

- **API Communication:**  
	- All frontend/backend comms via tRPC.  
	- Never use `fetch` directly; always use tRPC hooks.

## 4. Integration & Data Flow

- **tRPC:**  
	- Backend procedures in `adapters/primary/trpc/` are auto-typed for frontend.
	- Frontend uses `trpc.*.useQuery()` and `useMutation()` hooks.

- **Adapters:**  
	- DB: Prisma (see `adapters/db/`)
	- Auth: Firebase (see `adapters/auth/`)

## 5. Conventions & Rules

- **TypeScript everywhere.**
- **Immutability:** Treat all state as immutable, especially in core and Zustand.
- **No business logic in UI components.**
- **Follow ESLint/Prettier.**
- **Never break core/adapters separation.**
- **Write tests for all core logic.**
