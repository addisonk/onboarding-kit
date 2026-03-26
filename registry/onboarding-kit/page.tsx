"use client";

import { useState } from "react";
import { Survey } from "@/components/survey";
import type { QuestionConfig } from "@/components/survey";

interface Attrs {
  name?: string;
  role?: string;
  goal?: string;
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
      { value: "founder", label: "Founder" },
    ],
  },
  {
    id: "goal",
    title: "What are you building?",
    type: "textarea",
    placeholder: "Tell us about your project...",
  },
];

export default function OnboardingPage() {
  const [attrs, setAttrs] = useState<Attrs>({});
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex h-svh items-center justify-center p-8">
        <div className="w-full max-w-lg text-center">
          <h1 className="text-2xl font-bold">Welcome, {attrs.name}!</h1>
          <p className="mt-2 text-muted-foreground">Onboarding complete.</p>
          <pre className="mt-4 overflow-auto rounded bg-muted p-4 text-left text-sm">
            {JSON.stringify(attrs, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="h-svh">
      <Survey
        questions={steps}
        attributes={attrs}
        onAttributeChange={setAttrs}
        onComplete={(final) => {
          setAttrs(final);
          setDone(true);
        }}
        showProgress
        logo={<span className="text-lg font-bold tracking-tight">My App</span>}
      />
    </div>
  );
}
