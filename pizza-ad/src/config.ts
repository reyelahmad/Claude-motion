/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PIZZA AD: single source of truth
 *  Edit copy, price, phone number, colours, timings and asset paths here.
 *  Components never hard-code any of these values.
 * ─────────────────────────────────────────────────────────────────────────
 */

// ── Canvas ───────────────────────────────────────────────────────────────
export const CANVAS = {
  width: 1080,
  height: 1920,
  fps: 30,
  /** Target length in seconds. Grows only if the voiceover cannot fit. */
  targetSeconds: 15,
  /** Reels/Stories UI covers these areas. Keep important content out. */
  safeTop: 220,
  safeBottom: 380,
} as const;

// ── Colours ──────────────────────────────────────────────────────────────
export const COLORS = {
  redDeep: "#7A0010",
  redPrimary: "#B3001B",
  redBright: "#E3122B",
  yellowPrimary: "#FFC72C",
  yellowGold: "#F5A800",
  cream: "#FFF8E7",
  ink: "#1A0005",
  /** Chat UI (dark phone screen). */
  phoneBody: "#0E0E10",
  chatBg: "#17080B",
  chatHeader: "#22100F",
} as const;

// ── On-screen copy ───────────────────────────────────────────────────────
// Facts (keep in sync with the voiceover below): price, count, delivery, phone.
export const COPY = {
  /** On-screen price (Bangla digits). */
  price: "৳৯৭০",
  /** Pill shown next to the price from the offer reveal to the end. */
  sizeLabel: "রেগুলার সাইজ",
  /** Line under the price, revealed word by word. */
  countLine: "৩টা রেগুলার পিৎজা",
  delivery: "ফ্রি হোম ডেলিভারি",
  ctaLine: "অর্ডার করতে কল করো",
  /** Phone number, split into the groups that are revealed as they are spoken. */
  phoneGroups: ["013", "46", "099", "272"],

  chat: {
    groupName: "গ্যাং",
    /** Hook line: first message in the chat. */
    hook: { sender: "রাফি", text: "আজকে আড্ডা হবে?" },
    problem: [
      { sender: "নাদিয়া", text: "বাজেট কম রে", sad: true },
      { sender: "নাদিয়া", text: "কিন্তু পিৎজা খাইতে মন চায়!", sad: false },
    ],
    /** Offer card that arrives in the chat. */
    offerCard: {
      title: "৳৯৭০-এ ৩টা রেগুলার পিৎজা",
      subtitle: "ফ্রি হোম ডেলিভারি",
    },
  },
} as const;

// ── Voiceover script (Azure TTS, see scripts/generate-voiceover.ts) ──────
// `display` is the exact script; `ssml` is what the voice actually reads.
// Numbers are written as words so they are pronounced correctly.
export const VOICE = {
  /** Female Bangladeshi Bengali neural voice. Alternative: bn-BD-PradeepNeural. */
  name: "bn-BD-NabanitaNeural",
  rate: "+8%",
  pitch: "+2%",
  lines: [
    {
      display: "আজকে আড্ডা হবে?",
      ssml: "আজকে আড্ডা হবে?",
    },
    {
      display: "বাজেট কম... কিন্তু পিৎজা খাইতে মন চায়!",
      ssml: 'বাজেট কম... <break time="350ms"/> কিন্তু পিৎজা খাইতে মন চায়!',
    },
    {
      display:
        "টেনশন নাই! ৯৭০ টাকায় ৩টা রেগুলার পিৎজা, সাথে ফ্রি হোম ডেলিভারি!",
      ssml: 'টেনশন নাই! <break time="150ms"/> নয়শো সত্তর টাকায় তিনটা রেগুলার পিৎজা, <break time="120ms"/> সাথে ফ্রি হোম ডেলিভারি!',
    },
    {
      display: "অর্ডার করতে কল করো: 013 46 099 272",
      ssml: 'অর্ডার করতে কল করো: <break time="250ms"/> শূন্য এক তিন, <break time="250ms"/> চার ছয়, <break time="250ms"/> শূন্য নয় নয়, <break time="250ms"/> দুই সাত দুই',
    },
  ],
} as const;

