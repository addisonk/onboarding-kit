"use client";

import { TextInputQuestion } from "./text-input-question";
import { RadioQuestion } from "./radio-question";
import { CardCheckboxQuestion } from "./card-checkbox-question";
import type { QuestionConfig, CardOption } from "./types";
import { useQuestionOptions } from "./hooks/use-question-options";

interface QuestionRendererProps<A = any> {
  question: QuestionConfig<A>;
  attributes: A;
  isActive: boolean;
  onEnter?: () => void;
  onChange: (value: any) => void;
  value: any;
}

export function QuestionRenderer<A>({
  question,
  attributes,
  isActive,
  onEnter,
  onChange,
  value,
}: QuestionRendererProps<A>) {
  const { options, error } = useQuestionOptions(question, attributes);

  // Default max widths per question type
  const maxWidth = (() => {
    if (question.maxWidth !== undefined) return question.maxWidth;
    switch (question.type) {
      case "radio":
      case "boolean":
        return "md" as const;
      case "number":
        return "sm" as const;
      case "card-checkbox":
        return "lg" as const;
      default:
        return false as const;
    }
  })();

  if (error) {
    return (
      <div className="py-4 text-destructive">
        <p>Error loading options: {error}</p>
      </div>
    );
  }

  switch (question.type) {
    case "text":
      return (
        <TextInputQuestion
          id={question.id}
          value={(value as string) ?? ""}
          onChange={onChange}
          onEnter={isActive ? onEnter : undefined}
          disabled={!isActive}
          maxWidth={maxWidth}
          placeholders={question.placeholders}
        />
      );

    case "number":
      return (
        <TextInputQuestion
          id={question.id}
          value={value?.toString() ?? ""}
          onChange={(val) => onChange(val ? parseInt(val, 10) : undefined)}
          onEnter={isActive ? onEnter : undefined}
          disabled={!isActive}
          type="number"
          min={18}
          max={120}
          maxWidth={maxWidth}
        />
      );

    case "radio":
      return (
        <RadioQuestion
          id={question.id}
          options={options.map((opt) => ({
            ...opt,
            value: String(opt.value),
          }))}
          value={(value as string) ?? ""}
          onChange={onChange}
          onAutoAdvance={isActive ? onEnter : undefined}
          disabled={!isActive}
          maxWidth={maxWidth}
          variant={question.variant}
        />
      );

    case "boolean":
      return (
        <RadioQuestion
          id={question.id}
          options={[
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
          ]}
          value={value === true ? "true" : value === false ? "false" : ""}
          onChange={(val: string) => onChange(val === "true")}
          onAutoAdvance={isActive ? onEnter : undefined}
          disabled={!isActive}
          maxWidth={maxWidth}
        />
      );

    case "card-checkbox": {
      const isSingle = question.cardCheckboxProps?.singleSelection;
      return (
        <CardCheckboxQuestion
          id={question.id}
          options={options as CardOption[]}
          values={
            isSingle ? (value ? [value as string] : []) : Array.isArray(value) ? value : []
          }
          onChange={(values: string[]) => {
            if (isSingle) {
              onChange(values.length > 0 ? values[values.length - 1] : undefined);
            } else {
              onChange(values);
            }
          }}
          disabled={!isActive}
          maxWidth={maxWidth}
        />
      );
    }

    default:
      return (
        <div className="text-muted-foreground">
          Unsupported question type: {question.type}
        </div>
      );
  }
}
