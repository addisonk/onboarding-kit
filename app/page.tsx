"use client";

import { useState } from "react";
import { z } from "zod";
import { Survey } from "@/components/survey/survey";
import type { QuestionConfig } from "@/components/survey/survey-types";
import { ThemeToggle } from "@/components/theme-toggle";

/* ── Define your survey shape ─────────────────────────────────────────── */

interface DemoAttributes {
  _intro?: string;
  radioCards?: string;
  radioButtons?: string;
  longList?: string;
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
    title: "Welcome to Onboarding Kit",
    description:
      "A plug-and-play survey component for Next.js + shadcn. This demo walks you through every question type the library supports. Hit continue to start.",
    type: "info",
  },

  // 2. Radio buttons — vertical list, single select
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

  // 9. Long radio list — demonstrates scrolling behavior
  {
    id: "longList",
    title: "What industry are you in?",
    description:
      "A long list of options to demonstrate scrolling. The logo and progress bar stay sticky at the top.",
    type: "radio",
    variant: "button",
    options: [
      { value: "tech", label: "Technology" },
      { value: "healthcare", label: "Healthcare" },
      { value: "finance", label: "Finance & Banking" },
      { value: "education", label: "Education" },
      { value: "ecommerce", label: "E-commerce & Retail" },
      { value: "media", label: "Media & Entertainment" },
      { value: "real-estate", label: "Real Estate" },
      { value: "manufacturing", label: "Manufacturing" },
      { value: "legal", label: "Legal Services" },
      { value: "nonprofit", label: "Non-profit" },
      { value: "government", label: "Government" },
      { value: "other", label: "Other" },
    ],
  },

  // 10. Boolean — yes/no
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
              href="https://github.com/addisonk/onboarding-kit"
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
    <div className="h-svh overflow-y-auto">
      <Survey
        questions={questions}
        attributes={attributes}
        onAttributeChange={setAttributes}
        onComplete={(final) => {
          setAttributes(final);
          setCompleted(true);
        }}
        showProgress
        logo={
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold tracking-tight">Onboarding Kit</span>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <a
                href="https://github.com/addisonk/onboarding-kit"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-2 text-foreground"
                aria-label="View on GitHub"
              >
                <svg viewBox="0 0 16 16" className="size-4" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
            </div>
          </div>
        }
        rightImage="/right-panel.png"
        hideRightPanel={hidePanel}
        className=""
      />

      {/* Layout toggle — top right, over the panel */}
      <button
        onClick={() => setHidePanel((p) => !p)}
        className="fixed right-10 top-8 z-20 hidden cursor-pointer rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70 md:block"
      >
        {hidePanel ? "Show panel" : "Hide panel"}
      </button>
    </div>
  );
}
