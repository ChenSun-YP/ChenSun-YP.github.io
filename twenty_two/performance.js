var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// vendor/chimera/src/wasm/chimera.ts
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
function x() {
  if (!exports) throw new Error("engine not loaded (await initChimera())");
  return exports;
}
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
var module, exports, loading, enc, dec;
var init_chimera = __esm({
  "vendor/chimera/src/wasm/chimera.ts"() {
    module = null;
    exports = null;
    loading = null;
    enc = new TextEncoder();
    dec = new TextDecoder();
  }
});

// vendor/chimera/src/ui/creatureVisuals.ts
var CREATURE_VISUALS;
var init_creatureVisuals = __esm({
  "vendor/chimera/src/ui/creatureVisuals.ts"() {
    CREATURE_VISUALS = {
      "songbird": {
        view: { x0: -4, x1: 14, y0: -6, y1: 8 },
        silhouette: [[-3.2, -1.2], [-1.6, -3.4], [1.6, -4.6], [5.2, -4.4], [7.8, -2.6], [9, -0.4], [9.6, 1.8], [10.4, 2.4], [12.8, 2.6], [10.6, 3], [9.8, 3.6], [9.2, 4.6], [7.6, 5.2], [6, 4.6], [4.2, 2.8], [2, 2], [-0.2, 1.6], [-3.6, 1.4], [-3.4, 0.2]],
        parts: [{ shade: 0.2, pts: [[8.6, 4], [8.95, 4.3], [9.2, 4], [8.95, 3.7]] }],
        tubes: [
          { tube: "bronchusL", path: [[3.4, -1.9], [4.4, -1.4]], label: "Left bronchus", inView: false },
          { tube: "bronchusR", path: [[3.4, -0.9], [4.4, -1.2]], label: "Right bronchus", inView: false },
          { tube: "trachea", path: [[4.4, -1.3], [5.6, -0.4], [6.8, 0.8], [7.8, 1.9], [8.6, 2.5]], label: "Trachea" },
          { tube: "beak", path: [[9.4, 2.75], [10.6, 2.75], [12.4, 2.7]], label: "Beak" }
        ],
        tubeScale: 1.6,
        sources: [{ key: "left", at: [4.2, -1.6], label: "Left voice" }, { key: "right", at: [4.2, -1], label: "Right voice" }]
      },
      "seal": {
        view: { x0: -60, x1: 60, y0: -30, y1: 30 },
        silhouette: [[-58, -2], [-50, -8], [-30, -14], [-5, -16], [20, -14], [38, -10], [48, -6], [55, -3], [58, 1], [56, 5], [50, 8], [42, 10], [30, 11], [10, 13], [-15, 13], [-35, 10], [-50, 6], [-56, 3], [-62, 8], [-64, 4], [-60, 0], [-64, -4], [-62, -8]],
        parts: [{ shade: 0.15, pts: [[47, 4], [48.5, 5], [50, 4], [48.5, 3]] }],
        tubes: [
          { tube: "trachea", path: [[8, -4], [20, -3], [30, -2]], label: "Trachea" },
          { tube: "pharynx", path: [[30, -2], [38, 0], [44, 1.5]], label: "Pharynx" },
          { tube: "oral", path: [[44, 1.5], [50, 0.5], [57, -0.5]], label: "Mouth" }
        ],
        tubeScale: 1.3,
        sources: [{ key: "glottis", at: [30, -2], label: "Larynx" }]
      },
      "alligator": {
        view: { x0: -120, x1: 120, y0: -40, y1: 40 },
        silhouette: [[-118, 2], [-90, -4], [-60, -8], [-30, -14], [0, -16], [30, -14], [50, -10], [70, -8], [95, -5], [114, -3], [118, 0], [115, 3], [98, 5], [75, 7], [52, 9], [40, 12], [20, 14], [-10, 14], [-40, 11], [-70, 7], [-100, 4]],
        parts: [{ shade: 0.15, pts: [[54, 9], [56, 11], [58, 9], [56, 8]] }],
        tubes: [
          { tube: "trachea", path: [[0, -6], [18, -5], [36, -4]], label: "Trachea" },
          { tube: "pharynx", path: [[36, -4], [46, -2], [54, 0]], label: "Pharynx" },
          { tube: "oral", path: [[54, 0], [80, -1], [112, -1]], label: "Mouth" },
          { tube: "nasal", path: [[54, 2], [80, 4], [113, 2]], label: "Nostrils" }
        ],
        tubeScale: 1.05,
        sources: [{ key: "glottis", at: [36, -4], label: "Larynx" }]
      },
      "elephant": {
        view: { x0: -170, x1: 170, y0: -170, y1: 130 },
        silhouette: [[-160, 20], [-150, 70], [-110, 105], [-40, 118], [30, 115], [70, 100], [95, 112], [120, 108], [140, 85], [148, 55], [146, 25], [140, 5], [132, -20], [128, -60], [122, -110], [118, -150], [108, -152], [112, -100], [110, -50], [104, -20], [96, -5], [80, 0], [70, -10], [66, -90], [40, -95], [44, -30], [-90, -30], [-95, -95], [-125, -95], [-122, -10], [-150, -5]],
        parts: [{ shade: 0.15, pts: [[118, 62], [122, 66], [126, 62], [122, 58]] }, { shade: 0.62, pts: [[70, 100], [40, 60], [55, 25], [85, 40], [95, 80]] }],
        tubes: [
          { tube: "trachea", path: [[40, 20], [70, 30], [95, 38]], label: "Trachea" },
          { tube: "pharynx", path: [[95, 38], [112, 50], [124, 58]], label: "Pharynx" },
          { tube: "oral", path: [[124, 58], [130, 42], [134, 30]], label: "Mouth" },
          { tube: "trunk", path: [[136, 70], [142, 40], [136, 0], [128, -50], [120, -100], [113, -148]], label: "Trunk" }
        ],
        tubeScale: 3,
        sources: [{ key: "glottis", at: [95, 38], label: "Vocal folds" }, { key: "lips", at: [136, 70], label: "Trunk valve" }]
      }
    };
  }
});

// vendor/chimera/src/wasm/engine.ts
function airwayModel(body, sampleRate) {
  return call("model", { body, sampleRate });
}
function dropAirwayModel(m) {
  call("dropModel", { model: m.model });
}
function airwayFrame(m, artic) {
  return call("frame", { model: m.model, artic });
}
function airwayAreas(m, artic) {
  return call("apply", { model: m.model, artic });
}
function airwayTransfer(m, artic) {
  return call("transfer", { model: m.model, artic });
}
var CATALOG, NEUTRAL, BODY_MALE, BODY_FEMALE, BODY_CHILD, ARTIC_KEYS, ARTIC_SPECS, DEFAULT_SOURCE, EXHALE_LABEL, BASS_NOTE, BEAT_SOUNDS, BEAT_PRESETS, VOWEL_TARGETS, DEMO_SONGS, VOWELS, CREATURES, TractMap;
var init_engine = __esm({
  "vendor/chimera/src/wasm/engine.ts"() {
    init_chimera();
    init_creatureVisuals();
    CATALOG = call("catalog");
    NEUTRAL = CATALOG.neutral;
    BODY_MALE = CATALOG.bodies.male;
    BODY_FEMALE = CATALOG.bodies.female;
    BODY_CHILD = CATALOG.bodies.child;
    ARTIC_KEYS = CATALOG.articKeys;
    ARTIC_SPECS = CATALOG.articSpecs;
    DEFAULT_SOURCE = CATALOG.defaultSource;
    EXHALE_LABEL = CATALOG.exhaleLabel;
    BASS_NOTE = CATALOG.bassNote;
    BEAT_SOUNDS = CATALOG.beatSounds;
    BEAT_PRESETS = CATALOG.beatPresets;
    VOWEL_TARGETS = CATALOG.vowelTargets;
    DEMO_SONGS = CATALOG.demoSongs;
    VOWELS = CATALOG.vowels;
    CREATURES = CATALOG.creatures.map((c) => ({ ...c, visual: CREATURE_VISUALS[c.id] }));
    TractMap = class {
      scale;
      ph;
      constructor(body) {
        this.scale = body.scale;
        this.ph = body.pharynx;
      }
      P(x2, y) {
        const k = this.scale;
        const xx = x2 > 0.5 ? 0.5 + (x2 - 0.5) * 0.86 : x2;
        const yy = y < 7 ? 7 - (7 - y) * this.ph : y;
        return { x: xx * k, y: yy * k };
      }
      unP(x2, y) {
        const k = this.scale;
        let xx = x2 / k, yy = y / k;
        if (xx > 0.5) xx = 0.5 + (xx - 0.5) / 0.86;
        if (yy < 7) yy = 7 - (7 - yy) / this.ph;
        return { x: xx, y: yy };
      }
    };
  }
});

// vendor/chimera/src/ui/body.ts
function bodyWeights(b) {
  const f = clamp01(b.female), c = clamp01(b.child);
  return [
    ["male", (1 - c) * (1 - f)],
    ["female", (1 - c) * f],
    ["child", c]
  ];
}
var clamp01;
var init_body = __esm({
  "vendor/chimera/src/ui/body.ts"() {
    clamp01 = (x2) => Number.isFinite(x2) ? Math.min(1, Math.max(0, x2)) : 0;
  }
});

