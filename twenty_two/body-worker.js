// pocket-stage/native/src/wasm/chimera.ts
var module = null;
var exports = null;
var loading = null;
function initChimera(source) {
  if (loading) return loading;
  loading = (async () => {
    let mod;
    if (source && typeof source !== "string") mod = await WebAssembly.compile(source);
    else {
      const url = source ?? (await import("./chimera.wasm?url")).default;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`engine: ${url}: HTTP ${res.status}`);
      mod = await WebAssembly.compile(await res.arrayBuffer());
    }
    if (WebAssembly.Module.imports(mod).length) throw new Error("engine: the wasm module must not have imports");
    exports = (await WebAssembly.instantiate(mod, {})).exports;
    module = mod;
  })();
  loading.catch(() => loading = null);
  return loading;
}
function chimeraModule() {
  if (!module) throw new Error("engine not loaded (await initChimera())");
  return module;
}
function x() {
  if (!exports) throw new Error("engine not loaded (await initChimera())");
  return exports;
}
var enc = new TextEncoder();
var dec = new TextDecoder();
function call(fn, args = {}) {
  const e = x();
  const bytes = enc.encode(JSON.stringify({ fn, ...args }));
  const p = e.chimera_alloc(bytes.length);
  new Uint8Array(e.memory.buffer, p, bytes.length).set(bytes);
  const status = e.chimera_call(p, bytes.length);
  e.chimera_free(p, bytes.length);
  const out = dec.decode(new Uint8Array(e.memory.buffer, e.chimera_result_ptr(), e.chimera_result_len()));
  const v = JSON.parse(out);
  if (status !== 0) throw new Error(`engine ${fn}: ${v.error}`);
  return v;
}

// pocket-stage/native/src/wasm/wire.ts
var GESTURE_RECORD = 272;
var CONTROL_KEYS = [
  "jaw",
  "tbX",
  "tbY",
  "ttX",
  "ttY",
  "ttCurl",
  "root",
  "lipAp",
  "lipProt",
  "lipWidth",
  "labiodental",
  "velum",
  "larynx",
  "epilarynx",
  "ventricular",
  "lateral",
  "dorsum",
  "abduction",
  "closure",
  "breath",
  "f0",
  "vibrato"
];
var KEY_INDEX = Object.fromEntries(CONTROL_KEYS.map((k, i) => [k, i]));
var LABEL_CAP = 24;
function utf8(s) {
  const out = [];
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c < 128) out.push(c);
    else if (c < 2048) out.push(192 | c >> 6, 128 | c & 63);
    else if (c < 65536) out.push(224 | c >> 12, 128 | c >> 6 & 63, 128 | c & 63);
    else out.push(240 | c >> 18, 128 | c >> 12 & 63, 128 | c >> 6 & 63, 128 | c & 63);
  }
  return out;
}
function writeGestures(buf, at, gestures, max) {
  const n = Math.min(gestures.length, max);
  const dv = new DataView(buf, at, n * GESTURE_RECORD);
  const bytes = new Uint8Array(buf, at, n * GESTURE_RECORD);
  for (let i = 0; i < n; i++) {
    const g = gestures[i];
    const o = i * GESTURE_RECORD;
    const head = [g.t0, g.t1, g.rampIn, g.rampOut, g.strength, g.speed ?? NaN, g.releaseHold ?? NaN, g.tag ?? NaN];
    for (let j = 0; j < 8; j++) dv.setFloat64(o + j * 8, head[j], true);
    for (let k = 0; k < CONTROL_KEYS.length; k++) dv.setFloat64(o + 64 + k * 8, NaN, true);
    for (const [key, value] of Object.entries(g.targets)) {
      const k = KEY_INDEX[key];
      if (k !== void 0 && value !== void 0) dv.setFloat64(o + 64 + k * 8, value, true);
    }
    if (g.label === void 0) bytes[o + 240] = 255;
    else {
      let b = utf8(g.label);
      if (b.length > LABEL_CAP) {
        let n2 = LABEL_CAP;
        while (n2 > 0 && (b[n2] & 192) === 128) n2--;
        b = b.slice(0, n2);
      }
      bytes[o + 240] = b.length;
      bytes.set(b, o + 241);
    }
  }
  return n;
}

