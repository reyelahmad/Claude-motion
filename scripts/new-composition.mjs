#!/usr/bin/env node
// Scaffold a new composition from the Blank template and register it in src/Root.tsx.
// Usage: npm run new -- MyVideo [--seconds 8] [--format landscape|portrait|square]

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith("--"));
const flag = (key, fallback) => {
  const i = args.indexOf(`--${key}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const seconds = Number(flag("seconds", "5"));
const format = flag("format", "landscape");

if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  console.error("Usage: npm run new -- MyVideo [--seconds 8] [--format landscape|portrait|square]");
  console.error("The name must be PascalCase (letters and digits, starting with a capital).");
  process.exit(1);
}
if (!["landscape", "portrait", "square"].includes(format)) {
  console.error(`Unknown format "${format}". Use landscape, portrait or square.`);
  process.exit(1);
}
if (!Number.isFinite(seconds) || seconds <= 0) {
  console.error("--seconds must be a positive number.");
  process.exit(1);
}

const dir = join(root, "src", "compositions", name);
const file = join(dir, `${name}.tsx`);
if (existsSync(file)) {
  console.error(`${file} already exists.`);
  process.exit(1);
}

const template = readFileSync(join(root, "src", "compositions", "Blank", "Blank.tsx"), "utf8")
  .replaceAll("BlankProps", `${name}Props`)
  .replaceAll("export const Blank:", `export const ${name}:`)
  .replace(/\/\*\*\n \* Minimal starting point[\s\S]*?\*\/\n/, `/** ${name} composition. */\n`);

mkdirSync(dir, { recursive: true });
writeFileSync(file, template);

const rootFile = join(root, "src", "Root.tsx");
let rootSrc = readFileSync(rootFile, "utf8");
const importMarker = "// @new-composition-imports";
const compMarker = "{/* @new-compositions";
if (!rootSrc.includes(importMarker) || !rootSrc.includes(compMarker)) {
  console.error("Markers not found in src/Root.tsx; register the composition manually.");
  process.exit(1);
}
rootSrc = rootSrc.replace(
  importMarker,
  `import { ${name} } from "./compositions/${name}/${name}";\n${importMarker}`,
);
rootSrc = rootSrc.replace(
  /( *)\{\/\* @new-compositions/,
  (_m, indent) =>
    `${indent}<Composition\n` +
    `${indent}  id="${name}"\n` +
    `${indent}  component={${name}}\n` +
    `${indent}  defaultProps={{ text: "${name}" }}\n` +
    `${indent}  fps={FPS}\n` +
    `${indent}  {...FORMATS.${format}}\n` +
    `${indent}  durationInFrames={secondsToFrames(${seconds}, FPS)}\n` +
    `${indent}/>\n\n${indent}{/* @new-compositions`,
);
writeFileSync(rootFile, rootSrc);

console.log(`Created src/compositions/${name}/${name}.tsx and registered "${name}" in src/Root.tsx.`);
console.log(`Preview: npm run dev    Render: npx remotion render src/index.ts ${name} out/${name}.mp4`);
