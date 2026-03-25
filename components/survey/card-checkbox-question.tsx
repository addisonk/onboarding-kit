"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getMaxWidthClass } from "./utils";
import type { MaxWidth } from "./types";

interface CardOption {
  value: string;
  label: string;
  description?: string;
  imageUrl?: string;
}

interface CardCheckboxQuestionProps {
  id?: string;
  options: CardOption[];
  values: string[];
  onChange: (values: string[]) => void;
  className?: string;
  columns?: 1 | 2;
  disabled?: boolean;
  maxWidth?: MaxWidth;
}

export function CardCheckboxQuestion({
  options,
  values,
  onChange,
  className,
  columns = 2,
  disabled = false,
  maxWidth,
}: CardCheckboxQuestionProps) {
  const toggleOption = (optionValue: string) => {
    if (disabled) return;
    if (values.includes(optionValue)) {
      onChange(values.filter((v) => v !== optionValue));
    } else {
      onChange([...values, optionValue]);
    }
  };

  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 1 ? "grid-cols-1" : "grid-cols-2",
        className,
        getMaxWidthClass(maxWidth)
      )}
    >
      {options.map((option) => {
        const isSelected = values.includes(option.value);
        return (
          <motion.div
            key={option.value}
            className={cn(
              "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-card transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "hover:bg-muted/50",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40",
              disabled && "cursor-not-allowed opacity-60"
            )}
            onClick={() => toggleOption(option.value)}
            whileTap={disabled ? {} : { scale: 0.96 }}
            tabIndex={disabled ? -1 : 0}
            role="checkbox"
            aria-checked={isSelected}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleOption(option.value);
              }
            }}
          >
            {option.imageUrl && (
              <div className="relative aspect-square w-full overflow-hidden">
                <img
                  src={option.imageUrl}
                  alt={option.label}
                  className="size-full object-cover"
                />
                {/* Subtle image outline for depth */}
                <div className="absolute inset-0 rounded-t-xl ring-1 ring-inset ring-foreground/5" />
              </div>
            )}
            <div className="px-5 py-5">
              <div className="text-base font-medium text-foreground">
                {option.label}
              </div>
              {option.description && (
                <div className="mt-1 text-sm text-muted-foreground">
                  {option.description}
                </div>
              )}
            </div>

            {/* Check indicator — concentric border radius (outer = inner + padding) */}
            <div
              className={cn(
                "absolute right-3 top-3 flex size-6 items-center justify-center rounded-full border transition-colors",
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
                    className="size-3.5 text-primary-foreground"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
