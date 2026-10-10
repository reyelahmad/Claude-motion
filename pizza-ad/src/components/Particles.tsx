import React from "react";
import { random, useCurrentFrame } from "remotion";
import { COLORS } from "../config";

const PALETTE = [
  COLORS.yellowPrimary,
  COLORS.cream,
  COLORS.yellowGold,
  COLORS.yellowPrimary,
];

/** Deterministic radial burst of dots from (x, y), starting at a global frame. */
export const Particles: React.FC<{
  x: number;
  y: number;
  start: number;
  frameOffset?: number;
  count?: number;
  lifetime?: number;
  seed?: string;
}> = ({
  x,
  y,
  start,
  frameOffset = 0,
  count = 44,
  lifetime = 28,
  seed = "burst",
}) => {
  const frame = useCurrentFrame() + frameOffset;
  const t = frame - start;
  if (t < 0 || t > lifetime) return null;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const angle = random(`${seed}-a${i}`) * Math.PI * 2;
        const speed = 18 + random(`${seed}-s${i}`) * 26;
        const size = 8 + random(`${seed}-z${i}`) * 16;
        const k = 0.12;
        const dist = (speed * (1 - Math.exp(-k * t))) / k;
        const px = x + Math.cos(angle) * dist;
        const py = y + Math.sin(angle) * dist + 0.35 * t * t;
        const life = t / lifetime;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px - size / 2,
              top: py - size / 2,
              width: size,
              height: size,
              borderRadius: i % 5 === 0 ? 3 : "50%",
              background: PALETTE[i % PALETTE.length],
              opacity: 1 - life * life,
              scale: String(1 - life * 0.6),
            }}
          />
        );
      })}
    </div>
  );
};
