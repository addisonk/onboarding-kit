"use client";

import { useState } from "react";
import { z } from "zod";
import { Survey } from "@/components/survey";
import type { QuestionConfig } from "@/components/survey";

/* ── Define your survey shape ─────────────────────────────────────────── */

interface DemoAttributes {
  _intro?: string;
  radioCards?: string;
  radioButtons?: string;
  multiSelect?: string[];
  textInput?: string;
  textareaInput?: string;
  sliderValue?: number;
  ratingValue?: number;
  booleanChoice?: boolean;
  conditionalFollow?: string;
}

/* ── Questions that demo every feature ────────────────────────────────── */

const questions: QuestionConfig<DemoAttributes>[] = [
  // 1. Intro — text-only welcome screen, just a continue button
  {
    id: "_intro",
    title: "Welcome to Survey Kit",
    description:
      "A plug-and-play survey component for Next.js + shadcn. This demo walks you through every question type the library supports. Hit continue to start.",
    type: "info",
  },

  // 2. Radio cards — grid of visual options with emoji/icons
  {
    id: "radioCards",
    title: "Radio Cards",
    description:
      'type: "radio" with variant: "card". A 2-column grid with emoji, label, and description. Selecting auto-advances after a brief animation.',
    type: "radio",
    variant: "card",
    options: [
      { value: "minimal", label: "Minimal", emoji: "✨", description: "Clean & simple" },
      { value: "playful", label: "Playful", emoji: "🎨", description: "Fun & colorful" },
      { value: "corporate", label: "Corporate", emoji: "💼", description: "Professional tone" },
      { value: "technical", label: "Technical", emoji: "⚙️", description: "Developer-focused" },
    ],
  },

  // 3. Radio buttons — vertical list, single select
  {
    id: "radioButtons",
    title: "Radio Buttons",
    description:
      'type: "radio" with variant: "button" (default). A vertical list with optional descriptions. Also auto-advances on select.',
    type: "radio",
    variant: "button",
    options: [
      { value: "sm", label: "Small (1–10)", description: "Early stage or personal project" },
      { value: "md", label: "Medium (11–100)", description: "Growing team with structure" },
      { value: "lg", label: "Large (100+)", description: "Enterprise-scale organization" },
    ],
  },

  // 4. Card checkbox — multi-select grid
  {
    id: "multiSelect",
    title: "Multi-Select Cards",
    description:
      'type: "card-checkbox". Users can select multiple options. Validated with Zod to require at least one.',
    type: "card-checkbox",
    options: [
      { value: "onboarding", label: "Onboarding", description: "New user sign-up flows" },
      { value: "feedback", label: "Feedback", description: "NPS, CSAT, product surveys" },
      { value: "quiz", label: "Quiz", description: "Knowledge checks & assessments" },
      { value: "checkout", label: "Checkout", description: "Pre-purchase qualification" },
    ],
    validationSchema: z.array(z.string()).min(1),
    validationErrorMessage: "Select at least one use case",
  },

  // 5. Text input — with placeholder
  {
    id: "textInput",
    title: "Text Input",
    description:
      'type: "text". Supports custom placeholder, Zod validation, and an animated arrow button that appears when you type 2+ characters.',
    type: "text",
    placeholder: "eg. My Awesome Survey",
    validationSchema: z.string().min(1).max(100),
    validationErrorMessage: "Please type something",
  },

  // 6. Textarea — long-form text
  {
    id: "textareaInput",
    title: "Textarea",
    description:
      'type: "textarea". Multi-line input using shadcn\'s Textarea component. Great for feedback, comments, or open-ended responses.',
    type: "textarea",
    placeholder: "Tell us what you think...",
  },

  // 7. Slider — numeric range
  {
    id: "sliderValue",
    title: "Slider",
    description:
      'type: "slider". Uses shadcn\'s Slider component. Configurable min, max, step, and endpoint labels.',
    type: "slider",
    sliderProps: {
      min: 0,
      max: 10,
      step: 1,
      minLabel: "Not likely",
      maxLabel: "Very likely",
    },
  },

  // 8. Rating — star rating
  {
    id: "ratingValue",
    title: "Star Rating",
    description:
      'type: "rating". Interactive star rating with hover preview. Configurable number of stars (default 5). Auto-advances on selection.',
    type: "rating",
    ratingProps: { max: 5 },
  },

  // 9. Boolean — yes/no
  {
    id: "booleanChoice",
    title: "Boolean (Yes / No)",
    description:
      'type: "boolean". Renders as two radio buttons: Yes and No. The value is stored as a true/false boolean.',
    type: "boolean",
  },

  // 10. Conditional question — only shows if they said Yes above
  {
    id: "conditionalFollow",
    title: "Conditional Question",
    description:
      "This question only appears because you selected Yes on the previous step. Questions can have a condition function that controls visibility.",
    type: "radio",
    variant: "button",
    condition: (attrs) => attrs.booleanChoice === true,
    options: [
      { value: "router", label: "URL-based (Next.js router)" },
      { value: "state", label: "State-based (useState)" },
      { value: "both", label: "Both — let me decide per survey" },
    ],
  },
];

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function Home() {
  const [attributes, setAttributes] = useState<DemoAttributes>({});
  const [completed, setCompleted] = useState(false);
  const [hidePanel, setHidePanel] = useState(false);

  if (completed) {
    return (
      <div className="flex min-h-svh items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            That&apos;s every question type
          </h1>
          <p className="mb-6 text-muted-foreground">
            Here&apos;s the collected data — this is what your onComplete callback receives.
          </p>
          <pre className="rounded-lg border bg-card p-4 text-left text-sm tabular-nums">
            {JSON.stringify(attributes, null, 2)}
          </pre>
          <div className="mt-6 flex flex-col items-center gap-2">
            <button
              onClick={() => {
                setAttributes({});
                setCompleted(false);
              }}
              className="cursor-pointer text-sm text-primary underline underline-offset-4"
            >
              Run the demo again
            </button>
            <a
              href="https://github.com/addisonk/survey-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-svh">
      <Survey
        questions={questions}
        attributes={attributes}
        onAttributeChange={setAttributes}
        onComplete={(final) => {
          setAttributes(final);
          setCompleted(true);
        }}
        showProgress
        logo={<span className="text-lg font-bold tracking-tight">Survey Kit</span>}
        rightImage="/right-panel.png"
        hideRightPanel={hidePanel}
        className="h-full"
      />

      {/* Layout toggle — top right, over the panel */}
      <button
        onClick={() => setHidePanel((p) => !p)}
        className="fixed right-8 top-8 z-20 hidden cursor-pointer rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70 md:block"
      >
        {hidePanel ? "Show panel" : "Hide panel"}
      </button>
    </div>
  );
}
