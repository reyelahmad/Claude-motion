import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, SPRINGS, springIn, tween } from "../../utils/animation";
import { COFFEE } from "./palette";

const STEAM = [
  "M80 78 C70 66 90 58 80 44 C72 33 86 26 82 18",
  "M100 74 C90 60 110 52 100 38 C92 27 106 20 102 12",
  "M120 78 C110 66 130 58 120 44 C112 33 126 26 122 18",
];

/**
 * Original coffee-cup badge, drawn in SVG. Animates on mount:
 * ring draws → cup pops → steam rises and wavers.
 */
export const CoffeeLogo: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ring = tween(frame, [0, 0.6 * fps], [0, 1], EASE.inOut);
  const cup = springIn({
    frame,
    fps,
    delay: 0.25 * fps,
    config: SPRINGS.bouncy,
  });
  const t = frame / fps;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ overflow: "visible" }}
    >
      <circle cx={100} cy={100} r={92} fill={COFFEE.espresso} opacity={ring} />
      <circle
        cx={100}
        cy={100}
        r={92}
        fill="none"
        stroke={COFFEE.caramel}
        strokeWidth={5}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - ring}
        transform="rotate(-90 100 100)"
      />
      <circle
        cx={100}
        cy={100}
        r={80}
        fill="none"
        stroke={COFFEE.caramel}
        strokeWidth={1.5}
        strokeDasharray="3 5"
        opacity={ring * 0.7}
        transform={`rotate(${t * 20} 100 100)`}
      />
      <g transform={`translate(100 125) scale(${cup}) translate(-100 -125)`}>
        <path
          d="M58 92 H138 V112 C138 136 120 152 98 152 C76 152 58 136 58 112 Z"
          fill={COFFEE.cream}
        />
        <path
          d="M138 100 C158 100 158 128 136 130"
          fill="none"
          stroke={COFFEE.cream}
          strokeWidth={8}
          strokeLinecap="round"
        />
        <path
          d="M46 162 H150"
          stroke={COFFEE.caramel}
          strokeWidth={7}
          strokeLinecap="round"
        />
        <path
          d="M64 100 H132"
          stroke={COFFEE.caramel}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.8}
        />
      </g>
      {STEAM.map((d, i) => {
        const start = 0.5 * fps + i * 3;
        const draw = tween(frame, [start, start + 0.5 * fps], [0, 1], EASE.out);
        return (
          <path
            key={d}
            d={d}
            fill="none"
            stroke={COFFEE.latte}
            strokeWidth={5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
            opacity={interpolate(draw, [0, 0.2], [0, 0.9], {
              extrapolateRight: "clamp",
            })}
            transform={`translate(${Math.sin(t * 4 + i) * 3} ${-Math.max(0, t - 0.5) * 4})`}
          />
        );
      })}
    </svg>
  );
};
