import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SPRINGS, springIn } from "../utils/animation";

export type AnimatedTextProps = {
  readonly text: string;
  /** Animate per word or per character. */
  readonly by?: "word" | "char";
  /** Frame (relative to the parent sequence) at which the first unit starts. */
  readonly delay?: number;
  /** Frames between each unit's start. */
  readonly stagger?: number;
  /** Vertical travel distance in px before scaling. */
  readonly rise?: number;
  readonly style?: React.CSSProperties;
  /** Optional style applied to each animated unit (e.g. gradient text). */
  readonly unitStyle?: React.CSSProperties;
};

/**
 * Kinetic typography: splits text into words or characters and reveals each
 * with a staggered spring (rise + fade + un-blur).
 */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  by = "word",
  delay = 0,
  stagger = by === "word" ? 4 : 2,
  rise = 40,
  style,
  unitStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const units = by === "word" ? text.split(" ") : Array.from(text);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        ...style,
      }}
    >
      {units.map((unit, i) => {
        const p = springIn({
          frame,
          fps,
          delay: delay + i * stagger,
          config: SPRINGS.snappy,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: interpolate(p, [0, 0.6], [0, 1], {
                extrapolateRight: "clamp",
              }),
              translate: `0px ${(1 - p) * rise}px`,
              filter: `blur(${(1 - Math.min(p, 1)) * 8}px)`,
              ...unitStyle,
            }}
          >
            {unit}
            {by === "word" && i < units.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};
