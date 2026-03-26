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

### After modifying any file in `components/survey/`:

1. Copy updated files to `registry/onboarding-kit/`
2. Run `npx shadcn@latest build`
3. Commit the updated `public/r/` output

The `registry/` directory must stay in sync with `components/survey/`. The built output in `public/r/onboarding-kit.json` is what the CLI fetches.

## Deployment

- Hosted on Vercel under the `prompthunt` team
- Production domain: `the-onboarding-kit.vercel.app`
- Auto-deploys from `master` branch

## Architecture

- `components/survey/` — the reusable component library (what users install)
- `registry/` — source files for shadcn registry build
- `public/r/` — built registry JSON (auto-generated, do not edit manually)
- `app/` — demo app showcasing all question types
