import React from "react";
import {
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ASSETS, MOTION } from "../config";
import type { Slot } from "../lib/layout";
import { springAt } from "../lib/motion";

/** One round pizza photo, cropped to a circle with a soft drop shadow. */
const Pizza: React.FC<{ src: string; size: number }> = ({ src, size }) => (
  <div
    style={{
      width: size,
      height: size,
      filter: `drop-shadow(0 ${size * 0.08}px ${size * 0.09}px rgba(40,0,6,0.55))`,
    }}
  >
    <Img
      src={staticFile(src)}
      style={{
        width: size,
        height: size,
        objectFit: "cover",
        clipPath: "circle(50% at 50% 50%)",
        scale: String(ASSETS.pizzaCropZoom),
      }}
    />
  </div>
);

/**
 * Three pizzas. With `burstAt`, they burst out toward the camera from the
 * centre and land in their slots with overshoot. Afterwards they float and
 * rotate slowly. `slots` can be interpolated by the parent for layout morphs.
 */
export const PizzaTrio: React.FC<{
  images: [string, string, string];
  rotations: number[];
  slots: Slot[];
  burstAt?: [number, number, number];
  origin?: { x: number; y: number };
  frameOffset?: number;
}> = ({
  images,
  rotations,
  slots,
  burstAt,
  origin = { x: 540, y: 1080 },
  frameOffset = 0,
}) => {
  const frame = useCurrentFrame() + frameOffset;
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // Draw the middle pizza last so it sits in front.
  const order = [0, 2, 1];

  return (
    <>
      {order.map((i) => {
        const slot = slots[i];
        const p = burstAt ? springAt(frame, burstAt[i], fps, MOTION.punch) : 1;
        if (burstAt && frame < burstAt[i]) return null;
        const x = interpolate(p, [0, 1], [origin.x, slot.x]);
        const y = interpolate(p, [0, 1], [origin.y, slot.y]);
        const floatY = Math.sin(t * 2.2 + i * 1.7) * 9;
        const spin = (i === 1 ? 1 : -1) * t * 7;
        const blur = burstAt
          ? interpolate(p, [0, 0.7], [10, 0], { extrapolateRight: "clamp" })
          : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - slot.size / 2,
              top: y - slot.size / 2 + floatY,
              scale: String(interpolate(p, [0, 1], [0.2, 1])),
              rotate: `${rotations[i] + spin + (1 - p) * -120}deg`,
              filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
            }}
          >
            <Pizza src={images[i]} size={slot.size} />
          </div>
        );
      })}
    </>
  );
};
