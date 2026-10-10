# Agent guide: Claude Motion (Remotion)

This repo makes motion-graphics videos in code with **Remotion 4.0.534**, using React 19, TypeScript and npm.
A video is a React component rendered frame by frame. Studio previews it in the browser and the CLI renders it to MP4.

## Golden rules

1. **Drive all animation from `useCurrentFrame()`.** Use `interpolate()`, `spring()` or the helpers in `src/utils/animation.ts`.
   **Never** use CSS `transition`/`animation`, Tailwind `animate-*`, `setTimeout`, `Date.now()` or `Math.random()`. They will not render deterministically. For randomness, use `random(seed)` from `remotion`.
2. **Write timing in seconds, then convert with fps.** Get `fps` from `useVideoConfig()` (`1.5 * fps`), or use `secondsToFrames()` from `src/config/video.ts`. Never hard-code frame counts that assume 30 fps.
3. **Size things with resolution-independent units.** `const u = useUnit()` (in `src/utils/layout.ts`) returns 1 at 1080p. Write `fontSize: 96 * u`. Portrait, square and landscape then all work.
4. **Keep assets in `public/`** and reference them with `staticFile("audio/x.mp3")`. Never import media from outside `public/`.
5. **Use the right component for each kind of media:**
   - Audio and video: `<Audio>` and `<Video>` from `@remotion/media`.
   - Images: `<Img>` or `<CanvasImage>` from `remotion`.
   - Fonts: `@remotion/fonts` `loadFont()`. Plain `<img>`, `<audio>`, `<video>` and CSS `@font-face` do not block rendering.
6. **Preserve user edits.** Users and Studio (which writes props back to `Root.tsx`) may change files between turns. Do not revert changes that look surprising.
7. **Before you finish, run `npm run lint`** (ESLint with Remotion rules, plus `tsc`). It must pass with zero errors and zero warnings.

## Project map

```
src/
  index.ts                 Entry point (registerRoot). Studio and the CLI use it.
  Root.tsx                 Registers every <Composition> (id, size, fps, duration, props).
  config/video.ts          FPS, FORMATS (landscape/portrait/square), secondsToFrames().
  theme/index.ts           COLORS, GRADIENTS, FONTS (also loads local fonts).
  utils/animation.ts       EASE curves, SPRINGS presets, tween(), springIn(), fadeInOut(), stagger().
  utils/layout.ts          useUnit() (resolution scale), useIsPortrait().
  components/              Reusable building blocks:
    AnimatedText.tsx         Per-word or per-char staggered spring reveal (kinetic type).
    AnimatedShape.tsx        Circle/triangle/star/square that pops in, floats and spins (@remotion/shapes).
    Background.tsx           Animated gradient + drifting glow orbs + grid.
    BackgroundMusic.tsx      Music bed with frame-accurate fade in/out (@remotion/media).
    ProgressBar.tsx          Composition progress bar.
  compositions/
    Showcase/              Sample 4-scene video (the reference example).
      Showcase.tsx           TransitionSeries: fade → slide → wipe between scenes.
      timeline.ts            Scene lengths IN SECONDS; total duration is derived.
      schema.ts              Zod schema + default props (editable in the Studio sidebar).
      scenes/*.tsx           IntroScene, ShapesScene, TypographyScene, OutroScene.
    Blank/Blank.tsx        Template copied by `npm run new`.
public/                    Static assets: audio/, images/, fonts/ (see public/README.md).
scripts/new-composition.mjs  Scaffolds a composition and registers it in Root.tsx.
remotion.config.ts         CLI/Studio config (entry point, image format, overwrite).
out/                       Render output (git-ignored).
```

## Commands

