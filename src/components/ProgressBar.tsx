import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { GRADIENTS } from "../theme";
import { useUnit } from "../utils/layout";

/** Thin progress indicator for the whole composition. */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const u = useUnit();
  const progress = frame / Math.max(1, durationInFrames - 1);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 6 * u,
        width: `${progress * 100}%`,
        background: GRADIENTS.brand,
      }}
    />
  );
};
