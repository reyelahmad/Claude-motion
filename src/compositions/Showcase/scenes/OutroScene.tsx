import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedText, Background } from "../../../components";
import { COLORS, FONTS, GRADIENTS } from "../../../theme";
import { EASE, SPRINGS, springIn, tween } from "../../../utils/animation";
import { useUnit } from "../../../utils/layout";

export type OutroSceneProps = {
  readonly outroTitle: string;
  readonly outroCta: string;
  readonly accentColor: string;
};

/** Closing card: expanding ring, title reveal, CTA pill, fade to black. */
export const OutroScene: React.FC<OutroSceneProps> = ({
  outroTitle,
  outroCta,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const u = useUnit();

  const ring = springIn({
    frame,
    fps,
    config: SPRINGS.smooth,
    durationInFrames: Math.round(1.2 * fps),
  });
  const pill = springIn({
    frame,
    fps,
    delay: Math.round(0.8 * fps),
    config: SPRINGS.bouncy,
  });
  const fadeOut = tween(
    frame,
    [durationInFrames - 0.6 * fps, durationInFrames - 1],
    [1, 0],
    EASE.in,
  );

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONTS.body,
        color: COLORS.text,
        opacity: fadeOut,
        backgroundColor: "black",
      }}
    >
      <Background hue="#2A1230" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            width: 900 * u,
            height: 900 * u,
            borderRadius: "50%",
            border: `${4 * u}px solid ${accentColor}`,
            opacity: 0.35 * (1 - ring * 0.5),
            scale: String(0.2 + ring * 0.8),
          }}
        />
        <AnimatedText
          text={outroTitle}
          rise={50 * u}
          style={{
            fontFamily: FONTS.display,
            fontSize: 120 * u,
            fontWeight: 700,
            textAlign: "center",
          }}
        />
        <div
          style={{
            marginTop: 48 * u,
            padding: `${20 * u}px ${44 * u}px`,
            borderRadius: 999,
            background: GRADIENTS.brand,
            fontFamily: "monospace",
            fontSize: 40 * u,
            fontWeight: 600,
            scale: String(pill),
            boxShadow: `0 ${20 * u}px ${60 * u}px ${COLORS.primary}55`,
          }}
        >
          {outroCta}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
