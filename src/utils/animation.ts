import {
  Easing,
  interpolate,
  spring,
  type EasingFunction,
  type SpringConfig,
} from "remotion";

/**
 * Animation helpers. Everything is driven by the current frame — never use
 * CSS transitions/animations, they do not render deterministically.
 */

export const EASE = {
  /** Fast start, soft landing. Good default for entrances. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Symmetric ease for movements between two states. */
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** Slow start, fast end. Good for exits. */
  in: Easing.bezier(0.7, 0, 0.84, 0),
} as const;

export const SPRINGS = {
  /** No bounce, smooth settle. */
  smooth: { damping: 200 },
  /** Light, lively bounce. */
  snappy: { damping: 20, stiffness: 200 },
  /** Playful overshoot. */
  bouncy: { damping: 8 },
} as const satisfies Record<string, Partial<SpringConfig>>;

/** interpolate() with clamping on both sides and an optional easing. */
export const tween = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing: EasingFunction = EASE.out,
): number =>
  interpolate(frame, input, output, {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** 0 → 1 progress of a spring that starts at `delay` frames. */
export const springIn = ({
  frame,
  fps,
  delay = 0,
  config = SPRINGS.smooth,
  durationInFrames,
}: {
  frame: number;
  fps: number;
  delay?: number;
  config?: Partial<SpringConfig>;
  durationInFrames?: number;
}): number => spring({ frame: frame - delay, fps, config, durationInFrames });

/**
 * Opacity that fades in at the start and out at the end of a window.
 * Useful for whole scenes or overlays.
 */
export const fadeInOut = (
  frame: number,
  durationInFrames: number,
  fadeFrames: number,
): number =>
  interpolate(
    frame,
    [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

/** Delay for the n-th item of a staggered group. */
export const stagger = (index: number, step: number, start = 0): number =>
  start + index * step;
