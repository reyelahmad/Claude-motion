import { Circle, Rect, Star, Triangle } from "@remotion/shapes";
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SPRINGS, springIn } from "../utils/animation";

export type ShapeKind = "circle" | "triangle" | "star" | "square";

export type AnimatedShapeProps = {
  readonly kind: ShapeKind;
  /** Size in px (diameter / side length). */
  readonly size: number;
  readonly color: string;
  /** Center position in px. */
  readonly x: number;
  readonly y: number;
  readonly delay?: number;
  /** Degrees per second of continuous rotation after the entrance. */
  readonly spin?: number;
  /** Amplitude in px of the idle floating motion. */
  readonly float?: number;
};

const ShapeSvg: React.FC<{ kind: ShapeKind; size: number; color: string }> = ({
  kind,
  size,
  color,
}) => {
  switch (kind) {
    case "circle":
      return <Circle radius={size / 2} fill={color} />;
    case "triangle":
      return (
        <Triangle
          length={size}
          direction="up"
          fill={color}
          cornerRadius={size * 0.08}
        />
      );
    case "star":
      return (
        <Star
          points={5}
          innerRadius={size * 0.22}
          outerRadius={size / 2}
          fill={color}
          cornerRadius={size * 0.04}
        />
      );
    case "square":
      return (
        <Rect
          width={size}
          height={size}
          fill={color}
          cornerRadius={size * 0.18}
        />
      );
  }
};

/**
 * A @remotion/shapes primitive that pops in with a bouncy spring,
 * then floats and spins gently.
 */
export const AnimatedShape: React.FC<AnimatedShapeProps> = ({
  kind,
  size,
  color,
  x,
  y,
  delay = 0,
  spin = 20,
  float = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = springIn({ frame, fps, delay, config: SPRINGS.bouncy });
  const t = Math.max(0, frame - delay) / fps;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: `-50% calc(-50% + ${Math.sin(t * 2 + delay) * float}px)`,
        scale: String(enter),
        rotate: `${interpolate(enter, [0, 1], [-90, 0]) + t * spin}deg`,
        display: "flex",
        filter: `drop-shadow(0 ${size * 0.08}px ${size * 0.2}px ${color}66)`,
      }}
    >
      <ShapeSvg kind={kind} size={size} color={color} />
    </div>
  );
};
