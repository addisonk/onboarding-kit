"use client";

import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { TextInputQuestion } from "./text-input-question";
import { TextareaQuestion } from "./textarea-question";
import { RadioQuestion } from "./radio-question";
import { CardCheckboxQuestion } from "./card-checkbox-question";
import { SliderQuestion } from "./slider-question";
import { RatingQuestion } from "./rating-question";
import type { QuestionConfig, CardOption } from "./survey-types";
import { useQuestionOptions } from "@/hooks/use-question-options";

interface QuestionRendererProps<A = any> {
  question: QuestionConfig<A>;
  attributes: A;
  /** Whether this is the question on screen. */
  isActive: boolean;
  value: any;
  onChange: (value: any) => void;
  /** Schedules auto-advance after a pointer selection on single-choice questions. */
  onAutoAdvance?: () => void;
  /** Continues from a text answer (the inline arrow button). */
  onSubmitText?: () => void;
}

/** The answer control for one question, built from Questionnaire parts. */
export function QuestionRenderer<A>({
  question,
  attributes,
  isActive,
  value,
  onChange,
  onAutoAdvance,
  onSubmitText,
}: QuestionRendererProps<A>) {
  const { options, error } = useQuestionOptions(question, attributes);
  const inputId = `survey-${question.id}`;

  if (error) {
    return (
      <div className="py-4 text-destructive">
        <p>Error loading options: {error}</p>
      </div>
    );
  }

  switch (question.type) {
    case "info":
      // Nothing to answer: a fixed hidden answer lets Continue proceed.
      return (
        <QuestionnairePrimitive.Input
          value="true"
          readOnly
          tabIndex={-1}
          aria-hidden
          className="sr-only"
        />
      );

    case "text":
      return (
        <TextInputQuestion
          id={inputId}
          value={(value as string) ?? ""}
          onChange={onChange}
          onSubmit={isActive ? onSubmitText : undefined}
          placeholder={question.placeholder}
          placeholders={question.placeholders}
          ariaLabel={question.title}
        />
      );

    case "number":
      return (
        <TextInputQuestion
          id={inputId}
          type="number"
          value={value?.toString() ?? ""}
          onChange={(val) => onChange(val ? parseInt(val, 10) : undefined)}
          onSubmit={isActive ? onSubmitText : undefined}
          placeholder={question.placeholder}
          ariaLabel={question.title}
        />
      );

    case "radio":
      return (
        <RadioQuestion
          options={options.map((opt) => ({ ...opt, value: String(opt.value) }))}
          value={value === undefined || value === null ? "" : String(value)}
          onChange={onChange}
          onAutoAdvance={onAutoAdvance}
          variant={question.variant}
        />
      );

    case "boolean":
      return (
        <RadioQuestion
          options={options.map((opt) => ({ ...opt, value: String(opt.value) }))}
          value={value === true ? "true" : value === false ? "false" : ""}
          onChange={(val: string) => onChange(val === "true")}
          onAutoAdvance={onAutoAdvance}
        />
      );

    case "card-checkbox": {
      const single = question.cardCheckboxProps?.singleSelection ?? false;
      return (
        <CardCheckboxQuestion
          options={options as CardOption[]}
          singleSelection={single}
          values={single ? (value ? [value as string] : []) : Array.isArray(value) ? value : []}
          onChange={(values: string[]) =>
            onChange(single ? values[values.length - 1] : values)
          }
          onAutoAdvance={onAutoAdvance}
        />
      );
    }

    case "textarea":
      return (
        <TextareaQuestion
          id={inputId}
          value={(value as string) ?? ""}
          onChange={onChange}
          placeholder={question.placeholder}
          ariaLabel={question.title}
        />
      );

    case "slider": {
      const sp = question.sliderProps;
      return (
        <SliderQuestion
          id={inputId}
          value={value as number | undefined}
          onChange={onChange}
          min={sp?.min}
          max={sp?.max}
          step={sp?.step}
          minLabel={sp?.minLabel}
          maxLabel={sp?.maxLabel}
          ariaLabel={question.title}
        />
      );
    }

    case "rating":
      return (
        <RatingQuestion
          value={value as number | undefined}
          onChange={onChange}
          max={question.ratingProps?.max}
          onAutoAdvance={onAutoAdvance}
        />
      );

    default:
      return (
        <div className="text-muted-foreground">
          Unsupported question type: {question.type}
        </div>
      );
  }
}
