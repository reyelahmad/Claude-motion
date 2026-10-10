import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../theme";
import { useUnit } from "../utils/layout";

type Orb = { x: number; y: number; size: number; color: string; speed: number };

const ORBS: Orb[] = [
  { x: 0.2, y: 0.25, size: 700, color: COLORS.primary, speed: 1 },
  { x: 0.8, y: 0.7, size: 800, color: COLORS.secondary, speed: 0.7 },
  { x: 0.65, y: 0.15, size: 500, color: COLORS.accent, speed: 1.3 },
];

/**
 * Dark gradient backdrop with slowly drifting glow orbs and a faint grid.
 * Motion is frame-driven, so it loops seamlessly across scenes.
 */
export const Background: React.FC<{ hue?: string }> = ({
  hue = COLORS.backgroundAlt,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const u = useUnit();
  const t = frame / fps;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${hue} 0%, ${COLORS.background} 70%)`,
        overflow: "hidden",
      }}
    >
      {ORBS.map((orb, i) => {
        const dx = Math.sin(t * 0.4 * orb.speed + i) * 80 * u;
        const dy = Math.cos(t * 0.3 * orb.speed + i * 2) * 60 * u;
        const size = orb.size * u;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: orb.x * width - size / 2 + dx,
              top: orb.y * height - size / 2 + dy,
              width: size,
              height: size,
              // Radial gradient instead of filter: blur() — same glow, far cheaper to render.
              background: `radial-gradient(circle, ${orb.color}40 0%, ${orb.color}14 40%, transparent 70%)`,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${COLORS.text}0A 1px, transparent 1px), linear-gradient(90deg, ${COLORS.text}0A 1px, transparent 1px)`,
          backgroundSize: `${80 * u}px ${80 * u}px`,
          backgroundPosition: `0px ${interpolate(frame, [0, 10 * fps], [0, 80 * u])}px`,
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
    </AbsoluteFill>
  );
};
