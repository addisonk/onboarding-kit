"use client";

import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import { SurveyShell, SurveyQuestion } from "./survey-shell";
import { QuestionRenderer } from "./question-renderer";
import { useCurrentQuestion } from "./hooks/use-current-question";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { QuestionConfig } from "./types";

export interface SurveyProps<A extends Record<string, any>> {
  /** The question definitions to render. */
  questions: QuestionConfig<A>[];
  /** Current answer state — parent owns this. */
  attributes: A;
  /** Called whenever an answer changes. */
  onAttributeChange: (attributes: A) => void;
  /** Called when the user completes the last question. */
  onComplete: (attributes: A) => void;
  /** Optional right-panel content (e.g. illustration). */
  rightContent?: React.ReactNode;
  /** Called when the user presses back on the first question. */
  onBackFromFirstQuestion?: () => void;
  /** Hide the continue button (useful for auto-advance-only flows). */
  hideContinueButton?: boolean;
  /** Hide the per-question title (if you render it yourself). */
  hideQuestionTitle?: boolean;
  /** Show the progress bar. */
  showProgress?: boolean;
}

export function Survey<A extends Record<string, any>>({
  questions,
  attributes,
  onAttributeChange,
  onComplete,
  rightContent,
  onBackFromFirstQuestion,
  hideContinueButton = false,
  hideQuestionTitle = false,
  showProgress = false,
}: SurveyProps<A>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tempAnswer, setTempAnswer] = useState<any>(null);
  const [validationError, setValidationError] = useState("");

  const {
    filteredQuestions,
    currentQuestion,
    currentQuestionIndex,
    setActiveQuestionId,
    totalQuestions,
  } = useCurrentQuestion(questions, attributes);

  // Sync temp answer when question changes.
  useEffect(() => {
    if (currentQuestion) {
      setTempAnswer((attributes as any)[currentQuestion.id]);
      setValidationError("");
    }
  }, [currentQuestion, attributes]);

  const validate = (): boolean => {
    if (!currentQuestion?.validationSchema) return true;
    try {
      currentQuestion.validationSchema.parse(tempAnswer);
      setValidationError("");
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError(
          currentQuestion.validationErrorMessage ??
            err.issues[0]?.message ??
            "Invalid input"
        );
      }
      return false;
    }
  };

  const goToNext = () => {
    if (!validate()) return;

    // Commit answer
    if (currentQuestion) {
      const next = { ...attributes, [currentQuestion.id]: tempAnswer };
      onAttributeChange(next);
    }

    if (
      currentQuestionIndex !== -1 &&
      currentQuestionIndex < filteredQuestions.length - 1
    ) {
      const nextQ = filteredQuestions[currentQuestionIndex + 1];
      if (nextQ) setActiveQuestionId(String(nextQ.id));
    } else {
      handleComplete();
    }
  };

  const goToPrevious = () => {
    setValidationError("");
    if (currentQuestionIndex === 0 && onBackFromFirstQuestion) {
      onBackFromFirstQuestion();
    } else if (currentQuestionIndex > 0) {
      const prevQ = filteredQuestions[currentQuestionIndex - 1];
      if (prevQ) setActiveQuestionId(String(prevQ.id));
    }
  };

  const handleComplete = () => {
    if (!validate()) return;
    if (currentQuestion) {
      onComplete({ ...attributes, [currentQuestion.id]: tempAnswer });
    } else {
      onComplete(attributes);
    }
  };

  if (!currentQuestion) return null;

  return (
    <SurveyShell
      onBack={goToPrevious}
      onNext={goToNext}
      nextDisabled={!tempAnswer}
      nextLabel="Continue"
      showContinue
      hideContinueButton={hideContinueButton}
      currentQuestionIndex={currentQuestionIndex >= 0 ? currentQuestionIndex : 0}
      totalQuestions={totalQuestions}
      showProgress={showProgress}
      customBackCondition={currentQuestionIndex > 0 || !!onBackFromFirstQuestion}
      rightContent={rightContent}
    >
      <div className="flex flex-col gap-6" ref={containerRef}>
        <SurveyQuestion
          key={currentQuestion.id}
          title={currentQuestion.title}
          description={currentQuestion.description}
          active
          hideQuestionTitle={hideQuestionTitle}
        >
          <QuestionRenderer
            question={currentQuestion}
            attributes={attributes}
            isActive
            onEnter={goToNext}
            onChange={(value: any) => {
              setTempAnswer(value);
              setValidationError("");
            }}
            value={tempAnswer}
          />
          {validationError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
        </SurveyQuestion>
      </div>
    </SurveyShell>
  );
}
