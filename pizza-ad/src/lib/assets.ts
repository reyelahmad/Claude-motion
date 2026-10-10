import { staticFile } from "remotion";
import { ASSETS, type SfxName } from "../config";

export type ResolvedAssets = {
  /** Three pizza image paths (may be the same file three times). */
  pizzas: [string, string, string];
  /** True when one photo is reused and needs the rotation variety. */
  pizzaReused: boolean;
  logo: string;
  voMode: "lines" | "single";
  music: string | null;
  sfx: Partial<Record<SfxName, string>>;
  wordTimings: string | null;
};

/** True if a file exists in public/. Works in Studio and while rendering. */
export const fileExists = async (path: string): Promise<boolean> => {
  try {
    const res = await fetch(staticFile(path), { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
};

/**
 * Looks up every asset. Throws a clear error naming any REQUIRED file that is
 * missing (pizza photo, logo, voiceover). Optional files are simply skipped.
 */
export const resolveAssets = async (): Promise<ResolvedAssets> => {
  const [trio, single, logo, voLines, voSingle, music, timings] =
    await Promise.all([
      Promise.all(ASSETS.pizzaTrio.map(fileExists)),
      fileExists(ASSETS.pizzaSingle),
      fileExists(ASSETS.logo),
      Promise.all(ASSETS.voLines.map(fileExists)),
      fileExists(ASSETS.voSingle),
      fileExists(ASSETS.music),
      fileExists(ASSETS.voWordTimings),
    ]);

  const sfxEntries = await Promise.all(
    (Object.keys(ASSETS.sfx) as SfxName[]).map(
      async (name) =>
        [
          name,
          (await fileExists(ASSETS.sfx[name])) ? ASSETS.sfx[name] : null,
        ] as const,
    ),
  );

  const missing: string[] = [];
  const hasTrio = trio.every(Boolean);
  if (!hasTrio && !single)
    missing.push(
      `public/${ASSETS.pizzaSingle} (or ${ASSETS.pizzaTrio.join(", ")})`,
    );
  if (!logo) missing.push(`public/${ASSETS.logo}`);
  const hasVoLines = voLines.every(Boolean);
  if (!hasVoLines && !voSingle) {
    missing.push(
      `voiceover: public/${ASSETS.voLines.join(", ")} (run "npm run voiceover") or public/${ASSETS.voSingle}`,
    );
  }
  if (!hasVoLines && voSingle && ASSETS.voTimestamps.some((t) => t === null)) {
    missing.push(
      `voTimestamps in src/config.ts (start second of each line in ${ASSETS.voSingle})`,
    );
  }
  if (missing.length > 0) {
    throw new Error(
      `Missing required asset(s):\n  - ${missing.join("\n  - ")}\nAdd them and reload. No placeholders are used.`,
    );
  }

  const sfx: Partial<Record<SfxName, string>> = {};
  for (const [name, path] of sfxEntries) {
    if (path) sfx[name] = path;
  }

  return {
    pizzas: hasTrio
      ? [ASSETS.pizzaTrio[0], ASSETS.pizzaTrio[1], ASSETS.pizzaTrio[2]]
      : [ASSETS.pizzaSingle, ASSETS.pizzaSingle, ASSETS.pizzaSingle],
    pizzaReused: !hasTrio,
    logo: ASSETS.logo,
    voMode: hasVoLines ? "lines" : "single",
    music: music ? ASSETS.music : null,
    sfx,
    wordTimings: timings ? ASSETS.voWordTimings : null,
  };
};
