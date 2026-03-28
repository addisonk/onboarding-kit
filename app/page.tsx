"use client";

import { useState } from "react";
import { z } from "zod";
import { Survey } from "@/components/survey/survey";
import type { QuestionConfig } from "@/components/survey/survey-types";
import { ThemeToggle } from "@/components/theme-toggle";
import { Triangle, Square, Circle, Diamond } from "lucide-react";

/* ── Define your survey shape ─────────────────────────────────────────── */

interface DemoAttributes {
  _intro?: string;
  teamSize?: string;
  style?: string;
  goals?: string[];
  projectName?: string;
  context?: string;
  likelihood?: number;
  experience?: number;
  industry?: string;
  hasTeam?: boolean;
  teamStructure?: string;
}

/* ── Questions ────────────────────────────────────────────────────────── */

const questions: QuestionConfig<DemoAttributes>[] = [
  {
    id: "_intro",
    title: "Let's set up your account",
    description:
      "We'll ask a few quick questions to personalize your experience. Takes about 30 seconds.",
    type: "info",
  },

  {
    id: "teamSize",
    title: "How large is your team?",
    type: "radio",
    variant: "button",
    options: [
      { value: "solo", label: "Just me", description: "Solo founder or freelancer" },
      { value: "small", label: "2–10 people", description: "Small team, moving fast" },
      { value: "growing", label: "11–50 people", description: "Scaling with process" },
      { value: "large", label: "50+ people", description: "Established organization" },
    ],
  },

  {
    id: "style",
    title: "Pick a style",
    description: "This helps us set up your workspace.",
    type: "radio",
    variant: "card",
    options: [
      { value: "minimal", label: "Minimal", icon: Circle, description: "Clean and simple" },
      { value: "structured", label: "Structured", icon: Square, description: "Organized layouts" },
      { value: "dynamic", label: "Dynamic", icon: Triangle, description: "Bold and flexible" },
      { value: "custom", label: "Custom", icon: Diamond, description: "Build your own" },
    ],
  },

  {
    id: "goals",
    title: "What are you looking to build?",
    description: "Select all that apply.",
    type: "card-checkbox",
    options: [
      { value: "onboarding", label: "User Onboarding", description: "Welcome new signups" },
      { value: "waitlist", label: "Waitlist", description: "Capture early interest" },
      { value: "feedback", label: "Feedback", description: "Collect NPS or CSAT" },
      { value: "intake", label: "Intake Form", description: "Qualify leads or clients" },
    ],
    validationSchema: z.array(z.string()).min(1),
    validationErrorMessage: "Pick at least one",
  },

  {
    id: "projectName",
    title: "What's your project called?",
    type: "text",
    placeholder: "Acme Inc",
    validationSchema: z.string().min(1).max(100),
    validationErrorMessage: "Give your project a name",
  },

  {
    id: "context",
    title: "Anything else we should know?",
    description: "Optional — share context about your project or what you're hoping to achieve.",
    type: "textarea",
    placeholder: "We're launching a new product next month and need to onboard beta users...",
  },

  {
    id: "likelihood",
    title: "How likely are you to recommend us?",
    type: "slider",
    sliderProps: {
      min: 0,
      max: 10,
      step: 1,
      minLabel: "Not likely",
      maxLabel: "Very likely",
    },
  },

  {
    id: "experience",
    title: "How's the experience so far?",
    type: "rating",
    ratingProps: { max: 5 },
  },

  {
    id: "industry",
    title: "What industry are you in?",
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

  {
    id: "hasTeam",
    title: "Will other people use this with you?",
    type: "boolean",
  },

  {
    id: "teamStructure",
    title: "How is your team organized?",
    description: "This helps us tailor the collaboration features.",
    type: "radio",
    variant: "button",
    condition: (attrs) => attrs.hasTeam === true,
    options: [
      { value: "flat", label: "Flat — everyone does everything" },
      { value: "departments", label: "By department (eng, design, product)" },
      { value: "squads", label: "Cross-functional squads" },
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
