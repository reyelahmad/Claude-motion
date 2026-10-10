# Static assets

Everything in `public/` is served to compositions. Reference files with `staticFile()`:

```tsx
import { staticFile } from "remotion";
staticFile("images/logo.png"); // -> public/images/logo.png
```

| Folder    | Contents                                                                 |
| --------- | ------------------------------------------------------------------------ |
| `audio/`  | Music, voice-over, sound effects (`.mp3`, `.wav`, `.aac`)                 |
| `images/` | Logos, photos, illustrations (`.png`, `.jpg`, `.svg`, `.webp`)            |
| `fonts/`  | Local font files (`.woff2`), loaded in `src/theme/index.ts`              |
| `video/`  | Source clips to embed (create as needed)                                  |

Bundled files:

- `audio/ambient-pad.mp3`: a 14-second ambient pad synthesized with FFmpeg for this project. You can use it freely.
- `fonts/Inter-Variable-latin.woff2`, `fonts/SpaceGrotesk-Variable-latin.woff2`: SIL Open Font License 1.1 (see `OFL-*.txt`).
