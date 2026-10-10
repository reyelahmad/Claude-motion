import { Audio } from "@remotion/media";
import React from "react";
import { interpolate, staticFile, useVideoConfig } from "remotion";

export type BackgroundMusicProps = {
  /** Path inside public/ (e.g. "audio/music.mp3") or a full URL. Empty = no audio. */
  readonly src: string;
  readonly volume?: number;
  /** Fade in/out duration in seconds. */
  readonly fadeSeconds?: number;
};

/**
 * Music bed with frame-accurate fade in/out over the composition length.
 * Audio is rendered with @remotion/media, which keeps it in sync with the timeline.
 */
export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  src,
  volume = 0.6,
  fadeSeconds = 1,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  if (!src) {
    return null;
  }
  const fade = Math.min(fadeSeconds * fps, durationInFrames / 2);
  const resolved = /^https?:\/\//.test(src) ? src : staticFile(src);

  return (
    <Audio
      src={resolved}
      volume={(f) =>
        interpolate(
          f,
          [0, fade, durationInFrames - fade, durationInFrames],
          [0, volume, volume, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      }
    />
  );
};
