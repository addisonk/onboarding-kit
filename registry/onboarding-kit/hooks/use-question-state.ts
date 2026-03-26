import { useMemo } from "react";
import type { QuestionConfig } from "../types";

export interface QuestionState {
  isOptional: boolean;
  isAnswered: boolean;
}

export function useQuestionState<A = any>(
  currentQuestion: QuestionConfig<A> | undefined,
  attributes: A
): QuestionState {
  const isOptional = currentQuestion?.optional === true;

  const isAnswered = useMemo(() => {
    if (!currentQuestion) return false;
    const value = (attributes as any)[currentQuestion.id];

    switch (currentQuestion.type) {
      case "text":
        return typeof value === "string" && value.trim() !== "";
      case "number":
        return typeof value === "number" && !isNaN(value);
      case "radio":
      case "boolean":
        return value !== undefined && value !== "";
      case "card-checkbox":
        if (currentQuestion.cardCheckboxProps?.singleSelection) {
          return typeof value === "string" && value !== "";
        }
        return Array.isArray(value) && value.length > 0;
      default:
        return false;
    }
  }, [currentQuestion, attributes]);

  return { isOptional, isAnswered };
}
