/**
 * Centralized timing & animation config for survey auto-advance.
 * Keep durations short (< 1s) so the UI feels snappy.
 */

export const AUTO_ADVANCE_CONFIG = {
  /** Duration of the selection flash animation (ms). */
  ANIMATION_DURATION: 800,
  /** Opacity keyframes for the flash. */
  ANIMATION_PATTERN: [0.4, 1, 0.4, 1] as number[],
  ANIMATION_EASING: "easeInOut" as const,

  /** Duration of the progress-bar sweep (ms). */
  PROGRESS_BAR_DURATION: 800,
  PROGRESS_BAR_COLOR: "hsl(var(--primary))",
  PROGRESS_BAR_OPACITY: 0.15,

  /** Total wait before auto-advancing to the next question (ms). */
  TOTAL_DELAY: 1000,
} as const;

export const PROGRESS_BAR_ANIMATION = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: {
    duration: AUTO_ADVANCE_CONFIG.PROGRESS_BAR_DURATION / 1000,
    ease: "linear",
  },
} as const;
