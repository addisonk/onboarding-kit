"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
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
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Called after a pointer selection; keyboard users continue with Enter. */
  onAutoAdvance?: () => void;
  disabled?: boolean;
  variant?: "button" | "card";
}

/** Fills the choice left to right while auto-advance waits. */
function SelectionSweep() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 origin-left bg-primary/5 will-change-transform"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: AUTO_ADVANCE_CONFIG.ANIMATION_DURATION / 1000, ease: "linear" }}
    />
  );
}

/** Tracks whether the latest selection came from a pointer, for auto-advance. */
export function useAutoAdvanceSelection(onAutoAdvance?: () => void) {
  const fromPointer = useRef(false);
  const [sweeping, setSweeping] = useState<string | null>(null);

  const choiceProps = {
    onPointerDown: () => {
      fromPointer.current = true;
    },
    onKeyDown: () => {
      fromPointer.current = false;
    },
  };

  const selected = (value: string) => {
    if (fromPointer.current && onAutoAdvance) {
      setSweeping(value);
      setTimeout(() => setSweeping(null), AUTO_ADVANCE_CONFIG.TOTAL_DELAY);
      onAutoAdvance();
    }
    fromPointer.current = false;
  };

  return { choiceProps, selected, sweeping };
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
  const { choiceProps, selected, sweeping } = useAutoAdvanceSelection(onAutoAdvance);

  return (
    <QuestionnairePrimitive.Choices
      className={cn(
        variant === "card" ? "grid grid-cols-2 gap-4" : "flex flex-col gap-3",
        className
      )}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <QuestionnairePrimitive.Choice
            key={option.value}
            value={option.value}
            checked={isSelected}
            disabled={disabled}
            onChange={(event) => {
              if (!event.target.checked) return;
              onChange(option.value);
              selected(option.value);
            }}
            {...choiceProps}
            className={cn(
              "group relative flex cursor-pointer overflow-hidden rounded-xl bg-card ring-1 transition-[box-shadow,transform] active:scale-[0.96]",
              "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-background",
              variant === "card"
                ? "min-h-[160px] flex-col items-center justify-center p-6"
                : cn(
                    "w-full items-center justify-between px-3 text-base",
                    option.description ? "min-h-[60px] py-2.5" : "h-[50px]"
                  ),
              isSelected
                ? "shadow-sm ring-primary"
                : "shadow-[0_1px_2px_0_rgb(0_0_0/0.04)] ring-foreground/10 hover:ring-primary/40",
              disabled && "cursor-not-allowed opacity-60"
            )}
          >
            <QuestionnairePrimitive.ChoiceInput className="absolute inset-0 z-20 size-full cursor-pointer opacity-0" />
            {sweeping === option.value && !disabled && <SelectionSweep />}

            {variant === "card" ? (
              <>
                <CheckIndicator selected={isSelected} className="absolute right-3 top-3 z-10" />
                <div className="relative z-10 mb-4 flex items-center justify-center">
                  {option.icon ? (
                    <option.icon className="size-12 shrink-0 text-muted-foreground" />
                  ) : option.emoji ? (
                    <span className="shrink-0 text-5xl">{option.emoji}</span>
                  ) : null}
                </div>
                <QuestionnairePrimitive.ChoiceLabel className="relative z-10 flex flex-col items-center gap-1 text-center">
                  <span className="font-medium">{option.label}</span>
                  {option.description && (
                    <span className="text-sm leading-snug text-muted-foreground">
                      {option.description}
                    </span>
                  )}
                </QuestionnairePrimitive.ChoiceLabel>
              </>
            ) : (
              <>
                <div className="relative z-10 flex items-center gap-3">
                  {option.icon ? (
                    <option.icon className="size-4 shrink-0 self-center text-muted-foreground" />
                  ) : option.emoji ? (
                    <span className="shrink-0 self-center text-xl">{option.emoji}</span>
                  ) : null}
                  <QuestionnairePrimitive.ChoiceLabel className="flex flex-col gap-1">
                    <span className="font-medium">{option.label}</span>
                    {option.description && (
                      <span className="text-sm leading-snug text-muted-foreground">
                        {option.description}
                      </span>
                    )}
                  </QuestionnairePrimitive.ChoiceLabel>
                </div>
                <div className="relative z-10 flex items-center gap-2">
                  <QuestionnairePrimitive.ChoiceShortcut className="hidden size-5 items-center justify-center rounded-md border border-border bg-background font-mono text-[0.625rem] leading-none font-medium text-muted-foreground group-data-[shortcut]:inline-flex" />
                  <CheckIndicator selected={isSelected} />
                </div>
              </>
            )}
          </QuestionnairePrimitive.Choice>
        );
      })}
    </QuestionnairePrimitive.Choices>
  );
}
