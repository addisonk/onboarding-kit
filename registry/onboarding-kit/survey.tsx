"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import {
  Questionnaire as QuestionnairePrimitive,
  type QuestionnaireItemDefinition,
  type QuestionnaireShortcutMode,
} from "@shadcn/react/questionnaire";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Questionnaire,
  QuestionnaireDescription,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire";
import { SurveyShell } from "./survey-shell";
import { QuestionRenderer } from "./question-renderer";
import { AUTO_ADVANCE_CONFIG } from "./survey-config";
import { resolveQuestionOptions } from "@/hooks/use-question-options";
import type { QuestionConfig } from "./survey-types";

export interface SurveyProps<A extends Record<string, any>> {
  questions: QuestionConfig<A>[];
  /** Current answers. The survey is controlled: every change goes through `onAttributeChange`. */
  attributes: A;
  onAttributeChange: (attributes: A) => void;
  onComplete: (attributes: A) => void;
  /** Question to open first, for resuming a saved draft. Defaults to the first enabled question. */
  defaultQuestionId?: keyof A & string;
  /** Keyboard shortcuts for fixed choices: A, B, C… or 1, 2, 3… */
  shortcuts?: QuestionnaireShortcutMode;
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
  /** Label for Continue on every question, including the last. */
  continueLabel?: string;
  className?: string;
}

const isEnabled = <A,>(question: QuestionConfig<A>, attributes: A) =>
  !question.condition || question.condition(attributes);

// Info screens are required too: their hidden answer is always present, so Skip never shows.
const isRequired = <A,>(question: QuestionConfig<A>) => !question.optional;

const sliderMidpoint = <A,>(question: QuestionConfig<A>) => {
  const min = question.sliderProps?.min ?? 0;
  const max = question.sliderProps?.max ?? 10;
  return Math.round((min + max) / 2);
};

/** Answers a question carries without input: info screens and an untouched slider. */
function withImplicitAnswer<A extends Record<string, any>>(
  question: QuestionConfig<A>,
  attributes: A
): A {
  if (question.type === "info" && attributes[question.id] !== true) {
    return { ...attributes, [question.id]: true };
  }
  if (question.type === "slider" && attributes[question.id] === undefined) {
    return { ...attributes, [question.id]: sliderMidpoint(question) };
  }
  return attributes;
}

function validationMessage<A extends Record<string, any>>(
  question: QuestionConfig<A>,
  attributes: A
): string | null {
  if (!question.validationSchema) return null;
  const result = question.validationSchema.safeParse(attributes[question.id]);
  if (result.success) return null;
  return question.validationErrorMessage ?? result.error.issues[0]?.message ?? "Invalid input";
}

