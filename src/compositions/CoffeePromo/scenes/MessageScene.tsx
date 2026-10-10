import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONTS } from "../../../theme";
import { EASE, SPRINGS, springIn, tween } from "../../../utils/animation";
import { useUnit } from "../../../utils/layout";
import { CoffeeBackdrop } from "../CoffeeBackdrop";
import { COFFEE } from "../palette";

/** Scene 2: three lines slide in with a caramel underline, then an offer badge pops. */
export const MessageScene: React.FC<{ lines: string[]; offer: string }> = ({
  lines,
  offer,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useUnit();
  const offerIn = springIn({
    frame,
    fps,
    delay: 1.0 * fps,
    config: SPRINGS.bouncy,
  });

  return (
    <AbsoluteFill style={{ color: COFFEE.cream }}>
      <CoffeeBackdrop dark />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", gap: 36 * u }}
      >
        {lines.map((line, i) => {
          const delay = 0.1 * fps + i * 0.22 * fps;
          const p = springIn({ frame, fps, delay, config: SPRINGS.snappy });
          const underline = tween(
            frame,
            [delay + 4, delay + 0.35 * fps],
            [0, 1],
            EASE.inOut,
          );
          return (
            <div
              key={i}
              style={{
                position: "relative",
                fontFamily: FONTS.serif,
                fontSize: 120 * u,
                fontWeight: i === 1 ? 800 : 500,
                fontStyle: i === 1 ? "italic" : "normal",
                color: i === 1 ? COFFEE.caramel : COFFEE.cream,
                opacity: interpolate(p, [0, 0.5], [0, 1], {
                  extrapolateRight: "clamp",
                }),
                translate: `${(1 - p) * (i % 2 === 0 ? -160 : 160) * u}px 0px`,
              }}
            >
              {line}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -6 * u,
                  height: 6 * u,
                  borderRadius: 3 * u,
                  background: COFFEE.caramel,
                  opacity: 0.6,
                  scale: `${underline} 1`,
                  transformOrigin: "left center",
                }}
              />
            </div>
          );
        })}
        <div
          style={{
            marginTop: 70 * u,
            padding: `${28 * u}px ${56 * u}px`,
            borderRadius: 999,
            background: COFFEE.caramel,
            color: COFFEE.espresso,
            fontFamily: FONTS.body,
            fontSize: 54 * u,
            fontWeight: 800,
            scale: String(offerIn),
            rotate: `${(1 - offerIn) * -12 - 3}deg`,
            boxShadow: `0 ${18 * u}px ${50 * u}px rgba(0,0,0,0.35)`,
          }}
        >
          {offer}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
