import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, COPY, MOTION, TIMING } from "../config";
import {
  ChatBubble,
  OfferCardBubble,
  TypingIndicator,
} from "../components/ChatBubble";
import {
  FireIcon,
  PersonIcon,
  PizzaIcon,
  SadFaceIcon,
  ScooterIcon,
} from "../components/icons";
import type { ResolvedAssets } from "../lib/assets";
import { FONTS } from "../lib/fonts";
import { PHONE } from "../lib/layout";
import { progress, springAt } from "../lib/motion";
import type { Timeline } from "../lib/timeline";

const BEZEL = 16;
const SCREEN_W = PHONE.width - BEZEL * 2;
const SCREEN_H = PHONE.height - BEZEL * 2;
const INPUT_H = 104;
/** Bottom edge (screen coords) of the newest message. */
const BASE_BOTTOM = SCREEN_H - INPUT_H - 34;
const GAP = 18;
/** Approximate rendered heights, used to push older bubbles up smoothly. */
const H = { hook: 152, problemA: 152, problemB: 108, offer: 228 };

/**
 * Scenes 1 + 2 (and the offer card arriving): a group chat on a phone that
 * springs up, bubbles that pop in, a slow push-in, then a whip zoom into the
 * offer card. Scenes 1 and 2 share this one phone so it stays continuous.
 */
