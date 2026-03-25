import type { z } from "zod";

export interface CardOption {
  value: string;
  label: string;
  description?: string;
  imageUrl?: string;
}

export interface BaseOption {
  value: string | boolean;
  label: string;
  imageUrl?: string;
  emoji?: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

export type SyncOptions<T = BaseOption> = T[];
export type SyncOptionsFunction<T = BaseOption, A = any> = (attrs: A) => T[];
export type QuestionOptions<T = BaseOption, A = any> =
  | SyncOptions<T>
  | SyncOptionsFunction<T, A>;

export interface OptionsLoadingState<T = BaseOption> {
  options: T[];
  loading: boolean;
  error: string | null;
}

export type MaxWidth =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | false;

export interface QuestionConfig<A = any> {
  id: keyof A & string;
  title: string;
  description?: string;
  type: "text" | "number" | "radio" | "boolean" | "card-checkbox";
  options?: QuestionOptions<any, A>;
  condition?: (attributes: A) => boolean;
  optional?: boolean;
  maxWidth?: MaxWidth;
  /** Radio display style — "button" (vertical list) or "card" (2-col grid). */
  variant?: "button" | "card";
  /** Rotating typewriter placeholders for text inputs. */
  placeholders?: string[];
  cardCheckboxProps?: {
    singleSelection?: boolean;
  };
  validationSchema?: z.ZodSchema;
  validationErrorMessage?: string;
}
