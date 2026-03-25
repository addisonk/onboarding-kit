"use client";

import { Check } from "lucide-react";
import { useState, type KeyboardEvent, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AUTO_ADVANCE_CONFIG,
  PROGRESS_BAR_ANIMATION,
} from "./auto-advance-config";
import { getMaxWidthClass } from "./utils";
import type { MaxWidth } from "./types";

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
  maxWidth?: MaxWidth;
  variant?: "button" | "card";
}

export function RadioQuestion({
  options,
  value,
  onChange,
  className,
  onAutoAdvance,
  disabled = false,
  maxWidth,
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
          className,
          getMaxWidthClass(maxWidth)
        )}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          const isAnimating = animatingValue === option.value;
          return (
            <motion.div
              key={option.value}
              className={cn(
                "group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border p-6 transition-colors",
                "min-h-[160px]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/50",
                disabled && "cursor-not-allowed opacity-60"
              )}
              onClick={() => handleSelect(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              whileTap={disabled ? {} : { scale: 0.96 }}
              animate={
                isAnimating && !disabled
                  ? { opacity: AUTO_ADVANCE_CONFIG.ANIMATION_PATTERN }
                  : {}
              }
              transition={{
                duration: AUTO_ADVANCE_CONFIG.ANIMATION_DURATION / 1000,
                ease: AUTO_ADVANCE_CONFIG.ANIMATION_EASING,
              }}
              tabIndex={disabled ? -1 : 0}
              role="radio"
              aria-checked={isSelected}
            >
              {/* Progress sweep */}
              {isAnimating && !disabled && (
                <motion.div
                  className="absolute inset-0 origin-left"
                  style={{
                    backgroundColor: AUTO_ADVANCE_CONFIG.PROGRESS_BAR_COLOR,
                    opacity: AUTO_ADVANCE_CONFIG.PROGRESS_BAR_OPACITY,
                  }}
                  initial={PROGRESS_BAR_ANIMATION.initial}
                  animate={PROGRESS_BAR_ANIMATION.animate}
                  transition={PROGRESS_BAR_ANIMATION.transition}
                />
              )}

              {/* Check indicator */}
              <motion.div
                className={cn(
                  "absolute right-3 top-3 z-10 flex size-5 items-center justify-center rounded-full border transition-colors",
                  "group-hover:border-primary group-hover:bg-primary",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-border bg-muted/80"
                )}
              >
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  >
                    <Check
                      strokeWidth={3}
                      className="size-3 text-primary-foreground"
                    />
                  </motion.div>
                )}
              </motion.div>

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
                  <span className="text-xs leading-tight text-muted-foreground">
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
      className={cn("flex flex-col gap-3", className, getMaxWidthClass(maxWidth))}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const isAnimating = animatingValue === option.value;
        return (
          <motion.div
            key={option.value}
            className={cn(
              "group relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg border px-3 text-sm shadow-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              option.description ? "min-h-[60px] py-2.5" : "h-[50px]",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/40 hover:bg-muted/50",
              disabled && "cursor-not-allowed opacity-60"
            )}
            onClick={() => handleSelect(option.value)}
            onKeyDown={(e) => handleKeyDown(e, option.value)}
            whileTap={disabled ? {} : { scale: 0.96 }}
            animate={
              isAnimating && !disabled
                ? { opacity: AUTO_ADVANCE_CONFIG.ANIMATION_PATTERN }
                : {}
            }
            transition={{
              duration: AUTO_ADVANCE_CONFIG.ANIMATION_DURATION / 1000,
              ease: AUTO_ADVANCE_CONFIG.ANIMATION_EASING,
            }}
            tabIndex={disabled ? -1 : 0}
            role="radio"
            aria-checked={isSelected}
          >
            {/* Progress sweep */}
            {isAnimating && !disabled && (
              <motion.div
                className="absolute inset-0 origin-left"
                style={{
                  backgroundColor: AUTO_ADVANCE_CONFIG.PROGRESS_BAR_COLOR,
                  opacity: AUTO_ADVANCE_CONFIG.PROGRESS_BAR_OPACITY,
                }}
                initial={PROGRESS_BAR_ANIMATION.initial}
                animate={PROGRESS_BAR_ANIMATION.animate}
                transition={PROGRESS_BAR_ANIMATION.transition}
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
              <span className="flex flex-col gap-0.5">
                <span>{option.label}</span>
                {option.description && (
                  <span className="text-xs leading-tight text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </span>
            </div>

            {/* Check indicator */}
            <motion.div
              className={cn(
                "relative z-10 flex size-5 items-center justify-center rounded-full border transition-colors",
                "group-hover:border-primary group-hover:bg-primary",
                isSelected
                  ? "border-primary bg-primary"
                  : "border-border bg-muted/80"
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                >
                  <Check
                    strokeWidth={3}
                    className="size-3 text-primary-foreground"
                  />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
