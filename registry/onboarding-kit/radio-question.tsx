"use client";

import { useState, type KeyboardEvent, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckIndicator } from "./check-indicator";
import { AUTO_ADVANCE_CONFIG } from "./survey-config";
interface RadioOption {
  value: string;
  label: string;
  emoji?: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface RadioQuestionProps {
  id?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  onAutoAdvance?: () => void;
  disabled?: boolean;
  variant?: "button" | "card";
}

export function RadioQuestion({
  options,
  value,
  onChange,
  className,
  onAutoAdvance,
  disabled = false,
  variant = "button",
}: RadioQuestionProps) {
  const [animatingValue, setAnimatingValue] = useState<string | null>(null);

  const onAutoAdvanceRef = useRef(onAutoAdvance);
  useEffect(() => {
    onAutoAdvanceRef.current = onAutoAdvance;
  }, [onAutoAdvance]);

  const handleSelect = (optionValue: string) => {
    if (disabled) return;

    onChange(optionValue);
    setAnimatingValue(optionValue);

    if (onAutoAdvanceRef.current) {
      setTimeout(() => {
        setAnimatingValue(null);
        onAutoAdvanceRef.current?.();
      }, AUTO_ADVANCE_CONFIG.TOTAL_DELAY);
    } else {
      setTimeout(() => {
        setAnimatingValue(null);
      }, AUTO_ADVANCE_CONFIG.ANIMATION_DURATION);
    }
  };

  const handleKeyDown = (e: KeyboardEvent, optionValue: string) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(optionValue);
    }
  };

  /* ─── Card variant ─────────────────────────────────────────────────── */
  if (variant === "card") {
    return (
      <div
        role="radiogroup"
        className={cn(
          "grid grid-cols-2 gap-4",
          className
        )}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          const isAnimating = animatingValue === option.value;
          return (
            <motion.div
              key={option.value}
              whileTap={disabled ? {} : { scale: 0.96 }}
              className={cn(
                "group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl p-6 ring-1 transition-[box-shadow,ring-color]",
                "min-h-[160px]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "ring-primary shadow-sm"
                  : "ring-border hover:ring-primary/40 shadow-[0_1px_2px_0_rgb(0_0_0/0.04)]",
                disabled && "cursor-not-allowed opacity-60"
              )}
              onClick={() => handleSelect(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              tabIndex={disabled ? -1 : 0}
              role="radio"
              aria-checked={isSelected}
            >
              {/* Progress sweep — fills left to right on selection */}
              {isAnimating && !disabled && (
                <motion.div
                  className="absolute inset-0 z-0 origin-left bg-primary/5 will-change-transform"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, ease: "linear" }}
                />
              )}

              <CheckIndicator selected={isSelected} className="absolute right-3 top-3 z-10" />

              {/* Icon / Emoji */}
              <div className="relative z-10 mb-4 flex items-center justify-center">
                {option.icon ? (
                  <option.icon className="size-12 shrink-0 text-muted-foreground" />
                ) : option.emoji ? (
                  <span className="shrink-0 text-5xl">{option.emoji}</span>
                ) : null}
              </div>

              {/* Label */}
              <div className="relative z-10 flex flex-col items-center gap-1 text-center">
                <span className="font-medium">{option.label}</span>
                {option.description && (
                  <span className="text-sm leading-snug text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  /* ─── Button variant (default) ─────────────────────────────────────── */
  return (
    <div
      role="radiogroup"
      className={cn("flex flex-col gap-3", className)}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const isAnimating = animatingValue === option.value;
        return (
          <motion.div
            key={option.value}
            whileTap={disabled ? {} : { scale: 0.96 }}
            className={cn(
              "group relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg px-3 text-base ring-1 transition-[box-shadow,ring-color]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              option.description ? "min-h-[60px] py-2.5" : "h-[50px]",
              isSelected
                ? "ring-primary shadow-sm"
                : "ring-border bg-card hover:ring-primary/40 shadow-[0_1px_2px_0_rgb(0_0_0/0.04)]",
              disabled && "cursor-not-allowed opacity-60"
            )}
            onClick={() => handleSelect(option.value)}
            onKeyDown={(e) => handleKeyDown(e, option.value)}
            tabIndex={disabled ? -1 : 0}
            role="radio"
            aria-checked={isSelected}
          >
            {/* Progress sweep — fills left to right on selection */}
            {isAnimating && !disabled && (
              <motion.div
                className="absolute inset-0 z-0 origin-left bg-primary/5 will-change-transform"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: "linear" }}
              />
            )}

            <div
              className={cn(
                "relative z-10 flex items-center gap-3",
                option.description ? "items-start" : "items-center"
              )}
            >
              {option.icon ? (
                <option.icon className="size-4 shrink-0 self-center text-muted-foreground" />
              ) : option.emoji ? (
                <span className="shrink-0 self-center text-xl">
                  {option.emoji}
                </span>
              ) : null}
              <span className="flex flex-col gap-1">
                <span className="font-medium">{option.label}</span>
                {option.description && (
                  <span className="text-sm leading-snug text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </span>
            </div>

            <CheckIndicator selected={isSelected} className="relative z-10" />
          </motion.div>
        );
      })}
    </div>
  );
}
