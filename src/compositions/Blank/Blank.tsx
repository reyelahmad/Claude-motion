import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedText, Background } from "../../components";
import { COLORS, FONTS } from "../../theme";
import { tween } from "../../utils/animation";
import { useUnit } from "../../utils/layout";

export type BlankProps = {
  readonly text: string;
};

/**
 * Minimal starting point. `npm run new -- MyVideo` copies this file into
 * src/compositions/MyVideo/ and registers it in src/Root.tsx.
 */
export const Blank: React.FC<BlankProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const u = useUnit();

  return (
    <AbsoluteFill style={{ fontFamily: FONTS.body, color: COLORS.text }}>
      <Background />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: tween(
            frame,
            [durationInFrames - 0.5 * fps, durationInFrames - 1],
            [1, 0],
          ),
        }}
      >
        <AnimatedText
          text={text}
          style={{
            fontFamily: FONTS.display,
            fontSize: 120 * u,
            fontWeight: 700,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
