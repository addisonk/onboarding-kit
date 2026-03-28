---
title: "Align custom components with shadcn's own tokens and patterns"
category: ui-bugs
tags:
  - shadcn
  - accessibility
  - consistency
  - design-tokens
  - aria
module: onboarding-kit
symptoms:
  - "Custom components look slightly off next to shadcn primitives"
  - "Missing aria-label on interactive groups"
  - "Inconsistent timing between auto-advancing components"
  - "Ring/border colors don't match Card component"
root_cause: "Custom components were styled independently rather than referencing shadcn's actual component source for the exact tokens and patterns"
date_solved: 2026-03-28
---

# Align Custom Components with shadcn Tokens and Patterns

## Problem

Custom survey components (radio buttons, card checkboxes, rating) looked close to shadcn's Card but used slightly different tokens, missed accessibility attributes, and had inconsistent timing.

## Checklist

When building custom interactive components for a shadcn project, check each of these against the actual shadcn component source:

### Visual Tokens

| Token | shadcn Card uses | We were using |
|---|---|---|
| Border | `ring-foreground/10` | `ring-border` |
| Radius | `rounded-xl` | `rounded-lg` |
| Background | `bg-card` | sometimes missing |
| Title font | `font-heading font-medium` | `font-semibold` (no `font-heading`) |
| Description | `text-sm text-muted-foreground` | correct |

**Fix:** Read `components/ui/card.tsx` and match the exact classes.

### Accessibility

| Pattern | Required | We had |
|---|---|---|
| `role="radiogroup"` + `aria-label` | Yes | Missing `aria-label` |
| `role="group"` + `aria-label` on checkbox groups | Yes | Missing both |
| `aria-checked` on individual items | Yes | Correct |

**Fix:** Pass the question `id` as `aria-label` on group containers.

### Timing Consistency

| Component | Should use | We had |
|---|---|---|
| RadioQuestion | `AUTO_ADVANCE_CONFIG.TOTAL_DELAY` | Correct |
| RatingQuestion | `AUTO_ADVANCE_CONFIG.TOTAL_DELAY` | Hardcoded `400` |

**Fix:** Centralize all timing in `survey-config.ts`. Never hardcode delays.

### Dead Code

After every refactor, grep for:
- Hooks that nothing imports
- Registry dependencies that no component uses
- Props that are accepted but never destructured
- Types that are defined but never referenced

## Prevention

Before shipping a custom component that sits alongside shadcn primitives:

1. Read the shadcn source for the closest primitive (`card.tsx`, `button.tsx`, etc.)
2. Match ring, radius, background, and font tokens exactly
3. Add `aria-label` to every `role="radiogroup"` and `role="group"`
4. Centralize timing constants — no magic numbers in setTimeout
5. Run `grep -r "from.*survey-config\|from.*survey-types"` to verify all shared code is actually consumed
