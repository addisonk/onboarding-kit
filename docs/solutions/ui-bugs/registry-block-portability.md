---
title: "Make shadcn registry block portable across consumer projects"
category: ui-bugs
tags:
  - shadcn
  - registry-block
  - portability
  - layout
  - theming
  - tailwindcss
module: onboarding-kit
symptoms:
  - "Layout broken after install via npx shadcn add — content did not fill available width"
  - "Hardcoded bg-muted backgrounds clashed with consumer themes"
  - "Sticky header/footer only rendered correctly in the original demo app"
  - "max-w-lg wrappers missing w-full caused content to shrink to intrinsic text width"
  - "min-h-full on shell had no effect because ancestor containers lacked defined height"
  - "Empty right panel when consumer omitted rightContent/rightImage props"
  - "No starter page shipped with the block"
root_cause: "Component was developed as a demo app first, then extracted into a registry block; demo-specific assumptions about body background, page height, and color tokens leaked into the reusable component"
date_solved: 2026-03-26
---

# Make shadcn Registry Block Portable Across Consumer Projects

## Problem

The `onboarding-kit` shadcn registry block rendered correctly in its demo app but broke when installed into a fresh consumer project via `npx shadcn add`. The layout didn't fill the viewport, backgrounds were wrong, and content was narrower than expected.

## Solution

### Fix 1: Sticky header/footer backgrounds — use `bg-inherit`

The `bg-muted dark:bg-background` classes only looked correct against the demo's body background.

```tsx
// Before (hardcoded)
<div className="sticky top-0 z-20 bg-muted px-8 pt-6 pb-3 dark:bg-background">

// After (inherits from parent)
<div className="sticky top-0 z-20 bg-inherit px-8 pt-6 pb-3">
```

### Fix 2: Shell height — use `h-full` instead of `min-h-full`

`min-h-full` resolves to `min-height: 100%`, which requires the parent to have explicit height. Consumers won't always set this.

```tsx
// Before
<div className={cn("flex min-h-full w-full", className)}>

// After
<div className={cn("flex h-full w-full", className)}>
```

### Fix 3: Left panel — add `h-full overflow-y-auto`

Without explicit height and overflow, the left panel grew unbounded instead of scrolling internally.

```tsx
// Before
<div className={cn("relative", rightContent ? "w-full md:w-1/2" : ...)}>

// After
<div className={cn("relative h-full overflow-y-auto", rightContent ? "w-full md:w-1/2" : ...)}>
```

### Fix 4: Content wrappers — add `w-full`

`max-w-lg` alone doesn't force the element to expand. Without `w-full`, content is only as wide as its text.

```tsx
// Before
<div className="mx-auto max-w-lg py-6">

// After
<div className="mx-auto w-full max-w-lg py-6">
```

### Fix 5: Default gradient right panel

When no `rightContent` or `rightImage` is provided, show a gradient using the consumer's theme tokens.

```tsx
<div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-primary via-primary to-primary/80">
  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/5" />
</div>
```

### Fix 6: Registry page file

Add a `registry:page` so consumers get a working `/onboarding` route on install, matching how shadcn blocks like `login-04` work.

```json
{ "path": "registry/onboarding-kit/page.tsx", "type": "registry:page", "target": "app/onboarding/page.tsx" }
```

## Key Principle

A reusable registry block must not assume anything about the consumer's environment. Backgrounds should inherit, heights should be explicit, widths should be declared, and sensible defaults should exist for every optional prop.

## Prevention

### Design Rules for Portable Components

1. Never hardcode theme surface colors — use `bg-inherit`, `bg-background`, or `bg-transparent`
2. Use `h-full` not `min-h-full` when a component is meant to fill its parent
3. Always pair `max-w-*` with `w-full`
4. Keep demo-only styling in the demo page, not in the component
5. Ship a `registry:page` file so consumers get a working page immediately

### Testing Checklist

- [ ] Install via `npx shadcn add` in a fresh `shadcn init --preset b0 --template next` project
- [ ] Component renders with zero additional configuration
- [ ] Fills parent horizontally and vertically
- [ ] Works in both light and dark mode
- [ ] All imports resolve (no demo-app paths)
- [ ] Page file creates a working route

### Common Pitfalls

| Pitfall | Fix |
|---|---|
| `bg-muted` baked into component | Use `bg-inherit` or `bg-background` |
| `min-h-full` instead of `h-full` | Use `h-full`, document parent height requirement |
| `max-w-lg` without `w-full` | Always write `w-full max-w-lg` |
| Testing only in the demo app | Always test in a clean consumer project |
| No `registry:page` file | Ship a page that demonstrates correct usage |
