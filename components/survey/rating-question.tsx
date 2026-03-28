"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { AUTO_ADVANCE_CONFIG } from "./survey-config";

interface RatingQuestionProps {
  id: string;
  value: number | undefined;
  onChange: (value: number) => void;
  max?: number;
  className?: string;
  disabled?: boolean;
  onAutoAdvance?: () => void;
}

export function RatingQuestion({
  id,
  value,
  onChange,
  max = 5,
  className,
  disabled = false,
  onAutoAdvance,
}: RatingQuestionProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? value ?? 0;

  const handleSelect = (rating: number) => {
    if (disabled) return;
    onChange(rating);
    if (onAutoAdvance) {
      setTimeout(onAutoAdvance, AUTO_ADVANCE_CONFIG.TOTAL_DELAY);
    }
  };

  return (
    <div
      className={cn("flex gap-1", className)}
      role="radiogroup"
      aria-label="Rating"
      onMouseLeave={() => setHovered(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= displayValue;
        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={starValue === value}
            aria-label={`${starValue} of ${max}`}
            className={cn(
              "cursor-pointer rounded-md p-1 transition-[color,transform]",
              "hover:scale-110 active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              filled ? "text-foreground" : "text-muted-foreground/30",
              disabled && "cursor-not-allowed opacity-50"
            )}
            onClick={() => handleSelect(starValue)}
            onMouseEnter={() => !disabled && setHovered(starValue)}
            disabled={disabled}
          >
            <Star
              className={cn("size-8", filled && "fill-current")}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
