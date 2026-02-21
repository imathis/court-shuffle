# AGENTS.md - Court Shuffle Agent Guide

This file is for coding agents working in this repository.
It captures build/test commands and code conventions observed in the codebase.

## Sources of Truth

- Primary: this `AGENTS.md`.
- Also read: `package.json`, `eslint.config.js`, `tsconfig.json`, `vite.config.ts`, `components.json`.
- Cursor rules scan: no `.cursor/rules/` directory and no `.cursorrules` file found.
- Copilot rules scan: no `.github/copilot-instructions.md` found.
- If Cursor/Copilot rule files are added later, treat them as authoritative and merge guidance.

## Stack Snapshot

- Frontend: React 19 + TypeScript + Vite 6.
- Routing: React Router 7.
- State: Zustand + `persist` middleware.
- Styling: Tailwind CSS v4 + `tw-animate-css` + shadcn/ui patterns.
- UI primitives: Radix UI, Vaul, Sonner, Lucide icons.
- Sync backend (optional): Convex.
- Testing: Vitest + jsdom.
- Package manager in practice: Bun (`bun.lock` present).

## Commands (Use Bun)

- Install deps: `bun install`
- Dev server: `bun run dev`
- Production build: `bun run build`
- Faster build (skip SVG optimize): `bun run build:no-optimize`
- Preview built app: `bun run preview`
- Lint: `bun run lint`
- Test (watch): `bun run test`
- Test (single run): `bun run test:run`
- Optimize SVG cards: `bun run optimize:svg`
- Regenerate safe-area utilities: `bun run generate:safe-areas`

## Single-Test Recipes (Vitest)

- Run one file in watch mode:
  - `bun run test -- src/store/gameStore.test.ts`
- Run one file once:
  - `bun run test:run -- src/store/gameStore.test.ts`
- Run by filename pattern:
  - `bun run test -- gameStore`
- Run one test name pattern:
  - `bun run test -- -t "should handle game configuration correctly"`
- Run tests under a folder:
  - `bun run test -- src/hooks`

## Quality Gate Before Hand-off

- Minimum for code changes: `bun run lint` and relevant test scope.
- For larger/refactor changes: `bun run test:run` and `bun run build`.
- If you touch generated-safe-area usage, rerun `bun run generate:safe-areas`.
- Do not ship changes that fail type checking during build (`tsc -b` is part of build).

## Project Layout

- `src/pages/*`: route-level screens.
- `src/game/config/*`: game setup UI and actions.
- `src/game/play/*`: active game experience.
- `src/components/ui/*`: reusable UI primitives (shadcn-style wrappers).
- `src/hooks/*`: custom hooks (Convex + UI/device utilities).
- `src/store/*`: Zustand store + domain types.
- `src/helpers/*`: pure game logic and helpers.
- `convex/*`: backend query/mutation functions and schema.

## Import and Module Conventions

- Prefer `@/` alias for imports from `src` (configured in `tsconfig.json` and `vite.config.ts`).
- Keep import groups ordered: external packages -> internal alias imports -> relative imports.
- Use relative imports for very local neighbors when it improves clarity.
- Prefer type-only imports where possible (`import type { X } ...` or inline `type`).
- Do not churn import specifiers for style-only edits.

## TypeScript Conventions

- `strict` mode is enabled; keep code fully typed.
- `noUnusedLocals` and `noUnusedParameters` are enabled.
- Intentionally unused values must be prefixed with `_` (lint rule enforced).
- Prefer `interface` for object contracts shared across modules.
- Use `type` for unions, mapped/template literal types, and utility compositions.
- Avoid `any`; use `unknown` + narrowing where needed.
- Preserve existing overload patterns when extending utility APIs.

## React Conventions

- Functional components are standard for app UI.
- Keep components focused; move non-UI logic to hooks/helpers.
- Use named exports for most components/hooks.
- Keep framework-required default exports when needed (for example `src/App.tsx`).
- Destructure props in function signatures for readability.
- Keep side effects in `useEffect` and memoize callbacks when dependency-sensitive.

## State Management (Zustand)

- Store lives in `src/store/gameStore.ts`.
- Access state via selectors (`useGameStore((state) => state.x)`) to avoid broad rerenders.
- Keep updates immutable; return new arrays/objects rather than mutating existing state.
- Preserve persist/migration behavior when changing shape of stored state.
- If state schema changes, update `persist` migration logic safely.
- Keep local-only and sync-related state transitions explicit.

## Styling and UI Conventions

- Tailwind CSS v4 is the baseline styling system.
- Prettier uses `prettier-plugin-tailwindcss`; keep class lists sortable by plugin.
- Reuse primitives in `src/components/ui` before adding new bespoke controls.
- Use `cn()` from `src/lib/utils.ts` for class merging.
- Preserve existing design tokens and CSS variables in `src/index.css`.
- Maintain responsive behavior (mobile-first, safe-area aware).

## Error Handling and Logging

- Favor graceful fallback behavior over hard crashes.
- Use `console.error` for actionable runtime failures.
- Use `console.log`/`console.warn` sparingly for diagnostic flow.
- In sync flows, preserve local-first behavior when remote sync fails.
- Keep user-visible recovery paths intact (error boundaries, reload/retry affordances).

## Testing Conventions

- Framework: Vitest with `jsdom` and globals enabled.
- Test files follow `*.test.ts` (and can include `*.test.tsx` when needed).
- Co-locate tests near domain/store logic when practical.
- Prefer deterministic unit tests over timing-sensitive integration behavior.
- Mock browser APIs explicitly when needed (`localStorage`, service worker, etc.).
- Extend existing test style (`describe`/`it`, `beforeEach`, `expect`).

## Lint/Format Notes

- ESLint targets `src/**/*.{ts,tsx}`.
- Convex and scripts may not be fully covered by current lint command.
- Use consistent semicolon/double-quote style in TS/TSX files.
- Keep diffs focused; avoid unrelated formatting-only churn.

## Generated and Managed Files

- Do not hand-edit `src/styles/safe-areas.css` (generated by script).
- Avoid editing `convex/_generated/*` manually.
- Build output lives in `dist/`; treat as generated artifacts.

## Agent Working Agreement

- Make minimal, targeted edits aligned with existing architecture.
- Preserve backward compatibility in persisted state and sync behavior.
- When uncertain, follow patterns already used in nearby files.
- Prefer small PR-sized changes with clear intent and verification notes.