// twenty-two-full/mandarin-adapter.mjs
var direct = /* @__PURE__ */ new Set(["a", "e", "f", "h", "i", "j", "k", "l", "m", "n", "o", "p", "s", "t", "ts", "u", "w", "x", "y", "\u014B", "\u0259", "\u025B", "\u0264", "\u027B", "\u0282", "\u028A", "\u0290"]);
var vowels = /* @__PURE__ */ new Set(["a", "e", "i", "o", "u", "y", "\u0259", "\u025B", "\u0264", "\u028A", "\u025D"]);
var special = {
  "ai\u032F": { phones: ["a", "i"], weights: [3.5, 0.8], note: "explicit nonsyllabic i offglide" },
  "au\u032F": { phones: ["a", "u"], weights: [3.5, 0.8], note: "explicit nonsyllabic u offglide" },
  "ei\u032F": { phones: ["e", "i"], weights: [3.5, 0.8], note: "explicit nonsyllabic i offglide" },
  "ou\u032F": { phones: ["o", "u"], weights: [3.5, 0.8], note: "explicit nonsyllabic u offglide" },
  "\u025A": { phones: ["\u025D"], weights: [3.5], approximation: "Chimera calibrated rhotic vowel" },
  "a\u025A\u032F": { phones: ["a", "\u025D"], weights: [3.5, 0.8], approximation: "calibrated rhotic offglide" },
  "\u0279\u0329": { phones: ["z"], weights: [3.5], approximation: "sustained voiced alveolar frication for apical nucleus" },
  "z\u0329": { phones: ["z"], weights: [3.5], note: "syllabic voiced alveolar frication" },
  "\u027B\u0329": { phones: ["\u0290"], weights: [3.5], approximation: "sustained voiced retroflex frication for apical nucleus" },
  "\u0290\u0329": { phones: ["\u0290"], weights: [3.5], note: "syllabic voiced retroflex frication" },
  "\u0288\u0282": { phones: ["\u0288", "\u0282"], weights: [0.45, 0.55], note: "explicit retroflex closure and frication" },
  "t\u0255": { phones: ["t\u0283"], weights: [1], approximation: "postalveolar affricate with explicit unrounded lips; alveolopalatal target not calibrated", palatal: true },
  "\u0255": { phones: ["\xE7"], weights: [1], approximation: "palatal fricative; alveolopalatal target not calibrated", palatal: true },
  "\u0265": { phones: ["j"], weights: [0.55], approximation: "palatal glide with rounded lips", roundedGlide: true }
};
function adaptMandarin(parts, options = {}) {
  if (!Array.isArray(parts) || !parts.length) throw new Error("Missing Mandarin IPA parts");
  if (options.palatalFricative !== void 0 && !["\xE7", "\u0283"].includes(options.palatalFricative)) throw new Error("Unsupported palatal fricative candidate");
  if (options.retroflexNucleus !== void 0 && !["\u0290", "\u0268"].includes(options.retroflexNucleus)) throw new Error("Unsupported retroflex nucleus candidate");
  const units = [];
  const notes = [];
  for (const original of parts) {
    const aspirated = original.endsWith("\u02B0");
    const symbol = aspirated ? original.slice(0, -1) : original;
    let mapping = special[symbol];
    if (symbol === "\u0255" && options.palatalFricative === "\u0283") mapping = { ...mapping, phones: ["\u0283"], approximation: "unrounded postalveolar fricative before the existing palatal glide; experimental alveolopalatal approximation" };
    if (["\u027B\u0329", "\u0290\u0329"].includes(symbol) && options.retroflexNucleus === "\u0268") mapping = { ...mapping, phones: ["\u0268"], approximation: "central high vowel following retroflex onset; experimental apical-nucleus approximation" };
    if (!mapping) {
      if (!direct.has(symbol)) throw new Error("Unsupported Mandarin IPA: " + original);
      mapping = { phones: [symbol], weights: [vowels.has(symbol) ? 3.5 : ["j", "w"].includes(symbol) ? 0.55 : 1] };
    }
    const stop = ["p", "t", "k", "ts", "\u0288\u0282", "t\u0255"].includes(symbol);
    if (aspirated && !stop) throw new Error("Unexpected aspiration mark: " + original);
    const first = units.length;
    mapping.phones.forEach((ipa, i) => units.push({ ipa, weight: mapping.weights[i], source: original, aspiration: stop && i === 0 ? aspirated ? "aspirated" : "unaspirated" : null, palatal: !!mapping.palatal, roundedGlide: !!mapping.roundedGlide }));
    if (mapping.note || mapping.approximation) notes.push({ source: original, firstUnit: first, note: mapping.note, approximation: mapping.approximation });
  }
  return { units, notes, perceptuallyVerified: false };
}
function applyMandarinControls(plan, scheduled, options = {}) {
  const nasalLead = options.velarNasalReleaseLead ?? 0;
  if (!Number.isFinite(nasalLead) || nasalLead < 0 || nasalLead > 0.04) throw new Error("Invalid nasal release lead");
  const changes = [];
  for (const s of scheduled) {
    if (nasalLead && s.ipa === "\u014B") {
      const g = plan.gestures.find((g2) => g2.label === "velum" && Math.abs(g2.t0 - (s.start - 0.02)) < 1e-6);
      if (!g) throw new Error("Missing velar nasal gesture");
      const oldEnd = g.t1;
      g.t1 = Math.max(g.t0 + 5e-3, g.t1 - nasalLead);
      changes.push({ source: s.source, kind: "experimental-velar-nasal-release", token: s.token, oldEnd, newEnd: g.t1 });
    }
    for (const g of plan.gestures) {
      if (g.t0 < s.start - 0.04 || g.t0 >= s.end - 1e-7) continue;
      if (s.aspiration && !options.nativeAspiration && g.label === "aspiration") {
        const aspirated = s.aspiration === "aspirated";
        g.t1 = s.end + (aspirated ? 0.02 : 48e-4);
        g.rampOut = aspirated ? 0.045 : 0.02;
        g.targets.abduction = aspirated ? 0.36 : 0.22;
        changes.push({ source: s.source, ipa: s.ipa, kind: s.aspiration, t0: g.t0, t1: g.t1 });
      }
      if (s.palatal && g.label === s.ipa) {
        g.targets.lipProt = 0;
        g.targets.lipWidth = 1;
        changes.push({ source: s.source, kind: "unrounded-palatal-approximation" });
      }
      if (s.roundedGlide && g.label === s.ipa) {
        g.targets.lipProt = 1;
        g.targets.lipWidth = 0.2;
        g.targets.lipAp = 0.4;
        changes.push({ source: s.source, kind: "rounded-glide-approximation" });
      }
    }
  }
  return changes;
}

