"use client";

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
  className?: string;
  disabled?: boolean;
}

export function SliderQuestion({
  id,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  minLabel,
  maxLabel,
  className,
  disabled = false,
}: SliderQuestionProps) {
  const safeValue = typeof value === "number" ? value : Math.round((min + max) / 2);

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-6 text-center text-4xl font-bold tabular-nums text-foreground">
        {safeValue}
      </div>
      <Slider
        id={id}
        value={[safeValue]}
        onValueChange={(value) => {
          const v = Array.isArray(value) ? value[0] : value;
          onChange(v);
        }}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
      {(minLabel || maxLabel) && (
        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}
