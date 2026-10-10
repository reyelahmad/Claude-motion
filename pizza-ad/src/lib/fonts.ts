import { loadFont as loadLocalFont } from "@remotion/fonts";
import { loadFont as loadBaloo } from "@remotion/google-fonts/BalooDa2";
import { loadFont as loadHind } from "@remotion/google-fonts/HindSiliguri";
import { staticFile } from "remotion";

/**
 * Baloo Da 2 (headlines, price, phone number) and Hind Siliguri (chat, small text).
 * Loaded from Google Fonts by default; rendering waits until they are ready.
 *
 * Offline fallback: run with REMOTION_LOCAL_FONTS=1 to use the identical
 * font files bundled in public/fonts instead (no internet needed).
 */
const useLocal = process.env.REMOTION_LOCAL_FONTS === "1";

const loadFonts = () => {
  if (useLocal) {
    loadLocalFont({
      family: "Baloo Da 2",
      url: staticFile("fonts/BalooDa2-Variable.ttf"),
      weight: "400 800",
    });
    loadLocalFont({
      family: "Hind Siliguri",
      url: staticFile("fonts/HindSiliguri-Medium.ttf"),
      weight: "500",
    });
    loadLocalFont({
      family: "Hind Siliguri",
      url: staticFile("fonts/HindSiliguri-SemiBold.ttf"),
      weight: "600",
    });
    return { display: "'Baloo Da 2'", body: "'Hind Siliguri'" };
  }
  const baloo = loadBaloo("normal", {
    weights: ["700", "800"],
    subsets: ["bengali", "latin"],
  });
  const hind = loadHind("normal", {
    weights: ["500", "600"],
    subsets: ["bengali", "latin"],
  });
  return { display: baloo.fontFamily, body: hind.fontFamily };
};

const families = loadFonts();

export const FONTS = {
  display: `${families.display}, sans-serif`,
  body: `${families.body}, sans-serif`,
} as const;
