import { FPS, secondsToFrames } from "../../config/video";

/**
 * Showcase timing, authored in SECONDS. Edit these to change pacing; the total
 * composition duration is derived automatically (transitions overlap scenes).
 */
export const SHOWCASE_TIMELINE = {
  intro: 3.5,
  shapes: 3.5,
  typography: 3.5,
  outro: 3.2,
  transitionLength: 0.6, // seconds each transition overlaps two scenes
} as const;

const SCENE_KEYS = ["intro", "shapes", "typography", "outro"] as const;

export const sceneFrames = (
  scene: (typeof SCENE_KEYS)[number],
  fps: number = FPS,
) => secondsToFrames(SHOWCASE_TIMELINE[scene], fps);

export const transitionFrames = (fps: number = FPS) =>
  secondsToFrames(SHOWCASE_TIMELINE.transitionLength, fps);

/** Total frames = sum of scenes − overlap of each transition. */
export const getShowcaseDuration = (fps: number = FPS): number =>
  SCENE_KEYS.reduce((sum, key) => sum + sceneFrames(key, fps), 0) -
  (SCENE_KEYS.length - 1) * transitionFrames(fps);
