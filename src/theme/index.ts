import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts (OFL-licensed variable fonts, latin subset)
// so renders are offline-safe and deterministic. loadFont() blocks rendering
// until the font is ready. To add a font: drop the .woff2 into public/fonts
// and add a loadFont() call here.
loadFont({
  family: "Inter",
  url: staticFile("fonts/Inter-Variable-latin.woff2"),
  weight: "100 900",
});
loadFont({
  family: "Space Grotesk",
  url: staticFile("fonts/SpaceGrotesk-Variable-latin.woff2"),
  weight: "300 700",
});

export const FONTS = {
  body: "Inter, system-ui, sans-serif",
  display: "'Space Grotesk', Inter, system-ui, sans-serif",
} as const;

export const COLORS = {
  background: "#0B0D17",
  backgroundAlt: "#151A2E",
  text: "#F5F7FF",
  muted: "#9AA3C7",
  primary: "#7C5CFF",
  secondary: "#00D4FF",
  accent: "#FF4D8D",
  warm: "#FFB547",
} as const;

export const GRADIENTS = {
  brand: `linear-gradient(120deg, ${COLORS.primary}, ${COLORS.secondary})`,
  hot: `linear-gradient(120deg, ${COLORS.accent}, ${COLORS.warm})`,
} as const;
