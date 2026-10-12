"use client";

import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { cn } from "@/lib/utils";
import { CheckIndicator } from "./check-indicator";
import { useAutoAdvanceSelection } from "./radio-question";

interface CardOption {
  value: string;
  label: string;
  description?: string;
  imageUrl?: string;
}

interface CardCheckboxQuestionProps {
  options: CardOption[];
  values: string[];
  onChange: (values: string[]) => void;
  /** One card at a time (radios) instead of many (checkboxes). */
  singleSelection?: boolean;
  /** Single selection only: called after a pointer selection. */
  onAutoAdvance?: () => void;
  className?: string;
  columns?: 1 | 2;
  disabled?: boolean;
}

export function CardCheckboxQuestion({
  options,
  values,
  onChange,
  singleSelection = false,
  onAutoAdvance,
  className,
  columns = 2,
  disabled = false,
}: CardCheckboxQuestionProps) {
  const { choiceProps, selected } = useAutoAdvanceSelection(
    singleSelection ? onAutoAdvance : undefined
  );

  return (
    <QuestionnairePrimitive.Choices
      className={cn("grid gap-4", columns === 1 ? "grid-cols-1" : "grid-cols-2", className)}
    >
      {options.map((option) => {
        const isSelected = values.includes(option.value);
        return (
          <QuestionnairePrimitive.Choice
            key={option.value}
            value={option.value}
            checked={isSelected}
            disabled={disabled}
            onChange={(event) => {
              if (singleSelection) {
                if (!event.target.checked) return;
                onChange([option.value]);
                selected(option.value);
                return;
              }
              onChange(
                event.target.checked
                  ? [...values, option.value]
                  : values.filter((value) => value !== option.value)
              );
            }}
            {...choiceProps}
            className={cn(
              "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl bg-card text-card-foreground ring-1 transition-[box-shadow,transform] active:scale-[0.96]",
              "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-background",
              isSelected ? "ring-2 ring-primary" : "ring-foreground/10 hover:ring-primary/40",
              disabled && "cursor-not-allowed opacity-60"
            )}
          >
            <QuestionnairePrimitive.ChoiceInput className="absolute inset-0 z-20 size-full cursor-pointer opacity-0" />
            {option.imageUrl && (
              <img src={option.imageUrl} alt="" className="aspect-square w-full object-cover" />
            )}
            <div className="flex items-start justify-between gap-3 p-4">
              <QuestionnairePrimitive.ChoiceLabel className="flex min-w-0 flex-col">
                <span className="text-base font-medium text-foreground">{option.label}</span>
                {option.description && (
                  <span className="mt-1 text-sm text-muted-foreground">{option.description}</span>
                )}
              </QuestionnairePrimitive.ChoiceLabel>
              <CheckIndicator selected={isSelected} className="shrink-0" />
            </div>
          </QuestionnairePrimitive.Choice>
        );
      })}
    </QuestionnairePrimitive.Choices>
  );
}
