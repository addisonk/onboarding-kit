"use client";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface TextareaQuestionProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function TextareaQuestion({
  id,
  value,
  onChange,
  placeholder = "Type your answer...",
  label,
  className,
  disabled = false,
}: TextareaQuestionProps) {
  const safeValue = typeof value === "string" ? value : "";

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={id}
          className="mb-3 block text-sm text-muted-foreground"
        >
          {label}
        </label>
      )}
      <Textarea
        id={id}
        value={safeValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-28 text-base"
        rows={4}
      />
    </div>
  );
}
