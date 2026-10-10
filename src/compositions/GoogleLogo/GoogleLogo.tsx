import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONTS } from "../../theme";
import { EASE, SPRINGS, springIn, tween } from "../../utils/animation";
import { useUnit } from "../../utils/layout";

export type GoogleLogoProps = {
  readonly wordmark: string;
};

const BLUE = "#4285F4";
const RED = "#EA4335";
const YELLOW = "#FBBC05";
const GREEN = "#34A853";

const DOT_COLORS = [BLUE, RED, YELLOW, GREEN];
// Letter colors of the wordmark: G o o g l e.
const LETTER_COLORS = [BLUE, RED, YELLOW, BLUE, GREEN, RED];

/**
 * 2-second logo sting: four brand dots bounce in, pop, and each letter of the
 * wordmark springs out of a colored dot. A four-color bar then sweeps out under it.
 */
export const GoogleLogo: React.FC<GoogleLogoProps> = ({ wordmark }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useUnit();

  // Beat timing in seconds.
  const lettersStart = 0.6 * fps;
  const barStart = 1.1 * fps;

  const dotsOut = tween(
    frame,
    [lettersStart - 4, lettersStart + 4],
    [1, 0],
    EASE.in,
  );
  const letters = Array.from(wordmark);
  const settle = tween(frame, [barStart, 2 * fps], [1, 1.04], EASE.inOut);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, #FFFFFF 40%, #F1F3F4 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONTS.google,
      }}
    >
      {/* Phase 1: bouncing loader dots */}
      <div
        style={{
          position: "absolute",
          display: "flex",
          gap: 34 * u,
          scale: String(dotsOut),
        }}
      >
        {DOT_COLORS.map((color, i) => {
          const enter = springIn({
            frame,
            fps,
            delay: i * 3,
            config: SPRINGS.bouncy,
          });
          const bounce =
            Math.max(0, Math.sin(((frame - i * 3) / fps) * Math.PI * 3)) *
            50 *
            u;
          return (
            <div
              key={color}
              style={{
                width: 44 * u,
                height: 44 * u,
                borderRadius: "50%",
                background: color,
                scale: String(enter),
                translate: `0px ${-bounce * Math.min(1, enter)}px`,
              }}
            />
          );
        })}
      </div>

      {/* Phase 2 + 3: wordmark and color bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          scale: String(settle),
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          {letters.map((letter, i) => {
            const color = LETTER_COLORS[i % LETTER_COLORS.length];
            const delay = lettersStart + i * 2;
            const p = springIn({ frame, fps, delay, config: SPRINGS.snappy });
            const dot = interpolate(
              frame,
              [delay - 3, delay + 1, delay + 7],
              [0, 1, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );
            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    width: 60 * u,
                    height: 60 * u,
                    marginTop: -30 * u,
                    borderRadius: "50%",
                    background: color,
                    scale: String(dot),
                  }}
                />
                <span
                  style={{
                    color,
                    fontSize: 250 * u,
                    fontWeight: 500,
                    lineHeight: 1,
                    letterSpacing: -4 * u,
                    opacity: interpolate(p, [0, 0.4], [0, 1], {
                      extrapolateRight: "clamp",
                    }),
                    scale: String(0.3 + 0.7 * p),
                    translate: `0px ${(1 - p) * 70 * u}px`,
                  }}
                >
                  {letter}
                </span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40 * u,
            height: 12 * u,
            borderRadius: 6 * u,
            overflow: "hidden",
            width:
              tween(
                frame,
                [barStart, barStart + 0.45 * fps],
                [0, 560],
                EASE.out,
              ) * u,
          }}
        >
          {DOT_COLORS.map((color) => (
            <div key={color} style={{ flex: 1, background: color }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