export const ChatScene: React.FC<{
  timeline: Timeline;
  assets: ResolvedAssets;
  frameOffset?: number;
}> = ({ timeline, assets, frameOffset = 0 }) => {
  const g = useCurrentFrame() + frameOffset;
  const { fps, width } = useVideoConfig();
  const b = timeline.beats;
  const chat = COPY.chat;

  // Phone springs up from the bottom. Started 3 frames "early" so frame 0 is already moving.
  const enter = springAt(g + 3, 0, fps, { damping: 13, stiffness: 120 });
  const push = interpolate(
    progress(g, b.pushInStart, b.offerCard + 6),
    [0, 1],
    [1, 1.08],
  );
  const whip = progress(g, b.whipStart, b.whipStart + TIMING.whipFrames);
  const whipScale = 1 + Math.pow(whip, 2.2) * 7;
  const floatY = Math.sin((g / fps) * 1.6) * 6;

  // Offer card centre (phone-local) is the whip zoom target.
  const cardCx = BEZEL + 28 + 64 + 14 + 315;
  const cardCy = BEZEL + BASE_BOTTOM - H.offer / 2;

  const messages = [
    { key: "hook", appear: b.hookBubble, h: H.hook },
    { key: "a", appear: b.problemBubbles[0], h: H.problemA },
    { key: "b", appear: b.problemBubbles[1], h: H.problemB },
    { key: "offer", appear: b.offerCard, h: H.offer },
  ];
  const lift = messages.map((m) => springAt(g, m.appear, fps, MOTION.smooth));
  const bottomOf = (i: number) => {
    let offset = 0;
    for (let j = i + 1; j < messages.length; j++)
      offset += (messages[j].h + GAP) * lift[j];
    return BASE_BOTTOM - offset;
  };
  const place = (i: number): React.CSSProperties => ({
    position: "absolute",
    left: 28,
    bottom: SCREEN_H - bottomOf(i),
  });

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(whip, [0.45, 1], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: (width - PHONE.width) / 2,
          top: PHONE.top,
          width: PHONE.width,
          height: PHONE.height,
          translate: `0px ${(1 - enter) * 1300 + floatY}px`,
          rotate: `${interpolate(enter, [0, 1], [8, PHONE.tilt])}deg`,
          scale: String(push),
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            scale: String(whipScale),
            transformOrigin: `${cardCx}px ${cardCy}px`,
          }}
        >
          {/* Phone body */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 92,
              background: `linear-gradient(145deg, #2A2A2E, ${COLORS.phoneBody} 40%, #050506)`,
              boxShadow:
                "0 50px 120px rgba(40,0,6,0.65), inset 0 0 0 2px rgba(255,255,255,0.08)",
            }}
          />
          {/* Screen */}
          <div
            style={{
              position: "absolute",
              left: BEZEL,
              top: BEZEL,
              width: SCREEN_W,
              height: SCREEN_H,
              borderRadius: 78,
              overflow: "hidden",
              background: `radial-gradient(circle at 30% 20%, #2A1014, ${COLORS.chatBg} 60%)`,
              fontFamily: FONTS.body,
            }}
          >
            {/* Status bar + dynamic island */}
            <div
              style={{
                position: "absolute",
                top: 18,
                left: SCREEN_W / 2 - 70,
                width: 140,
                height: 38,
                borderRadius: 20,
                background: "#000",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 22,
                left: 56,
                color: COLORS.cream,
                fontSize: 26,
                fontWeight: 600,
              }}
            >
              9:41
            </div>
            <div
              style={{
                position: "absolute",
                top: 28,
                right: 56,
                width: 44,
                height: 20,
                borderRadius: 6,
                border: `2px solid ${COLORS.cream}`,
                opacity: 0.85,
              }}
            >
              <div
                style={{
                  margin: 2,
                  width: 30,
                  height: 12,
                  borderRadius: 3,
                  background: COLORS.cream,
                }}
              />
            </div>
            {/* Chat header */}
            <div
              style={{
                position: "absolute",
                top: 72,
                left: 0,
                right: 0,
                height: 112,
                background: COLORS.chatHeader,
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "0 30px",
                borderBottom: "1px solid rgba(255,248,231,0.08)",
              }}
            >
              <svg width={22} height={36} viewBox="0 0 12 20">
                <path
                  d="M10 2 2 10l8 8"
                  stroke={COLORS.yellowPrimary}
                  strokeWidth={2.6}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div style={{ display: "flex" }}>
                {[COLORS.redBright, COLORS.yellowGold, "#7A3CFF"].map(
                  (c, i) => (
                    <div
                      key={c}
                      style={{
                        width: 62,
                        height: 62,
                        borderRadius: "50%",
                        background: `linear-gradient(160deg, ${c}, ${COLORS.redDeep})`,
                        border: `3px solid ${COLORS.chatHeader}`,
                        marginLeft: i === 0 ? 0 : -20,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <PersonIcon size={50} />
                    </div>
                  ),
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: COLORS.cream,
                  fontSize: 44,
                  fontWeight: 600,
                }}
              >
                {chat.groupName}
                <FireIcon
                  size={42}
                  style={{ scale: String(1 + Math.sin(g * 0.5) * 0.06) }}
                />
              </div>
            </div>

            {/* Messages */}
            <div style={place(0)}>
              <TypingIndicator
                start={b.typingStart}
                end={b.hookBubble}
                frameOffset={frameOffset}
              />
            </div>
            {g >= b.hookBubble ? (
              <div style={place(0)}>
                <ChatBubble
                  appear={b.hookBubble}
                  frameOffset={frameOffset}
                  sender={chat.hook.sender}
                  text={chat.hook.text}
                />
              </div>
            ) : null}
            {g >= b.problemBubbles[0] ? (
              <div style={place(1)}>
                <ChatBubble
                  appear={b.problemBubbles[0]}
                  frameOffset={frameOffset}
                  sender={chat.problem[0].sender}
                  senderColor="#C2185B"
                  text={chat.problem[0].text}
                  icon={<SadFaceIcon size={54} />}
                />
              </div>
            ) : null}
            {g >= b.problemBubbles[1] ? (
              <div style={place(2)}>
                <ChatBubble
                  appear={b.problemBubbles[1]}
                  frameOffset={frameOffset}
                  text={chat.problem[1].text}
                />
              </div>
            ) : null}
            {g >= b.offerCard ? (
              <div style={{ ...place(3), left: 28 }}>
                <OfferCardBubble
                  appear={b.offerCard}
                  frameOffset={frameOffset}
                  title={chat.offerCard.title}
                  subtitle={chat.offerCard.subtitle}
                  logoSrc={assets.logo}
                  pizzaIcon={<PizzaIcon size={92} />}
                  scooterIcon={<ScooterIcon size={46} color={COLORS.redDeep} />}
                />
              </div>
            ) : null}

            {/* Input bar */}
            <div
              style={{
                position: "absolute",
                left: 24,
                right: 24,
                bottom: 28,
                height: INPUT_H - 24,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "100%",
                  borderRadius: 999,
                  background: "rgba(255,248,231,0.08)",
                  border: "1px solid rgba(255,248,231,0.12)",
                }}
              />
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: COLORS.yellowPrimary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width={34} height={34} viewBox="0 0 24 24">
                  <path d="M3 20.5 21 12 3 3.5l2.5 8.5z" fill={COLORS.ink} />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
