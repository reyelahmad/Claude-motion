import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedText } from "../../../components";
import { FONTS } from "../../../theme";
import { EASE, tween } from "../../../utils/animation";
import { useUnit } from "../../../utils/layout";
import { CoffeeBackdrop } from "../CoffeeBackdrop";
import { CoffeeLogo } from "../CoffeeLogo";
import { COFFEE } from "../palette";

/** Scene 1: badge draws, cup + steam, then name and tagline. */
export const LogoScene: React.FC<{ shopName: string; tagline: string }> = ({
  shopName,
  tagline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useUnit();

  return (
    <AbsoluteFill style={{ color: COFFEE.espresso }}>
      <CoffeeBackdrop />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", gap: 40 * u }}
      >
        <CoffeeLogo size={460 * u} />
        <AnimatedText
          text={shopName}
          by="char"
          delay={0.7 * fps}
          stagger={1.5}
          rise={50 * u}
          style={{
            fontFamily: FONTS.serif,
            fontSize: 150 * u,
            fontWeight: 700,
            letterSpacing: -2 * u,
          }}
        />
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 38 * u,
            fontWeight: 600,
            letterSpacing: 10 * u,
            textTransform: "uppercase",
            color: COFFEE.caramel,
            opacity: tween(frame, [1.05 * fps, 1.4 * fps], [0, 1]),
            translate: `0px ${tween(frame, [1.05 * fps, 1.4 * fps], [20, 0], EASE.out) * u}px`,
          }}
        >
          {tagline}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
