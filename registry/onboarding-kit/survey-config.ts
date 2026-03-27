/**
 * Centralized timing config for survey auto-advance.
 */

export const AUTO_ADVANCE_CONFIG = {
  /** Duration of the selection animation (ms). */
  ANIMATION_DURATION: 800,
  /** Total wait before auto-advancing to the next question (ms). */
  TOTAL_DELAY: 1000,
} as const;
