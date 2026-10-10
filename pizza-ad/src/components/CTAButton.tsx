import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, COPY, MOTION } from "../config";
import { FONTS } from "../lib/fonts";
import { springAt } from "../lib/motion";
import { PhoneIcon } from "./icons";

/**
 * Big yellow call button. Number groups reveal at their spoken beats; once the
 * whole number is shown the button pulses with a soft glow. The phone icon
 * rings (wiggles) once per second.
 */
export const CTAButton: React.FC<{
  appear: number;
  groupBeats: number[];
  width: number;
  height: number;
  fontSize: number;
  frameOffset?: number;
}> = ({ appear, groupBeats, width, height, fontSize, frameOffset = 0 }) => {
  const frame = useCurrentFrame() + frameOffset;
  const { fps } = useVideoConfig();
  const enter = springAt(frame, appear, fps, MOTION.punch);
  const allShown = groupBeats[groupBeats.length - 1];
  const pulseT = Math.max(0, frame - allShown);
  const pulse =
    frame >= allShown ? 0.5 - 0.5 * Math.cos((2 * Math.PI * pulseT) / 20) : 0;
  const ringPhase = Math.max(0, frame - appear) % fps;
  const ring =
    frame >= appear + 6 && ringPhase < 12
      ? Math.sin(ringPhase * 1.9) * 16 * (1 - ringPhase / 12)
      : 0;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 999,
        background: `linear-gradient(180deg, #FFD54F 0%, ${COLORS.yellowPrimary} 45%, ${COLORS.yellowGold} 100%)`,
        boxShadow: `0 12px 0 #C98700, 0 0 ${40 + pulse * 50}px rgba(255,199,44,${0.35 + pulse * 0.35}), 0 30px 60px rgba(40,0,6,0.5)`,
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "0 44px 0 30px",
        scale: String(enter * (1 + pulse * 0.04)),
        opacity: interpolate(enter, [0, 0.3], [0, 1], {
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          width: height - 52,
          height: height - 52,
          flexShrink: 0,
          borderRadius: "50%",
          background: COLORS.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          rotate: `${ring}deg`,
        }}
      >
        <PhoneIcon size={(height - 52) * 0.56} />
      </div>
      <div
        style={{
          display: "flex",
          gap: fontSize * 0.26,
          flex: 1,
          justifyContent: "center",
        }}
      >
        {COPY.phoneGroups.map((group, i) => {
          const p = springAt(frame, groupBeats[i] ?? appear, fps, MOTION.punch);
          return (
            <span
              key={i}
              style={{
                fontFamily: FONTS.display,
                fontWeight: 800,
                fontSize,
                lineHeight: 1,
                paddingTop: fontSize * 0.1,
                color: COLORS.ink,
                letterSpacing: 1,
                display: "inline-block",
                opacity: interpolate(p, [0, 0.3], [0, 1], {
                  extrapolateRight: "clamp",
                }),
                scale: String(interpolate(p, [0, 1], [0.4, 1])),
                translate: `0px ${(1 - p) * 30}px`,
              }}
            >
              {group}
            </span>
          );
        })}
      </div>
    </div>
  );
};
