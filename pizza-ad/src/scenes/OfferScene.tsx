import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ASSETS, COLORS, COPY, MOTION } from "../config";
import { DeliveryBadge } from "../components/DeliveryBadge";
import { Particles } from "../components/Particles";
import { PizzaTrio } from "../components/PizzaTrio";
import { KineticLine, PriceSlam, SizeLabel } from "../components/PriceSlam";
import type { ResolvedAssets } from "../lib/assets";
import { OFFER_LAYOUT as L } from "../lib/layout";
import { springAt } from "../lib/motion";
import type { Timeline } from "../lib/timeline";

/** Centre an element on (x, y). */
export const At: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  children: React.ReactNode;
}> = ({ x, y, scale = 1, rotate = 0, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      translate: "-50% -50%",
      scale: String(scale),
      rotate: `${rotate}deg`,
    }}
  >
    {children}
  </div>
);

export const pizzaRotations = (assets: ResolvedAssets) =>
  assets.pizzaReused ? ASSETS.pizzaRotations : [0, 0, 0];

/**
 * Scene 3: the offer. The stage is revealed by the whip zoom, pizzas burst
 * out, the price slams in on the spoken price (shake + particles + sheen),
 * the count line rises word by word, and the delivery badge slides in.
 */
export const OfferScene: React.FC<{
  timeline: Timeline;
  assets: ResolvedAssets;
  frameOffset: number;
}> = ({ timeline, assets, frameOffset }) => {
  const g = useCurrentFrame() + frameOffset;
  const { fps } = useVideoConfig();
  const b = timeline.beats;

  const zoom = interpolate(
    springAt(g, b.stageStart, fps, MOTION.settle),
    [0, 1],
    [1.35, 1],
  );
  const flash = interpolate(g, [b.stageStart, b.stageStart + 9], [0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeT = g - b.price;
  const shaking = shakeT >= 0 && shakeT < 4;
  const amp = shaking ? 20 * (1 - shakeT / 4) : 0;
  const dx = shaking ? (random(`shx${g}`) - 0.5) * 2 * amp : 0;
  const dy = shaking ? (random(`shy${g}`) - 0.5) * 2 * amp : 0;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ scale: String(zoom), translate: `${dx}px ${dy}px` }}
      >
        <PizzaTrio
          images={assets.pizzas}
          rotations={pizzaRotations(assets)}
          slots={L.pizzas}
          burstAt={b.pizzas}
          frameOffset={frameOffset}
        />
        <At x={L.price.x} y={L.price.y}>
          <PriceSlam
            fontSize={L.price.fontSize}
            slamAt={b.price}
            frameOffset={frameOffset}
          />
        </At>
        <Particles
          x={L.price.x}
          y={L.price.y}
          start={b.price}
          frameOffset={frameOffset}
        />
        <At x={L.sizeLabel.x} y={L.sizeLabel.y} rotate={L.sizeLabel.rotate}>
          <SizeLabel appear={b.sizeLabel} frameOffset={frameOffset} />
        </At>
        <At x={L.count.x} y={L.count.y}>
          <KineticLine
            text={COPY.countLine}
            fontSize={L.count.fontSize}
            start={b.count}
            frameOffset={frameOffset}
          />
        </At>
        {g >= b.delivery ? (
          <At x={L.delivery.x} y={L.delivery.y}>
            <DeliveryBadge appear={b.delivery} frameOffset={frameOffset} />
          </At>
        ) : null}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${COLORS.cream}, ${COLORS.yellowPrimary}AA 40%, transparent 75%)`,
          opacity: flash,
        }}
      />
    </AbsoluteFill>
  );
};
