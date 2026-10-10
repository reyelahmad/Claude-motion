import { useVideoConfig } from "remotion";

/**
 * Returns a scale unit so sizes adapt to any resolution.
 * 1 unit = 1px on a 1080px short side (1920×1080, 1080×1920, 1080×1080).
 * Usage: `fontSize: 96 * u`.
 */
export const useUnit = (): number => {
  const { width, height } = useVideoConfig();
  return Math.min(width, height) / 1080;
};

/** True when the canvas is taller than it is wide. */
export const useIsPortrait = (): boolean => {
  const { width, height } = useVideoConfig();
  return height > width;
};
