"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

/* ---------------------------------- Types --------------------------------- */

export interface SurveyShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  rightContent?: React.ReactNode;
  logoUrl?: string;
  logo?: React.ReactNode;
  showProgress?: boolean;
  progressPercent?: number;
  actions?: React.ReactNode;
}

/* -------------------------------- Component ------------------------------- */

const SurveyShell = React.forwardRef<HTMLDivElement, SurveyShellProps>(
  ({ className, children, rightContent, logoUrl, logo, showProgress, progressPercent, actions, ...props }, ref) => {
    const resolvedLogo = logo ?? (logoUrl ? (
      <img src={logoUrl} alt="Logo" className="max-h-8 w-auto" />
    ) : null);

    const hasHeader = resolvedLogo || (showProgress && progressPercent !== undefined);

    return (
      <div
        ref={ref}
        className={cn("flex min-h-full w-full", className)}
        {...props}
      >
        {/*
          Left panel — single overflow-y-auto container.
          Scrollbar sits at the right edge (between left and right panels).
          Header and actions use sticky positioning within the scroll flow.
          Pattern from Diino's StickToBottom + StickyChatContainer.
        */}
        <div
          className={cn(
            "relative",
            rightContent ? "w-full md:w-1/2" : "mx-auto w-full max-w-2xl"
          )}
        >
          <div className="flex min-h-full flex-col">
            {/* Header — sticky top */}
            {hasHeader && (
              <div className="sticky top-0 z-20 bg-inherit px-8 pt-6 pb-3 md:px-12 md:pt-8">
                <div className="mx-auto max-w-lg">
                  {resolvedLogo}
                  {showProgress && progressPercent !== undefined && (
                    <Progress value={progressPercent} className="mt-2 h-1.5 w-24" />
                  )}
                </div>
              </div>
            )}

            {/* Content — flex-1 + justify-end pushes content to bottom like Diino's chat feed */}
            <div className="flex min-h-0 flex-1 flex-col justify-end px-8 md:px-12">
              {children}
            </div>

            {/* Actions — sticky bottom (like StickyChatContainer) */}
            {actions && (
              <div className="sticky bottom-0 z-20 bg-inherit px-8 pb-6 pt-4 md:px-12 md:pb-8">
                {actions}
              </div>
            )}
          </div>
        </div>

        {/* Right panel — static, no scroll */}
        {rightContent && (
          <div className="sticky top-0 hidden max-h-dvh shrink-0 md:flex md:w-1/2 md:p-4">
            {rightContent}
          </div>
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
        <h2 className={cn("max-w-lg text-2xl font-semibold tracking-tight text-foreground md:text-3xl", !description && "mb-6")}>
          {title}
        </h2>
      )}
      {description && (
        <p className="mt-3 mb-6 max-w-lg leading-relaxed text-muted-foreground">
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
