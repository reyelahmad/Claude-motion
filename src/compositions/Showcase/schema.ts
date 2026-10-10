import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { COLORS } from "../../theme";

/** Props editable in the Studio sidebar and overridable with --props when rendering. */
export const showcaseSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  keywords: z.array(z.string()).min(1),
  outroTitle: z.string(),
  outroCta: z.string(),
  accentColor: zColor(),
  /** File in public/ (e.g. "audio/ambient-pad.mp3"), a URL, or "" for silence. */
  musicSrc: z.string(),
});

export type ShowcaseProps = z.infer<typeof showcaseSchema>;

export const showcaseDefaultProps: ShowcaseProps = {
  title: "Claude Motion",
  subtitle: "Programmatic motion graphics, written in React",
  keywords: ["Design.", "Animate.", "Render."],
  outroTitle: "Made with Remotion",
  outroCta: "npm run render",
  accentColor: COLORS.accent,
  musicSrc: "audio/ambient-pad.mp3",
};
