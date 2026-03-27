import { useMemo } from "react";
import type {
  QuestionConfig,
  OptionsLoadingState,
  BaseOption,
  SyncOptionsFunction,
} from "@/components/survey/survey-types";

export function useQuestionOptions<T extends BaseOption, A = any>(
  question: QuestionConfig<A>,
  attributes: A
): OptionsLoadingState<T> {
  const options = useMemo(() => {
    if (!question.options) return [];

    if (Array.isArray(question.options)) {
      return question.options as T[];
    }

    const syncFn = question.options as SyncOptionsFunction<T, A>;
    return syncFn(attributes);
  }, [question.options, attributes]);

  return { options, loading: false, error: null };
}
