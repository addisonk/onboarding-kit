"use client";

import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface TextareaQuestionProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Visible label. Without one, the question title names the textarea. */
  label?: string;
  /** Accessible name when there is no visible label. */
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
}

export function TextareaQuestion({
  id,
  value,
  onChange,
  placeholder = "Type your answer...",
  label,
  ariaLabel,
  className,
  disabled = false,
}: TextareaQuestionProps) {
  const safeValue = typeof value === "string" ? value : "";

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label htmlFor={id} className="mb-3 block text-sm text-muted-foreground">
          {label}
        </label>
      )}
      <QuestionnairePrimitive.Input
        render={<Textarea rows={4} />}
        id={id}
        value={safeValue}
        onChange={(e) => onChange(e.target.value)}
        // Enter adds a line here; Cmd/Ctrl+Enter still continues.
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) e.stopPropagation();
        }}
        placeholder={placeholder}
        aria-label={label ? undefined : ariaLabel}
        disabled={disabled}
        className="min-h-28 text-base"
      />
    </div>
  );
}
