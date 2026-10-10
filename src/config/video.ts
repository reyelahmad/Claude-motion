/**
 * Global video settings. Change these to re-target every composition that
 * uses the defaults. Scene timing is authored in seconds and converted with
 * the active fps, so changing FPS keeps the same real-world timing.
 */

export const FPS = 30;

export const FORMATS = {
  landscape: { width: 1920, height: 1080 }, // 16:9 — YouTube, web
  portrait: { width: 1080, height: 1920 }, // 9:16 — Reels, Shorts, TikTok
  square: { width: 1080, height: 1080 }, // 1:1  — feed posts
} as const;

export type FormatName = keyof typeof FORMATS;

export const DEFAULT_FORMAT: FormatName = "landscape";

/** Convert seconds to a whole number of frames. */
export const secondsToFrames = (seconds: number, fps: number = FPS): number =>
  Math.round(seconds * fps);
