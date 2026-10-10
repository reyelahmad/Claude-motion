# CLAUDE.md

@AGENTS.md

## Claude Code specifics

- Remotion's official skills live in `.claude/skills/`. Invoke `/remotion-best-practices` when unsure, or a specific one: `/remotion-markup`, `/remotion-render`, `/remotion-studio`, `/remotion-captions`, `/remotion-docs`.
- Verify visual work by rendering stills (`npx remotion still src/index.ts <Id> out/f.png --frame=N`) and viewing the PNGs, then run `npm run lint`.
- Do not commit `out/`; it is git-ignored.
