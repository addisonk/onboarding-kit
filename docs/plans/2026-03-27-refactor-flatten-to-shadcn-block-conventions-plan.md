---
title: Align with shadcn block conventions
type: refactor
date: 2026-03-27
deepened: true
---

# ♻️ Align with shadcn Block Conventions

## Enhancement Summary

**Deepened on:** 2026-03-27
**Agents used:** code-simplicity-reviewer, portability-checker, import-convention-researcher

### Key Decision: Keep the Subfolder

The original plan proposed flattening 16+ files from `components/survey/` into `components/`. After review, this was identified as unnecessary churn:

- The subfolder **is** the organization — flattening dumps survey files next to `theme-provider.tsx` and `theme-toggle.tsx`, making `components/` a junk drawer
- shadcn blocks don't *require* flat `components/` — the `registry.json` `target` field controls where files land
- Relative `./` imports between sibling files are the correct shadcn convention (not `@/`)
- Moving 16 files means updating 30+ locations across two mirrored directories for zero user benefit

### What Actually Needs to Change

The real alignment issues are:
1. **Barrel exports** — shadcn blocks use direct imports, not barrel `index.ts` files
2. **Dead code** — `utils.ts` is never imported
3. **Import style** — hooks use `../types` (parent-relative), should use `@/components/survey/survey-types` since hooks will move to top-level `hooks/`

## Changes

### 1. Delete dead files

| File | Reason |
|---|---|
| `components/survey/index.ts` | Barrel export — shadcn uses direct imports |
| `components/survey/hooks/index.ts` | Barrel export — never consumed |
| `components/survey/utils.ts` | Never imported anywhere |

Delete corresponding files in `registry/onboarding-kit/` too.

### 2. Move hooks to top-level `hooks/`

shadcn convention puts hooks in `hooks/`, not nested in a component subfolder.

| From | To |
|---|---|
| `components/survey/hooks/use-current-question.ts` | `hooks/use-current-question.ts` |
| `components/survey/hooks/use-question-options.ts` | `hooks/use-question-options.ts` |
| `components/survey/hooks/use-question-state.ts` | `hooks/use-question-state.ts` |

Update their `../types` import to `@/components/survey/survey-types`.

### 3. Rename for clarity

| From | To | Reason |
|---|---|---|
| `components/survey/types.ts` | `components/survey/survey-types.ts` | Avoids ambiguity when hooks import from outside the folder |
| `components/survey/auto-advance-config.ts` | `components/survey/survey-config.ts` | Shorter, clearer |

### 4. Update imports

| File | Change |
|---|---|
| `survey.tsx` | `./hooks/use-current-question` → `@/hooks/use-current-question` |
| `question-renderer.tsx` | `./hooks/use-question-options` → `@/hooks/use-question-options` |
| `survey.tsx` | `./types` → `./survey-types` |
| `question-renderer.tsx` | `./types` → `./survey-types` |
| `radio-question.tsx` | `./auto-advance-config` → `./survey-config` |
| `hooks/use-current-question.ts` | `../types` → `@/components/survey/survey-types` |
| `hooks/use-question-options.ts` | `../types` → `@/components/survey/survey-types` |
| `hooks/use-question-state.ts` | `../types` → `@/components/survey/survey-types` |
| `app/page.tsx` | `@/components/survey` → `@/components/survey/survey` |
| `onboarding-form.tsx` | `@/components/survey` → `@/components/survey/survey` |

### 5. Update registry.json

- Remove entries for `index.ts`, `hooks/index.ts`, `utils.ts`
- Rename `types.ts` → `survey-types.ts`, `auto-advance-config.ts` → `survey-config.ts`
- Move hook targets from `components/survey/hooks/*` → `hooks/*`
- Flatten `registry/onboarding-kit/hooks/` into `registry/onboarding-kit/`

### 6. Update CLAUDE.md

Reflect new structure: components stay in `components/survey/`, hooks in `hooks/`.

### 7. Rebuild and test

- `npx shadcn@latest build`
- `pnpm build` (typecheck)
- Fresh install test in a new project

## Portability Check

All six portability fixes (bg-inherit, h-full, w-full max-w-lg, overflow-y-auto, default gradient, registry:page) are CSS-class-level changes in JSX — none depend on directory structure. This refactor is safe.

## Acceptance Criteria

- [ ] No barrel `index.ts` files
- [ ] `utils.ts` deleted
- [ ] Hooks in top-level `hooks/`
- [ ] All imports resolve correctly
- [ ] `npx shadcn@latest build` succeeds
- [ ] `pnpm build` passes clean
- [ ] Demo app works
- [ ] Fresh install test passes
- [ ] CLAUDE.md updated

## Risk

Low. Mechanical changes only. TypeScript compiler catches any missed imports immediately.
