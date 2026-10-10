import React from "react";
import { useCurrentFrame } from "remotion";
import { progress } from "../lib/motion";

/**
 * A glossy sheen that sweeps across text. Renders an overlay copy of the text
 * whose fill is a moving highlight band, clipped to the glyphs.
 */
export const LightSweep: React.FC<{
  text: string;
  /** Global frame the sweep starts. */
  start: number;
  frameOffset?: number;
  durationInFrames?: number;
  style: React.CSSProperties;
}> = ({ text, start, frameOffset = 0, durationInFrames = 14, style }) => {
  const frame = useCurrentFrame() + frameOffset;
  const p = progress(frame, start, start + durationInFrames);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      aria-hidden
      style={{
        ...style,
        position: "absolute",
        inset: 0,
        textShadow: "none",
        color: "transparent",
        backgroundImage:
          "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.95) 50%, transparent 62%)",
        backgroundSize: "300% 100%",
        backgroundPosition: `${120 - p * 140}% 0%`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
      }}
    >
      {text}
    </div>
  );
};
