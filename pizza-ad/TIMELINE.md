# Pizza Ad: Timeline & How to Edit It

**30 frames = 1 second.** The ad is 450 frames (15 s).

The **voiceover drives the timing**: each scene starts when its voice line starts, and the price, delivery badge and phone-number groups land on the words that say them. The frame numbers below are the **reference timing** (measured with sample clips). Once you generate the real voice, beats shift by a few frames to match it. Studio always shows the real frame number at the bottom-left as you scrub.

---

## Master timeline

| Time | Frame | What happens | Synced to | Edit with (`src/config.ts` unless noted) |
| --- | --- | --- | --- | --- |
| **SCENE 1: The question** | | | | |
| 0.00 s | 0 | Phone springs up from the bottom (already moving on frame 0), tilted −4° | Start | Spring: `ChatScene.tsx` (`damping: 13`) · tilt: `layout.ts` `PHONE.tilt` |
| 0.17 s | 5 | Typing dots (•••) appear | 10 frames before the bubble | `TIMING.typingFrames` |
| 0.50 s | 15 | Bubble "আজকে আড্ডা হবে?" pops (rafi) + pop/vibrate SFX | Voice line 1 starts | `TIMING.nudge.hookBubble` · line start: `TIMING.nominalLineStarts[0]` |
| **SCENE 2: The problem** | | | | |
| 2.20 s | 66 | Bubble "বাজেট কম রে" + sad face (নাদিয়া); camera starts pushing in (1 → 1.08) | Voice line 2 starts | `TIMING.nudge.problemBubbles` |
| 2.47 s | 74 | Bubble "কিন্তু পিৎজা খাইতে মন চায়!" | 8 frames after previous | `TIMING.problemBubbleStagger` |
| **SCENE 3: The offer** | | | | |
| 5.10 s | 153 | Yellow offer card arrives in the chat + pop SFX | Voice line 3 starts | `TIMING.nudge.offerCard` |
| 5.50 s | 165 | **Whip zoom** into the card (motion blur, whoosh) | 18 frames before the price | `TIMING.whipFrames` (length = 8) |
| 5.63 s | 169 | Red stage revealed with a flash and zoom-out | Middle of the whip | — |
| 5.70 s | 171 / 175 / 179 | **3 pizzas burst out** and land (pop SFX each) | Right after the whip | `TIMING.pizzaStagger` (4 frames apart) |
| 6.10 s | 183 | **"৳৯৭০" PRICE SLAM**: scale 2.5→1, camera shake 4 frames, particle burst, slam SFX | Word **"নয়শো"** | `TIMING.nudge.price` (also moves the whip and pizzas) · word: `TIMING.cues.price` |
| 6.30 s | 189 | Light sweep across the price | 6 frames after slam | `TIMING.sweepDelay` |
| 6.43 s | 193 | "রেগুলার সাইজ" sticker pops (stays to the end) | 10 frames after slam | `timeline.ts` (`sizeLabel: price + 10`) |
| 7.20 s | 216 | "৩টা রেগুলার পিৎজা" rises word by word | Word **"তিনটা"** | `TIMING.nudge.count` · word: `TIMING.cues.count` |
| 8.70 s | 261 | **"ফ্রি হোম ডেলিভারি" badge** slides in, scooter rides across (ding SFX) | Word **"ফ্রি"** | `TIMING.nudge.delivery` · word: `TIMING.cues.delivery` |
| **SCENE 4: Call to action** | | | | |
| 10.00 s | 300 | Layout morphs: price block shrinks to the top, pizzas move to a row at the bottom, logo grows to centre | Voice line 4 starts | `TIMING.nudge.cta` · line start: `TIMING.nominalLineStarts[3]` |
| 10.13 s | 304 | Yellow call button pops in (phone icon rings every second) | 4 frames after scene start | `CtaScene.tsx` (`appear={b.cta + 4}`) |
| 10.20 s | 306 | "অর্ডার করতে কল করো" rises word by word | 6 frames after scene start | `CtaScene.tsx` (`start={b.cta + 6}`) |
| 11.30 s | 339 | Number group **013** appears | Word "শূন্য" (1st) | `TIMING.nudge.phoneGroups[0]` |
| 12.17 s | 365 | Group **46** | Word "চার" | `TIMING.nudge.phoneGroups[1]` |
| 12.80 s | 384 | Group **099** | Word "শূন্য" (2nd) | `TIMING.nudge.phoneGroups[2]` |
| 13.67 s | 410 | Group **272**, then the button starts pulsing (every 20 frames) | Word "দুই" | `TIMING.nudge.phoneGroups[3]` |
| 14.53 s | 436 | Ring SFX (after the number is fully spoken) | Voice line 4 end | `timeline.ts` (`ring`) |
| 15.00 s | 450 | End on a clean frame (no fade) | — | `CANVAS.targetSeconds` |