// vendor/chimera/src/ui/analysis.ts
var analysis_exports = {};
__export(analysis_exports, {
  VoiceModel: () => VoiceModel
});
var VoiceModel;
var init_analysis = __esm({
  "vendor/chimera/src/ui/analysis.ts"() {
    init_engine();
    init_body();
    VoiceModel = class {
      body;
      /** the body's dimensions (blended, as the engine builds it) */
      bodyParams;
      /** template ↔ body coordinates */
      tract;
      vowels;
      nPh;
      nOr;
      model;
      cacheKey = "";
      cacheFrame = null;
      tfKey = "";
      tf = null;
      constructor(body, sampleRate) {
        this.body = body;
        this.model = airwayModel(body, sampleRate);
        this.bodyParams = this.model.body;
        this.tract = new TractMap(this.bodyParams);
        this.nPh = this.model.nPh;
        this.nOr = this.model.nOr;
        const parts = bodyWeights(body).filter(([, w]) => w > 0).map(([n, w]) => ({ w, table: VOWEL_TARGETS[n] ?? {} }));
        this.vowels = VOWELS.filter((v) => parts.every((p) => p.table[v.ipa])).map((v) => {
          const at = (f) => {
            let acc = 0, ws = 0;
            for (const p of parts) {
              const x2 = f(p.table[v.ipa]);
              if (x2 !== void 0) acc += p.w * x2, ws += p.w;
            }
            return ws > 0 ? acc / ws : void 0;
          };
          const artic = {};
          for (const k of ARTIC_KEYS) {
            const x2 = at((t) => t.artic[k]);
            if (x2 !== void 0) artic[k] = x2;
          }
          return { ipa: v.ipa, example: v.example, F1: at((t) => t.formants[0]), F2: at((t) => t.formants[1]), artic };
        });
      }
      /** Free the engine's model; this VoiceModel must not be used afterwards. */
      dispose() {
        dropAirwayModel(this.model);
      }
      static articFromArray(arr) {
        const a = { ...NEUTRAL };
        ARTIC_KEYS.forEach((k, i) => a[k] = arr[i]);
        return a;
      }
      frame(a) {
        const key = ARTIC_KEYS.map((k) => a[k].toFixed(3)).join(",");
        if (key !== this.cacheKey || !this.cacheFrame) {
          this.cacheFrame = airwayFrame(this.model, a);
          this.cacheKey = key;
        }
        return this.cacheFrame;
      }
      /** The area function the worklet's airway would get for this articulation. */
      areas(a) {
        return airwayAreas(this.model, a);
      }
      /** Transfer function (dB) + formants for an articulation (cached on a coarse key). */
      transfer(a) {
        const key = ARTIC_KEYS.map((k) => a[k].toFixed(2)).join(",");
        if (key === this.tfKey && this.tf) return this.tf;
        this.tf = airwayTransfer(this.model, a);
        this.tfKey = key;
        return this.tf;
      }
      /** Blend calibrated vowel articulations for a point in (F1, F2) space (inverse-distance, log Hz). */
      articForFormants(F1, F2) {
        const w = this.vowels.map((v) => {
          const d1 = Math.log(F1 / v.F1) * 2.2;
          const d2 = Math.log(F2 / v.F2);
          const d = Math.hypot(d1, d2);
          return { v, w: 1 / Math.pow(d + 0.02, 3) };
        });
        w.sort((p, q) => q.w - p.w);
        const top = w.slice(0, 4);
        const sum = top.reduce((s, x2) => s + x2.w, 0);
        const keys = ["tbX", "tbY", "jaw", "lipAp", "lipProt", "lipWidth", "root", "larynx", "ttCurl"];
        const out = {};
        for (const k of keys) {
          let acc = 0;
          for (const { v, w: wi } of top) acc += (v.artic[k] ?? NEUTRAL[k]) * wi;
          out[k] = acc / sum;
        }
        return out;
      }
      /** s-position (cm from glottis) of each tract node in the telemetry arrays */
      nodeS(phLen, orLen) {
        const nPh = this.nPh, nOr = this.nOr;
        const s = new Float64Array(nPh + nOr);
        for (let i = 0; i < nPh; i++) s[i] = (i + 0.5) / nPh * phLen;
        for (let i = 0; i < nOr; i++) s[nPh + i] = phLen + (i + 0.5) / nOr * orLen;
        return s;
      }
      /** s-position of a noise-source branch index (pharynx/oral internal branches) */
      branchS(branch, phLen, orLen) {
        const ph = this.model.pharynxBranches, or = this.model.oralBranches;
        if (branch >= ph.base && branch < ph.base + ph.n - 1) return (branch - ph.base + 1) / ph.n * phLen;
        if (branch >= or.base && branch < or.base + or.n - 1) return phLen + (branch - or.base + 1) / or.n * orLen;
        if (branch === this.model.glottisPort) return 0.2;
        return -1;
      }
    };
  }
});

// performance.ts
init_chimera();

// vendor/chimera/src/ui/colors.ts
var V = {
  blue: "#4fb6f2",
  blueMid: "#3487c4",
  blueDim: "#1f5f8c",
  frame: "#133954",
  green: "#5be381",
  red: "#ff5d40",
  pink: "#ff73cf",
  white: "#eef6f8",
  amber: "#ffb340"
};
var SLOTS = [V.green, V.red, V.pink, V.white];
function mix(hex, to, u) {
  const a = parseInt(hex.slice(1), 16), b = parseInt(to.slice(1), 16);
  const ch = (s) => Math.round((a >> s & 255) * (1 - u) + (b >> s & 255) * u);
  return "#" + [16, 8, 0].map((s) => ch(s).toString(16).padStart(2, "0")).join("");
}
var core = (hex) => mix(hex, "#ffffff", 0.55);
var HEAT = [[0, "#3a2408"], [0.35, "#c9822a"], [0.6, "#ffb340"], [0.82, "#ffe39a"], [1, "#fff8ec"]];
function heat(level) {
  const v = Math.max(0, Math.min(1, level));
  for (let i = 1; i < HEAT.length; i++) if (v <= HEAT[i][0]) return mix(HEAT[i - 1][1], HEAT[i][1], (v - HEAT[i - 1][0]) / (HEAT[i][0] - HEAT[i - 1][0]));
  return HEAT[HEAT.length - 1][1];
}
var C = {
  black: "#000000",
  console: "#000000",
  inset: "#000000",
  line: V.frame,
  text: V.blue,
  textDim: V.blueMid,
  caliper: V.amber,
  caliperDim: "rgba(255, 179, 64, 0.45)",
  // MRI-like tissue intensities (T1-ish)
  fat: "#bdbdbd",
  skin: "#a8a8a8",
  muscle: "#5d5d5d",
  tongue: "#6b6b6b",
  brain: "#7c7c7c",
  marrow: "#b2b2b2",
  cortex: "#1c1c1c",
  cartilage: "#3e3e3e",
  mucosa: "#8f8f8f",
  tooth: "#101010"
};
var pressureLevel = (rms) => {
  if (!(rms > 0)) return 0;
  const lo = Math.log10(40), hi = Math.log10(4e3);
  return Math.max(0, Math.min(1, (Math.log10(rms) - lo) / (hi - lo)));
};