// twenty-two-full/plan-native-song.mjs
function planMandarinSong(call2, score, inventory) {
  const unitLists = [];
  const notes = score.tokens.map((token, i) => {
    if (token.language === "en") {
      const syllables = token.singingSyllable ? [token.singingSyllable] : token.text.toLowerCase() === "mm" ? [{ text: token.text, onset: [], nucleus: { ipa: "m" }, coda: [], wordEnd: true }] : call2("lyricsToSyllables", { text: token.text });
      if (syllables.length !== 1) throw new Error(`Explicit syllable timing or vocable required: ${token.id} ${token.text}`);
      const syl = syllables[0];
      const diphthongs = { "o\u028A": ["o", "u"], "e\u026A": ["e", "i"], "a\u026A": ["a", "\u026A"], "a\u028A": ["a", "\u028A"], "\u0254\u026A": ["\u0254", "\u026A"] };
      const nucleus = diphthongs[syl.nucleus.ipa] ?? [syl.nucleus.ipa];
      const units2 = [...syl.onset.map((p) => ({ ipa: p.ipa, weight: 1 })), ...nucleus.map((ipa, i2) => ({ ipa, weight: i2 === 0 ? 3.5 : 0.8 })), ...syl.coda.map((p) => ({ ipa: p.ipa, weight: 1 }))];
      unitLists.push(units2.map((u) => ({ ...u, source: token.text, token: token.id, aspiration: null, palatal: false, roundedGlide: false })));
      const end2 = i + 1 < score.tokens.length ? score.tokens[i + 1].start : token.end;
      if (!(end2 > token.start)) throw new Error("Invalid English vowel-note interval");
      return { midi: 60, beats: end2 - token.start, syl: { ...syl, phraseEnd: i === score.tokens.length - 1 } };
    }
    if (token.language !== "zh") throw new Error("Unsupported lyric language");
    const entry = inventory.find((s) => s.pinyin === token.pinyin);
    if (!entry) throw new Error("Missing transcription");
    let parts = entry.toneless_candidates[0];
    if (score.adapterOptions?.engVowel !== void 0 && !["\u0259", "\u0264"].includes(score.adapterOptions.engVowel)) throw new Error("Unsupported eng vowel candidate");
    if (score.adapterOptions?.engVowel === "\u0264" && parts.includes("\u014B")) parts = parts.map((p) => p === "\u0259" ? "\u0264" : p);
    const neutralSchwa = score.adapterOptions?.neutralSchwa === true && ["de5", "zhe5", "me5"].includes(token.pinyin);
    const mapped = adaptMandarin(neutralSchwa ? parts.map((p) => p === "\u0264" ? "\u0259" : p) : parts, score.adapterOptions);
    if (neutralSchwa) mapped.notes.push({ source: token.pinyin, approximation: "experimental contextual neutral vowel \u0264\u2192\u0259; song pitch and timing retained" });
    if (score.adapterOptions?.nativeAspiration) {
      for (const u of mapped.units) if (u.aspiration === "aspirated") u.ipa += "\u02B0";
    }
    const index = mapped.units.findIndex((u) => u.weight >= 3.5);
    if (index < 0) throw new Error("Missing syllable nucleus");
    unitLists.push(mapped.units.map((u) => ({ ...u, token: token.id })));
    const end = i + 1 < score.tokens.length ? score.tokens[i + 1].start : token.end;
    const beats = end - token.start;
    if (!(beats > 0)) throw new Error("Invalid vowel-note interval");
    return { midi: 60, beats, syl: { text: token.text, onset: mapped.units.slice(0, index).map((u) => ({ ipa: u.ipa })), nucleus: { ipa: mapped.units[index].ipa }, coda: mapped.units.slice(index + 1).map((u) => ({ ipa: u.ipa })), wordEnd: true, phraseEnd: i === score.tokens.length - 1 } };
  });
  const consonantScale = score.adapterOptions?.consonantScale;
  if (consonantScale !== void 0) {
    if (!(consonantScale >= 0.5 && consonantScale <= 1)) throw new Error("Invalid consonant scale");
    const durations = /* @__PURE__ */ new Map(), vowels2 = /* @__PURE__ */ new Set(["a", "e", "i", "o", "u", "y", "\u0259", "\u025B", "\u0264", "\u028A", "\u025D", "\u0268"]);
    const shorten = (p) => {
      if (vowels2.has(p.ipa)) return p;
      let d = durations.get(p.ipa);
      if (d === void 0) {
        const r = call2("planSong", { notes: [{ midi: 60, beats: 2, syl: { text: "", onset: [p], nucleus: { ipa: "a" }, coda: [], wordEnd: true, phraseEnd: true } }], options: { body: { female: 0, child: 0 }, bpm: 60, t0: 1, vibrato: 0 } });
        d = 1 - r.segments[0].t0;
        durations.set(p.ipa, d);
      }
      return { ...p, dur: d * consonantScale };
    };
    for (const n of notes) {
      n.syl.onset = n.syl.onset.map(shorten);
      n.syl.coda = n.syl.coda.map(shorten);
    }
  }
  const plan = call2("planSong", { notes, options: { body: score.body ?? { female: 0, child: 0 }, bpm: 60, t0: score.tokens[0].start - score.sourceStart + score.lead, vibrato: 0, ...score.adapterOptions?.nativeAspiration ? { aspiration: "marked" } : {} } });
  const units = unitLists.flat();
  if (plan.segments.length !== units.length) throw new Error("Native planner changed phone count");
  const scheduled = plan.segments.map((s, i) => {
    if (s.ipa !== units[i].ipa) throw new Error("Native planner changed phone identity");
    return { ...units[i], start: s.t0, end: s.t1 };
  });
  plan.gestures = plan.gestures.filter((g) => g.targets.f0 === void 0);
  const changes = applyMandarinControls(plan, scheduled, score.adapterOptions);
  const cap = score.adapterOptions?.vowelRampCap;
  if (cap !== void 0) {
    if (!(cap >= 0.01 && cap <= 0.08)) throw new Error("Invalid vowel articulation ramp cap");
    const vowelLabels = /* @__PURE__ */ new Set(["a", "e", "i", "o", "u", "y", "\u0259", "\u025B", "\u0264", "\u028A", "\u025D", "\u0268"]);
    for (const g of plan.gestures) if (vowelLabels.has(g.label)) {
      const before = [g.rampIn, g.rampOut];
      g.rampIn = Math.min(g.rampIn, cap);
      g.rampOut = Math.min(g.rampOut, cap);
      if (before[0] !== g.rampIn || before[1] !== g.rampOut) changes.push({ kind: "explicit-vowel-transition-cap", label: g.label, t0: g.t0, before, after: [g.rampIn, g.rampOut] });
    }
  }
  return { plan, scheduled, changes, notes };
}

