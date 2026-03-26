import { useMemo, useCallback, useState } from "react";
import type { QuestionConfig } from "../types";

/**
 * Manages which question is currently active.
 * Pure state-based — no router dependency. Drop into any framework.
 */
export function useCurrentQuestion<A = any>(
  questions: QuestionConfig<A>[],
  attributes: A,
  initialQuestionId?: string
) {
  const [activeId, setActiveId] = useState<string | null>(
    initialQuestionId ?? null
  );

  // Filter questions whose conditions are met.
  const filteredQuestions = useMemo(
    () =>
      questions.filter((q) => {
        if (!q.condition) return true;
        return q.condition(attributes);
      }),
    [questions, attributes]
  );

  // Auto-select first question if none is active.
  const effectiveId = useMemo(() => {
    if (activeId && filteredQuestions.some((q) => String(q.id) === activeId)) {
      return activeId;
    }
    return filteredQuestions.length > 0 ? String(filteredQuestions[0].id) : null;
  }, [activeId, filteredQuestions]);

  const currentQuestion = useMemo(
    () => filteredQuestions.find((q) => String(q.id) === effectiveId),
    [filteredQuestions, effectiveId]
  );

  const currentQuestionIndex = useMemo(
    () => filteredQuestions.findIndex((q) => String(q.id) === effectiveId),
    [filteredQuestions, effectiveId]
  );

  const setActiveQuestionId = useCallback((id: string | null) => {
    setActiveId(id);
  }, []);

  return {
    filteredQuestions,
    currentQuestion,
    currentQuestionIndex,
    activeQuestionId: effectiveId,
    setActiveQuestionId,
    totalQuestions: filteredQuestions.length,
  };
}