| Task | Command |
| --- | --- |
| Open Studio (live preview, hot reload) | `npm run dev` (http://localhost:3000) |
| List compositions | `npm run compositions` |
| New composition | `npm run new -- MyVideo --seconds 8 --format portrait` |
| Render the sample to MP4 | `npm run render` → `out/showcase.mp4` |
| Render any composition | `npx remotion render src/index.ts <CompositionId> out/<name>.mp4` |
| Render with custom props | `npx remotion render src/index.ts Showcase out/x.mp4 --props='{"title":"Hello"}'` |
| Render one frame (quick visual check) | `npx remotion still src/index.ts <CompositionId> out/frame.png --frame=60` |
| Lint + typecheck | `npm run lint` |
| Upgrade Remotion (all packages in lockstep) | `npm run upgrade` |

Useful render flags:
- `--codec=h264|h265|vp9|prores|gif`
- `--crf=18` (lower means higher quality)
- `--frames=0-89` (render a range)
- `--scale=0.5` (quick low-res draft)
- `--concurrency=4`
- `--muted`

## How to…

### Change resolution, frame rate or duration
- **Frame rate:** `FPS` in `src/config/video.ts`. Every composition and the scene timing follow it automatically.
- **Resolution:** `DEFAULT_FORMAT`, or the values in `FORMATS`, in `src/config/video.ts`. For a single composition, set its `width`/`height` in `Root.tsx` (for example `{...FORMATS.portrait}`).
- **Duration:** for the Showcase, edit the seconds in `compositions/Showcase/timeline.ts`. The total is computed as scenes minus transition overlaps. For other compositions, edit `durationInFrames={secondsToFrames(N, FPS)}` in `Root.tsx`.
- You can also override size or range per render without editing code: `--width`, `--height`, `--frames`, `--scale`.
  Avoid `--fps` for this: it keeps the frame count, which changes the duration. Change `FPS` in the config instead.

### Create a new video
1. Run `npm run new -- PromoVideo --seconds 10 --format landscape`. This creates `src/compositions/PromoVideo/PromoVideo.tsx` and registers it in `Root.tsx`.
2. Build scenes as separate components in `src/compositions/PromoVideo/scenes/`. Each scene must be self-contained: it sets its own background and fonts, and frame 0 is the scene start.
3. Sequence the scenes:
   - Use `<TransitionSeries>` when scenes need transitions (see `Showcase.tsx`).
   - Use `<Series>` for hard cuts.
   - Use `<Sequence from={…} durationInFrames={…}>` for overlapping layers.
   - Give every sequence `premountFor={fps}`.
4. Optionally register each scene as its own composition (a "connected composition") in a `<Folder>`, so it can be previewed on its own.
5. Make the props editable: add a Zod `schema` (use `zColor()` from `@remotion/zod-types` for colors) and `defaultProps` to the `<Composition>`.
   Write `defaultProps` as an inline object literal in `Root.tsx` so Studio can save edits back to the file.
6. Check the result: `npx remotion still … --frame=N` at a few key frames, then `npm run lint`, then a full render.

### Animate typography
- `<AnimatedText text="…" by="word" | "char" delay={…} stagger={…} />` gives a staggered rise, fade and un-blur.
- For gradient text, pass `unitStyle={{ backgroundImage: GRADIENTS.brand, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}`.
- `TypographyScene.tsx` shows a keyword-by-keyword reveal with a highlight-bar sweep, using `scale: \`${p} 1\`` and `transformOrigin: "left center"`.
- Prefer the individual CSS `scale` / `translate` / `rotate` properties over a combined `transform` string.
- Typewriter effect: `text.slice(0, Math.floor(tween(frame, [0, 2 * fps], [0, text.length], EASE.inOut)))`.
- Fonts: add the `.woff2` file to `public/fonts/`, call `loadFont({family, url: staticFile(...), weight})` in `src/theme/index.ts`, then use the family name.
  (`@remotion/google-fonts` also works on machines with internet access.)

### Animate graphics
- **Entrances:** `springIn({ frame, fps, delay, config: SPRINGS.snappy | SPRINGS.bouncy | SPRINGS.smooth })` returns a value that goes from 0 to 1 (with overshoot for bouncy springs). Map it to scale, translate or opacity.
- **Tweens:** `tween(frame, [startFrame, endFrame], [from, to], EASE.out)` is clamped, eased `interpolate()`.
- **Shapes:** `@remotion/shapes` provides Circle, Rect, Triangle, Star, Polygon, Pie, Ellipse, Heart, Arrow, Callout and Spark. You can also wrap them in `<AnimatedShape>`.
- **SVG path drawing:** `evolvePath(progress, d)` from `@remotion/paths` (install with `npx remotion add @remotion/paths`).
- **Exits:** fade out near the end with `tween(frame, [durationInFrames - 0.5 * fps, durationInFrames - 1], [1, 0])`.
- **Performance:** avoid large `filter: blur()` on big elements. Use radial gradients for glows, as `Background.tsx` does.

### Transitions
```tsx
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";      // also: slide, wipe, flip, clock-wipe, iris…
<TransitionSeries.Transition presentation={slide({ direction: "from-right" })}
  timing={springTiming({ config: { damping: 200 }, durationInFrames: 18 })} />
```
Transitions overlap the two neighboring scenes, so total duration = sum of scenes − sum of transitions.

### Synchronize audio
- Put the file in `public/audio/`. Then either:
  - use `<BackgroundMusic src="audio/track.mp3" volume={0.5} fadeSeconds={1} />`, or
  - use `<Audio src={staticFile("audio/track.mp3")} />` from `@remotion/media` directly.
- **Start a sound at a moment:** wrap it in `<Sequence from={2 * fps}>`. Trim the source with `trimBefore={1 * fps}`.
- **Volume automation:** pass a function, `volume={(f) => interpolate(f, [0, fps], [0, 1], {extrapolateRight: "clamp"})}`. Here `f` counts from the start of the audio.
- **Hit animation beats:** convert beat times in seconds to frames (`beat * fps`) and use those as `delay` / `from` values.
  For audio-reactive visuals, use `useWindowedAudioData` + `visualizeAudio` from `@remotion/media-utils`.
- **Fit the video to the audio length:** use `calculateMetadata` on the `<Composition>` to return `durationInFrames` from the audio duration (see `.claude/skills/remotion-markup/calculate-metadata.md`).
- Set a composition's `musicSrc` prop to `""` to render it silent.

### Preview and render
- `npm run dev` opens Studio. The left sidebar lists compositions, the right panel edits props, the timeline scrubs frames, and **Render** exports from the UI.
- `npm run render`, or `npx remotion render src/index.ts <Id> out/<file>.mp4` for any composition. The output is H.264 MP4 with AAC audio by default.
- First run: Remotion downloads Chrome Headless Shell automatically. If you are offline or behind a firewall, set `REMOTION_BROWSER_EXECUTABLE=/path/to/chrome` (see `remotion.config.ts`).

## Remotion Agent Skills

The official Remotion skills are installed in `.claude/skills/` (via `npx skills add remotion-dev/skills`, tracked in `skills-lock.json`).
Read them for detailed, version-matched guidance:

- `remotion-best-practices`
- `remotion-markup` (animations, fonts, audio, transitions, effects, and more)
- `remotion-render`
- `remotion-studio`
- `remotion-captions`
- `remotion-docs`
- `remotion-upgrade`

Update them with `npx skills update`.

Official docs: https://www.remotion.dev/docs. Remotion has its own license; it is free for individuals and companies of up to 3 people (https://www.remotion.dev/license).
