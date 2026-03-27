# CLAUDE.md

## Project Overview

Onboarding Kit — a drop-in onboarding flow component for Next.js + shadcn/ui. Users define steps as data and get structured answers back.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # ESLint
npm run typecheck    # TypeScript check
```

## Registry (Important)

This project is a **shadcn registry**. Users install via:

```bash
npx shadcn@latest add "https://the-onboarding-kit.vercel.app/r/onboarding-kit.json"
```

### After modifying files in `components/survey/` or `hooks/`:

1. Copy updated files to `registry/onboarding-kit/`
2. Run `npx shadcn@latest build`
3. Commit the updated `public/r/` output

The `registry/` directory must stay in sync with source files. The built output in `public/r/onboarding-kit.json` is what the CLI fetches.

## Deployment

- Hosted on Vercel under the `prompthunt` team
- Production domain: `the-onboarding-kit.vercel.app`
- Auto-deploys from `master` branch

## Architecture

- `components/survey/` — the reusable component library (what users install)
- `hooks/` — custom hooks (use-current-question, use-question-options, use-question-state)
- `registry/` — source files for shadcn registry build (flat, no subdirectories)
- `public/r/` — built registry JSON (auto-generated, do not edit manually)
- `app/` — demo app showcasing all question types

## Conventions

- No barrel exports (`index.ts`) — use direct imports
- Components use `./` relative imports for siblings in the same folder
- Hooks import types via `@/components/survey/survey-types`
- Demo app imports via `@/components/survey/survey`
