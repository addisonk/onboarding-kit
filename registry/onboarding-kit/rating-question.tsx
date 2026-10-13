"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { cn } from "@/lib/utils";
import { useAutoAdvanceSelection } from "./radio-question";

interface RatingQuestionProps {
  value: number | undefined;
  onChange: (value: number) => void;
  max?: number;
  className?: string;
  disabled?: boolean;
  onAutoAdvance?: () => void;
}

/** One native radio per star, so ratings work with arrows, shortcuts and screen readers. */
export function RatingQuestion({
  value,
  onChange,
  max = 5,
  className,
  disabled = false,
  onAutoAdvance,
}: RatingQuestionProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const { choiceProps, selected } = useAutoAdvanceSelection(onAutoAdvance);
  const displayValue = hovered ?? value ?? 0;

  return (
    <QuestionnairePrimitive.Choices
      className={cn("flex gap-1", className)}
      onMouseLeave={() => setHovered(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= displayValue;
        return (
          <QuestionnairePrimitive.Choice
            key={starValue}
            value={String(starValue)}
            checked={starValue === value}
            disabled={disabled}
            onChange={(event) => {
              if (!event.target.checked) return;
              onChange(starValue);
              selected(String(starValue));
            }}
            onMouseEnter={() => !disabled && setHovered(starValue)}
            {...choiceProps}
            className={cn(
              "relative cursor-pointer rounded-md p-1 transition-[color,transform] hover:scale-110 active:scale-95",
              "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring",
              filled ? "text-foreground" : "text-muted-foreground/30",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <QuestionnairePrimitive.ChoiceInput className="absolute inset-0 z-10 size-full cursor-pointer opacity-0" />
            <Star aria-hidden className={cn("size-8", filled && "fill-current")} strokeWidth={1.5} />
            <QuestionnairePrimitive.ChoiceLabel className="sr-only">
              {starValue} of {max}
            </QuestionnairePrimitive.ChoiceLabel>
          </QuestionnairePrimitive.Choice>
        );
      })}
    </QuestionnairePrimitive.Choices>
  );
}
