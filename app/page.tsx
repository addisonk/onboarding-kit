"use client";

import { useState } from "react";
import { z } from "zod";
import { Survey } from "@/components/survey";
import type { QuestionConfig } from "@/components/survey";

/* ── Define your survey shape ─────────────────────────────────────────── */

interface DemoAttributes {
  goal?: string;
  experience?: string;
  interests?: string[];
  name?: string;
  newsletter?: boolean;
}

/* ── Define your questions ────────────────────────────────────────────── */

const questions: QuestionConfig<DemoAttributes>[] = [
  {
    id: "goal",
    title: "What brings you here?",
    description: "We'll personalize your experience based on your answer.",
    type: "radio",
    variant: "card",
    maxWidth: "lg",
    options: [
      { value: "learn", label: "Learn something new", emoji: "📚", description: "Courses & tutorials" },
      { value: "build", label: "Build a project", emoji: "🧱", description: "Hands-on creation" },
      { value: "grow", label: "Grow my career", emoji: "💼", description: "Skills & networking" },
      { value: "explore", label: "Just exploring", emoji: "🔦", description: "See what's here" },
    ],
    validationSchema: z.string().min(1),
    validationErrorMessage: "Please select a goal to continue",
  },
  {
    id: "experience",
    title: "How much experience do you have?",
    type: "radio",
    variant: "button",
    options: [
      { value: "beginner", label: "Beginner", description: "Just getting started" },
      { value: "intermediate", label: "Intermediate", description: "Some projects under my belt" },
      { value: "advanced", label: "Advanced", description: "I know my way around" },
    ],
  },
  {
    id: "interests",
    title: "What topics interest you?",
    description: "Select all that apply.",
    type: "card-checkbox",
    maxWidth: "lg",
    options: [
      { value: "design", label: "Design", description: "UI/UX, visual design, prototyping" },
      { value: "engineering", label: "Engineering", description: "Frontend, backend, infra" },
      { value: "ai", label: "AI & ML", description: "Models, agents, automation" },
      { value: "business", label: "Business", description: "Strategy, growth, ops" },
    ],
    validationSchema: z.array(z.string()).min(1),
    validationErrorMessage: "Pick at least one topic",
  },
  {
    id: "name",
    title: "What should we call you?",
    type: "text",
    placeholder: "eg. John",
    maxWidth: "sm",
    validationSchema: z.string().min(1).max(50),
    validationErrorMessage: "Please enter your name",
  },
  {
    id: "newsletter",
    title: "Want weekly tips in your inbox?",
    type: "boolean",
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
        <div className="max-w-md text-center">
          <div className="mb-4 text-4xl">🎉</div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            All done!
          </h1>
          <p className="mb-6 text-muted-foreground">
            Here&apos;s what you told us:
          </p>
          <pre className="rounded-lg border bg-card p-4 text-left text-sm font-variant-numeric-tabular">
            {JSON.stringify(attributes, null, 2)}
          </pre>
          <button
            onClick={() => {
              setAttributes({});
              setCompleted(false);
            }}
            className="mt-6 cursor-pointer text-sm text-primary underline underline-offset-4"
          >
            Start over
          </button>
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
        logo={<span className="text-lg font-bold tracking-tight">Acme Co.</span>}
        rightImage="/right-panel.png"
        hideRightPanel={hidePanel}
        className="h-full"
      />

      {/* Layout toggle */}
      <button
        onClick={() => setHidePanel((p) => !p)}
        className="fixed bottom-6 left-6 z-20 hidden cursor-pointer rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted md:block"
      >
        {hidePanel ? "Show panel" : "Hide panel"}
      </button>
    </div>
  );
}
