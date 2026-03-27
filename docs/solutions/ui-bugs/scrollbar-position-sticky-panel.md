---
title: "Scrollbar must be on the page, not the left panel"
category: ui-bugs
tags:
  - scrollbar
  - sticky
  - layout
  - overflow
  - tailwindcss
module: onboarding-kit
symptoms:
  - "Scrollbar appears between left and right panels instead of at far right of window"
  - "Right panel scrolls away instead of staying fixed"
  - "Content area doesn't fill viewport height"
root_cause: "overflow-y-auto placed on the left panel div instead of the page-level wrapper. This makes the left panel an independent scroll container with its own scrollbar, pushing the scrollbar to the panel edge rather than the window edge."
date_solved: 2026-03-27
---

# Scrollbar Must Be on the Page, Not the Left Panel

## Problem

In the split-panel layout (left content + right image/gradient), the scrollbar appeared between the two panels instead of at the far right of the browser window. This happened twice — once during initial development and again during the shadcn block portability refactor.

## Root Cause

Two competing scroll patterns were confused:

**Wrong (scrollbar between panels):**
- Page wrapper: `h-svh overflow-hidden`
- Left panel: `h-full overflow-y-auto`
- Right panel: `h-full` (static)

**Correct (scrollbar at far right):**
- Page wrapper: `h-svh overflow-y-auto` ← page scrolls
- Left panel: `relative` (no overflow)
- Shell: `min-h-full` (stretches to content)
- Right panel: `sticky top-0 max-h-dvh` ← stays in place while page scrolls

## Solution

The "Diino pattern": the **page** is the scroll container, not the left panel. The right panel uses CSS `sticky` positioning to stay in place while the rest of the page scrolls naturally.

### Shell (survey-shell.tsx)

```tsx
// Outer shell — min-h-full, NOT h-full, NO overflow
<div className={cn("flex min-h-full w-full", className)}>

// Left panel — NO overflow-y-auto
<div className={cn("relative", rightContent ? "w-full md:w-1/2" : ...)}>

// Right panel — sticky, NOT static
<div className="sticky top-0 hidden max-h-dvh shrink-0 md:flex md:w-1/2 md:p-4">
```

### Consumer's page wrapper

```tsx
// The PAGE is the scroll container
<div className="h-svh overflow-y-auto">
  <Survey ... />
</div>
```

### Registry page (app/onboarding/page.tsx)

```tsx
export default function OnboardingPage() {
  return (
    <div className="h-svh overflow-y-auto">
      <OnboardingForm />
    </div>
  );
}
```

## Why We Got This Wrong Twice

1. **First time:** During the portability refactor, the test project's content wasn't filling the viewport. We "fixed" it by adding `h-full overflow-y-auto` to the left panel and `overflow-hidden` to the page. This made the content fill correctly but moved the scrollbar.

2. **The real fix:** The content height issue should have been solved by ensuring the consumer's page wrapper has `h-svh overflow-y-auto` and the shell uses `min-h-full`. The shell stretches to fit content, the page scrolls it.

## Prevention

- **Never put `overflow-y-auto` on the left panel.** The left panel should be a normal flow element inside the page scroll container.
- **The page wrapper owns the scrollbar.** `h-svh overflow-y-auto` on the outermost div.
- **The right panel sticks with CSS `sticky`.** `sticky top-0 max-h-dvh` keeps it in place.
- **The shell uses `min-h-full` not `h-full`.** It stretches to content height, not viewport height.
- **When fixing height issues in consumer projects, fix the page wrapper, not the shell.**

## Related

- [Registry Block Portability](../ui-bugs/registry-block-portability.md) — the refactor that introduced this regression
