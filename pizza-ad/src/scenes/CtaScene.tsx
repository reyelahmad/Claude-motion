import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY, MOTION } from "../config";
import { CTAButton } from "../components/CTAButton";
import { DeliveryBadge } from "../components/DeliveryBadge";
import { PizzaTrio } from "../components/PizzaTrio";
import { KineticLine, PriceSlam, SizeLabel } from "../components/PriceSlam";
import type { ResolvedAssets } from "../lib/assets";
import { CTA_LAYOUT as C, OFFER_LAYOUT as O } from "../lib/layout";
import { mix, springAt } from "../lib/motion";
import type { Timeline } from "../lib/timeline";
import { At, pizzaRotations } from "./OfferScene";

/**
 * Scene 4: call to action. The offer layout morphs into a compact block at the
 * top, pizzas move into a row at the bottom, and the phone button reveals the
 * number group by group as the voice reads it, then pulses until the end.
 */
export const CtaScene: React.FC<{
  timeline: Timeline;
  assets: ResolvedAssets;
  frameOffset: number;
}> = ({ timeline, assets, frameOffset }) => {
  const g = useCurrentFrame() + frameOffset;
  const { fps, width } = useVideoConfig();
  const b = timeline.beats;
  const m = springAt(g, b.cta, fps, MOTION.settle);

  const slots = O.pizzas.map((s, i) => ({
    x: mix(s.x, C.pizzas[i].x, m),
    y: mix(s.y, C.pizzas[i].y, m),
    size: mix(s.size, C.pizzas[i].size, m),
  }));

  return (
    <AbsoluteFill>
      <PizzaTrio
        images={assets.pizzas}
        rotations={pizzaRotations(assets)}
        slots={slots}
        frameOffset={frameOffset}
      />
      <At
        x={mix(O.price.x, C.price.x, m)}
        y={mix(O.price.y, C.price.y, m)}
        scale={mix(1, C.price.fontSize / O.price.fontSize, m)}
      >
        <PriceSlam fontSize={O.price.fontSize} />
      </At>
      <At
        x={mix(O.sizeLabel.x, C.sizeLabel.x, m)}
        y={mix(O.sizeLabel.y, C.sizeLabel.y, m)}
        rotate={O.sizeLabel.rotate}
        scale={mix(1, 0.8, m)}
      >
        <SizeLabel />
      </At>
      <At
        x={mix(O.count.x, C.count.x, m)}
        y={mix(O.count.y, C.count.y, m)}
        scale={mix(1, C.count.fontSize / O.count.fontSize, m)}
      >
        <KineticLine text={COPY.countLine} fontSize={O.count.fontSize} />
      </At>
      <At
        x={mix(O.delivery.x, C.delivery.x, m)}
        y={mix(O.delivery.y, C.delivery.y, m)}
        scale={mix(1, C.delivery.scale, m)}
      >
        <DeliveryBadge />
      </At>
      <At x={width / 2} y={C.ctaLine.y}>
        <KineticLine
          text={COPY.ctaLine}
          fontSize={C.ctaLine.fontSize}
          start={b.cta + 6}
          frameOffset={frameOffset}
        />
      </At>
      <At x={width / 2} y={C.button.y}>
        <CTAButton
          appear={b.cta + 4}
          groupBeats={b.phoneGroups}
          width={C.button.width}
          height={C.button.height}
          fontSize={C.button.fontSize}
          frameOffset={frameOffset}
        />
      </At>
    </AbsoluteFill>
  );
};