// vendor/chimera/src/ui/render/vector.ts
var HERSHEY = '"Hershey", "Archivo", system-ui, sans-serif';
var hfont = (size, weight = "l") => `${weight === "m" ? 500 : 300} ${size}px ${HERSHEY}`;
var hasLetterSpacing = typeof CanvasRenderingContext2D !== "undefined" && "letterSpacing" in CanvasRenderingContext2D.prototype;
function pathOf(pts, close = false) {
  const p = new Path2D();
  if (pts.length === 0) return p;
  p.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]);
  if (close) p.closePath();
  return p;
}
function beam(ctx, path, color, width, o = {}) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = o.alpha ?? 1;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.setLineDash(o.dash ?? []);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke(path);
  if (o.hot) {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = core(color);
    ctx.lineWidth = width * 0.42;
    ctx.stroke(path);
  }
  ctx.restore();
}
function beamPts(ctx, pts, color, width, o = {}) {
  if (pts.length < 2) return;
  beam(ctx, pathOf(pts, o.close), color, width, o);
}
function seg(ctx, x0, y0, x1, y1, color, width, o = {}) {
  const p = new Path2D();
  p.moveTo(x0, y0);
  p.lineTo(x1, y1);
  beam(ctx, p, color, width, o);
}
function ring(ctx, x2, y, r, color, width = 1.2, o = {}) {
  const p = new Path2D();
  p.arc(x2, y, r, 0, Math.PI * 2);
  beam(ctx, p, color, width, o);
}
function dot(ctx, x2, y, r, color, alpha = 1) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x2, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
function handle(ctx, x2, y, color, r = 7, alpha = 1) {
  const t = 4;
  const p = new Path2D();
  p.arc(x2, y, r, 0, Math.PI * 2);
  p.moveTo(x2 - r - t, y);
  p.lineTo(x2 - r + 2, y);
  p.moveTo(x2 + r - 2, y);
  p.lineTo(x2 + r + t, y);
  p.moveTo(x2, y - r - t);
  p.lineTo(x2, y - r + 2);
  p.moveTo(x2, y + r - 2);
  p.lineTo(x2, y + r + t);
  beam(ctx, p, color, 1.25, { alpha });
}
function label(ctx, text, x2, y, o = {}) {
  const size = o.size ?? 11;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = o.alpha ?? 1;
  ctx.font = hfont(size, o.weight);
  if (hasLetterSpacing) ctx.letterSpacing = `${((o.ls ?? 0.14) * size).toFixed(2)}px`;
  ctx.textAlign = o.align ?? "left";
  ctx.textBaseline = o.baseline ?? "alphabetic";
  ctx.fillStyle = o.color ?? V.blue;
  const c = ctx;
  if (o.moving) c.layoutMoving = true;
  ctx.fillText(text, x2, y);
  c.layoutMoving = void 0;
  ctx.restore();
}
function chaikin(p, it = 2) {
  let q = p.length > 1 && p[0][0] === p[p.length - 1][0] && p[0][1] === p[p.length - 1][1] ? p.slice(0, -1) : p.slice();
  for (let k = 0; k < it; k++) {
    const o = [];
    for (let i = 0; i < q.length; i++) {
      const a = q[i], b = q[(i + 1) % q.length];
      o.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    q = o;
  }
  return q.length ? [...q, q[0]] : q;
}
function ipaGlyph(ctx, x2, y, ipa, size, color, alpha = 1) {
  const xh = size * 0.5;
  const r = xh * 0.48;
  const cy = y - xh / 2;
  const sw = Math.max(0.9, size * 0.07);
  const f = (n) => n.toFixed(2);
  const stroke = (d) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = sw;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke(new Path2D(d));
    ctx.restore();
  };
  const glyph = (s, tf) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = alpha;
    ctx.font = hfont(size);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = color;
    if (tf) tf(ctx);
    ctx.fillText(s, tf ? 0 : x2, tf ? 0 : y);
    ctx.restore();
  };
  const turned = (c) => {
    c.translate(x2, cy);
    c.rotate(Math.PI);
    c.translate(0, xh / 2);
  };
  const mirrored = (c) => {
    c.translate(x2, y);
    c.scale(-1, 1);
  };
  const bowl = (c) => `M${f(c + r)} ${f(cy)}A${f(r)} ${f(xh / 2)} 0 1 0 ${f(c - r)} ${f(cy)}A${f(r)} ${f(xh / 2)} 0 1 0 ${f(c + r)} ${f(cy)}`;
  switch (ipa) {
    case "\u0251": {
      const c = x2 - 0.06 * size;
      return stroke(bowl(c) + `M${f(c + r)} ${f(y - xh)}L${f(c + r)} ${f(y)}`);
    }
    case "\u0252": {
      const c = x2 + 0.06 * size;
      return stroke(bowl(c) + `M${f(c - r)} ${f(y - xh)}L${f(c - r)} ${f(y)}`);
    }
    case "\u026A":
      return stroke(`M${f(x2)} ${f(y - xh)}L${f(x2)} ${f(y)}M${f(x2 - xh * 0.3)} ${f(y - xh)}L${f(x2 + xh * 0.3)} ${f(y - xh)}M${f(x2 - xh * 0.3)} ${f(y)}L${f(x2 + xh * 0.3)} ${f(y)}`);
    case "\u025B":
      return stroke(`M${f(x2 + r * 0.9)} ${f(y - xh * 0.92)}Q${f(x2 - r * 1.1)} ${f(y - xh * 1.08)} ${f(x2 - r * 0.25)} ${f(cy)}Q${f(x2 - r * 1.3)} ${f(y + xh * 0.1)} ${f(x2 + r * 0.95)} ${f(y - xh * 0.06)}`);
    case "\u025C":
      return stroke(`M${f(x2 - r * 0.9)} ${f(y - xh * 0.92)}Q${f(x2 + r * 1.1)} ${f(y - xh * 1.08)} ${f(x2 + r * 0.25)} ${f(cy)}Q${f(x2 + r * 1.3)} ${f(y + xh * 0.1)} ${f(x2 - r * 0.95)} ${f(y - xh * 0.06)}`);
    case "\u025D":
      return stroke(`M${f(x2 - r * 0.9)} ${f(y - xh * 0.92)}Q${f(x2 + r * 1.1)} ${f(y - xh * 1.08)} ${f(x2 + r * 0.25)} ${f(cy)}Q${f(x2 + r * 1.3)} ${f(y + xh * 0.1)} ${f(x2 - r * 0.95)} ${f(y - xh * 0.06)}M${f(x2 + r * 0.55)} ${f(cy - xh * 0.1)}Q${f(x2 + r * 1.4)} ${f(cy - xh * 0.5)} ${f(x2 + r * 1.5)} ${f(cy - xh * 0.15)}`);
    case "\u028A":
      return stroke(`M${f(x2 - r * 1.15)} ${f(y - xh)}Q${f(x2 - r * 0.5)} ${f(y - xh * 0.9)} ${f(x2 - r * 0.75)} ${f(cy)}Q${f(x2 - r)} ${f(y)} ${f(x2)} ${f(y)}Q${f(x2 + r)} ${f(y)} ${f(x2 + r * 0.75)} ${f(cy)}Q${f(x2 + r * 0.5)} ${f(y - xh * 0.9)} ${f(x2 + r * 1.15)} ${f(y - xh)}`);
    case "\u028C":
      return stroke(`M${f(x2 - r)} ${f(y)}L${f(x2)} ${f(y - xh)}L${f(x2 + r)} ${f(y)}`);
    case "\u0264":
      return stroke(`M${f(x2 - r)} ${f(y - xh)}L${f(x2)} ${f(y - xh * 0.1)}L${f(x2 + r)} ${f(y - xh)}M${f(x2)} ${f(y - xh * 0.1)}Q${f(x2 - r * 0.5)} ${f(y + xh * 0.4)} ${f(x2)} ${f(y + xh * 0.45)}Q${f(x2 + r * 0.5)} ${f(y + xh * 0.4)} ${f(x2)} ${f(y - xh * 0.1)}`);
    case "\u0283":
      return stroke(`M${f(x2 + r * 0.9)} ${f(y - xh * 1.9)}Q${f(x2)} ${f(y - xh * 2.2)} ${f(x2)} ${f(y - xh)}L${f(x2)} ${f(y + xh * 0.3)}Q${f(x2)} ${f(y + xh * 0.95)} ${f(x2 - r * 0.9)} ${f(y + xh * 0.7)}`);
    case "\u03B8":
      return stroke(`M${f(x2 + r)} ${f(y - xh)}A${f(r)} ${f(xh)} 0 1 0 ${f(x2 - r)} ${f(y - xh)}A${f(r)} ${f(xh)} 0 1 0 ${f(x2 + r)} ${f(y - xh)}M${f(x2 - r)} ${f(y - xh)}L${f(x2 + r)} ${f(y - xh)}`);
    case "\u014B":
      return stroke(`M${f(x2 - r)} ${f(y)}L${f(x2 - r)} ${f(y - xh)}M${f(x2 - r)} ${f(y - xh * 0.6)}Q${f(x2 - r * 0.2)} ${f(y - xh * 1.1)} ${f(x2 + r * 0.6)} ${f(y - xh * 0.9)}Q${f(x2 + r)} ${f(y - xh * 0.75)} ${f(x2 + r)} ${f(y - xh * 0.4)}L${f(x2 + r)} ${f(y + xh * 0.4)}Q${f(x2 + r)} ${f(y + xh * 0.85)} ${f(x2 + r * 0.3)} ${f(y + xh * 0.8)}`);
    case "\u0259":
      return stroke(`M${f(x2 - r)} ${f(cy)}L${f(x2 + r)} ${f(cy)}A${f(r)} ${f(xh / 2)} 0 1 1 ${f(x2 - r * 0.75)} ${f(y - xh * 0.85)}`);
    case "\u0250":
      return glyph("a", turned);
    case "\u0254":
      return glyph("c", mirrored);
    case "\u026F":
      return glyph("m", turned);
    case "\u0268":
      glyph("i");
      return stroke(`M${f(x2 - r * 0.8)} ${f(cy)}L${f(x2 + r * 0.8)} ${f(cy)}`);
    case "\xF8":
      glyph("o");
      return stroke(`M${f(x2 - r * 1.1)} ${f(y + xh * 0.1)}L${f(x2 + r * 1.1)} ${f(y - xh * 1.1)}`);
    case "\xE6":
      return glyph("\xE6");
    case "\u0153":
      return glyph("\u0153");
    default:
      return glyph(ipa);
  }
}
var Glow = class {
  constructor(sigma = 2, alpha = 0.75, down = 4) {
    this.sigma = sigma;
    this.alpha = alpha;
    this.down = down;
    this.small = document.createElement("canvas");
    this.sctx = this.small.getContext("2d");
    this.canFilter = typeof this.sctx.filter === "string";
  }
  small;
  sctx;
  canFilter;
  apply(canvas, ctx, dpr) {
    const W = canvas.width, H = canvas.height;
    const w = Math.max(1, Math.round(W / this.down)), h = Math.max(1, Math.round(H / this.down));
    if (this.small.width !== w || this.small.height !== h) {
      this.small.width = w;
      this.small.height = h;
    }
    const s = this.sctx;
    s.setTransform(1, 0, 0, 1, 0, 0);
    s.globalCompositeOperation = "copy";
    if (this.canFilter) s.filter = `blur(${(this.sigma * dpr / this.down).toFixed(2)}px)`;
    s.drawImage(canvas, 0, 0, w, h);
    if (this.canFilter) s.filter = "none";
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = this.alpha;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(this.small, 0, 0, W, H);
    ctx.restore();
  }
};

