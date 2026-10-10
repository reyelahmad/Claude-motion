import { interpolate, spring } from "remotion";
import { MOTION } from "../config";

type SpringCfg = { damping: number; stiffness?: number; mass?: number };

/** Spring progress that starts at `start` (global frame). 0 before it. */
export const springAt = (
  frame: number,
  start: number,
  fps: number,
  config: SpringCfg = MOTION.punch,
) => (frame < start ? 0 : spring({ frame: frame - start, fps, config }));

/** Clamped linear progress 0 → 1 between two frames. */
export const progress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Linear mix between a and b. */
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
