"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { CheckIndicator } from "./check-indicator";

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
}

export function CardCheckboxQuestion({
  options,
  values,
  onChange,
  className,
  columns = 2,
  disabled = false,
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
      )}
    >
      {options.map((option) => {
        const isSelected = values.includes(option.value);
        return (
          <motion.div
            key={option.value}
            whileTap={disabled ? {} : { scale: 0.96 }}
          >
            <Card
              className={cn(
                "group relative cursor-pointer transition-colors",
                isSelected
                  ? "ring-2 ring-primary"
                  : "hover:ring-1 hover:ring-primary/40",
                disabled && "cursor-not-allowed opacity-60"
              )}
              onClick={() => toggleOption(option.value)}
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
                <img
                  src={option.imageUrl}
                  alt={option.label}
                  className="aspect-square w-full object-cover"
                />
              )}
              <CardContent>
                <div className="text-base font-medium text-foreground">
                  {option.label}
                </div>
                {option.description && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    {option.description}
                  </div>
                )}
              </CardContent>

              <CheckIndicator selected={isSelected} className="absolute right-3 top-3" />
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
