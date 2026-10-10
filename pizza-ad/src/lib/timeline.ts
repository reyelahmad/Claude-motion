import { CANVAS, TIMING } from "../config";

/** Word timing for one voice line, as written by scripts/generate-voiceover.ts. */
export type WordTiming = { text: string; offsetMs: number; durationMs: number };
export type VoTimingsFile = {
  voice: string;
  lines: { file: string; durationMs: number; words: WordTiming[] }[];
};

export type Cue = {
  line: number;
  word: string;
  occurrence: number;
  fallback: number;
};

/** All frame numbers are global (frame 0 = start of the video). */
export type Timeline = {
  durationInFrames: number;
  /** Start frame and length (frames) of each voice line. */
  lines: { start: number; frames: number }[];
  /** True when the voice could not fit the target length. */
  overran: boolean;
  usedWordTimings: boolean;
  beats: {
    typingStart: number;
    hookBubble: number;
    problemBubbles: [number, number];
    pushInStart: number;
    offerCard: number;
    whipStart: number;
    stageStart: number;
    pizzas: [number, number, number];
    price: number;
    sizeLabel: number;
    count: number;
    delivery: number;
    cta: number;
    phoneGroups: number[];
    ring: number | null;
  };
};

const normalize = (s: string) =>
  s
    .normalize("NFC")
    .replace(/[\s,.!?।:;…"'“”‘’-]/g, "")
    .trim();

/** Seconds from the start of the line at which the cue word is spoken. */
export const cueOffsetSeconds = (
  cue: Cue,
  lineSeconds: number,
  words: WordTiming[] | null,
): number => {
  if (words) {
    const target = normalize(cue.word);
    let seen = 0;
    for (const w of words) {
      if (normalize(w.text) === target) {
        seen++;
        if (seen === cue.occurrence) return w.offsetMs / 1000;
      }
    }
  }
  return cue.fallback * lineSeconds;
};

/**
 * Lays the four voice lines out on the timeline from their real durations,
 * then derives every visual beat from them.
 * 1. Try the brief's nominal starts (0.5 s, 2 s, 5 s, 10 s), pushing later only if a line runs long.
 * 2. If that overruns the target length, tighten the gaps (never cut words).
 */
export const buildTimeline = ({
  lineSeconds,
  fixedStarts,
  timings,
  fps = CANVAS.fps,
}: {
  lineSeconds: number[];
  /** Start seconds of each line when using one voiceover file. */
  fixedStarts: number[] | null;
  timings: VoTimingsFile | null;
  fps?: number;
}): Timeline => {
  const target = CANVAS.targetSeconds;
  const end = (starts: number[]) => starts[3] + lineSeconds[3] + TIMING.tail;

  let starts: number[];
  if (fixedStarts) {
    starts = fixedStarts;
  } else {
    const layout = (first: number, gap: number, useNominal: boolean) => {
      const out: number[] = [];
      for (let i = 0; i < 4; i++) {
        const earliest =
          i === 0 ? first : out[i - 1] + lineSeconds[i - 1] + gap;
        out.push(
          useNominal
            ? Math.max(TIMING.nominalLineStarts[i], earliest)
            : earliest,
        );
      }
      return out;
    };
    starts = layout(TIMING.nominalLineStarts[0], TIMING.lineGap, true);
    if (end(starts) > target)
      starts = layout(TIMING.nominalLineStarts[0], TIMING.minLineGap, false);
    if (end(starts) > target) starts = layout(0.35, TIMING.minLineGap, false);
  }

  const totalSeconds = Math.max(target, end(starts));
  const f = (s: number) => Math.round(s * fps);
  const lines = starts.map((s, i) => ({
    start: f(s),
    frames: Math.ceil(lineSeconds[i] * fps),
  }));

  const wordsFor = (line: number) => timings?.lines[line - 1]?.words ?? null;
  const cueFrame = (cue: Cue) =>
    f(
      starts[cue.line - 1] +
        cueOffsetSeconds(cue, lineSeconds[cue.line - 1], wordsFor(cue.line)),
    );

  const n = TIMING.nudge;
  const hookBubble = Math.max(
    TIMING.typingFrames,
    lines[0].start + n.hookBubble,
  );
  const offerCard = lines[2].start + n.offerCard;
  // The whip needs a few frames after the card arrives; the price must follow the whip.
  const price = Math.max(cueFrame(TIMING.cues.price) + n.price, offerCard + 14);
  const whipStart = Math.max(offerCard + 6, price - 18);
  const stageStart = whipStart + Math.round(TIMING.whipFrames / 2);
  const pizza0 = whipStart + TIMING.whipFrames - 2;
  const count = Math.max(cueFrame(TIMING.cues.count) + n.count, price + 6);
  const delivery = Math.max(
    cueFrame(TIMING.cues.delivery) + n.delivery,
    count + 6,
  );
  const cta = Math.max(delivery + 12, lines[3].start + n.cta);
  const phoneGroups = TIMING.cues.phone.map((c, i) =>
    Math.max(cueFrame(c) + n.phoneGroups[i], cta + 6),
  );
  const lineEnd = lines[3].start + lines[3].frames;
  const durationInFrames = f(totalSeconds);

  return {
    durationInFrames,
    lines,
    overran: totalSeconds > target + 1e-6,
    usedWordTimings: timings !== null,
    beats: {
      typingStart: Math.max(0, hookBubble - TIMING.typingFrames),
      hookBubble,
      problemBubbles: [
        lines[1].start + n.problemBubbles,
        lines[1].start + n.problemBubbles + TIMING.problemBubbleStagger,
      ],
      pushInStart: lines[1].start + n.problemBubbles,
      offerCard,
      whipStart,
      stageStart,
      pizzas: [
        pizza0,
        pizza0 + TIMING.pizzaStagger,
        pizza0 + 2 * TIMING.pizzaStagger,
      ],
      price,
      sizeLabel: price + 10,
      count,
      delivery,
      cta,
      phoneGroups,
      // Ring after the number has been read, so it never covers the voice.
      ring: lineEnd + 4 < durationInFrames - 12 ? lineEnd + 4 : null,
    },
  };
};
