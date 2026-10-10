import { FPS, secondsToFrames } from "../../config/video";

/** Scene lengths in SECONDS. Total = scenes − transitions = 5.0 s. */
export const COFFEE_TIMELINE = {
  logo: 1.8,
  message: 1.9,
  cta: 1.7,
  transitionLength: 0.2,
} as const;

export const coffeeFrames = (
  key: keyof typeof COFFEE_TIMELINE,
  fps: number = FPS,
) => secondsToFrames(COFFEE_TIMELINE[key], fps);

export const getCoffeePromoDuration = (fps: number = FPS) =>
  coffeeFrames("logo", fps) +
  coffeeFrames("message", fps) +
  coffeeFrames("cta", fps) -
  2 * coffeeFrames("transitionLength", fps);
