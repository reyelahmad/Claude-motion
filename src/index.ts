// Remotion entry point. Studio and the CLI pick this up automatically
// (or pass it explicitly: npx remotion render src/index.ts <id> out/video.mp4).

import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
