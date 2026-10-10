# Pizza Ad: 15-second Bangla sales ad (Remotion)

A 1080×1920, 30 fps vertical ad: a friends' group chat → the offer → call to action, with a Bangla voiceover that the animation syncs to.

## 1. Install
```bash
cd pizza-ad
npm install
```

## 2. Add your assets to `public/`
| File | Required | Notes |
| --- | --- | --- |
| `pizza.png` (or `pizza-1.png`, `pizza-2.png`, `pizza-3.png`) | yes | Cropped to a circle automatically. One photo is reused with different rotations. |
| `logo.png` | yes | Aspect ratio is always kept; never recoloured. |
| `music.mp3` | no | Ducks under the voice automatically. |
| `sfx/pop.mp3`, `whoosh.mp3`, `slam.mp3`, `ding.mp3`, `vibrate.mp3`, `ring.mp3` | no | Any missing one is skipped. |

If a required file is missing, Studio and the renderer stop with a message naming it.

## Current voiceover
`public/vo-1.mp3` … `vo-4.mp3` were cut from the supplied Cartesia recording (`source-audio/voiceover-cartesia-original.wav`) at the pauses between lines. `public/vo-timings.json` holds the times of the sync words (price, count, delivery, phone groups), measured from the audio. To fine-tune a beat, use `TIMING.nudge` in `src/config.ts` (see TIMELINE.md).
Running `npm run voiceover` (Azure) **replaces** these files.

## 3. Generate the voiceover (Azure, female voice `bn-BD-NabanitaNeural`)
Create `pizza-ad/.env` (it is git-ignored, and Remotion never bundles it):
```ini
AZURE_SPEECH_KEY=your-key
AZURE_SPEECH_REGION=your-region   # e.g. eastus, southeastasia
```
Then:
```bash
npm run voiceover
```
This checks the voice exists in your region and writes `public/vo-1.mp3` … `vo-4.mp3` plus `public/vo-timings.json` (word timings). The ad measures the clips and lands the price slam, delivery badge and each phone-number group on the exact spoken word.

Recorded audio instead? Put `vo-1.mp3` … `vo-4.mp3` in `public/` (and delete `vo-timings.json`), or use one `voiceover.mp3` and fill `ASSETS.voTimestamps` in `src/config.ts`.

## 4. Preview and render
```bash
npm run dev                                                                  # Remotion Studio
npx remotion render PizzaAd916 out/pizza-ad-9x16.mp4 --codec=h264 --crf=18   # final MP4
npx remotion still PizzaAd916 out/thumbnail.png --frame=230                  # thumbnail
```
Fonts come from Google Fonts. Offline? Uncomment `REMOTION_LOCAL_FONTS=1` in `.env.remotion` to use the bundled copies in `public/fonts/`.

## Making a new version: edit `src/config.ts`
| Change | Where |
| --- | --- |
| Price | `COPY.price`, `COPY.chat.offerCard.title`, and the spoken price in `VOICE.lines[2]` (`display` + `ssml`), plus `TIMING.cues.price.word` if the first spoken word of the price changes |
| Phone number | `COPY.phoneGroups` and `VOICE.lines[3]` (`display` + `ssml`); keep `TIMING.cues.phone` pointing at the first spoken word of each group |
| Hook line | `COPY.chat.hook` and `VOICE.lines[0]` |
| Colours | `COLORS` |
| Pacing | `TIMING`, `CANVAS.targetSeconds` |
| Audio levels | `MIX` |
After changing spoken text, run `npm run voiceover` again.

## Editing the animation
See [TIMELINE.md](TIMELINE.md): every beat with its time and frame, and which setting controls it.

## Structure
```
src/config.ts          All copy, colours, timings, asset paths, voice script, audio mix
src/PizzaAd.tsx        Composition + calculateMetadata (measures voice, builds the timeline)
src/lib/timeline.ts    Lays out voice lines and derives every visual beat from them
src/lib/assets.ts      Finds assets; errors on missing required files
src/scenes/            ChatScene (scenes 1–2), OfferScene (3), CtaScene (4)
src/components/        ChatBubble, PriceSlam, PizzaTrio, CTAButton, Particles, LightSweep, DeliveryBadge, Logo, Background, AdAudio, icons
scripts/generate-voiceover.ts   Azure TTS → vo-N.mp3 + word timings
```
