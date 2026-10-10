/**
 * Generates the Bangla voiceover with Azure Speech (one MP3 per line) plus
 * word timings, so the animation can land beats exactly on spoken words.
 *
 *   1. Put your key in pizza-ad/.env:
 *        AZURE_SPEECH_KEY=...
 *        AZURE_SPEECH_REGION=eastus   (your Speech resource's region)
 *   2. npm run voiceover
 *
 * Output: public/vo-1.mp3 … vo-4.mp3 and public/vo-timings.json
 * Edit the script text and voice in src/config.ts (VOICE).
 */
import "dotenv/config";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { ASSETS, CANVAS, TIMING, VOICE } from "../src/config";
import type { VoTimingsFile, WordTiming } from "../src/lib/timeline";

const key = process.env.AZURE_SPEECH_KEY;
const region = process.env.AZURE_SPEECH_REGION;
const publicDir = join(__dirname, "..", "public");

const fail = (msg: string): never => {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
};

if (!key || !region) {
  fail("AZURE_SPEECH_KEY and AZURE_SPEECH_REGION must be set in pizza-ad/.env");
}

const ssmlFor = (inner: string) =>
  `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="bn-BD">` +
  `<voice name="${VOICE.name}"><prosody rate="${VOICE.rate}" pitch="${VOICE.pitch}">${inner}</prosody></voice></speak>`;

/** Confirms the chosen voice exists in this region. */
const checkVoice = async () => {
  const res = await fetch(
    `https://${region}.tts.speech.microsoft.com/cognitiveservices/voices/list`,
    {
      headers: { "Ocp-Apim-Subscription-Key": key! },
    },
  );
  if (!res.ok)
    fail(
      `Could not list voices (HTTP ${res.status}). Check the key and region.`,
    );
  const voices = (await res.json()) as {
    ShortName: string;
    Locale: string;
    Gender: string;
  }[];
  if (!voices.some((v) => v.ShortName === VOICE.name)) {
    const bn = voices
      .filter((v) => v.Locale.startsWith("bn-"))
      .map((v) => `${v.ShortName} (${v.Gender})`);
    fail(
      `Voice ${VOICE.name} is not available in ${region}. Bengali voices here: ${bn.join(", ") || "none"}`,
    );
  }
  console.log(`✓ Voice ${VOICE.name} is available in ${region}`);
};

const synthesize = (
  ssml: string,
): Promise<{ audio: ArrayBuffer; durationMs: number; words: WordTiming[] }> =>
  new Promise((resolve, reject) => {
    const config = sdk.SpeechConfig.fromSubscription(key!, region!);
    config.speechSynthesisOutputFormat =
      sdk.SpeechSynthesisOutputFormat.Audio24Khz96KBitRateMonoMp3;
    // Request word boundary events.
    config.setProperty(
      sdk.PropertyId.SpeechServiceResponse_RequestWordBoundary,
      "true",
    );
    const synth = new sdk.SpeechSynthesizer(config, null);
    const words: WordTiming[] = [];
    synth.wordBoundary = (_s, e) => {
      if (e.boundaryType === sdk.SpeechSynthesisBoundaryType.Word) {
        words.push({
          text: e.text,
          offsetMs: e.audioOffset / 10000,
          durationMs: e.duration / 10000,
        });
      }
    };
    synth.speakSsmlAsync(
      ssml,
      (result) => {
        synth.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          resolve({
            audio: result.audioData,
            durationMs: result.audioDuration / 10000,
            words,
          });
        } else {
          reject(
            new Error(
              sdk.CancellationDetails.fromResult(result).errorDetails ||
                "Synthesis failed",
            ),
          );
        }
      },
      (err) => {
        synth.close();
        reject(new Error(err));
      },
    );
  });

const normalize = (s: string) =>
  s.normalize("NFC").replace(/[\s,.!?।:;…"'“”‘’-]/g, "");

const main = async () => {
  await checkVoice();
  const out: VoTimingsFile = { voice: VOICE.name, lines: [] };

  for (let i = 0; i < VOICE.lines.length; i++) {
    const file = ASSETS.voLines[i];
    process.stdout.write(`… Line ${i + 1}: ${VOICE.lines[i].display}\n`);
    const { audio, durationMs, words } = await synthesize(
      ssmlFor(VOICE.lines[i].ssml),
    );
    writeFileSync(join(publicDir, file), Buffer.from(audio));
    out.lines.push({ file, durationMs, words });
    console.log(
      `✓ public/${file}  ${(durationMs / 1000).toFixed(2)} s, ${words.length} words`,
    );
  }

  writeFileSync(
    join(publicDir, ASSETS.voWordTimings),
    JSON.stringify(out, null, 2),
  );
  console.log(`✓ public/${ASSETS.voWordTimings}`);

  // Report whether every sync word was found.
  const cues = [
    TIMING.cues.price,
    TIMING.cues.count,
    TIMING.cues.delivery,
    ...TIMING.cues.phone,
  ];
  for (const cue of cues) {
    const hits = out.lines[cue.line - 1].words.filter(
      (w) => normalize(w.text) === normalize(cue.word),
    ).length;
    console.log(
      `${hits >= cue.occurrence ? "✓" : "⚠"} sync word "${cue.word}" (#${cue.occurrence}) in line ${cue.line}${hits >= cue.occurrence ? "" : ": not found, a timing estimate will be used"}`,
    );
  }

  const total = out.lines.reduce((s, l) => s + l.durationMs, 0) / 1000;
  console.log(
    `\nTotal speech: ${total.toFixed(2)} s (target ad length ${CANVAS.targetSeconds} s). Reload Remotion Studio to sync.`,
  );
};

main().catch((e) => fail(e instanceof Error ? e.message : String(e)));
