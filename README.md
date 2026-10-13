# Onboarding Kit

Drop-in onboarding flows for Next.js + shadcn/ui. Define steps as data, get structured answers back.

Built on shadcn's [Questionnaire](https://ui.shadcn.com/docs/components/base/questionnaire): every question is a native form control inside a `<fieldset>`, and Questionnaire handles progress, navigation, validation and keyboard support. Onboarding Kit adds the questions-as-data API, the split layout, card and rating controls, and auto-advance.

[Live Demo](https://the-onboarding-kit.vercel.app)

https://github.com/user-attachments/assets/977b727c-06a2-4ee1-80f1-e2c5425ce636

## Install

```bash
npx shadcn@latest add "https://the-onboarding-kit.vercel.app/r/onboarding-kit.json"
```

This installs all components, hooks, and dependencies (`@shadcn/react`, Motion, Zod, the `questionnaire` component and the other shadcn primitives it uses) automatically. It works with the Base UI and Radix shadcn styles.

### Prerequisites

- Next.js 15+ (App Router)
- Tailwind CSS v4
- [shadcn/ui](https://ui.shadcn.com) initialized (`npx shadcn init`)

## Usage

```tsx
import { useState } from "react";
import { Survey } from "@/components/survey/survey";
import type { QuestionConfig } from "@/components/survey/survey-types";

interface Attrs {
  name?: string;
  role?: string;
}

const steps: QuestionConfig<Attrs>[] = [
  {
    id: "name",
    title: "What's your name?",
    type: "text",
    placeholder: "Jane Doe",
  },
  {
    id: "role",
    title: "What's your role?",
    type: "radio",
    variant: "button",
    options: [
      { value: "engineer", label: "Engineer" },
      { value: "designer", label: "Designer" },
      { value: "pm", label: "Product Manager" },
    ],
  },
];

export default function Onboarding() {
  const [attrs, setAttrs] = useState<Attrs>({});

  return (
    <Survey
      questions={steps}
      attributes={attrs}
      onAttributeChange={setAttrs}
      onComplete={(final) => console.log(final)}
      showProgress
      logo={<span className="text-lg font-bold">My App</span>}
    />
  );
}
```

## Step Types

| Type | Value | Control | Auto-advances |
|------|-------|---------|:---:|
| `info` | `true` | none (a fixed hidden answer, so Continue always works) | |
| `text` | `string` | text input | |
| `number` | `number` | number input | |
| `textarea` | `string` | textarea (Enter adds a line, Cmd/Ctrl+Enter continues) | |
| `radio` | `string` | native radios | Yes |
| `boolean` | `boolean` | Yes/No radios | Yes |
| `card-checkbox` | `string[]` | native checkboxes (radios with `singleSelection`) | single only |
| `slider` | `number` | shadcn Slider driving a hidden number input | |
| `rating` | `number` | one native radio per star | Yes |

Radio supports `variant: "button"` (list) or `"card"` (grid). Card-checkbox supports `singleSelection` and `imageUrl` on options.

Auto-advance fires after a pointer selection. Keyboard users choose with the arrow keys and continue with Enter, so moving through options never skips a question.

Questions are required unless `optional: true`; optional questions show a Skip button. An untouched slider records its midpoint.

## Conditional Steps

```tsx
{
  id: "followUp",
  title: "Tell us more",
  type: "text",
  condition: (attrs) => attrs.role === "engineer",
}
```

## Validation

```tsx
import { z } from "zod";

{
  id: "email",
  title: "Your email",
  type: "text",
  validationSchema: z.string().email(),
  validationErrorMessage: "Enter a valid email",
}
```

## Keyboard

| Key | Action |
|-----|--------|
| Arrow keys | Move between answers (and move a focused slider) |
| Enter | Continue from a chosen answer or a filled text input |
| Cmd/Ctrl + Enter | Continue from anywhere, including a textarea |
| `shortcuts="letters"` or `"numbers"` | Pick list answers with A, B, C… or 1, 2, 3… |

## Other Props

| Prop | Description |
|------|-------------|
| `defaultQuestionId` | Question to open first, for resuming a saved draft (pass the saved answers as `attributes`) |
| `shortcuts` | `"letters"` or `"numbers"` answer shortcuts |
| `continueLabel` | Label for Continue (default `"Continue"`) |
| `showProgress` | Progress bar under the logo |
| `hideContinueButton` | Rely on auto-advance; Continue stays available to assistive tech |
| `hideQuestionTitle` | Hide the title visually; it stays as the fieldset legend |
| `onBackFromFirstQuestion` | Show Back on the first question and call this |

## Layout Options

```tsx
<Survey rightImage="/hero.png" />    // Image panel
<Survey rightContent={<Custom />} /> // Custom panel
<Survey hideRightPanel />            // Centered, no panel
```

## Upgrading from 0.0.x

- The kit now depends on `@shadcn/react` and the shadcn `questionnaire` component; re-run the install command.
- `framer-motion` is replaced by `motion` (`motion/react`).
- `hooks/use-current-question.ts` is gone; Questionnaire tracks the active question. Use `defaultQuestionId` to start elsewhere.
- `SurveyShell` takes a `progress` node; `showProgress`/`progressPercent` still work but are deprecated.
- `optional: true` questions now show Skip.
- `onAttributeChange` now fires as answers change, not only on Continue.

## Built With

React 19, Next.js 16, Tailwind CSS v4, shadcn/ui and its Questionnaire, Motion, Zod

## License

MIT
