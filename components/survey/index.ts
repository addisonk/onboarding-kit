// Main component
export { Survey } from "./survey";
export type { SurveyProps } from "./survey";

// Shell (for custom layouts)
export { SurveyShell, SurveyQuestion, SurveyRightPanel } from "./survey-shell";
export type { SurveyShellProps, SurveyQuestionProps } from "./survey-shell";

// Question components (for standalone use)
export { RadioQuestion } from "./radio-question";
export { CardCheckboxQuestion } from "./card-checkbox-question";
export { TextInputQuestion } from "./text-input-question";
export { QuestionRenderer } from "./question-renderer";

// Hooks
export { useCurrentQuestion } from "./hooks/use-current-question";
export { useQuestionOptions } from "./hooks/use-question-options";
export { useQuestionState } from "./hooks/use-question-state";
export type { QuestionState } from "./hooks/use-question-state";

// Types
export type {
  QuestionConfig,
  BaseOption,
  CardOption,
  MaxWidth,
  QuestionOptions,
  SyncOptions,
  SyncOptionsFunction,
  OptionsLoadingState,
} from "./types";

// Config
export { AUTO_ADVANCE_CONFIG, PROGRESS_BAR_ANIMATION } from "./auto-advance-config";
