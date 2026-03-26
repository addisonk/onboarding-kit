# Onboarding Kit

Drop-in onboarding flows for Next.js + shadcn/ui. Define steps as data, get structured answers back.

[Live Demo](https://the-onboarding-kit.vercel.app)

## Prerequisites

- Next.js 15+ (App Router)
- Tailwind CSS v4
- [shadcn/ui](https://ui.shadcn.com) installed (`npx shadcn init`)
- [Framer Motion](https://motion.dev) and [Zod](https://zod.dev)

## Usage

1. Copy `components/survey/` into your project
2. Install the required shadcn components: `npx shadcn add button input textarea slider progress card alert`
3. Import and use:

```tsx
import { useState } from "react";
import { Survey } from "@/components/survey";
import type { QuestionConfig } from "@/components/survey";

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

| Type | Value | Auto-advances |
|------|-------|:---:|
| `info` | — | |
| `text` | `string` | |
| `number` | `number` | |
| `textarea` | `string` | |
| `radio` | `string` | Yes |
| `boolean` | `boolean` | Yes |
| `card-checkbox` | `string[]` | |
| `slider` | `number` | |
| `rating` | `number` | Yes |

Radio supports `variant: "button"` (list) or `"card"` (grid). Boolean renders as Yes/No. Card-checkbox supports `singleSelection` mode.

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

## Layout Options

```tsx
<Survey rightImage="/hero.png" />    // Image panel
<Survey rightContent={<Custom />} /> // Custom panel
<Survey hideRightPanel />            // Centered, no panel
```

## Built With

React 19, Next.js 16, Tailwind CSS v4, shadcn/ui, Framer Motion, Zod

## License

MIT
