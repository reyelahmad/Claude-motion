import { Audio } from "@remotion/media";
import React from "react";
import { interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { ASSETS, MIX, type SfxName } from "../config";
import type { ResolvedAssets } from "../lib/assets";
import type { Timeline } from "../lib/timeline";

/** Music volume at a global frame: fades in, and ducks while any voice line plays. */
const musicVolume = (frame: number, lines: Timeline["lines"]) => {
  const fadeIn = interpolate(frame, [0, MIX.musicFadeInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });
  const r = MIX.duckRampFrames;
  let duck = 0;
  for (const l of lines) {
    const d = interpolate(
      frame,
      [l.start - r, l.start, l.start + l.frames, l.start + l.frames + r],
      [0, 1, 1, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );
    duck = Math.max(duck, d);
  }
  return fadeIn * interpolate(duck, [0, 1], [MIX.music, MIX.musicDucked]);
};

const Sfx: React.FC<{
  name: SfxName;
  at: number | null;
  assets: ResolvedAssets;
  volume?: number;
}> = ({ name, at, assets, volume }) => {
  const src = assets.sfx[name];
  if (!src || at === null || at < 0) return null;
  return (
    <Sequence from={at} name={`sfx: ${name}`} layout="none">
      <Audio src={staticFile(src)} volume={volume ?? MIX.sfx[name]} />
    </Sequence>
  );
};

/** Voiceover, ducked music and sound effects. Missing optional files are skipped. */
export const AdAudio: React.FC<{
  timeline: Timeline;
  assets: ResolvedAssets;
}> = ({ timeline, assets }) => {
  const { fps } = useVideoConfig();
  const b = timeline.beats;
  return (
    <>
      {assets.voMode === "lines" ? (
        timeline.lines.map((l, i) => (
          <Sequence
            key={i}
            from={l.start}
            name={`VO line ${i + 1}`}
            layout="none"
          >
            <Audio
              src={staticFile(ASSETS.voLines[i])}
              volume={MIX.voice}
              premountFor={fps}
            />
          </Sequence>
        ))
      ) : (
        <Audio src={staticFile(ASSETS.voSingle)} volume={MIX.voice} />
      )}
      {assets.music ? (
        <Audio
          src={staticFile(assets.music)}
          loop
          volume={(f) => musicVolume(f, timeline.lines)}
        />
      ) : null}
      <Sfx name="vibrate" at={b.hookBubble} assets={assets} />
      <Sfx name="pop" at={b.hookBubble} assets={assets} />
      <Sfx name="pop" at={b.problemBubbles[0]} assets={assets} />
      <Sfx name="pop" at={b.problemBubbles[1]} assets={assets} />
      <Sfx name="pop" at={b.offerCard} assets={assets} />
      <Sfx name="whoosh" at={b.whipStart} assets={assets} />
      {b.pizzas.map((p, i) => (
        <Sfx
          key={i}
          name="pop"
          at={p}
          assets={assets}
          volume={MIX.sfx.pop * 0.85}
        />
      ))}
      <Sfx name="slam" at={b.price} assets={assets} />
      <Sfx name="ding" at={b.delivery} assets={assets} />
      <Sfx name="ring" at={b.ring} assets={assets} />
    </>
  );
};
