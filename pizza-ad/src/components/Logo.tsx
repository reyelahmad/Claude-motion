import React from "react";
import {
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MOTION } from "../config";
import { LOGO_LAYOUT } from "../lib/layout";
import { springAt } from "../lib/motion";

/**
 * Brand logo. Pops in small in the top-left corner when the offer stage is
 * revealed, then grows to the upper centre for the call to action.
 * `objectFit: contain` keeps the original aspect ratio; it is never recoloured.
 */
export const Logo: React.FC<{
  src: string;
  appear: number;
  toCenterAt: number;
}> = ({ src, appear, toCenterAt }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  if (frame < appear) return null;
  const pop = springAt(frame, appear, fps, MOTION.punch);
  const m = springAt(frame, toCenterAt, fps, MOTION.settle);
  const { small, big } = LOGO_LAYOUT;
  const w = interpolate(m, [0, 1], [small.width, big.width]);
  const h = interpolate(m, [0, 1], [small.height, big.height]);
  const left = interpolate(m, [0, 1], [small.left, (width - big.width) / 2]);
  const top = interpolate(m, [0, 1], [small.top, big.top]);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: w,
        height: h,
        scale: String(pop),
        transformOrigin: m > 0.5 ? "center" : "left center",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: m > 0.5 ? "center" : "left center",
          filter: "drop-shadow(0 8px 18px rgba(40,0,6,0.45))",
        }}
      />
    </div>
  );
};
