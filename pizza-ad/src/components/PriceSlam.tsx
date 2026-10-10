import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, COPY, MOTION, TIMING } from "../config";
import { FONTS } from "../lib/fonts";
import { springAt } from "../lib/motion";
import { LightSweep } from "./LightSweep";

/**
 * The price. With `slamAt`, it slams in (scale 2.5 → 1 with overshoot) and gets
 * a light sweep. Without it, it renders settled (used when the layout morphs).
 */
export const PriceSlam: React.FC<{
  fontSize: number;
  slamAt?: number;
  frameOffset?: number;
}> = ({ fontSize, slamAt, frameOffset = 0 }) => {
  const frame = useCurrentFrame() + frameOffset;
  const { fps } = useVideoConfig();
  const p =
    slamAt === undefined ? 1 : springAt(frame, slamAt, fps, MOTION.punch);
  const visible = slamAt === undefined || frame >= slamAt;
  const depth = fontSize / 300;

  const textStyle: React.CSSProperties = {
    fontFamily: FONTS.display,
    fontWeight: 800,
    fontSize,
    lineHeight: 1,
    color: COLORS.yellowPrimary,
    whiteSpace: "nowrap",
    paddingTop: fontSize * 0.08,
  };

  return (
    <div
      style={{
        position: "relative",
        opacity:
          slamAt === undefined
            ? 1
            : visible
              ? interpolate(frame - slamAt, [0, 2], [0, 1], {
                  extrapolateRight: "clamp",
                })
              : 0,
        scale: String(interpolate(p, [0, 1], [2.5, 1])),
      }}
    >
      <div
        style={{
          ...textStyle,
          textShadow: `0 ${10 * depth}px 0 ${COLORS.yellowGold}, 0 ${20 * depth}px 0 ${COLORS.redDeep}, 0 ${34 * depth}px ${60 * depth}px rgba(0,0,0,0.4)`,
        }}
      >
        {COPY.price}
      </div>
      {slamAt !== undefined ? (
        <LightSweep
          text={COPY.price}
          start={slamAt + TIMING.sweepDelay}
          frameOffset={frameOffset}
          style={textStyle}
        />
      ) : null}
    </div>
  );
};

/** Small "regular size" sticker that stays near the price. */
export const SizeLabel: React.FC<{
  appear?: number;
  frameOffset?: number;
  scale?: number;
}> = ({ appear, frameOffset = 0, scale = 1 }) => {
  const frame = useCurrentFrame() + frameOffset;
  const { fps } = useVideoConfig();
  const p =
    appear === undefined ? 1 : springAt(frame, appear, fps, MOTION.punch);
  return (
    <div
      style={{
        background: COLORS.cream,
        color: COLORS.redPrimary,
        fontFamily: FONTS.body,
        fontWeight: 600,
        fontSize: 34 * scale,
        padding: `${6 * scale}px ${22 * scale}px ${8 * scale}px`,
        borderRadius: 999,
        whiteSpace: "nowrap",
        boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
        scale: String(p),
      }}
    >
      {COPY.sizeLabel}
    </div>
  );
};

/** Word-by-word kinetic rise. */
export const KineticLine: React.FC<{
  text: string;
  fontSize: number;
  start?: number;
  frameOffset?: number;
  color?: string;
  font?: "display" | "body";
}> = ({
  text,
  fontSize,
  start,
  frameOffset = 0,
  color = COLORS.cream,
  font = "display",
}) => {
  const frame = useCurrentFrame() + frameOffset;
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        gap: fontSize * 0.28,
        justifyContent: "center",
        whiteSpace: "nowrap",
      }}
    >
      {text.split(" ").map((word, i) => {
        const p =
          start === undefined
            ? 1
            : springAt(frame, start + i * 4, fps, MOTION.punch);
        return (
          <span
            key={i}
            style={{
              fontFamily: font === "display" ? FONTS.display : FONTS.body,
              fontWeight: font === "display" ? 700 : 600,
              fontSize,
              lineHeight: 1.25,
              color,
              display: "inline-block",
              opacity: interpolate(p, [0, 0.4], [0, 1], {
                extrapolateRight: "clamp",
              }),
              translate: `0px ${(1 - p) * fontSize * 0.7}px`,
              textShadow: `0 ${fontSize * 0.06}px ${fontSize * 0.2}px rgba(0,0,0,0.35)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
