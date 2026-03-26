"use client";

import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { SurveyShell, SurveyQuestion } from "./survey-shell";
import { QuestionRenderer } from "./question-renderer";
import { useCurrentQuestion } from "./hooks/use-current-question";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { QuestionConfig } from "./types";

export interface SurveyProps<A extends Record<string, any>> {
  questions: QuestionConfig<A>[];
  attributes: A;
  onAttributeChange: (attributes: A) => void;
  onComplete: (attributes: A) => void;
  /** Custom right panel content. Overrides `rightImage`. */
  rightContent?: React.ReactNode;
  /** Shorthand: provide an image URL and it fills the right panel as cover. */
  rightImage?: string;
  /** Hide the right panel and center the survey content. */
  hideRightPanel?: boolean;
  /** Logo image URL for top-left branding. Max height 32px. */
  logoUrl?: string;
  /** Custom logo element (overrides `logoUrl`). */
  logo?: React.ReactNode;
  onBackFromFirstQuestion?: () => void;
  hideContinueButton?: boolean;
  hideQuestionTitle?: boolean;
  showProgress?: boolean;
  className?: string;
}

export function Survey<A extends Record<string, any>>({
  questions,
  attributes,
  onAttributeChange,
  onComplete,
  rightContent,
  rightImage,
  hideRightPanel = false,
  logoUrl,
  logo,
  onBackFromFirstQuestion,
  hideContinueButton = false,
  hideQuestionTitle = false,
  showProgress = false,
  className,
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

  useEffect(() => {
    if (currentQuestion) {
      const existing = (attributes as any)[currentQuestion.id];
      if (currentQuestion.type === "info") {
        setTempAnswer(true);
      } else if (currentQuestion.type === "slider" && existing === undefined) {
        const sp = currentQuestion.sliderProps;
        const min = sp?.min ?? 0;
        const max = sp?.max ?? 10;
        setTempAnswer(Math.round((min + max) / 2));
      } else {
        setTempAnswer(existing);
      }
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

  // Resolve right panel: hidden > explicit content > image shorthand > default gradient
  const resolvedRightContent = hideRightPanel
    ? undefined
    : rightContent ?? (rightImage ? (
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
          <img
            src={rightImage}
            alt=""
            className="size-full object-cover"
          />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/5" />
        </div>
      ) : (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-primary via-primary to-primary/80">
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/5" />
        </div>
      ));

  if (!currentQuestion) return null;

  const showBack = currentQuestionIndex > 0 || !!onBackFromFirstQuestion;
  const showNext = !hideContinueButton && (currentQuestion.type === "info" || !!tempAnswer);
  const progressPercent =
    currentQuestionIndex >= 0 && totalQuestions
      ? ((currentQuestionIndex + 1) / totalQuestions) * 100
      : 0;

  return (
    <SurveyShell
      className={className}
      rightContent={resolvedRightContent}
      logo={logo}
      logoUrl={logoUrl}
      showProgress={showProgress}
      progressPercent={progressPercent}
      actions={
        <div className="mx-auto w-full max-w-lg">
          {/* Desktop */}
          <div className="hidden items-center justify-between md:flex">
            <Button variant="outline" size="icon" className={cn("min-h-10 min-w-10", showBack ? "" : "invisible")} onClick={goToPrevious} aria-label="Go back">
              <ArrowLeft />
            </Button>
            <Button size="lg" onClick={goToNext} className={showNext ? "" : "invisible"}>
              Continue
            </Button>
          </div>
          {/* Mobile */}
          {!hideContinueButton && (
            <div className="flex gap-3 md:hidden">
              {showBack && (
                <Button variant="outline" size="lg" className="flex-1" onClick={goToPrevious} aria-label="Go back">
                  <ArrowLeft />
                  Back
                </Button>
              )}
              <Button size="lg" className="flex-1" onClick={goToNext} disabled={!showNext}>
                Continue
              </Button>
            </div>
          )}
        </div>
      }
    >
      <div ref={containerRef} className="mx-auto w-full max-w-lg py-6">
        {/* Question — fade + subtle slide on transition */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
          >
            <SurveyQuestion
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
          </motion.div>
        </AnimatePresence>
      </div>
    </SurveyShell>
  );
}
