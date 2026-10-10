import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedText, Background } from "../../../components";
import { COLORS, FONTS, GRADIENTS } from "../../../theme";
import { EASE, tween } from "../../../utils/animation";
import { useUnit } from "../../../utils/layout";

export type IntroSceneProps = {
  readonly title: string;
  readonly subtitle: string;
  readonly accentColor: string;
};

/** Title card: letter-by-letter title, accent line wipe, word-by-word subtitle. */
export const IntroScene: React.FC<IntroSceneProps> = ({
  title,
  subtitle,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useUnit();

  const lineStart = Math.round(0.6 * fps);
  const subtitleStart = Math.round(0.9 * fps);

  return (
    <AbsoluteFill style={{ fontFamily: FONTS.body, color: COLORS.text }}>
      <Background />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80 * u,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 28 * u,
            fontWeight: 600,
            letterSpacing: 8 * u,
            textTransform: "uppercase",
            color: accentColor,
            marginBottom: 24 * u,
            opacity: tween(frame, [0, 0.5 * fps], [0, 1]),
          }}
        >
          Remotion Starter
        </div>
        <AnimatedText
          text={title}
          by="char"
          stagger={2}
          rise={80 * u}
          style={{
            fontFamily: FONTS.display,
            fontSize: 160 * u,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: -4 * u,
          }}
          unitStyle={{
            backgroundImage: GRADIENTS.brand,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        />
        <div
          style={{
            height: 8 * u,
            borderRadius: 4 * u,
            marginTop: 36 * u,
            marginBottom: 36 * u,
            background: accentColor,
            width: `${tween(frame, [lineStart, lineStart + 0.7 * fps], [0, 360], EASE.inOut) * u}px`,
          }}
        />
        <AnimatedText
          text={subtitle}
          delay={subtitleStart}
          stagger={3}
          rise={24 * u}
          style={{
            fontSize: 48 * u,
            fontWeight: 400,
            color: COLORS.muted,
            textAlign: "center",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