// vendor/chimera/src/ui/render/geom.ts
var dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
var rotateAbout = (p, c, ang) => {
  const s = Math.sin(ang), co = Math.cos(ang);
  const dx = p.x - c.x, dy = p.y - c.y;
  return { x: c.x + dx * co - dy * s, y: c.y + dx * s + dy * co };
};
function catmullRom(pts, per) {
  if (pts.length < 3) return pts.slice();
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < per; k++) {
      const t = k / per;
      const t2 = t * t, t3 = t2 * t;
      out.push({
        x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
      });
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

// vendor/chimera/src/ui/render/profile.ts
var VIEW = { x0: -7.5, x1: 10.25, y0: -4.55, y1: 19.9 };
function jawAngle(model, jaw) {
  const t = model.tract;
  return -Math.max(-0.2, Math.min(3, jaw)) * t.scale / dist(t.P(-2.5, 10.5), t.P(6.95, 7.75));
}
function jawFn(model, a) {
  const t = model.tract;
  const condyle = t.P(-2.5, 10.5);
  const phi = jawAngle(model, a.jaw);
  return (x2, y) => rotateAbout(t.P(x2, y), condyle, phi);
}
function ellipse(c, rx, ry, rot = 0, n = 40) {
  const cr = Math.cos(-rot), sr = Math.sin(-rot);
  const o = [];
  for (let i = 0; i <= n; i++) {
    const an = i / n * Math.PI * 2;
    const x2 = Math.cos(an) * rx, y = Math.sin(an) * ry;
    o.push({ x: c.x + x2 * cr - y * sr, y: c.y + x2 * sr + y * cr });
  }
  return o;
}
function roundRect(p0, p1, r) {
  const x0 = Math.min(p0.x, p1.x), x1 = Math.max(p0.x, p1.x), y0 = Math.min(p0.y, p1.y), y1 = Math.max(p0.y, p1.y);
  const rr = Math.min(r, (x1 - x0) / 2, (y1 - y0) / 2);
  const o = [];
  const corner = (cx, cy, a0) => {
    for (let i = 0; i <= 6; i++) {
      const an = a0 + i / 6 * (Math.PI / 2);
      o.push({ x: cx + Math.cos(an) * rr, y: cy + Math.sin(an) * rr });
    }
  };
  corner(x1 - rr, y1 - rr, 0);
  corner(x0 + rr, y1 - rr, Math.PI / 2);
  corner(x0 + rr, y0 + rr, Math.PI);
  corner(x1 - rr, y0 + rr, 3 * Math.PI / 2);
  o.push(o[0]);
  return o;
}
var wallX = (y) => -1.2 - 0.025 * y;
function bodyPoint(model) {
  const k = model.tract.scale;
  const ph = model.bodyParams.pharynx;
  return (x2, y) => ({ x: x2 * k, y: (y < 7 ? 7 - (7 - y) * ph : y) * k });
}
function buildProfile(model, f, a) {
  const t = model.tract;
  const P = (x2, y) => t.P(x2, y);
  const J = jawFn(model, a);
  const k = t.scale;
  const lar = a.larynx * k;
  const B = bodyPoint(model);
  const ulOut = f.upperLip.slice(7);
  const llOut = f.lowerLip.slice(7);
  const neckFront = catmullRom([B(2.3, -4.6), B(2.38, -1.5), B(2.52, 0.4), B(3, 1.7), J(5.3, 3), J(7.25, 3.35), J(7.95, 4.6), J(7.55, 5.7)], 4);
  const face = catmullRom([ulOut[ulOut.length - 1], B(7.05, 10.6), B(7.75, 10.78), B(8.75, 11.05), B(9.25, 11.65), B(8.95, 12.6), B(8.35, 13.9), B(7.7, 15), B(7.95, 16.1), B(7.9, 18.1), B(6.9, 20.5)], 4);
  const cranium = catmullRom([B(6.9, 20.5), B(3, 22.9), B(-2.2, 22.7), B(-6.9, 19.6), B(-8.7, 15.4), B(-8.3, 11.9), B(-7.4, 8.9), B(-6.8, 4.8), B(-6.6, 0), B(-6.6, -4.6)], 4);
  const vertebrae = [];
  for (let i = 0; i < 9; i++) {
    const y0 = -4.4 + i * 1.75;
    if (y0 > 10.5) break;
    const x0 = wallX(y0) - 2.25;
    vertebrae.push(roundRect(P(x0, y0 + 1.4), P(x0 + 1.6, y0), 0.32 * k));
  }
  const palRaw = [[1, 9.6], [1.8, 9.92], [2.7, 10.18], [3.6, 10.3], [4.4, 10.25], [5.1, 10.05], [5.7, 9.72], [6.15, 9.36], [6.55, 9.15], [7, 9.6]];
  const palOral = palRaw.map(([x2, y]) => t.P(x2, y));
  const jb = f.jawBone.filter((p) => p.x > 0.8 * k);
  const g = f.glottis;
  const hy = { x: P(1.6, 0).x, y: P(0, 2.9).y + 0.6 * lar };
  const rings = [];
  for (let i = 0; i < 4; i++) {
    const y = g.y - (0.9 + i * 1) * k;
    if (y < -4.4) break;
    rings.push([{ x: g.x + 0.8 * k, y }, { x: g.x + 1.05 * k, y: y - 0.05 }, { x: g.x + 1.05 * k, y: y - 0.5 * k }, { x: g.x + 0.82 * k, y: y - 0.45 * k }, { x: g.x + 0.8 * k, y }]);
  }
  const origin = J(6, 5.45);
  const tc2 = f.tongueCenter;
  const fibres = [];
  for (let i = 0; i <= 16; i++) {
    const ang = Math.PI * (0.18 + 0.9 * i / 16);
    const end = { x: tc2.x + Math.cos(ang) * f.tongueRadius * 1.25, y: tc2.y + Math.sin(ang) * f.tongueRadius * 1.25 };
    const ctrl = { x: tc2.x, y: (tc2.y + origin.y) / 2 };
    const c = [];
    for (let j = 0; j <= 12; j++) {
      const u = j / 12;
      c.push({ x: (1 - u) * (1 - u) * origin.x + 2 * (1 - u) * u * ctrl.x + u * u * end.x, y: (1 - u) * (1 - u) * origin.y + 2 * (1 - u) * u * ctrl.y + u * u * end.y });
    }
    fibres.push(c);
  }
  const wallAtGlottis = { x: wallX(g.y / k) * k, y: g.y };
  return {
    f,
    model,
    skinLower: [...neckFront, ...llOut.slice().reverse()],
    skinUpper: [...ulOut, ...face.slice(1), ...cranium.slice(1)],
    inset: catmullRom([B(1.85, -4.6), B(1.9, -0.8), B(2.3, 1.6), J(5.2, 3.6), J(6.9, 3.9), J(7.4, 4.9), J(7.2, 5.9), B(6.6, 9.9), B(7.6, 10.9), B(8.55, 11.5), B(8.1, 13.4), B(7.25, 15.2), B(7.45, 18), B(3, 22.2), B(-2, 22), B(-6.3, 19.2), B(-7.9, 15.3), B(-7.6, 12), B(-6.7, 8.7), B(-6.1, 4.6), B(-6, -4.6)], 3),
    skull: catmullRom([B(7, 16.2), B(7.3, 18.5), B(6, 20.7), B(3, 22.1), B(-2, 22), B(-6.3, 19.2), B(-7.9, 15.3), B(-7.4, 12.6), B(-4.6, 12.2), B(-2.2, 13.3), B(1, 13.7), B(4.1, 14.1), B(6.2, 14.9)], 4),
    brain: catmullRom([B(6.55, 16.3), B(6.75, 18.4), B(5.5, 20.1), B(2.8, 21.4), B(-1.9, 21.3), B(-5.8, 18.8), B(-7.1, 15.4), B(-6.7, 13.1), B(-4.4, 12.8), B(-2.1, 13.9), B(1, 14.3), B(4, 14.7), B(5.9, 15.4)], 4),
    sulcus: catmullRom([B(5.4, 19.4), B(2.4, 20.5), B(-1.4, 20.4), B(-4.8, 18.4)], 4),
    eye: ellipse(B(6.5, 15.4), 1.1 * k, 0.95 * k),
    eyeC: B(6.5, 15.4),
    vertebrae,
    cords: [[P(-5.3, -4.6), P(-4.5, -4.6), P(-4.5, 11.8), P(-5.1, 12.4), P(-5.6, 11.6)], [P(-5.1, -4.6), P(-4.7, -4.6), P(-4.72, 11.4), P(-5.15, 11.6)]],
    nasal: catmullRom([B(0.3, 11.2), B(1.1, 10.25), B(2.7, 10.75), B(4.6, 10.85), B(6.4, 10.65), B(7.6, 10.85), B(8.45, 11.3), B(8, 12.2), B(6.7, 13.4), B(4.4, 13.9), B(1.8, 13.6), B(0.2, 12.6)], 4),
    turbinates: [[3, 11.45, 2.1, 0.32], [3.5, 12.45, 1.9, 0.3], [4, 13.3, 1.45, 0.22]].map(([cx, cy, rx, ry]) => ellipse(B(cx, cy), rx * k, ry * k, -0.04)),
    palOral,
    palNasal: palOral.map((p) => ({ x: p.x, y: p.y + 0.55 * k })),
    jawLower: jb,
    jawUpper: jb.map((p) => ({ x: p.x, y: p.y + 0.75 * k })),
    hyoid: ellipse(hy, 0.5 * k, 0.28 * k, 0.3, 28),
    thyroid: [{ x: g.x + 0.75 * k, y: g.y - 1.6 * k }, { x: g.x + 1.75 * k, y: g.y - 0.6 * k }, { x: g.x + 1.95 * k, y: g.y + 1.2 * k }, { x: g.x + 1.45 * k, y: g.y + 1.9 * k }, { x: g.x + 1.15 * k, y: g.y + 1.1 * k }, { x: g.x + 1.3 * k, y: g.y - 0.4 * k }, { x: g.x + 0.75 * k, y: g.y - 1.6 * k }],
    trachea: [[{ x: g.x - 0.65 * k, y: g.y }, { x: g.x - 0.75 * k, y: -4.8 }], [{ x: g.x + 0.75 * k, y: g.y }, { x: g.x + 0.95 * k, y: -4.8 }]],
    rings,
    outerWall: f.outer.filter((p) => p.y > g.y || p.x > 0),
    glottisWall: [wallAtGlottis, f.outer.find((p) => p.y > g.y) ?? wallAtGlottis],
    fibres,
    folds: [
      [{ x: g.x - 0.62 * k, y: g.y + 0.05 }, { x: g.x - 0.1, y: g.y + 0.12 * k }, { x: g.x - 0.62 * k, y: g.y + 0.32 * k }, { x: g.x - 0.62 * k, y: g.y + 0.05 }],
      [{ x: g.x + 0.72 * k, y: g.y + 0.05 }, { x: g.x + 0.12, y: g.y + 0.12 * k }, { x: g.x + 0.72 * k, y: g.y + 0.32 * k }, { x: g.x + 0.72 * k, y: g.y + 0.05 }]
    ],
    lowerTeeth: [...f.lowerTeeth, J(6.8, 6), J(6.4, 6.2), f.lowerTeeth[0]]
  };
}
var Gaze = class {
  pitch = 0;
  yaw = 0;
  toPitch = 0;
  toYaw = 0;
  next = 2;
  update(clock, dt) {
    if (clock >= this.next) {
      const centre = Math.random() < 0.35;
      this.toPitch = centre ? 0 : (Math.random() * 2 - 1) * 0.55;
      this.toYaw = centre ? 0 : (Math.random() * 2 - 1) * 0.9;
      this.next = clock + 1.2 + Math.random() * 3.5;
    }
    const ease = 1 - Math.exp(-dt * 28);
    this.pitch += (this.toPitch - this.pitch) * ease;
    this.yaw += (this.toYaw - this.yaw) * ease;
  }
};

// vendor/chimera/src/ui/render/readouts.ts
function drawReadouts(ctx, layout, formants, info, slots) {
  if (layout.compact) return drawReadoutsCompact(ctx, layout, formants, info, slots);
  const { w, h } = layout;
  const fx = w - 18;
  let y = 26;
  if (formants.length >= 3) {
    ["F1", "F2", "F3"].forEach((lab, i) => {
      label(ctx, lab, fx - 78, y + i * 22, { size: 12, color: V.amber, ls: 0.12, alpha: 0.75 });
      label(ctx, String(Math.round(formants[i])), fx, y + i * 22, { size: 15, color: V.amber, align: "right", ls: 0.08 });
    });
    label(ctx, "HZ", fx, y + 64, { size: 10, color: V.amber, align: "right", alpha: 0.6 });
    y += 110;
  }
  for (const s of info) {
    label(ctx, s, fx, y, { size: 10, color: V.blueMid, align: "right", ls: 0.14 });
    y += 16;
  }
  if (!slots.length) return;
  const gx0 = layout.slotX, gy0 = layout.slotY;
  const cellW = Math.max(60, (w - 14 - gx0) / 2);
  const cellH = Math.max(56, Math.min(112, (h - 8 - gy0) / 2));
  const big = Math.max(22, Math.min(44, cellH * 0.4, cellW * 0.32));
  slots.slice(0, 4).forEach((s, i) => {
    const cx = gx0 + i % 2 * cellW, cy = gy0 + Math.floor(i / 2) * cellH;
    dot(ctx, cx + 6, cy + 4, 4, s.color);
    label(ctx, s.label.toUpperCase(), cx + 16, cy + 8, { size: 11, color: s.color, ls: 0.2, alpha: 0.85 });
    const by = cy + 18 + big * 1.1;
    if (s.ipa) ipaGlyph(ctx, cx + big * 0.6, by, s.value, big * 1.45, s.color);
    else label(ctx, s.value.toUpperCase(), cx, by, { size: s.value.length > 3 ? big * 0.82 : big, color: s.color, weight: "m", ls: 0.04 });
    if (s.unit) label(ctx, s.unit.toUpperCase(), s.ipa ? cx + big * 1.5 : cx + (s.value.length > 3 ? 0 : big * 1.64), s.ipa || s.value.length <= 3 ? by : by + 18, { size: 11, color: s.color, ls: 0.16, alpha: 0.7 });
  });
}
function drawReadoutsCompact(ctx, layout, formants, info, slots) {
  const { w, h } = layout;
  if (formants.length >= 3) {
    const cw2 = (w - 24) / 3;
    ["F1", "F2", "F3"].forEach((lab, i) => {
      label(ctx, lab, 12 + i * cw2, 18, { size: 10, color: V.amber, ls: 0.12, alpha: 0.75 });
      label(ctx, String(Math.round(formants[i])), 12 + i * cw2 + 26, 18, { size: 13, color: V.amber, ls: 0.06 });
    });
  }
  label(ctx, info.slice(0, 2).join("   "), 12, 36, { size: 9, color: V.blueMid, ls: 0.12 });
  if (info.length > 2) label(ctx, info.slice(2).join("   "), 12, 50, { size: 9, color: V.blueMid, ls: 0.12 });
  const four = slots.slice(0, 4);
  if (!four.length) return;
  const cw = (w - 24) / four.length, y0 = h - 82;
  const big = Math.max(16, Math.min(30, cw * 0.28));
  four.forEach((s, i) => {
    const cx = 12 + i * cw;
    dot(ctx, cx + 4, y0, 3, s.color);
    label(ctx, s.label.toUpperCase(), cx + 12, y0 + 3, { size: 8, color: s.color, ls: 0.14, alpha: 0.85 });
    const by = y0 + 18 + big;
    if (s.ipa) ipaGlyph(ctx, cx + big * 0.5, by, s.value, big * 1.4, s.color);
    else label(ctx, s.value.toUpperCase(), cx, by, { size: s.value.length > 3 ? big * 0.62 : big, color: s.color, weight: "m", ls: 0.02 });
    if (s.unit) label(ctx, s.unit.toUpperCase(), cx, by + 16, { size: 8, color: s.color, ls: 0.14, alpha: 0.7 });
  });
}

// vendor/chimera/src/ui/render/expression.ts
var CM_H2O = 980.665;
var smooth = (a, b, x2) => {
  const t = Math.max(0, Math.min(1, (x2 - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
var clamp = (x2, lo, hi) => Math.max(lo, Math.min(hi, x2));
var follow = (x2, target, tau, dt) => x2 + (target - x2) * (1 - Math.exp(-dt / tau));
var Spring = class {
  constructor(hz, damping) {
    this.hz = hz;
    this.damping = damping;
  }
  x = 0;
  v = 0;
  step(target, dt) {
    const w = 2 * Math.PI * this.hz;
    const n = Math.max(1, Math.ceil(dt / 8e-3)), h = dt / n;
    for (let i = 0; i < n; i++) {
      this.v += (w * w * (target - this.x) - 2 * this.damping * w * this.v) * h;
      this.x += this.v * h;
    }
    return this.x;
  }
};
function mouthPressure(tele) {
  const p = tele.t.pressureRms;
  const i = tele.nPh + tele.nOr - 3;
  return i >= tele.nPh && i < p.length ? p[i] / CM_H2O : 0;
}
var Expression = class {
  /** cheeks: 0 at rest, 1 fully puffed (a spring: it overshoots a little either way on release) */
  puff = 0;
  /** brows: +1 raised high, −1 lowered and knit */
  brow = 0;
  /** eyelids: 0 open, 1 shut */
  lid = 0;
  /** extra gaze pitch (radians, up): the eyes roll up on high notes */
  lookUp = 0;
  /** being petted: 0..1, set by the view; the eyes close and the brows lift with pleasure */
  content = 0;
  /** 3D head: chin up (+) or down, radians */
  nod = 0;
  /** 3D head: tilted towards its right shoulder (+), radians */
  tilt = 0;
  clock = 0;
  cheeks = new Spring(6.5, 0.32);
  nodSpring = new Spring(2.4, 0.42);
  tiltSpring = new Spring(3.2, 0.3);
  /** the pitch's long-run level (log2 Hz) and its last fraction of a second, while voiced */
  ref = NaN;
  fast = NaN;
  /** how long the pitch has held steady (s) */
  held = 0;
  hold = 0;
  nextBlink = 1.5 + Math.random() * 2;
  blinkAt = -1;
  secondBlink = false;
  lastStep = -1;
  /** dt: the real time since the last update (s), not a frame-capped one, so a held note or a blink
   *  lasts as long at a low frame rate */
  update(tele, dt) {
    this.clock += dt;
    const t = tele?.t;
    const voiced = !!t && t.voicing > 0.45 && t.gate > 0.3 && t.f0 > 30 && t.outRms > 4e-3;
    const puffTo = tele ? smooth(1.5, 7, mouthPressure(tele)) : 0;
    this.puff = clamp(this.cheeks.step(puffTo, dt), -0.35, 1.25);
    let dev = 0, wobble = 0;
    if (voiced) {
      const l = Math.log2(t.f0);
      if (!Number.isFinite(this.ref) || Math.abs(12 * (l - this.ref)) > 14) this.ref = this.fast = l;
      this.ref = follow(this.ref, l, 5, dt);
      if (Math.abs(12 * (l - this.fast)) > 2.5) {
        this.fast = l;
        this.held = 0;
      }
      this.fast = follow(this.fast, l, 0.35, dt);
      this.held += dt;
      dev = 12 * (l - this.ref);
      wobble = 12 * (l - this.fast);
    } else this.held = 0;
    const browTo = (voiced ? clamp(dev / 6, -0.7, 1) : 0) + 0.3 * this.content;
    this.brow = follow(this.brow, browTo, voiced ? 0.12 : 0.45, dt);
    this.lookUp = 0.32 * Math.max(0, this.brow);
    const holdTo = voiced ? 0.92 * smooth(0.9, 1.9, this.held) * smooth(0.15, 0.55, this.brow) : 0;
    this.hold = follow(this.hold, holdTo, holdTo > this.hold ? 0.35 : 0.08, dt);
    if (this.clock >= this.nextBlink && this.hold < 0.2) {
      this.blinkAt = this.clock;
      this.secondBlink = !this.secondBlink && Math.random() < 0.18;
      this.nextBlink = this.clock + (this.secondBlink ? 0.28 : 2 + Math.random() * 4.5);
    }
    const b = (this.clock - this.blinkAt) / 0.17;
    const blink = this.blinkAt >= 0 && b < 1 ? Math.sin(Math.PI * b) ** 0.7 : 0;
    this.lid = Math.max(blink, this.hold, 0.95 * this.content);
    const step = tele?.beatStep ?? -1;
    if (step >= 0 && this.lastStep >= 0 && step !== this.lastStep) {
      const wrapped = step < this.lastStep;
      if (wrapped || Math.floor(step / 4) !== Math.floor(this.lastStep / 4)) this.nodSpring.v -= wrapped || Math.floor(step / 16) !== Math.floor(this.lastStep / 16) ? 1.3 : 0.8;
    }
    this.lastStep = step;
    this.nod = this.nodSpring.step(0.13 * this.brow, dt);
    const sway = smooth(0.6, 2, this.held) * 0.07 * Math.sin(this.clock * 1.7);
    this.tilt = this.tiltSpring.step(sway + 0.05 * clamp(wobble, -1.5, 1.5), dt);
  }
};

// vendor/chimera/src/ui/render/anatomy.ts
function faceHandles(model, f, a) {
  const t = model.tract;
  const J = jawFn(model, a);
  const lips = { x: (f.upperLip[6].x + f.lowerLip[6].x) / 2 + 0.15, y: (f.upperLip[6].y + f.lowerLip[6].y) / 2 };
  return [
    { id: "tongue", pos: f.tongueCenter, label: "Tongue body" },
    { id: "tip", pos: f.tip, label: "Tongue tip" },
    { id: "jaw", pos: J(7.5, 4.9), label: "Jaw" },
    { id: "lips", pos: lips, label: "Lips" },
    { id: "velum", pos: f.velum[Math.floor(f.velum.length / 2)], label: "Soft palate" },
    { id: "larynx", pos: { x: f.glottis.x + 1.2 * t.scale, y: f.glottis.y }, label: "Larynx" }
  ];
}
var ECHO_AGES = [0.09, 0.06, 0.03];
var CROWN = 23.4;
var smoothstep = (a, b, x2) => {
  const t = Math.max(0, Math.min(1, (x2 - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
function eyeFeatures(c, k, e) {
  const rx = 1.22 * k, ry = 1.08 * k;
  const arc = (a0, a1) => {
    const o = [];
    for (let i = 0; i <= 14; i++) {
      const an = a0 + (a1 - a0) * i / 14;
      o.push({ x: c.x + rx * Math.cos(an), y: c.y + ry * Math.sin(an) });
    }
    return o;
  };
  const deg = Math.PI / 180;
  const wide = Math.max(0, e.brow);
  const upEnd = 30 * deg + 14 * deg * wide, lo = -32 * deg;
  const up = upEnd + (lo - upEnd) * e.lid;
  const brow = [];
  const raise = 0.42 * k * e.brow, knit = 0.3 * k * Math.max(0, -e.brow);
  for (let i = 0; i <= 12; i++) {
    const u = -1 + i / 6;
    const front = (1 + u) / 2;
    brow.push({ x: c.x + 0.1 * k + 0.9 * k * u, y: c.y + 1.4 * k + 0.2 * k * (1 - u * u) + raise - knit * front });
  }
  return [
    { pts: arc(100 * deg, up), w: 1.15, alpha: 0.9 },
    { pts: arc(-78 * deg, lo), w: 1, alpha: 0.75 },
    { pts: brow, w: 1.4, alpha: 0.85 }
  ];
}
function puffProfile(f, k, puff) {
  if (Math.abs(puff) < 0.01) return null;
  const L = { x: (f.upperLip[6].x + f.lowerLip[6].x) / 2, y: (f.upperLip[6].y + f.lowerLip[6].y) / 2 };
  const out = 0.6 * k * puff;
  return (p) => {
    const dy = Math.abs(p.y - L.y) / (2.6 * k);
    if (dy >= 1) return p;
    const w = (1 - dy * dy) ** 2 * smoothstep(0.03, 0.45, dy) * smoothstep(L.x - 1.2 * k, L.x - 0.5 * k, p.x);
    return w ? { x: p.x + out * w, y: p.y } : p;
  };
}
var AnatomyRenderer = class {
  particles = [];
  scale = 20;
  ox = 0;
  oy = 0;
  w = 0;
  h = 0;
  /** a narrow screen (a phone): readouts in a row above the head, slots in a row below it */
  compact = false;
  sparkSeed = 1;
  geo = null;
  echoes = [];
  clock = 0;
  lastEcho = -1;
  /** where the eye looks */
  gaze = new Gaze();
  /** brows, lids and cheeks, from the voice (the view updates it) */
  face = new Expression();
  constructor() {
    for (let i = 0; i < 170; i++) this.particles.push({ s: Math.random() * 17, u: Math.random() * 2 - 1, life: Math.random(), px: NaN, py: NaN });
  }
  /** size in CSS px */
  resize(w, h) {
    this.w = w;
    this.h = h;
    this.compact = w < 560;
    const padX = 12, padT = this.compact ? 62 : 8, padB = this.compact ? 92 : 8;
    const y1 = this.compact ? CROWN : VIEW.y1;
    this.scale = Math.max(1, Math.min((w - 2 * padX) / (VIEW.x1 - VIEW.x0), (h - padT - padB) / (y1 - VIEW.y0)));
    const spare = w - 2 * padX - (VIEW.x1 - VIEW.x0) * this.scale;
    this.ox = padX + (this.compact ? spare / 2 : Math.min(spare / 2, Math.max(0, spare - 220))) - VIEW.x0 * this.scale;
    this.oy = padT + Math.max(0, (h - padT - padB - (y1 - VIEW.y0) * this.scale) / 2) + y1 * this.scale;
    for (const p of this.particles) p.px = NaN;
  }
  /** body cm → CSS px */
  X(p) {
    return this.ox + p.x * this.scale;
  }
  Y(p) {
    return this.oy - p.y * this.scale;
  }
  P(p) {
    return [this.ox + p.x * this.scale, this.oy - p.y * this.scale];
  }
  /** CSS px (relative to the canvas) → body cm */
  toBody(cx, cy) {
    return { x: (cx - this.ox) / this.scale, y: (this.oy - cy) / this.scale };
  }
  get pxPerCm() {
    return this.scale;
  }
  handles(model, f, a) {
    return faceHandles(model, f, a);
  }
  // ------------------------------------------------------------------ geometry
  geometry(model, f, a) {
    if (this.geo && this.geo.f === f && this.geo.model === model) return this.geo;
    return this.geo = buildProfile(model, f, a);
  }
  /**
   * The lens, moved by the eye's gaze: it holds still for a few seconds, then darts somewhere
   * new (a saccade), and every so often back to straight ahead. Pitch swings it round the front
   * of the eyeball; yaw (looking towards or away from the viewer) foreshortens its offset and
   * opens the edge-on disc out.
   */
  lens(c, k, dt) {
    const g = this.gaze;
    g.update(this.clock, dt);
    const off = 0.85 * k * Math.cos(g.yaw);
    const pitch = g.pitch + this.face.lookUp;
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const lc = { x: c.x + off * cp, y: c.y + off * sp };
    const rx = (0.18 + 0.2 * Math.abs(Math.sin(g.yaw))) * k, ry = 0.42 * k;
    const o = [];
    for (let i = 0; i <= 20; i++) {
      const an = i / 20 * Math.PI * 2;
      const x2 = Math.cos(an) * rx, y = Math.sin(an) * ry;
      o.push({ x: lc.x + x2 * cp - y * sp, y: lc.y + x2 * sp + y * cp });
    }
    return o;
  }
  // ------------------------------------------------------------------ main draw
  draw(ctx, model, f, a, tele, view, opts) {
    this.clock += opts.dt;
    const G = this.geometry(model, f, a);
    const pts = (v) => v.map((p) => this.P(p));
    const line = (v, color, w, o = {}) => beamPts(ctx, pts(v), color, w, o);
    line(G.inset, V.blueDim, 0.9, { alpha: 0.9 });
    line(G.skull, V.blueDim, 0.9, { close: true });
    line(G.brain, V.blueMid, 1.1, { close: true });
    line(G.sulcus, V.blueDim, 0.9);
    line(G.eye, V.blueMid, 1.1);
    const k = model.tract.scale;
    const bulge = puffProfile(f, k, this.face.puff);
    const puffed = (v) => bulge ? v.map(bulge) : v;
    line(this.lens(G.eyeC, k, opts.dt), V.blueDim, 0.9, { alpha: 1 - smoothstep(0.45, 0.9, this.face.lid) });
    for (const l of eyeFeatures(G.eyeC, k, this.face)) line(l.pts, V.blue, l.w, { alpha: l.alpha });
    for (const v of G.vertebrae) line(v, V.blueDim, 1);
    line(G.cords[0], V.blueDim, 0.8, { alpha: 0.8 });
    line(G.cords[1], V.blueDim, 0.8, { alpha: 0.6 });
    line(G.nasal, V.blueMid, 1, { close: true });
    for (const tb of G.turbinates) line(tb, V.blueDim, 0.9);
    line(G.palOral, V.blueMid, 1.1);
    line(G.palNasal, V.blueMid, 1.1);
    line(G.hyoid, V.blueDim, 1);
    line(G.thyroid, V.blueDim, 1);
    for (const tr of G.trachea) line(tr, V.blueMid, 1);
    for (const r of G.rings) line(r, V.blueDim, 0.9);
    if (view.pressure && tele) this.drawPressure(ctx, model, f, tele);
    else if (view.grid) for (const gs of f.grid) seg(ctx, this.X(gs.inner), this.Y(gs.inner), this.X(gs.outer), this.Y(gs.outer), V.blueDim, 0.9, { alpha: 0.7 });
    if (view.particles && tele) this.drawParticles(ctx, model, f, tele, opts.dt);
    if (tele && this.clock - this.lastEcho >= 0.028) {
      this.lastEcho = this.clock;
      this.echoes.push({ t: this.clock, tongue: f.tongue.slice(), jaw: G.jawLower, upperLip: chaikin(puffed(f.upperLip).map((p) => [p.x, p.y])), lowerLip: chaikin(puffed(f.lowerLip).map((p) => [p.x, p.y])) });
      while (this.echoes.length && this.clock - this.echoes[0].t > 0.12) this.echoes.shift();
    }
    if (tele) {
      ECHO_AGES.forEach((age, i) => {
        const e = this.nearestEcho(this.clock - age);
        if (!e) return;
        const o = 0.1 + 0.07 * i;
        line(e.tongue, V.green, 1, { alpha: o });
        line(e.jaw, V.red, 1, { alpha: o * 0.9 });
        const lip = (q) => beamPts(ctx, q.map(([x2, y]) => [this.ox + x2 * this.scale, this.oy - y * this.scale]), V.pink, 1, { alpha: o * 0.9 });
        lip(e.upperLip);
        lip(e.lowerLip);
      });
    }
    line(puffed(G.skinLower), V.blue, 1.7, { hot: true });
    line(puffed(G.skinUpper), V.blue, 1.7, { hot: true });
    line(G.outerWall, V.blue, 1.4, { hot: true });
    line(f.inner, V.blue, 1.3, { alpha: 0.9 });
    line(G.glottisWall, V.blue, 1.2, { alpha: 0.8 });
    line(f.epiglottis.slice(0, 3), V.blue, 2.2, { alpha: 0.85 });
    line(f.upperTeeth, V.blueMid, 1.1, { close: true });
    line(G.lowerTeeth, V.blueMid, 1.1);
    for (const fo of G.folds) line(fo, V.blue, 1);
    const tongueOutline = pts(f.tongue);
    ctx.save();
    const clip = new Path2D();
    tongueOutline.forEach(([x2, y], i) => i ? clip.lineTo(x2, y) : clip.moveTo(x2, y));
    clip.closePath();
    ctx.clip(clip);
    for (const fb of G.fibres) line(fb, V.green, 0.8, { alpha: 0.32 });
    ctx.restore();
    beamPts(ctx, tongueOutline, V.green, 1.6, { hot: true });
    line(G.jawLower, V.red, 1.5, { hot: true });
    line(G.jawUpper, V.red, 1, { alpha: 0.45 });
    const soft = (v, it) => chaikin(v.map((p) => this.P(p)), it);
    beamPts(ctx, soft(puffed(f.upperLip), 2), V.pink, 1.5, { hot: true });
    beamPts(ctx, soft(puffed(f.lowerLip), 2), V.pink, 1.5, { hot: true });
    beamPts(ctx, soft(f.velum, 3), V.white, 1.25, { alpha: 0.92 });
    if (tele) this.drawTurbulence(ctx, model, f, tele);
    if (view.calipers) this.drawCalipers(ctx, f);
    this.drawHandles(ctx, model, f, a, opts.hover, opts.drag);
    this.drawReadouts(ctx, opts.formants, opts.info, opts.slots);
  }
  nearestEcho(t) {
    let best = null, bd = 0.016;
    for (const e of this.echoes) {
      const d = Math.abs(e.t - t);
      if (d < bd) {
        bd = d;
        best = e;
      }
    }
    return best;
  }
  gridPoint(f, s, u) {
    const g = f.grid;
    if (g.length < 2) return null;
    if (s <= g[0].s) {
      const t2 = Math.max(0, s / Math.max(0.01, g[0].s));
      const base = f.glottis;
      const mid = { x: (g[0].inner.x + g[0].outer.x) / 2, y: (g[0].inner.y + g[0].outer.y) / 2 };
      const half = 0.35;
      return { x: base.x + (mid.x - base.x) * t2 + u * half * 0.5, y: base.y + (mid.y - base.y) * t2 };
    }
    let lo = 0, hi = g.length - 1;
    if (s >= g[hi].s) return null;
    while (hi - lo > 1) {
      const m = lo + hi >> 1;
      if (g[m].s <= s) lo = m;
      else hi = m;
    }
    const t = (s - g[lo].s) / Math.max(1e-6, g[hi].s - g[lo].s);
    const ix = g[lo].inner.x + (g[hi].inner.x - g[lo].inner.x) * t;
    const iy = g[lo].inner.y + (g[hi].inner.y - g[lo].inner.y) * t;
    const ox = g[lo].outer.x + (g[hi].outer.x - g[lo].outer.x) * t;
    const oy = g[lo].outer.y + (g[hi].outer.y - g[lo].outer.y) * t;
    const w = 0.5 + 0.5 * u * 0.82;
    return { x: ix + (ox - ix) * w, y: iy + (oy - iy) * w };
  }
  nodeValueAtS(values, nodeS, s) {
    let best = 0, bd = Infinity;
    for (let i = 0; i < nodeS.length; i++) {
      const d = Math.abs(nodeS[i] - s);
      if (d < bd) {
        bd = d;
        best = i;
      }
    }
    return values[best] ?? 0;
  }
  drawPressure(ctx, model, f, tele) {
    const t = tele.t;
    const nodeS = model.nodeS(t.phLen, t.orLen);
    if (nodeS.length !== t.pressureRms.length) return;
    for (const g of f.grid) {
      const lvl = Math.pow(pressureLevel(this.nodeValueAtS(t.pressureRms, nodeS, g.s)), 0.85);
      seg(ctx, this.X(g.inner), this.Y(g.inner), this.X(g.outer), this.Y(g.outer), heat(lvl), 1.15, { alpha: 0.35 + 0.65 * lvl });
    }
  }
  drawParticles(ctx, model, f, tele, dt) {
    const t = tele.t;
    const nodeS = model.nodeS(t.phLen, t.orLen);
    const areas = new Float32Array(t.phAreas.length + t.orAreas.length);
    areas.set(t.phAreas, 0);
    areas.set(t.orAreas, t.phAreas.length);
    const L = f.lipS;
    const path = [new Path2D(), new Path2D(), new Path2D()];
    for (const p of this.particles) {
      const U = this.nodeValueAtS(t.flow, nodeS, p.s);
      const A = Math.max(0.05, this.nodeValueAtS(areas, nodeS, p.s));
      const u = U / A;
      const vis = Math.sign(u) * 2.2 * Math.log1p(Math.abs(u) / 30);
      p.s += vis * dt;
      p.life -= dt * 0.25;
      if (p.s > L || p.s < 0 || p.life <= 0 || Math.abs(u) < 3) {
        if (!(Math.abs(u) < 3 && p.life > 0)) {
          p.s = Math.random() * 0.8;
          p.u = Math.random() * 2 - 1;
          p.life = 0.6 + Math.random() * 0.8;
          p.px = NaN;
          continue;
        }
      }
      const pos = this.gridPoint(f, p.s, p.u);
      if (!pos) continue;
      const x2 = this.X(pos), y = this.Y(pos);
      if (Number.isFinite(p.px)) {
        const band = Math.min(2, Math.floor(Math.min(1, Math.abs(vis) / 6) * Math.min(1, p.life) * 3));
        path[band].moveTo(p.px, p.py);
        path[band].lineTo(x2, y);
      }
      p.px = x2;
      p.py = y;
    }
    path.forEach((pa, i) => beam(ctx, pa, "#ffe2a8", 1.1, { alpha: 0.16 + 0.2 * i }));
  }
  drawTurbulence(ctx, model, f, tele) {
    const t = tele.t;
    if (!(t.noiseLevel > 1) || t.noiseNode < 0) return;
    const s = model.branchS(t.noiseNode, t.phLen, t.orLen);
    if (s < 0) return;
    const intensity = Math.min(1, Math.log10(t.noiseLevel) / 3.2);
    if (intensity <= 0.05) return;
    let seed = this.sparkSeed = this.sparkSeed * 16807 % 2147483647;
    const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
    for (let i = 0; i < 30; i++) {
      const pos = this.gridPoint(f, s + 0.2 + rnd() * 1.2, rnd() * 2 - 1);
      if (!pos) continue;
      dot(ctx, this.X(pos), this.Y(pos), 0.6 + rnd() * 1.4, "#f4fbff", 0.15 + 0.7 * intensity * rnd());
    }
  }
  drawCalipers(ctx, f) {
    let mi = -1, ma = Infinity;
    for (let i = 2; i < f.grid.length - 1; i++) if (f.grid[i].area < ma) {
      ma = f.grid[i].area;
      mi = i;
    }
    if (mi < 0 || ma >= 1.2) return;
    const g = f.grid[mi];
    const [x0, y0] = this.P(g.inner), [x1, y1] = this.P(g.outer);
    seg(ctx, x0, y0, x1, y1, V.white, 1.4, { hot: true });
    const nx = -(y1 - y0), ny = x1 - x0, nl = Math.hypot(nx, ny) || 1;
    for (const [x2, y] of [[x0, y0], [x1, y1]]) seg(ctx, x2 - nx / nl * 4, y - ny / nl * 4, x2 + nx / nl * 4, y + ny / nl * 4, V.white, 1.2);
    const lx = Math.max(x0, x1) + 10, ly = Math.min(y0, y1) - 4;
    label(ctx, ma <= 5e-4 ? "CLOSED" : `${ma.toFixed(2)} CM\xB2`, lx, ly, { size: 11, color: V.white, ls: 0.12 });
  }
  drawHandles(ctx, model, f, a, hover, drag) {
    const colour = { tongue: V.green, jaw: V.red, lips: V.pink, velum: V.white, tip: V.blueMid, larynx: V.blueMid };
    const size = { tongue: 8, jaw: 7, lips: 7, velum: 6, tip: 5, larynx: 5 };
    for (const h of this.handles(model, f, a)) {
      const x2 = this.X(h.pos), y = this.Y(h.pos);
      const active = h.id === drag || h.id === hover;
      handle(ctx, x2, y, colour[h.id], size[h.id] + (active ? 2 : 0), active ? 1 : 0.9);
      if (active) {
        ring(ctx, x2, y, 28, colour[h.id], 1, { alpha: 0.75 });
        label(ctx, h.label.toUpperCase(), x2 + 32, y - 18, { size: 12, color: colour[h.id], ls: 0.18 });
      }
    }
  }
  drawReadouts(ctx, formants, info, slots) {
    drawReadouts(ctx, { w: this.w, h: this.h, compact: this.compact, slotX: this.X({ x: 3.35, y: 0 }), slotY: this.Y({ x: 0, y: 2.05 }) }, formants, info, slots);
  }
};

// vendor/chimera/src/ui/mouthWords.ts
var FADE = 0.45;
function advanceTrail(t, word, clock) {
  const e = t.entries;
  const top = e[e.length - 1];
  if (top && word && top.word.key === word.key) top.left = null;
  else {
    if (top && top.left === null) top.left = clock;
    if (word) e.push({ word, left: null });
  }
  while (e.length && (e.length > 8 || e[0].left !== null && clock - e[0].left > FADE)) e.shift();
}
function mouthWords(now, color, side = 1) {
  const t = { entries: [] };
  const trail = t.entries;
  let clock = 0;
  return (ctx, r, m, f, a, { w, h, dt }) => {
    clock += dt;
    advanceTrail(t, now(), clock);
    if (!trail.length) return;
    const lips = r.handles(m, f, a).find((h2) => h2.id === "lips");
    if (!lips) return;
    const lx = r.X(lips.pos), ly = r.Y(lips.pos);
    const x0 = lx + side * r.pxPerCm * 1.2;
    const ahead = side > 0 ? w - x0 - 14 : x0 - 14;
    const below = ahead < 60;
    const room = below ? w - 16 : ahead;
    const base = Math.max(26, Math.min(64, r.pxPerCm * 1.7));
    const by = Math.min(h - 14, ly + r.pxPerCm * 18);
    for (const { word: wd, left } of trail) {
      const age = left === null ? 0 : clock - left;
      const u = Math.min(1, age / FADE);
      const text = wd.text.toUpperCase();
      ctx.font = hfont(base, "m");
      const wide = ctx.measureText(text).width * 1.08;
      const size = (wide > room ? base * room / wide : base) * (1 - 0.55 * u);
      const alpha = left === null ? 1 : 0.75 * (1 - u) ** 1.5;
      const o = { size, color, weight: "m", ls: 0.05, alpha, moving: left !== null };
      if (below) {
        const half = Math.min(wide, room) * (1 - 0.55 * u) / 2;
        label(ctx, text, Math.min(w - 8 - half, Math.max(8 + half, lx)), by + age * 120, { ...o, align: "center" });
      } else label(ctx, text, x0 + side * age * 240, ly + size * 0.36 - age * 200, { ...o, align: side > 0 ? "left" : "right" });
    }
    if (!below && trail[trail.length - 1].left === null) seg(ctx, lx + side * 10, ly, x0 - side * 10, ly, color, 1, { dash: [2, 5], alpha: 0.7 });
  };
}

// performance.ts
var ink = "#e5eddd";
var dim = "#a2b4ab";
var green = "#8ce1b7";
var amber = "#ffc578";
var rule = "#3a4d48";
var tc = (t) => [Math.floor(t / 60), Math.floor(t % 60)].map((v) => String(v).padStart(2, "0")).join(":");
function pinyin(value) {
  const marks = { a: "\u0101\xE1\u01CE\xE0", e: "\u0113\xE9\u011B\xE8", i: "\u012B\xED\u01D0\xEC", o: "\u014D\xF3\u01D2\xF2", u: "\u016B\xFA\u01D4\xF9", \u00FC: "\u01D6\u01D8\u01DA\u01DC" };
  const tone = Number(value.at(-1)), base = value.replace(/[1-5]$/, "").replaceAll("v", "\xFC");
  if (!tone || tone === 5) return base;
  const char = base.includes("a") ? "a" : base.includes("e") ? "e" : base.includes("ou") ? "o" : [...base].filter((c) => marks[c]).at(-1);
  return char ? base.replace(char, marks[char][tone - 1]) : base;
}
var initialization;
async function createPerformance(canvas, score, telemetry, wasm) {
  await (initialization ??= initChimera(wasm));
  const { VoiceModel: VoiceModel2 } = await Promise.resolve().then(() => (init_analysis(), analysis_exports));
  const model = new VoiceModel2(telemetry.body, 48e3), renderer = new AnatomyRenderer(), glow = new Glow();
  const tract = document.createElement("canvas");
  tract.width = 530;
  tract.height = 632;
  const ctx = tract.getContext("2d");
  const fillText = ctx.fillText.bind(ctx), measureText = ctx.measureText.bind(ctx);
  const chinese = (s) => /[\u3100-\u9fff]/.test(s);
  ctx.fillText = (s, x2, y, maxWidth) => {
    const previous = ctx.font;
    if (chinese(s)) ctx.font = `400 ${previous.match(/[\d.]+px/)?.[0] ?? "30px"} ChimeraSans`;
    if (maxWidth === void 0) fillText(s, x2, y);
    else fillText(s, x2, y, maxWidth);
    ctx.font = previous;
  };
  ctx.measureText = (s) => {
    const previous = ctx.font;
    if (chinese(s)) ctx.font = `400 ${previous.match(/[\d.]+px/)?.[0] ?? "30px"} ChimeraSans`;
    const result = measureText(s);
    ctx.font = previous;
    return result;
  };
  canvas.width = 1280;
  canvas.height = 720;
  const out = canvas.getContext("2d");
  renderer.resize(530, 632);
  let currentWord = null, prevTime = 0;
  const overlay = mouthWords(() => currentWord, "#ffffff");
  const noteRows = score.syllables.map((s) => {
    const ps = score.pitch.filter((p) => p.time >= s.start && p.time < s.end && p.measured).map((p) => p.hz).sort((a, b) => a - b);
    return { ...s, hz: ps.length ? ps[Math.floor(ps.length / 2)] : 210 };
  });
  const words = [];
  function text(str, x2, y, size, color = ink, family = "Archivo, sans-serif", weight = "400", align = "left") {
    if (/[\u00c0-\u02ff\u3100-\u9fff]/.test(str) && !family.includes("ChimeraSerif")) family = "ChimeraSans, sans-serif";
    out.font = `${weight} ${size}px ${family}`;
    out.fillStyle = color;
    out.textAlign = align;
    out.fillText(str, x2, y);
    out.textAlign = "left";
  }
  const sample = (time) => telemetry.frames[Math.min(telemetry.frames.length - 1, Math.max(0, Math.floor(time * (telemetry.fps ?? 60))))];
  function draw(time, options = {}) {
    const frame = sample(time), t = frame.t;
    const dt = options.playing ? Math.max(0, Math.min(0.05, time >= prevTime ? time - prevTime : 1 / 60)) : 0;
    prevTime = time;
    const a = VoiceModel2.articFromArray(t.artic), f = model.frame(a), formants = frame.formants ?? model.transfer(a).formants;
    const idx = score.syllables.findIndex((s) => time >= s.start && time < s.end);
    const syl = score.syllables[idx];
    currentWord = syl ? { key: idx, text: syl.text } : null;
    const nearest = model.vowels.reduce((best, v) => {
      const error = Math.hypot(2.2 * Math.log(formants[0] / v.F1), Math.log(formants[1] / v.F2));
      return error < best.error ? { error, ipa: v.ipa } : best;
    }, { error: Infinity, ipa: "\u2212" });
    const slots = [{ label: "Tongue", value: nearest.ipa, color: V.green, ipa: true }, { label: "Jaw", value: a.jaw.toFixed(1), unit: "cm", color: V.red }, { label: "Lips", value: a.lipAp.toFixed(1), unit: "cm", color: V.pink }, { label: "Soft palate", value: f.velumPort > 0.02 ? f.velumPort.toFixed(2) : "Shut", unit: f.velumPort > 0.02 ? "cm\xB2" : "", color: V.white }];
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 530, 632);
    renderer.face.update(frame, dt);
    renderer.draw(ctx, model, f, a, frame, { pressure: options.pressure !== false, particles: options.airflow !== false, calipers: options.measurements !== false, grid: false }, { dt, hover: null, drag: null, slots, formants, info: ["TRACT " + f.length.toFixed(1) + " CM", "MOUTH " + f.lipArea.toFixed(1) + " CM\xB2", "F0 " + t.f0.toFixed(1) + " HZ", "LUNGS " + t.pLung.toFixed(1) + " CMH\u2082O"] });
    overlay(ctx, renderer, model, f, a, { w: 530, h: 632, dt });
    glow.apply(tract, ctx, 1);
    out.fillStyle = "#101d1d";
    out.fillRect(0, 0, 1280, 720);
    out.fillStyle = "#000";
    out.fillRect(0, 0, 552, 714);
    out.strokeStyle = "#45657d";
    out.lineWidth = 1;
    out.strokeRect(8.5, 8.5, 535, 697);
    label(out, "VOCAL TRACT", 19, 30, { size: 15, color: V.blue, ls: 0.15, weight: "m" });
    label(out, "ADULT MALE / MIDSAGITTAL", 170, 30, { size: 11, color: V.blueMid, ls: 0.11 });
    let chipX = 19;
    for (const [name, cw, on] of [["SOUND PRESSURE", 145, options.pressure !== false], ["AIRFLOW", 89, options.airflow !== false], ["MEASUREMENTS", 134, options.measurements !== false]]) {
      out.strokeStyle = on ? "#55758e" : "#213442";
      out.strokeRect(chipX + 0.5, 40.5, cw, 23);
      label(out, name, chipX + cw / 2, 56, { size: 11, color: on ? V.blue : V.blueDim, align: "center" });
      chipX += cw + 6;
    }
    out.drawImage(tract, 11, 68);
    text("CHIMERA   /   VOCAL SYNTHESIZER", 585, 42, 15, green, "monospace");
    text(score.title ?? "\u95DC\u65BC\u5C0F\u718A", 583, 132, 76, ink, "ChimeraSerif, serif");
    text(score.credit ?? "\u86CB\u5821 / SOFT LIPA \xB7 \u4E2D\u6587\u8BF4\u5531", 587, 174, 16, dim, 'Archivo, "PingFang SC", sans-serif');
    out.strokeStyle = "#a76d5b";
    out.strokeRect(1179.5, 94.5, 42, 43);
    text("\u83EF", 1190, 112, 15, "#bb8068", "serif");
    text("\u8A9E", 1190, 130, 15, "#bb8068", "serif");
    out.fillStyle = rule;
    out.fillRect(585, 199, 650, 1);
    text("SUNG TEXT", 585, 235, 16, dim, "monospace");
    text("VERSE", 1235, 235, 17, amber, "monospace", "400", "right");
    const second = time >= (score.syllables[13]?.start ?? Infinity);
    const rows = score.lyricRows ? score.lyricRows.map(([a2, b]) => score.syllables.slice(a2, b)) : second ? [score.syllables.slice(13, 19), score.syllables.slice(19)] : [score.syllables.slice(0, 8), score.syllables.slice(8, 13)];
    words.length = 0;
    rows.forEach((row, j) => {
      let x2 = 585;
      const y = 302 + j * 76;
      const widths = row.map((r) => Math.max(1, r.text.length) * 46 + 10), scale2 = Math.min(1, 650 / widths.reduce((a2, b) => a2 + b, 0));
      row.forEach((r, k) => {
        const active = syl === r, size = 46 * scale2;
        const highlighted = active ? amber : ink;
        text(r.text, x2, y, size, highlighted, 'Archivo, "PingFang SC", sans-serif', "700");
        if (options.reading !== "none") {
          const reading = options.reading === "zhuyin" ? r.zhuyin : pinyin(r.pinyin);
          text(reading, x2 + widths[k] * scale2 / 2, y + 23, 12, active ? amber : "#7e9c8e", 'Archivo, "PingFang SC", sans-serif', "400", "center");
        }
        words.push({ x: x2, y: y - 48, w: widths[k] * scale2, h: 77, start: r.start });
        x2 += widths[k] * scale2;
      });
    });
    text("MELODY", 585, 448, 15, dim, "monospace");
    const audible = t.outRms > 5e-3 && t.voicing > 0.25;
    text("PITCH / " + (audible ? Math.round(t.f0) + " Hz" : "\u2014"), 1235, 448, 16, green, "monospace", "400", "right");
    out.save();
    out.beginPath();
    out.rect(585, 463, 650, 167);
    out.clip();
    out.fillStyle = "#273c37";
    for (let y = 480; y <= 620; y += 28) out.fillRect(585, y, 650, 1);
    const left = time - 1.45, scale = 141, xOf = (s) => 585 + (s - left) * scale, yOf = (hz) => 620 - Math.max(0, Math.min(1, Math.log2(hz / 110) / 1.7)) * 132;
    noteRows.forEach((r) => {
      const x2 = xOf(r.start), width = Math.max(3, (r.end - r.start) * scale - 2);
      out.fillStyle = time >= r.start && time < r.end ? amber : "#5c776b";
      out.beginPath();
      out.roundRect(x2, yOf(r.hz), width, 6, 2);
      out.fill();
    });
    if (options.compare) {
      out.strokeStyle = "#8ce1b7";
      out.lineWidth = 1.2;
      out.beginPath();
      let pen = false;
      for (const p of score.renderedPitch) {
        if (p.hz < 110 || p.time < left || p.time > time + 3.2) {
          pen = false;
          continue;
        }
        const x2 = xOf(p.time), y = yOf(p.hz);
        if (pen) out.lineTo(x2, y);
        else {
          out.moveTo(x2, y);
          pen = true;
        }
      }
      out.stroke();
    }
    out.fillStyle = amber;
    out.fillRect(xOf(time), 468, 1.5, 160);
    out.restore();
    if (score.harmonySpectrum) {
      text("BACKING VOCALS", 585, 359, 15, green, "monospace");
      text("\u548C\u58F0\u7EC4\u9891\u8C31 \xB7 \u542B\u6CDB\u97F3", 1235, 359, 13, dim, "ChimeraSans", "400", "right");
      const sp = score.harmonySpectrum;
      out.fillStyle = "#172b28";
      out.fillRect(585, 370, 650, 52);
      sp.values.forEach((row, i) => row.forEach((v, j) => {
        if (v < 0.16) return;
        out.fillStyle = `rgba(140,225,183,${v * 0.75})`;
        out.fillRect(585 + sp.times[i] / score.duration * 650, 418 - j / row.length * 46, Math.ceil(650 / sp.values.length) + 1, 2);
      }));
      out.fillStyle = amber;
      out.fillRect(585 + time / score.duration * 650, 370, 1.5, 52);
    }
    out.fillStyle = rule;
    out.fillRect(585, 647, 650, 1);
    text(score.bpm ? score.bpm + " BPM  /  4\xB74" : "LEAD + BACKING  /  \u6821\u5BF9\u7247\u6BB5", 585, 684, 16, dim, "monospace");
    text(tc(time) + " / " + tc(score.duration), 1235, 684, 20, ink, "monospace", "400", "right");
    out.fillStyle = green;
    out.fillRect(0, 715, 1280 * time / score.duration, 5);
    return { words, telemetry: t, currentIndex: idx };
  }
  return { draw, sample: (time) => sample(time).t, dispose: () => model.dispose() };
}
export {
  createPerformance
};
