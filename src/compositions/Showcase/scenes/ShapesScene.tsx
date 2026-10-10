import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { AnimatedShape, AnimatedText, Background } from "../../../components";
import { COLORS, FONTS } from "../../../theme";
import { stagger } from "../../../utils/animation";
import { useIsPortrait, useUnit } from "../../../utils/layout";

export type ShapesSceneProps = {
  readonly accentColor: string;
};

/** Staggered, springy shape entrances with idle float + spin. */
export const ShapesScene: React.FC<ShapesSceneProps> = ({ accentColor }) => {
  const { width, height, fps } = useVideoConfig();
  const u = useUnit();
  const portrait = useIsPortrait();
  const step = Math.round(0.15 * fps);
  const cy = portrait ? height * 0.55 : height * 0.58;
  const spread = portrait ? width * 0.22 : width * 0.16;
  // Size shapes relative to their spacing so they never overlap in any format.
  const base = spread * 0.68;

  return (
    <AbsoluteFill style={{ fontFamily: FONTS.body, color: COLORS.text }}>
      <Background hue="#1A1438" />
      <AbsoluteFill
        style={{ alignItems: "center", paddingTop: (portrait ? 360 : 140) * u }}
      >
        <AnimatedText
          text="Shapes in motion"
          rise={40 * u}
          style={{
            fontFamily: FONTS.display,
            fontSize: 96 * u,
            fontWeight: 700,
          }}
        />
        <AnimatedText
          text="Springs, easing and stagger — all frame-driven"
          delay={Math.round(0.4 * fps)}
          rise={20 * u}
          style={{
            fontSize: 38 * u,
            color: COLORS.muted,
            marginTop: 16 * u,
            textAlign: "center",
          }}
        />
      </AbsoluteFill>
      <AnimatedShape
        kind="circle"
        size={base * 0.9}
        color={COLORS.primary}
        x={width / 2 - spread * 1.5}
        y={cy}
        delay={stagger(0, step, 8)}
      />
      <AnimatedShape
        kind="triangle"
        size={base}
        color={COLORS.secondary}
        x={width / 2 - spread * 0.5}
        y={cy}
        delay={stagger(1, step, 8)}
        spin={-25}
      />
      <AnimatedShape
        kind="star"
        size={base * 1.1}
        color={COLORS.warm}
        x={width / 2 + spread * 0.5}
        y={cy}
        delay={stagger(2, step, 8)}
        spin={35}
      />
      <AnimatedShape
        kind="square"
        size={base * 0.85}
        color={accentColor}
        x={width / 2 + spread * 1.5}
        y={cy}
        delay={stagger(3, step, 8)}
        spin={-15}
      />
    </AbsoluteFill>
  );
};
