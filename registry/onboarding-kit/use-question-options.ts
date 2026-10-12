import { useMemo } from "react";
import type {
  QuestionConfig,
  OptionsLoadingState,
  BaseOption,
  SyncOptionsFunction,
} from "@/components/survey/survey-types";

/** A question's options for the current answers: a static list, or computed from them. */
export function resolveQuestionOptions<T extends BaseOption, A = any>(
  question: QuestionConfig<A>,
  attributes: A
): T[] {
  if (question.type === "boolean") {
    return [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ] as T[];
  }
  if (question.type === "rating") {
    const max = question.ratingProps?.max ?? 5;
    return Array.from({ length: max }, (_, i) => ({
      value: String(i + 1),
      label: `${i + 1} of ${max}`,
    })) as T[];
  }
  if (!question.options) return [];
  if (Array.isArray(question.options)) return question.options as T[];
  return (question.options as SyncOptionsFunction<T, A>)(attributes);
}

export function useQuestionOptions<T extends BaseOption, A = any>(
  question: QuestionConfig<A>,
  attributes: A
): OptionsLoadingState<T> {
  const options = useMemo(
    () => resolveQuestionOptions<T, A>(question, attributes),
    [question, attributes]
  );

  return { options, loading: false, error: null };
}
