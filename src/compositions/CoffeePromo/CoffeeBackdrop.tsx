import React from "react";
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useUnit } from "../../utils/layout";
import { COFFEE } from "./palette";

const BEANS = Array.from({ length: 14 }, (_, i) => ({
  x: random(`bx${i}`),
  y: random(`by${i}`),
  size: 40 + random(`bs${i}`) * 50,
  rot: random(`br${i}`) * 360,
  speed: 0.5 + random(`bv${i}`),
}));

/** Warm gradient with slowly drifting, rotating coffee beans. */
export const CoffeeBackdrop: React.FC<{ dark?: boolean }> = ({
  dark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const u = useUnit();
  const t = frame / fps;
  const bg = dark
    ? `radial-gradient(ellipse at 50% 40%, ${COFFEE.roast} 0%, ${COFFEE.espresso} 75%)`
    : `radial-gradient(ellipse at 50% 40%, ${COFFEE.foam} 0%, ${COFFEE.cream} 55%, ${COFFEE.latte} 100%)`;

  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      {BEANS.map((b, i) => {
        const s = b.size * u;
        return (
          <svg
            key={i}
            width={s}
            height={s * 1.3}
            viewBox="0 0 40 52"
            style={{
              position: "absolute",
              left: b.x * width - s / 2,
              top:
                ((((b.y * height - t * 40 * b.speed * u) % height) + height) %
                  height) -
                s / 2,
              rotate: `${b.rot + t * 25 * b.speed}deg`,
              opacity: dark ? 0.18 : 0.14,
            }}
          >
            <ellipse
              cx={20}
              cy={26}
              rx={18}
              ry={24}
              fill={dark ? COFFEE.caramel : COFFEE.roast}
            />
            <path
              d="M20 4 C10 18 30 34 20 48"
              stroke={dark ? COFFEE.espresso : COFFEE.cream}
              strokeWidth={3}
              fill="none"
            />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};
