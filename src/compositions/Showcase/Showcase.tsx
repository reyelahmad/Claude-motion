import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { BackgroundMusic, ProgressBar } from "../../components";
import { COLORS } from "../../theme";
import type { ShowcaseProps } from "./schema";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";
import { ShapesScene } from "./scenes/ShapesScene";
import { TypographyScene } from "./scenes/TypographyScene";
import { sceneFrames, transitionFrames } from "./timeline";

/**
 * Sample multi-scene video: 4 scenes joined by fade / slide / wipe transitions,
 * with an optional music bed and progress bar. Timing lives in ./timeline.ts.
 */
export const Showcase: React.FC<ShowcaseProps> = ({
  title,
  subtitle,
  keywords,
  outroTitle,
  outroCta,
  accentColor,
  musicSrc,
}) => {
  const { fps } = useVideoConfig();
  const t = transitionFrames(fps);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Intro"
          durationInFrames={sceneFrames("intro", fps)}
          premountFor={fps}
        >
          <IntroScene
            title={title}
            subtitle={subtitle}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: t })}
        />
        <TransitionSeries.Sequence
          name="Shapes"
          durationInFrames={sceneFrames("shapes", fps)}
          premountFor={fps}
        >
          <ShapesScene accentColor={accentColor} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: t,
          })}
        />
        <TransitionSeries.Sequence
          name="Typography"
          durationInFrames={sceneFrames("typography", fps)}
          premountFor={fps}
        >
          <TypographyScene keywords={keywords} accentColor={accentColor} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: t })}
        />
        <TransitionSeries.Sequence
          name="Outro"
          durationInFrames={sceneFrames("outro", fps)}
          premountFor={fps}
        >
          <OutroScene
            outroTitle={outroTitle}
            outroCta={outroCta}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <ProgressBar />
      <BackgroundMusic src={musicSrc} volume={0.5} />
    </AbsoluteFill>
  );
};