// pocket-stage/body-render.mjs
async function renderBody({ wasm, dictionary, score, id, body }, progress = () => {
}) {
  if (!["lead", "harmony1", "harmony2", "bass"].includes(id) || ![body.female, body.child].every((v) => Number.isFinite(v) && v >= 0 && v <= 1)) throw Error("Invalid voice/body");
  await initChimera(wasm);
  call("g2pLoad", { text: dictionary });
  const sr = 48e3, track = score.tracks[id], audio = new Float32Array(Math.round(score.duration * sr)), frames = [], words = [];
  const chunks = [];
  if (id === "lead") for (const p of track.phrases) {
    const c = { ...p, body, lead: p.lead + 0.15 };
    const { plan, scheduled } = planMandarinSong(call, c, score.inventory);
    chunks.push({ gestures: plan.gestures, offset: p.sourceStart - c.lead, duration: p.duration + 0.15, pitch: p.pitch.map((v) => ({ ...v, time: v.time + 0.15 })), source: "lead" });
    mouths(p.tokens, scheduled, p.sourceStart - c.lead);
  }
  else if (id === "bass") for (let start = 0; start < score.duration; start += 10) {
    const notes = track.notes.filter((n) => n.start >= start && n.start < start + 10);
    if (!notes.length) continue;
    const gestures = notes.flatMap((n) => call("planSong", { notes: [{ midi: n.midi, beats: n.end - n.start, syl: { text: "m", onset: [], nucleus: { ipa: "m" }, coda: [], wordEnd: true, phraseEnd: true } }], options: { body, bpm: 60, t0: n.start - start + 0.15, vibrato: 0 } }).gestures);
    chunks.push({ gestures, offset: start - 0.15, duration: Math.max(...notes.map((n) => n.end)) - start + 0.5, source: "bass" });
  }
  else {
    const gestures = [];
    for (const p of track.phrases) {
      const { plan, scheduled } = planMandarinSong(call, { tokens: p.tokens, sourceStart: 0, lead: 0.15, body, adapterOptions: p.adapterOptions }, score.inventory);
      gestures.push(...plan.gestures);
      mouths(p.tokens, scheduled, -0.15);
    }
    chunks.push({ gestures, offset: -0.15, duration: score.duration + 0.15, pitch: track.pitch.map((v) => ({ ...v, time: v.time + 0.15 })), source: "harmony" });
  }
  function mouths(tokens, scheduled, offset) {
    for (const t of tokens) {
      const phones = scheduled.filter((p) => p.token === t.id);
      const nucleus = phones.find((p) => p.weight >= 3.5);
      if (Math.abs(nucleus.start + offset - t.start) > 2e-3) throw Error("Body change displaced lyric timing");
      words.push({ ...t, start: Math.min(...phones.map((p) => p.start)) + offset, end: Math.max(...phones.map((p) => p.end)) + offset });
    }
  }
  for (let ci = 0; ci < chunks.length; ci++) {
    const c = chunks[ci], x2 = new WebAssembly.Instance(chimeraModule(), {}).exports, h = x2.engine_new(sr);
    x2.engine_set_body(h, body.female, body.child);
    const v = new Float64Array(x2.memory.buffer, x2.engine_values(h), 32).fill(NaN);
    v[1] = c.source === "lead" ? 2e-3 : c.source === "bass" ? 0.012 : 0.035;
    if (c.source !== "harmony") {
      v[6] = 0;
      v[7] = 0;
      v[9] = 0;
      v[11] = c.source === "lead" ? 0.25 : 0.15;
    }
    x2.engine_set_source(h);
    c.gestures.sort((a, b) => a.t0 - b.t0);
    for (let j = 0; j < c.gestures.length; j += 4e3) x2.engine_schedule(h, writeGestures(x2.memory.buffer, x2.engine_records(h), c.gestures.slice(j, j + 4e3), 4e3), 0, j === 0 ? 1 : 0);
    const len = Math.round(c.duration * sr), samples = new Float32Array(len);
    let pi = 0;
    for (let at = 0; at < len; at += 128) {
      const time = at / sr;
      if (c.pitch) {
        while (pi < c.pitch.length - 2 && c.pitch[pi + 1].time < time) pi++;
        const a = c.pitch[pi], b = c.pitch[pi + 1] ?? a, w = Math.max(0, Math.min(1, (time - a.time) / Math.max(1e-8, b.time - a.time)));
        const v2 = new Float64Array(x2.memory.buffer, x2.engine_values(h), 32).fill(NaN);
        v2[0] = Math.exp(Math.log(a.hz) * (1 - w) + Math.log(b.hz) * w);
        x2.engine_set_source(h);
      }
      const n = Math.min(128, len - at);
      samples.set(new Float32Array(x2.memory.buffer, x2.engine_render(h, n), n), at);
      if (at % 1024 === 0) {
        const ptr = x2.engine_telemetry(h), z = Array.from(new Float64Array(x2.memory.buffer, ptr, 16)), [na, np, no] = z.slice(11, 14), ng = z[14], d = Array.from(new Float64Array(x2.memory.buffer, ptr + 128, na + 3 * (np + no) + 2 * ng));
        frames.push({ time: c.offset + z[10], f0: z[3], voicing: z[4], outRms: z[6], artic: d.slice(0, na), velumPort: z[2], phLen: z[0], orLen: z[1], phAreas: d.slice(na, na + np), orAreas: d.slice(na + np, na + np + no), pressureRms: d.slice(na + np + no, na + 2 * (np + no)), flow: d.slice(na + 2 * (np + no), na + 3 * (np + no)), pLung: z[5], gate: z[9], clock: z[10], noiseLevel: z[7], noiseNode: z[8], glottalArea: d.slice(na + 3 * (np + no), na + 3 * (np + no) + ng).filter((_, i) => i % 4 === 0), glottalFlow: d.slice(na + 3 * (np + no) + ng).filter((_, i) => i % 4 === 0) });
      }
      if (at % (sr * 2 - sr * 2 % 128) === 0) progress(Math.min(0.99, (ci + at / len) / chunks.length));
    }
    let peak2 = 0;
    for (const a of samples) {
      if (!Number.isFinite(a)) throw Error("Nonfinite synthesis");
      peak2 = Math.max(peak2, Math.abs(a));
    }
    const gain2 = c.source === "lead" && peak2 > 0 ? 0.52 / peak2 : 1, offset = Math.round(c.offset * sr);
    for (let i = 0; i < len; i++) if (offset + i >= 0 && offset + i < audio.length) audio[offset + i] += samples[i] * gain2;
    x2.engine_free(h);
  }
  let peak = 0;
  for (const a of audio) peak = Math.max(peak, Math.abs(a));
  if (peak < 1e-6) throw Error("Silent synthesis");
  const gain = id === "lead" ? Math.min(1, 0.88 / peak) : 0.5 / peak;
  for (let i = 0; i < audio.length; i++) audio[i] *= gain;
  words.sort((a, b) => a.start - b.start);
  for (let i = 0; i < words.length - 1; i++) words[i].end = Math.min(words[i].end, words[i + 1].start);
  frames.sort((a, b) => a.time - b.time);
  progress(1);
  return { id, body, sampleRate: sr, audio, frames, words };
}

// pocket-stage/body-worker.mjs
self.onmessage = async ({ data }) => {
  try {
    const result = await renderBody(data, (progress) => self.postMessage({ type: "progress", progress }));
    self.postMessage({ type: "done", ...result }, [result.audio.buffer]);
  } catch (e) {
    self.postMessage({ type: "error", message: e.message });
  }
};