Logo: appears small top-left at frame ~173 (stage reveal), grows to the top centre at 300.

---

## How to edit

### 1. Move a moment earlier or later → `TIMING.nudge` in `src/config.ts`
Values are in **frames** (`15` = half a second later, `-6` = 0.2 s earlier). They move the visuals only; the voice stays put.
```ts
nudge: {
  hookBubble: 0,
  problemBubbles: 0,
  offerCard: 0,
  price: 0,          // also moves the whip + pizza burst that lead into it
  count: 0,
  delivery: 0,
  cta: 0,            // moves the whole call-to-action scene
  phoneGroups: [0, 0, 0, 0],
},
```
Safety rules keep the order sensible (e.g. the price never comes before the whip, the count never before the price).

### 2. Change which word a beat locks onto → `TIMING.cues`
e.g. make the price slam on "সত্তর" instead: `price: { line: 3, word: "সত্তর", occurrence: 1, fallback: 0.3 }`.
`fallback` (fraction of the line) is only used if there are no Azure word timings.

### 3. Change pacing between voice lines → `TIMING`
- `nominalLineStarts: [0.5, 2, 5, 10]`: where each line *tries* to start (seconds)
- `lineGap` / `minLineGap`: pause between lines
- `tail`: hold after the last word
- `CANVAS.targetSeconds`: total length (15)

### 4. Change animation speed and bounce → `MOTION`
- `punch` (`damping: 12`) is used by all pop-ins. Lower damping means more bounce; higher stiffness means faster.
- `settle` (`damping: 14`) is used by the layout morphs and logo.
- Fixed lengths: `TIMING.whipFrames`, `pizzaStagger`, `problemBubbleStagger`, `sweepDelay`, `typingFrames`.

### 5. Change positions and sizes → `src/lib/layout.ts`
- `OFFER_LAYOUT`: price, sticker, count line, pizzas, delivery badge (scene 3)
- `CTA_LAYOUT`: everything in scene 4 (button size, number font size, pizza row)
- `LOGO_LAYOUT`: logo corner and centre positions
- `PHONE`: phone size, position, tilt

Keep important things between **y = 220 and y = 1540** (Reels/Stories UI covers the rest).

### 6. Per-element animation details → `src/components/`
| Element | File | Examples |
| --- | --- | --- |
| Price slam / sticker / word-by-word text | `PriceSlam.tsx` | start scale `2.5`, shadow depth |
| Pizzas | `PizzaTrio.tsx` | burst start scale `0.2`, float `9` px, spin `7°/s` |
| Delivery badge | `DeliveryBadge.tsx` | scooter ride length (frames `+3 → +17`) |
| Call button | `CTAButton.tsx` | pulse every `20` frames, `1.04` scale, ring every second |
| Particles | `Particles.tsx` | count `44`, lifetime `28` frames |
| Camera shake | `scenes/OfferScene.tsx` | `20` px for `4` frames |
| Background | `Background.tsx` | light rotation speed, grain opacity `0.06` |

### 7. Audio levels → `MIX`
Voice `1.0`, music `0.22` ducking to `0.10` under the voice, SFX `0.5–0.6`.

---

## Seeing it in Studio
Run `npm run dev`. The timeline at the bottom shows these lanes: **Scenes 1–2: chat**, **Whip zoom**, **Scene 3: offer**, **Scene 4: call to action**, **VO line 1–4** and each **sfx**. Drag the playhead to any frame; the current frame number shows at the bottom-left.

Because the timing is calculated from the voice, dragging lanes in Studio won't save. Make changes in `src/config.ts`; Studio reloads instantly when you save.
