# Onboarding Kit

A plug-and-play survey and onboarding component for Next.js + shadcn/ui. Define questions as data, get back structured answers.

Built with React 19, Tailwind CSS v4, Framer Motion, and Zod validation.

[Live Demo](https://onboarding-kit.vercel.app)

## Quick Start

Drop the `components/survey` directory into your Next.js + shadcn project.

```tsx
import { useState } from "react";
import { Survey } from "@/components/survey";
import type { QuestionConfig } from "@/components/survey";

interface MyAttributes {
  name?: string;
  role?: string;
}

const questions: QuestionConfig<MyAttributes>[] = [
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
  const [attributes, setAttributes] = useState<MyAttributes>({});

  return (
    <Survey
      questions={questions}
      attributes={attributes}
      onAttributeChange={setAttributes}
      onComplete={(final) => console.log(final)}
      showProgress
      logo={<span className="text-lg font-bold">My App</span>}
    />
  );
}
```

## Question Types

| Type | Value | Auto-advances | Notes |
|------|-------|:---:|-------|
| `text` | `string` | | Supports `placeholder` and rotating `placeholders` (typewriter effect) |
| `number` | `number` | | Numeric input with hidden spinners |
| `textarea` | `string` | | Multi-line text |
| `radio` | `string` | Yes | `variant: "button"` (list) or `"card"` (2-column grid with emoji/icons) |
| `boolean` | `boolean` | Yes | Renders Yes / No radio buttons, stores `true` / `false` |
| `card-checkbox` | `string[]` | | Multi-select cards. Set `cardCheckboxProps: { singleSelection: true }` for single select |
| `slider` | `number` | | Configurable `min`, `max`, `step`, and endpoint labels |
| `rating` | `number` | Yes | Star rating with hover preview. Configurable `max` (default 5) |
| `info` | | | Text-only screen with a continue button. No input collected |

## Features

### Conditional Questions

Show questions based on previous answers.

```tsx
{
  id: "followUp",
  title: "Tell us more",
  type: "text",
  condition: (attrs) => attrs.role === "engineer",
}
```

### Validation

Use Zod schemas to validate answers before advancing.

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

### Dynamic Options

Pass a function instead of a static array. Receives current attributes.

```tsx
{
  id: "team",
  type: "radio",
  variant: "button",
  options: (attrs) => {
    if (attrs.role === "engineer") {
      return [
        { value: "frontend", label: "Frontend" },
        { value: "backend", label: "Backend" },
      ];
    }
    return [
      { value: "growth", label: "Growth" },
      { value: "brand", label: "Brand" },
    ];
  },
}
```

### Right Panel

Display an image or custom content alongside the survey.

```tsx
// Image shorthand
<Survey rightImage="/hero.png" ... />

// Custom content
<Survey rightContent={<MyCustomPanel />} ... />

// Hide and center the survey
<Survey hideRightPanel ... />
```

### Logo and Progress

```tsx
<Survey
  logo={<img src="/logo.svg" alt="Logo" className="h-6" />}
  showProgress
  ...
/>
```

## Survey Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `questions` | `QuestionConfig<A>[]` | required | Array of question definitions |
| `attributes` | `A` | required | Current form state |
| `onAttributeChange` | `(attrs: A) => void` | required | Called on each answer |
| `onComplete` | `(attrs: A) => void` | required | Called when survey finishes |
| `rightContent` | `ReactNode` | | Custom right panel content |
| `rightImage` | `string` | | Image URL for right panel |
| `hideRightPanel` | `boolean` | `false` | Hides right panel, centers content |
| `logoUrl` | `string` | | Logo image URL (max 32px height) |
| `logo` | `ReactNode` | | Custom logo element |
| `showProgress` | `boolean` | `false` | Shows progress bar |
| `onBackFromFirstQuestion` | `() => void` | | Called when back is pressed on the first question |
| `hideContinueButton` | `boolean` | `false` | Hides navigation buttons |
| `hideQuestionTitle` | `boolean` | `false` | Hides question titles |
| `className` | `string` | | Container class name |

## Question Config

```tsx
interface QuestionConfig<A> {
  id: keyof A & string;
  title: string;
  description?: string;
  type: "text" | "number" | "textarea" | "radio" | "boolean"
      | "card-checkbox" | "slider" | "rating" | "info";
  options?: BaseOption[] | ((attrs: A) => BaseOption[]);
  condition?: (attrs: A) => boolean;
  optional?: boolean;
  variant?: "button" | "card";
  placeholder?: string;
  placeholders?: string[];
  sliderProps?: { min; max; step; minLabel; maxLabel };
  ratingProps?: { max };
  cardCheckboxProps?: { singleSelection };
  validationSchema?: ZodSchema;
  validationErrorMessage?: string;
}
```

## Layout

The survey uses a split layout on desktop (content left, optional panel right) and stacks on mobile. The header (logo + progress) and footer (navigation buttons) are sticky. Content scrolls between them.

## Dependencies

- [React 19](https://react.dev)
- [Next.js 16](https://nextjs.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) (Button, Input, Textarea, Slider, Progress, Card, Alert)
- [Framer Motion](https://motion.dev)
- [Zod](https://zod.dev)

## License

MIT
