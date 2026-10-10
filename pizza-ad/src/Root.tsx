import React from "react";
import { Composition } from "remotion";
import { CANVAS } from "./config";
import { calculatePizzaAdMetadata, PizzaAd } from "./PizzaAd";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PizzaAd916"
      component={PizzaAd}
      width={CANVAS.width}
      height={CANVAS.height}
      fps={CANVAS.fps}
      durationInFrames={CANVAS.fps * CANVAS.targetSeconds}
      defaultProps={{ timeline: null, assets: null }}
      calculateMetadata={calculatePizzaAdMetadata}
    />
  );
};
