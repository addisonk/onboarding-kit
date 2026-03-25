"use client";

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/* ---------------------------------- Types --------------------------------- */

export interface SurveyShellProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  children?: React.ReactNode;
  rightContent?: React.ReactNode;
  showContinue?: boolean;
  hideContinueButton?: boolean;
  currentQuestionIndex?: number;
  totalQuestions?: number;
  showProgress?: boolean;
  /** Override whether the back button renders. Defaults to `true` when `onBack` is provided. */
  customBackCondition?: boolean;
}

/* -------------------------------- Component ------------------------------- */

const SurveyShell = React.forwardRef<HTMLDivElement, SurveyShellProps>(
  (
    {
      title,
      description,
      onBack,
      onNext,
      nextLabel = "Continue",
      nextDisabled = false,
      className,
      children,
      rightContent,
      showContinue = true,
      hideContinueButton = false,
      currentQuestionIndex,
      totalQuestions,
      showProgress = false,
      customBackCondition,
      ...props
    },
    ref
  ) => {
    const [isContentOverflowing, setIsContentOverflowing] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const showBackButton =
      onBack &&
      (customBackCondition !== undefined ? customBackCondition : true);

    // Detect overflow so we can show a sticky bottom CTA when content is tall.
    useEffect(() => {
      const checkOverflow = () => {
        if (contentRef.current && containerRef.current) {
          const contentHeight = contentRef.current.scrollHeight;
          const containerHeight = containerRef.current.clientHeight - 160;
          setIsContentOverflowing(contentHeight > containerHeight);
        }
      };

      checkOverflow();
      const tid = setTimeout(checkOverflow, 100);
      window.addEventListener("resize", checkOverflow);
      return () => {
        window.removeEventListener("resize", checkOverflow);
        clearTimeout(tid);
      };
    }, [children, currentQuestionIndex]);

    const progressPercent =
      currentQuestionIndex !== undefined && totalQuestions
        ? ((currentQuestionIndex + 1) / totalQuestions) * 100
        : 0;

    return (
      <div
        ref={ref}
        className={cn("flex w-full", className)}
        {...props}
      >
        {/* Left — survey content */}
        <div
          ref={containerRef}
          className={cn(
            "relative flex w-full flex-col",
            rightContent ? "md:w-1/2" : "md:w-full"
          )}
        >
          <div className="flex w-full flex-col">
            {/* Back + progress bar */}
            {showBackButton && (
              <div className="mb-2 flex shrink-0 items-center justify-between">
                <Button variant="secondary" size="sm" onClick={onBack}>
                  <ArrowLeft data-icon="inline-start" />
                  Back
                </Button>

                {showProgress &&
                  currentQuestionIndex !== undefined &&
                  totalQuestions !== undefined && (
                    <Progress
                      value={progressPercent}
                      className="h-2 w-32"
                    />
                  )}
              </div>
            )}

            {/* Header */}
            {(title || description) && (
              <div className="mb-6 shrink-0">
                {title && (
                  <h1 className="text-2xl font-bold text-foreground text-wrap-balance">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-2 text-muted-foreground text-wrap-pretty">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Body */}
            <div className="flex min-h-0 w-full flex-1 flex-col">
              <div ref={contentRef} className="flex h-fit flex-col gap-6">
                {children}

                {/* Inline continue — visible when content fits */}
                {!hideContinueButton &&
                  showContinue &&
                  onNext &&
                  !isContentOverflowing &&
                  !nextDisabled && (
                    <div>
                      <Button size="lg" onClick={onNext}>
                        {nextLabel}
                      </Button>
                    </div>
                  )}
              </div>

              {/* Sticky continue — visible when content overflows */}
              {!hideContinueButton &&
                showContinue &&
                onNext &&
                isContentOverflowing &&
                !nextDisabled && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background to-transparent p-4 pt-6">
                    <Button size="lg" onClick={onNext}>
                      {nextLabel}
                    </Button>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Right panel */}
        {rightContent && (
          <div className="hidden h-full md:flex md:w-1/2">{rightContent}</div>
        )}
      </div>
    );
  }
);
SurveyShell.displayName = "SurveyShell";

/* ------------------------------ Sub-components ----------------------------- */

export interface SurveyQuestionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children: React.ReactNode;
  active?: boolean;
  hideQuestionTitle?: boolean;
}

const SurveyQuestion = React.forwardRef<HTMLDivElement, SurveyQuestionProps>(
  (
    {
      className,
      title,
      description,
      children,
      active = true,
      hideQuestionTitle,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn("w-full", !active && "opacity-60", className)}
      {...props}
    >
      {!hideQuestionTitle && (
        <h2 className="max-w-lg text-2xl font-bold text-foreground text-wrap-balance">
          {title}
        </h2>
      )}
      {description && (
        <p className="mb-6 max-w-lg text-muted-foreground text-wrap-pretty">
          {description}
        </p>
      )}
      <div className={cn(!active && "pointer-events-none")}>{children}</div>
    </div>
  )
);
SurveyQuestion.displayName = "SurveyQuestion";

const SurveyRightPanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center", className)}
    {...props}
  >
    {children}
  </div>
));
SurveyRightPanel.displayName = "SurveyRightPanel";

export { SurveyShell, SurveyQuestion, SurveyRightPanel };
