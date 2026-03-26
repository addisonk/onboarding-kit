import type { MaxWidth } from "./types";

const MAX_WIDTH_MAP: Record<string, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
};

/** Convert a `MaxWidth` token to its Tailwind class (or empty string). */
export function getMaxWidthClass(maxWidth: MaxWidth | undefined): string {
  if (!maxWidth) return "";
  return MAX_WIDTH_MAP[maxWidth] ?? "";
}
