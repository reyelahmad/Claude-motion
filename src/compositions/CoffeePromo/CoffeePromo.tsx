import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { COFFEE } from "./palette";
import type { CoffeePromoProps } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { LogoScene } from "./scenes/LogoScene";
import { MessageScene } from "./scenes/MessageScene";
import { coffeeFrames } from "./timeline";

/** 5-second 9:16 coffee shop promo: logo reveal → message + offer → call to action. */
export const CoffeePromo: React.FC<CoffeePromoProps> = ({
  shopName,
  tagline,
  lines,
  offer,
  cta,
  address,
}) => {
  const { fps } = useVideoConfig();
  const t = coffeeFrames("transitionLength", fps);

  return (
    <AbsoluteFill style={{ backgroundColor: COFFEE.espresso }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Logo reveal"
          durationInFrames={coffeeFrames("logo", fps)}
          premountFor={fps}
        >
          <LogoScene shopName={shopName} tagline={tagline} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: t,
          })}
        />
        <TransitionSeries.Sequence
          name="Message"
          durationInFrames={coffeeFrames("message", fps)}
          premountFor={fps}
        >
          <MessageScene lines={lines} offer={offer} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: t })}
        />
        <TransitionSeries.Sequence
          name="Call to action"
          durationInFrames={coffeeFrames("cta", fps)}
          premountFor={fps}
        >
          <CtaScene shopName={shopName} cta={cta} address={address} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
