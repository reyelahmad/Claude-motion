import { CameraMotionBlur } from "@remotion/motion-blur";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import React from "react";
import {
  AbsoluteFill,
  type CalculateMetadataFunction,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { ASSETS, CANVAS, TIMING } from "./config";
import { AdAudio } from "./components/AdAudio";
import { Background } from "./components/Background";
import { Logo } from "./components/Logo";
import { resolveAssets, type ResolvedAssets } from "./lib/assets";
import {
  buildTimeline,
  type Timeline,
  type VoTimingsFile,
} from "./lib/timeline";
import { ChatScene } from "./scenes/ChatScene";
import { CtaScene } from "./scenes/CtaScene";
import { OfferScene } from "./scenes/OfferScene";

export type PizzaAdProps = {
  timeline: Timeline | null;
  assets: ResolvedAssets | null;
};

/**
 * Finds the assets, measures the voice clips and lays the whole ad out from
 * their real durations (and word timings, when available).
 */
export const calculatePizzaAdMetadata: CalculateMetadataFunction<
  PizzaAdProps
> = async () => {
  const assets = await resolveAssets();

  let lineSeconds: number[];
  let fixedStarts: number[] | null = null;
  if (assets.voMode === "lines") {
    lineSeconds = await Promise.all(
      ASSETS.voLines.map((f) => getAudioDurationInSeconds(staticFile(f))),
    );
  } else {
    const total = await getAudioDurationInSeconds(staticFile(ASSETS.voSingle));
    fixedStarts = ASSETS.voTimestamps as number[];
    lineSeconds = fixedStarts.map(
      (s, i) => (i < 3 ? fixedStarts![i + 1] : total) - s,
    );
  }

  // Word timings only apply if they belong to these exact clips.
  let timings: VoTimingsFile | null = null;
  if (assets.wordTimings && assets.voMode === "lines") {
    const json = (await (
      await fetch(staticFile(assets.wordTimings))
    ).json()) as VoTimingsFile;
    const matches =
      json.lines.length === 4 &&
      json.lines.every(
        (l, i) => Math.abs(l.durationMs / 1000 - lineSeconds[i]) < 0.2,
      );
    timings = matches ? json : null;
  }

  const timeline = buildTimeline({
    lineSeconds,
    fixedStarts,
    timings,
    fps: CANVAS.fps,
  });
  return {
    durationInFrames: timeline.durationInFrames,
    props: { timeline, assets },
  };
};

/** 15-second 9:16 Bangla pizza ad. */
export const PizzaAd: React.FC<PizzaAdProps> = ({ timeline, assets }) => {
  const { fps } = useVideoConfig();
  if (!timeline || !assets) return null;
  const b = timeline.beats;
  const whipEnd = b.whipStart + TIMING.whipFrames;

  return (
    <AbsoluteFill>
      <Background />

      <Sequence name="Scenes 1–2: chat" durationInFrames={b.whipStart}>
        <ChatScene timeline={timeline} assets={assets} />
      </Sequence>
      <Sequence
        name="Whip zoom (motion blur)"
        from={b.whipStart}
        durationInFrames={TIMING.whipFrames}
      >
        <CameraMotionBlur samples={6} shutterAngle={270}>
          <ChatScene
            timeline={timeline}
            assets={assets}
            frameOffset={b.whipStart}
          />
        </CameraMotionBlur>
      </Sequence>

      <Sequence
        name="Scene 3: offer"
        from={b.stageStart}
        durationInFrames={b.cta - b.stageStart}
        premountFor={fps}
      >
        <OfferScene
          timeline={timeline}
          assets={assets}
          frameOffset={b.stageStart}
        />
      </Sequence>
      <Sequence name="Scene 4: call to action" from={b.cta} premountFor={fps}>
        <CtaScene timeline={timeline} assets={assets} frameOffset={b.cta} />
      </Sequence>

      <Logo
        src={assets.logo}
        appear={Math.min(whipEnd, b.stageStart + 4)}
        toCenterAt={b.cta}
      />
      <AdAudio timeline={timeline} assets={assets} />
    </AbsoluteFill>
  );
};
