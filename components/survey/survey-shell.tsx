"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------- Types --------------------------------- */

export interface SurveyShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  rightContent?: React.ReactNode;
  /** Logo image URL. Max height 32px. */
  logoUrl?: string;
  /** Custom logo element (overrides `logoUrl`). */
  logo?: React.ReactNode;
}

/* -------------------------------- Component ------------------------------- */

const SurveyShell = React.forwardRef<HTMLDivElement, SurveyShellProps>(
  ({ className, children, rightContent, logoUrl, logo, ...props }, ref) => {
    const resolvedLogo = logo ?? (logoUrl ? (
      <img src={logoUrl} alt="Logo" className="max-h-8 w-auto" />
    ) : null);

    return (
      <div
        ref={ref}
        className={cn("flex w-full", className)}
        {...props}
      >
        {/* Left — survey content */}
        <div
          className={cn(
            "relative flex flex-col overflow-y-auto p-8 md:p-12",
            rightContent ? "w-full md:w-1/2" : "mx-auto w-full max-w-2xl"
          )}
        >
          {/* Logo — top left */}
          {resolvedLogo && (
            <div className="mb-8 shrink-0">
              {resolvedLogo}
            </div>
          )}

          <div className="flex w-full flex-1 flex-col md:justify-center">
            <div className="min-h-[420px]">
              {children}
            </div>
          </div>
        </div>

        {/* Right panel */}
        {rightContent && (
          <div className="hidden md:flex md:w-1/2 md:p-4">
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
        <p className="mt-2 mb-6 max-w-lg leading-relaxed text-muted-foreground">
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
