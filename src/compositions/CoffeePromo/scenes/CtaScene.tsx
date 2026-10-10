import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedText } from "../../../components";
import { FONTS } from "../../../theme";
import { EASE, SPRINGS, springIn, tween } from "../../../utils/animation";
import { useUnit } from "../../../utils/layout";
import { CoffeeBackdrop } from "../CoffeeBackdrop";
import { CoffeeLogo } from "../CoffeeLogo";
import { COFFEE } from "../palette";

/** Scene 3: logo returns, call to action, address pill, gentle fade out. */
export const CtaScene: React.FC<{
  shopName: string;
  cta: string;
  address: string;
}> = ({ shopName, cta, address }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const u = useUnit();
  const pill = springIn({
    frame,
    fps,
    delay: 0.55 * fps,
    config: SPRINGS.snappy,
  });
  const fadeOut = tween(
    frame,
    [durationInFrames - 0.3 * fps, durationInFrames - 1],
    [1, 0.0],
    EASE.in,
  );

  return (
    <AbsoluteFill
      style={{ color: COFFEE.espresso, backgroundColor: COFFEE.espresso }}
    >
      <AbsoluteFill style={{ opacity: fadeOut }}>
        <CoffeeBackdrop />
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            gap: 34 * u,
          }}
        >
          <CoffeeLogo size={300 * u} />
          <div
            style={{
              fontFamily: FONTS.serif,
              fontSize: 64 * u,
              fontWeight: 600,
              color: COFFEE.roast,
            }}
          >
            {shopName}
          </div>
          <AnimatedText
            text={cta}
            delay={0.25 * fps}
            stagger={3}
            rise={40 * u}
            style={{
              fontFamily: FONTS.serif,
              fontSize: 140 * u,
              fontWeight: 800,
              lineHeight: 1.05,
              textAlign: "center",
              maxWidth: 900 * u,
            }}
          />
          <div
            style={{
              marginTop: 20 * u,
              padding: `${22 * u}px ${44 * u}px`,
              borderRadius: 999,
              border: `${3 * u}px solid ${COFFEE.caramel}`,
              fontFamily: FONTS.body,
              fontSize: 40 * u,
              fontWeight: 600,
              color: COFFEE.roast,
              opacity: pill,
              translate: `0px ${(1 - pill) * 30 * u}px`,
            }}
          >
            📍 {address}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
