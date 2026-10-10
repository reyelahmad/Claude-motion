import React from "react";
import { Composition, Folder } from "remotion";
import { DEFAULT_FORMAT, FORMATS, FPS, secondsToFrames } from "./config/video";
import { Blank } from "./compositions/Blank/Blank";
import { IntroScene } from "./compositions/Showcase/scenes/IntroScene";
import { OutroScene } from "./compositions/Showcase/scenes/OutroScene";
import { ShapesScene } from "./compositions/Showcase/scenes/ShapesScene";
import { TypographyScene } from "./compositions/Showcase/scenes/TypographyScene";
import {
  showcaseDefaultProps,
  showcaseSchema,
} from "./compositions/Showcase/schema";
import { Showcase } from "./compositions/Showcase/Showcase";
import {
  getShowcaseDuration,
  sceneFrames,
} from "./compositions/Showcase/timeline";
// @new-composition-imports (scripts/new-composition.mjs inserts imports above this line)

// Each <Composition> appears in the Studio sidebar. Its `id` is what you render:
//   npx remotion render src/index.ts <id> out/<id>.mp4
// Resolution: FORMATS in src/config/video.ts. Frame rate: FPS. Duration: per composition.

const { width, height } = FORMATS[DEFAULT_FORMAT];
const p = showcaseDefaultProps;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Showcase"
        component={Showcase}
        schema={showcaseSchema}
        // Inline literal so Studio can save prop edits back to this file.
        // Keep in sync with showcaseDefaultProps (used by the variants and scenes below).
        defaultProps={{
          title: "Claude Motion",
          subtitle: "Programmatic motion graphics, written in React",
          keywords: ["Design.", "Animate.", "Render."],
          outroTitle: "Made with Remotion",
          outroCta: "npm run render",
          accentColor: "#FF4D8D",
          musicSrc: "audio/ambient-pad.mp3",
        }}
        fps={FPS}
        width={width}
        height={height}
        durationInFrames={getShowcaseDuration(FPS)}
      />

      <Folder name="Formats">
        <Composition
          id="Showcase-Portrait"
          component={Showcase}
          schema={showcaseSchema}
          defaultProps={showcaseDefaultProps}
          fps={FPS}
          {...FORMATS.portrait}
          durationInFrames={getShowcaseDuration(FPS)}
        />
        <Composition
          id="Showcase-Square"
          component={Showcase}
          schema={showcaseSchema}
          defaultProps={showcaseDefaultProps}
          fps={FPS}
          {...FORMATS.square}
          durationInFrames={getShowcaseDuration(FPS)}
        />
      </Folder>

      {/* Each scene registered on its own so it can be previewed/edited in isolation. */}
      <Folder name="Showcase-Scenes">
        <Composition
          id="Scene-Intro"
          component={IntroScene}
          defaultProps={{
            title: p.title,
            subtitle: p.subtitle,
            accentColor: p.accentColor,
          }}
          fps={FPS}
          width={width}
          height={height}
          durationInFrames={sceneFrames("intro", FPS)}
        />
        <Composition
          id="Scene-Shapes"
          component={ShapesScene}
          defaultProps={{ accentColor: p.accentColor }}
          fps={FPS}
          width={width}
          height={height}
          durationInFrames={sceneFrames("shapes", FPS)}
        />
        <Composition
          id="Scene-Typography"
          component={TypographyScene}
          defaultProps={{ keywords: p.keywords, accentColor: p.accentColor }}
          fps={FPS}
          width={width}
          height={height}
          durationInFrames={sceneFrames("typography", FPS)}
        />
        <Composition
          id="Scene-Outro"
          component={OutroScene}
          defaultProps={{
            outroTitle: p.outroTitle,
            outroCta: p.outroCta,
            accentColor: p.accentColor,
          }}
          fps={FPS}
          width={width}
          height={height}
          durationInFrames={sceneFrames("outro", FPS)}
        />
      </Folder>

      <Folder name="Templates">
        <Composition
          id="Blank"
          component={Blank}
          defaultProps={{ text: "Your idea here" }}
          fps={FPS}
          width={width}
          height={height}
          durationInFrames={secondsToFrames(3, FPS)}
        />
      </Folder>

      {/* @new-compositions (scripts/new-composition.mjs inserts compositions above this line) */}
    </>
  );
};