export function Survey<A extends Record<string, any>>({
  questions,
  attributes,
  onAttributeChange,
  onComplete,
  defaultQuestionId,
  shortcuts,
  rightContent,
  rightImage,
  hideRightPanel = false,
  logoUrl,
  logo,
  onBackFromFirstQuestion,
  hideContinueButton = false,
  hideQuestionTitle = false,
  showProgress = false,
  continueLabel = "Continue",
  className,
}: SurveyProps<A>) {
  const shellRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enabledQuestions = useMemo(
    () => questions.filter((q) => isEnabled(q, attributes)),
    [questions, attributes]
  );
  const [activeId, setActiveId] = useState<string | undefined>(defaultQuestionId);
  const [invalid, setInvalid] = useState<{ id: string; message: string } | null>(null);

  // A condition can remove the active question; fall back to the first enabled one.
  const currentId = enabledQuestions.some((q) => q.id === activeId)
    ? activeId
    : enabledQuestions[0]?.id;
  const currentIndex = enabledQuestions.findIndex((q) => q.id === currentId);
  const currentQuestion = enabledQuestions[currentIndex];

  const items = useMemo<QuestionnaireItemDefinition[]>(
    () =>
      questions.map((q) => ({
        name: q.id,
        required: isRequired(q),
        disabled: !isEnabled(q, attributes),
        choices: resolveQuestionOptions(q, attributes).map((option) => ({
          value: String(option.value),
        })),
      })),
    [questions, attributes]
  );

  const cancelAdvance = useCallback(() => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
  }, []);

  useEffect(() => cancelAdvance, [cancelAdvance]);
  useEffect(() => cancelAdvance(), [currentId, cancelAdvance]);

  /** Moves on through Questionnaire's own Continue button, so its validation still runs. */
  const advance = useCallback(() => {
    const action = shellRef.current?.querySelector<HTMLButtonElement>(
      '[data-survey-action][data-visible]:not(:disabled)'
    );
    action?.click();
  }, []);

  const scheduleAdvance = useCallback(() => {
    cancelAdvance();
    advanceTimer.current = setTimeout(advance, AUTO_ADVANCE_CONFIG.TOTAL_DELAY);
  }, [advance, cancelAdvance]);

  const answer = (question: QuestionConfig<A>, value: unknown) => {
    setInvalid((current) => (current?.id === question.id ? null : current));
    onAttributeChange({ ...attributes, [question.id]: value });
  };

  const handleItemChange = (nextId: string) => {
    const nextIndex = enabledQuestions.findIndex((q) => q.id === nextId);
    if (currentQuestion && nextIndex > currentIndex) {
      const committed = withImplicitAnswer(currentQuestion, attributes);
      const message = validationMessage(currentQuestion, committed);
      if (message) {
        setInvalid({ id: currentQuestion.id, message });
        return;
      }
      if (committed !== attributes) onAttributeChange(committed);
    }
    setInvalid(null);
    setActiveId(nextId);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    cancelAdvance();
    const committed = currentQuestion
      ? withImplicitAnswer(currentQuestion, attributes)
      : attributes;
    for (const question of enabledQuestions) {
      const message = validationMessage(question, committed);
      if (message) {
        setInvalid({ id: question.id, message });
        setActiveId(question.id);
        return;
      }
    }
    onComplete(committed);
  };

  // Resolve right panel: hidden > explicit content > image shorthand > default placeholder
  const resolvedRightContent = hideRightPanel
    ? undefined
    : rightContent ??
      (rightImage ? (
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
          <img src={rightImage} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/5" />
        </div>
      ) : (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-muted">
          <img
            src="/placeholder.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover dark:invert"
          />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/5" />
        </div>
      ));

  if (!currentQuestion) return null;

  const backClassName = "flex-1 md:size-10 md:flex-none md:px-0";
  // Continue stays unavailable until the question is answered (or skipped).
  const continueRender = (
    props: React.ComponentProps<"button">,
    state: { status: string | null }
  ) => <button {...props} disabled={props.disabled || state.status === "unanswered"} />;
  const continueClassName = cn(
    "flex-1 md:ms-auto md:flex-none",
    "md:data-[status=unanswered]:invisible",
    hideContinueButton && "sr-only"
  );

  return (
    <Questionnaire
      item={currentId}
      items={items}
      onItemChange={handleItemChange}
      onSubmit={handleSubmit}
      shortcuts={shortcuts}
      className={cn("min-h-full gap-0", className)}
    >
      <SurveyShell
        ref={shellRef}
        className="flex-1"
        rightContent={resolvedRightContent}
        logo={logo}
        logoUrl={logoUrl}
        progress={
          showProgress ? (
            <QuestionnairePrimitive.Progress
              render={(props, state) => (
                <div
                  {...props}
                  className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-foreground/10"
                >
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-300"
                    style={{ width: `${state.total ? (state.current / state.total) * 100 : 0}%` }}
                  />
                </div>
              )}
            />
          ) : undefined
        }
        actions={
          <div className="mx-auto flex w-full max-w-lg items-center gap-3">
            {currentIndex === 0 && onBackFromFirstQuestion && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className={backClassName}
                onClick={onBackFromFirstQuestion}
              >
                <ArrowLeft />
                <span className="md:sr-only">Back</span>
              </Button>
            )}
            <QuestionnairePrevious variant="outline" size="lg" className={backClassName}>
              <ArrowLeft />
              <span className="md:sr-only">Back</span>
            </QuestionnairePrevious>
            <QuestionnaireSkip variant="ghost" size="lg" className="md:ms-auto">
              Skip
            </QuestionnaireSkip>
            <QuestionnaireNext
              data-survey-action="next"
              size="lg"
              className={continueClassName}
              render={continueRender}
            >
              {continueLabel}
            </QuestionnaireNext>
            <QuestionnaireSubmit
              data-survey-action="submit"
              size="lg"
              className={continueClassName}
              render={continueRender}
            >
              {continueLabel}
            </QuestionnaireSubmit>
          </div>
        }
      >
        <div className="mx-auto w-full max-w-lg py-6">
          {questions.map((question) => {
            const active = question.id === currentId;
            return (
              <QuestionnaireItem
                key={question.id}
                name={question.id}
                required={isRequired(question)}
                disabled={!isEnabled(question, attributes)}
                multiple={
                  question.type === "card-checkbox" &&
                  !question.cardCheckboxProps?.singleSelection
                }
                invalid={invalid?.id === question.id}
                className="gap-0 data-active:animate-in data-active:fade-in-0 data-active:slide-in-from-bottom-2 data-active:duration-300"
              >
                <QuestionnaireTitle
                  className={cn(
                    "mb-0 max-w-lg font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl",
                    !question.description && "mb-6",
                    hideQuestionTitle && "sr-only"
                  )}
                >
                  {question.title}
                </QuestionnaireTitle>
                {question.description && (
                  <QuestionnaireDescription className="mt-3 mb-6 max-w-lg text-base leading-relaxed">
                    {question.description}
                  </QuestionnaireDescription>
                )}
                <QuestionRenderer
                  question={question}
                  attributes={attributes}
                  isActive={active}
                  value={attributes[question.id]}
                  onChange={(value) => answer(question, value)}
                  onAutoAdvance={active ? scheduleAdvance : undefined}
                  onSubmitText={advance}
                />
                <QuestionnairePrimitive.Error
                  render={<Alert variant="destructive" className="mt-4" />}
                >
                  <AlertCircle />
                  <AlertDescription>
                    {invalid?.id === question.id
                      ? invalid.message
                      : "Answer this question to continue."}
                  </AlertDescription>
                </QuestionnairePrimitive.Error>
              </QuestionnaireItem>
            );
          })}
        </div>
      </SurveyShell>
    </Questionnaire>
  );
}