// ── Assets (all paths are inside public/) ────────────────────────────────
export const ASSETS = {
  /** Use pizza-1/2/3.png if all three exist, otherwise pizza.png three times. */
  pizzaSingle: "pizza.png",
  pizzaTrio: ["pizza-1.png", "pizza-2.png", "pizza-3.png"],
  /** Rotations used when one pizza photo is reused three times. */
  pizzaRotations: [-12, 4, 15],
  /** Circular crop tuning for the pizza photo (1 = fit, >1 = zoom in). */
  pizzaCropZoom: 1.0,
  logo: "logo.png",
  /** One file per line (preferred) … */
  voLines: ["vo-1.mp3", "vo-2.mp3", "vo-3.mp3", "vo-4.mp3"],
  /** … or a single file plus the start time (seconds) of each line. */
  voSingle: "voiceover.mp3",
  voTimestamps: [null, null, null, null] as (number | null)[],
  /** Word timings written by the Azure script, used to land beats on words. */
  voWordTimings: "vo-timings.json",
  music: "music.mp3",
  sfx: {
    pop: "sfx/pop.mp3",
    whoosh: "sfx/whoosh.mp3",
    slam: "sfx/slam.mp3",
    ding: "sfx/ding.mp3",
    vibrate: "sfx/vibrate.mp3",
    ring: "sfx/ring.mp3",
  },
};

export type SfxName = keyof typeof ASSETS.sfx;

// ── Timing (seconds unless noted) ────────────────────────────────────────
export const TIMING = {
  /** Nominal line starts from the brief. Lines move later only if needed. */
  nominalLineStarts: [0.5, 2, 5, 10],
  /** Preferred pause between voice lines, and the minimum when tightening. */
  lineGap: 0.3,
  minLineGap: 0.08,
  /** Time after the last word before the video may end. */
  tail: 0.5,
  /** Frames the typing indicator shows before the first bubble. */
  typingFrames: 10,
  /** Frames between the two "problem" bubbles. */
  problemBubbleStagger: 8,
  /** Whip zoom length in frames. */
  whipFrames: 8,
  /** Frames between each pizza landing. */
  pizzaStagger: 4,
  /** Frames after the price slam before the light sweep. */
  sweepDelay: 6,

  /**
   * Words the visual beats lock onto. Matched against Azure word timings
   * (`vo-timings.json`). `occurrence` is 1-based within that line.
   * `fallback` = fraction of the line's duration, used when no word timings exist.
   */
  cues: {
    price: { line: 3, word: "নয়শো", occurrence: 1, fallback: 0.22 },
    count: { line: 3, word: "তিনটা", occurrence: 1, fallback: 0.48 },
    delivery: { line: 3, word: "ফ্রি", occurrence: 1, fallback: 0.72 },
    phone: [
      { line: 4, word: "শূন্য", occurrence: 1, fallback: 0.36 },
      { line: 4, word: "চার", occurrence: 1, fallback: 0.55 },
      { line: 4, word: "শূন্য", occurrence: 2, fallback: 0.7 },
      { line: 4, word: "দুই", occurrence: 1, fallback: 0.86 },
    ],
  },
} as const;

// ── Audio mix ────────────────────────────────────────────────────────────
export const MIX = {
  voice: 1.0,
  music: 0.22,
  musicDucked: 0.1,
  /** Music fade-in at the start, in frames. */
  musicFadeInFrames: 6,
  /** Ramp in/out of ducking, in frames. */
  duckRampFrames: 5,
  sfx: {
    pop: 0.55,
    whoosh: 0.6,
    slam: 0.55,
    ding: 0.5,
    vibrate: 0.6,
    ring: 0.6,
  } satisfies Record<SfxName, number>,
};

// ── Motion ───────────────────────────────────────────────────────────────
export const MOTION = {
  /** Punchy overshoot spring for entrances. */
  punch: { damping: 12, stiffness: 170, mass: 1 },
  /** Slightly calmer overshoot. */
  settle: { damping: 14, stiffness: 140, mass: 1 },
  /** No-bounce spring for layout moves. */
  smooth: { damping: 200 },
} as const;
