# Claude Motion

Programmatic motion graphics with [Remotion](https://www.remotion.dev) **4.0.534**, React 19 and TypeScript. The project is set up for AI coding agents: instructions are in [`AGENTS.md`](AGENTS.md) / [`CLAUDE.md`](CLAUDE.md), and the official Remotion Agent Skills are in `.claude/skills/`.

## Requirements

- Node.js 18 or newer (tested on 22).
- npm.
- On first render, Remotion downloads Chrome Headless Shell automatically.

## Quick start

```bash
npm install          # install dependencies
npm run dev          # open Remotion Studio at http://localhost:3000
npm run render       # export the sample to out/showcase.mp4
```

## Commands

| What | Command |
| --- | --- |
| Preview in Studio | `npm run dev` |
| List compositions | `npm run compositions` |
| New composition | `npm run new -- MyVideo --seconds 8 --format landscape\|portrait\|square` |
| Render the sample MP4 | `npm run render` |
| Render the portrait sample | `npm run render:portrait` |
| Render any composition | `npx remotion render src/index.ts <CompositionId> out/<name>.mp4` |
| Render with custom props | `npx remotion render src/index.ts Showcase out/hello.mp4 --props='{"title":"Hello"}'` |
| Render a still frame | `npx remotion still src/index.ts Showcase out/frame.png --frame=60` |
| Lint and typecheck | `npm run lint` |
| Upgrade Remotion | `npm run upgrade` |

## Sample: `Showcase`

The sample is a 30 fps, 1920×1080, 11.9 s video in four scenes:

1. Animated title
2. Springy shapes
3. Kinetic typography
4. Outro

The scenes are joined by fade, slide and wipe transitions, with a music bed that fades in and out. There are also portrait and square versions (`Showcase-Portrait`, `Showcase-Square`), and each scene is registered as its own composition so you can preview it alone.

- **Frame rate and resolution:** `src/config/video.ts` (`FPS`, `FORMATS`, `DEFAULT_FORMAT`)
- **Scene durations (in seconds):** `src/compositions/Showcase/timeline.ts`
- **Text, colors and music:** props in the Studio sidebar, or `--props` on the CLI

See [`AGENTS.md`](AGENTS.md) for the full project map and how-tos.

## Documentation

- Remotion docs: https://www.remotion.dev/docs
- Install into an existing project: https://www.remotion.dev/docs/brownfield
- Agent Skills: https://www.remotion.dev/docs/ai/skills
- Rendering: https://www.remotion.dev/docs/render

## License note

Remotion has its own license. It is free for individuals and teams of up to 3; larger companies need a company license (https://www.remotion.dev/license).
The bundled fonts are under the SIL OFL 1.1.
