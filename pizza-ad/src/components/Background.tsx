import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../config";

/**
 * Premium red stage: radial gradient, slow-rotating soft light shape,
 * a drifting glow (parallax layer), vignette and subtle animated grain.
 */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const glowX = width * (0.5 + Math.sin(t * 0.45) * 0.12);
  const glowY = height * (0.42 + Math.cos(t * 0.35) * 0.06);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, ${COLORS.redBright} 0%, ${COLORS.redPrimary} 45%, ${COLORS.redDeep} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Slow-rotating soft light rays behind the subject */}
      <div
        style={{
          position: "absolute",
          left: width / 2 - 1100,
          top: height * 0.42 - 1100,
          width: 2200,
          height: 2200,
          borderRadius: "50%",
          background: `conic-gradient(from 0deg, ${COLORS.yellowPrimary}00 0deg, ${COLORS.yellowPrimary}1A 45deg, ${COLORS.yellowPrimary}00 90deg, ${COLORS.cream}12 135deg, ${COLORS.cream}00 180deg, ${COLORS.yellowPrimary}17 225deg, ${COLORS.yellowPrimary}00 270deg, ${COLORS.cream}10 315deg, ${COLORS.yellowPrimary}00 360deg)`,
          maskImage:
            "radial-gradient(circle, rgba(0,0,0,0.6) 0%, black 25%, transparent 66%)",
          rotate: `${t * 9}deg`,
        }}
      />
      {/* Drifting warm glow (parallax) */}
      <div
        style={{
          position: "absolute",
          left: glowX - 600,
          top: glowY - 600,
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.redBright}AA 0%, ${COLORS.redBright}33 35%, transparent 70%)`,
        }}
      />
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 45%, transparent 45%, ${COLORS.redDeep}CC 100%)`,
        }}
      />
      {/* Grain */}
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          mixBlendMode: "overlay",
        }}
      >
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed={Math.floor(frame / 2)}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
