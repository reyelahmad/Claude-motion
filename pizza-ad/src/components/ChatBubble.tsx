import React from "react";
import {
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, MOTION } from "../config";
import { FONTS } from "../lib/fonts";
import { springAt } from "../lib/motion";

export type ChatBubbleProps = {
  /** Global frame at which the bubble pops in. */
  appear: number;
  /** Global frame offset of the parent sequence. */
  frameOffset?: number;
  sender?: string;
  senderColor?: string;
  text: string;
  /** Inline icon after the text. */
  icon?: React.ReactNode;
  /** Small avatar to the left (32–60 px circle). */
  avatar?: React.ReactNode;
};

/** Received chat bubble that pops in with scale overshoot from its tail corner. */
export const ChatBubble: React.FC<ChatBubbleProps> = ({
  appear,
  frameOffset = 0,
  sender,
  senderColor = COLORS.redPrimary,
  text,
  icon,
  avatar,
}) => {
  const frame = useCurrentFrame() + frameOffset;
  const { fps } = useVideoConfig();
  const p = springAt(frame, appear, fps, MOTION.punch);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
      {avatar}
      <div
        style={{
          background: COLORS.cream,
          color: COLORS.ink,
          borderRadius: 30,
          borderBottomLeftRadius: 8,
          padding: "18px 30px 22px",
          maxWidth: 650,
          fontFamily: FONTS.body,
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          transformOrigin: "left bottom",
          scale: String(p),
          opacity: interpolate(p, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        {sender ? (
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: senderColor,
              marginBottom: 2,
            }}
          >
            {sender}
          </div>
        ) : null}
        <div
          style={{
            fontSize: 50,
            fontWeight: 600,
            lineHeight: 1.3,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span>{text}</span>
          {icon}
        </div>
      </div>
    </div>
  );
};

/** Three bouncing dots in a bubble. */
export const TypingIndicator: React.FC<{
  start: number;
  end: number;
  frameOffset?: number;
}> = ({ start, end, frameOffset = 0 }) => {
  const frame = useCurrentFrame() + frameOffset;
  if (frame < start || frame >= end) return null;
  const local = frame - start;
  return (
    <div
      style={{
        display: "inline-flex",
        gap: 10,
        padding: "26px 30px",
        background: COLORS.cream,
        borderRadius: 30,
        borderBottomLeftRadius: 8,
        scale: String(Math.min(1, 0.6 + local * 0.12)),
        transformOrigin: "left bottom",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: COLORS.redPrimary,
            opacity: 0.85,
            translate: `0px ${-Math.max(0, Math.sin((local - i * 2) * 0.7)) * 10}px`,
          }}
        />
      ))}
    </div>
  );
};

/** Brand offer card that arrives in the chat (yellow, with pizza icon). */
export const OfferCardBubble: React.FC<{
  appear: number;
  frameOffset?: number;
  title: string;
  subtitle: string;
  logoSrc: string;
  pizzaIcon: React.ReactNode;
  scooterIcon: React.ReactNode;
}> = ({
  appear,
  frameOffset = 0,
  title,
  subtitle,
  logoSrc,
  pizzaIcon,
  scooterIcon,
}) => {
  const frame = useCurrentFrame() + frameOffset;
  const { fps } = useVideoConfig();
  const p = springAt(frame, appear, fps, MOTION.punch);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#FFFFFF",
          padding: 8,
          flexShrink: 0,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <Img
          src={staticFile(logoSrc)}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <div
        style={{
          width: 630,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "22px 26px",
          borderRadius: 30,
          borderBottomLeftRadius: 8,
          background: `linear-gradient(160deg, #FFD54F, ${COLORS.yellowPrimary} 50%, ${COLORS.yellowGold})`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          transformOrigin: "left bottom",
          scale: String(p),
          opacity: interpolate(p, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        {pizzaIcon}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              fontFamily: FONTS.display,
              fontWeight: 800,
              fontSize: 48,
              lineHeight: 1.15,
              color: COLORS.ink,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: FONTS.body,
              fontWeight: 600,
              fontSize: 34,
              color: COLORS.redDeep,
            }}
          >
            {scooterIcon}
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};
