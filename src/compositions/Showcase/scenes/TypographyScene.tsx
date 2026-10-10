import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../../../components";
import { COLORS, FONTS } from "../../../theme";
import { EASE, SPRINGS, springIn, tween } from "../../../utils/animation";
import { useIsPortrait, useUnit } from "../../../utils/layout";

export type TypographySceneProps = {
  readonly keywords: string[];
  readonly accentColor: string;
};

/**
 * Kinetic typography: each keyword slams in, gets a highlight bar sweep,
 * then dims as the next one arrives.
 */
export const TypographyScene: React.FC<TypographySceneProps> = ({
  keywords,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useUnit();
  const portrait = useIsPortrait();
  const gap = Math.round(0.6 * fps);
  const start = Math.round(0.2 * fps);

  return (
    <AbsoluteFill style={{ fontFamily: FONTS.display, color: COLORS.text }}>
      <Background hue="#0E2433" />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: portrait ? "column" : "row",
          gap: 56 * u,
        }}
      >
        {keywords.map((word, i) => {
          const delay = start + i * gap;
          const p = springIn({ frame, fps, delay, config: SPRINGS.snappy });
          const isLatest =
            i === keywords.length - 1 || frame < start + (i + 1) * gap;
          const highlight = tween(
            frame,
            [delay + 6, delay + 6 + 0.4 * fps],
            [0, 1],
            EASE.inOut,
          );
          return (
            <div
              key={word + i}
              style={{ position: "relative", opacity: Math.min(1, p * 1.5) }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -12 * u,
                  right: -12 * u,
                  bottom: 18 * u,
                  height: 36 * u,
                  background: accentColor,
                  opacity: 0.85,
                  transformOrigin: "left center",
                  scale: `${highlight} 1`,
                  borderRadius: 6 * u,
                }}
              />
              <div
                style={{
                  position: "relative",
                  fontSize: 132 * u,
                  fontWeight: 700,
                  letterSpacing: -3 * u,
                  scale: String(0.6 + 0.4 * p),
                  translate: `0px ${(1 - p) * 60 * u}px`,
                  color: isLatest ? COLORS.text : COLORS.muted,
                }}
              >
                {word}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
