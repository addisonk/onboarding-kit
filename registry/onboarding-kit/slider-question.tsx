"use client";

import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface SliderQuestionProps {
  id: string;
  value: number | undefined;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  /** Accessible name for the slider. */
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
}

const RANGE_KEYS = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
  "PageUp",
  "PageDown",
]);

/**
 * Questionnaire has no range input, so the visible shadcn Slider drives a
 * hidden number input that the questionnaire reads and submits.
 */
export function SliderQuestion({
  id,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  minLabel,
  maxLabel,
  ariaLabel,
  className,
  disabled = false,
}: SliderQuestionProps) {
  const safeValue = typeof value === "number" ? value : Math.round((min + max) / 2);

  return (
    <div
      className={cn("w-full", className)}
      // Arrow keys move the slider, not the questionnaire.
      onKeyDown={(e) => {
        if (RANGE_KEYS.has(e.key)) e.stopPropagation();
      }}
    >
      <div
        aria-hidden
        className="mb-6 text-center font-heading text-3xl font-bold tabular-nums text-foreground"
      >
        {safeValue}
      </div>
      <Slider
        id={id}
        value={[safeValue]}
        onValueChange={(next) => {
          const v = Array.isArray(next) ? next[0] : next;
          onChange(v);
        }}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        // The root passes aria-labelledby on to the thumb; aria-label would stop at the root.
        aria-labelledby={ariaLabel ? `${id}-label` : undefined}
      />
      {ariaLabel && (
        <span id={`${id}-label`} className="sr-only">
          {ariaLabel}
        </span>
      )}
      <QuestionnairePrimitive.Input
        type="number"
        value={String(safeValue)}
        readOnly
        tabIndex={-1}
        aria-hidden
        className="sr-only"
      />
      {(minLabel || maxLabel) && (
        <div className="mt-3 flex items-center justify-between text-sm leading-none text-muted-foreground">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}
