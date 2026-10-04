import { LitElement, html, css, svg, PropertyValues } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { RecipeStep, RECIPES, buildSteps, stepIndexAt } from "./recipe";
import "./editor";

export interface V60TimerCardConfig {
  type: string;
  title?: string;
  cups?: number;
  sound_enabled?: boolean;
  default_recipe?: string;
}

type RunState = "idle" | "running" | "paused" | "finished";

// One "cup" = James Hoffmann's own per-serving ratio (30g : 500g is 2 cups).
const PER_CUP_DOSE_G = 15;
const PER_CUP_WATER_G = 250;
const CUPS_MIN = 1;
const CUPS_MAX = 6;
const DEFAULT_CUPS = 2;

// Pulse-line geometry (viewBox units).
const PULSE_W = 320;
const PULSE_H = 56;
const PULSE_BASELINE = 42;
const PULSE_MAX_AMP = 28;
const PULSE_SAMPLES = 160;

function fmt(s: number): string {
  const whole = Math.max(0, Math.floor(s));
  const m = Math.floor(whole / 60);
  const sec = whole % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/** Text for the "Next: ..." row — measured steps auto-derive, others carry their own phrase. */
function nextRowText(step: RecipeStep): string {
  if (step.kind === "measured") return `Pour to ${step.targetWaterG}g (${step.targetWaterG}ml)`;
  return step.nextLabel;
}

interface Hump {
  start: number;
  dur: number;
  flow: number;
}

interface PulseGeometry {
  fullPath: string;
  pastPath: string;
  markerX: number;
  markerY: number;
}

@customElement("v60-timer-card")
export class V60TimerCard extends LitElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property({ attribute: false }) hass?: any;

  @state() private _config!: V60TimerCardConfig;
  @state() private _recipeId = RECIPES[0].id;
  @state() private _steps: RecipeStep[] = [];
  @state() private _runState: RunState = "idle";
  @state() private _elapsedS = 0;
  @state() private _cups = DEFAULT_CUPS;
  @state() private _soundOn = true;

  private _startEpochMs = 0;
  private _pausedElapsedS = 0;
  private _lastStepIndex = -1;
  private _rafId?: number;
  private _audioCtx?: AudioContext;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _wakeLock?: any;

  static getStubConfig(): V60TimerCardConfig {
    return {
      type: "custom:v60-timer-card",
      title: "Pour-Over Timer",
      cups: DEFAULT_CUPS,
      sound_enabled: true,
      default_recipe: RECIPES[0].id,
    };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("v60-timer-card-editor");
  }

  setConfig(config: V60TimerCardConfig): void {
    if (config.cups !== undefined && config.cups <= 0) {
      throw new Error("cups must be greater than 0");
    }

    this._config = {
      title: "Pour-Over Timer",
      sound_enabled: true,
      cups: DEFAULT_CUPS,
      default_recipe: RECIPES[0].id,
      ...config,
    };

    this._cups = Math.min(CUPS_MAX, Math.max(CUPS_MIN, Math.round(this._config.cups!)));
    this._soundOn = this._config.sound_enabled!;
    this._recipeId = RECIPES.some((r) => r.id === this._config.default_recipe)
      ? this._config.default_recipe!
      : RECIPES[0].id;
    this._recomputeSteps();
  }

  getCardSize(): number {
    return 7;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._rafId = requestAnimationFrame(this._tick);
    document.addEventListener("visibilitychange", this._onVisibilityChange);
  }

  disconnectedCallback(): void {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    document.removeEventListener("visibilitychange", this._onVisibilityChange);
    this._releaseWakeLock();
    super.disconnectedCallback();
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
  }

  private _tick = (): void => {
    if (this._runState === "running") {
      const totalS = this._steps[this._steps.length - 1].endTimeS;
      const elapsed = (Date.now() - this._startEpochMs) / 1000;
      this._elapsedS = Math.min(elapsed, totalS);

      const idx = stepIndexAt(this._steps, this._elapsedS);
      if (idx !== this._lastStepIndex) {
        const isLast = idx === this._steps.length - 1;
        this._playChime(isLast ? "done" : "step");
        this._lastStepIndex = idx;
      }

      if (this._elapsedS >= totalS) {
        this._runState = "finished";
        this._releaseWakeLock();
      }
    }
    this._rafId = requestAnimationFrame(this._tick);
  };

  private _start(): void {
    if (this._runState === "idle" || this._runState === "finished") {
      this._pausedElapsedS = 0;
      this._lastStepIndex = -1;
      this._elapsedS = 0;
    }
    this._ensureAudio();
    this._startEpochMs = Date.now() - this._pausedElapsedS * 1000;
    this._runState = "running";
    this._requestWakeLock();
  }

  private _pause(): void {
    this._pausedElapsedS = this._elapsedS;
    this._runState = "paused";
    this._releaseWakeLock();
  }

  private _reset(): void {
    this._runState = "idle";
    this._elapsedS = 0;
    this._pausedElapsedS = 0;
    this._lastStepIndex = -1;
    this._releaseWakeLock();
  }

  private _doseG(): number {
    return this._cups * PER_CUP_DOSE_G;
  }

  private _currentWaterG(): number {
    return this._cups * PER_CUP_WATER_G;
  }

  private _recomputeSteps(): void {
    const recipe = RECIPES.find((r) => r.id === this._recipeId) ?? RECIPES[0];
    this._steps = buildSteps(recipe.template, {
      doseG: this._doseG(),
      waterG: this._currentWaterG(),
    });
    this._reset();
  }

  private get _recipeLocked(): boolean {
    return this._runState === "running" || this._runState === "paused";
  }

  private _switchRecipe(id: string): void {
    if (this._recipeLocked || id === this._recipeId) return;
    this._recipeId = id;
    this._recomputeSteps();
  }

  private _changeCups(delta: number): void {
    if (this._recipeLocked) return;
    this._cups = Math.min(CUPS_MAX, Math.max(CUPS_MIN, this._cups + delta));
    this._recomputeSteps();
  }

  private _toggleSound = (): void => {
    this._soundOn = !this._soundOn;
  };

  // The wake lock auto-releases when the tab is hidden; re-acquire it if the
  // brew is still running when the dashboard becomes visible again.
  private _onVisibilityChange = (): void => {
    if (this._runState === "running" && document.visibilityState === "visible" && !this._wakeLock) {
      this._requestWakeLock();
    }
  };

  private async _requestWakeLock(): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this._wakeLock = await (navigator as any).wakeLock?.request?.("screen");
    } catch {
      this._wakeLock = undefined;
    }
  }

  private _releaseWakeLock(): void {
    this._wakeLock?.release?.();
    this._wakeLock = undefined;
  }

  private _ensureAudio(): void {
    if (!this._soundOn) return;
    if (!this._audioCtx) {
      this._audioCtx = new AudioContext();
    }
    if (this._audioCtx.state === "suspended") {
      this._audioCtx.resume();
    }
  }

  private _playChime(kind: "step" | "done"): void {
    if (!this._soundOn || !this._audioCtx) return;
    const ctx = this._audioCtx;
    const freqs = kind === "done" ? [880, 1100, 1320] : [760];
    let t = ctx.currentTime;
    for (const freq of freqs) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
      t += 0.16;
    }
  }

  private _currentStepIndex(): number {
    return stepIndexAt(this._steps, this._elapsedS);
  }

  /** Smoothly interpolated "pour to" target for the active step, for following along with a scale. */
  private _liveTargetG(idx: number): number {
    const step = this._steps[idx];
    if (step.kind !== "measured") return step.targetWaterG;

    const prevEnd = idx > 0 ? this._steps[idx - 1].endTimeS : 0;
    const prevTarget = idx > 0 ? this._steps[idx - 1].targetWaterG : 0;
    const span = step.endTimeS - prevEnd;
    const frac = span > 0 ? (this._elapsedS - prevEnd) / span : 1;
    return Math.round(lerp(prevTarget, step.targetWaterG, frac));
  }

  // Step boundaries can sit just a few seconds apart (e.g. a 10s pause on a
  // 9-minute brew), which would stack their axis labels on top of each
  // other. Thin them out to a minimum spacing, always keeping the final tick.
  private _axisTicks(totalS: number): number[] {
    const all = [0];
    for (const s of this._steps) {
      if (s.kind !== "done") all.push(s.endTimeS);
    }
    const minGap = totalS * 0.08;
    const kept: number[] = [];
    for (const t of all) {
      if (kept.length === 0 || t - kept[kept.length - 1] >= minGap) {
        kept.push(t);
      } else if (t === all[all.length - 1]) {
        kept[kept.length - 1] = t;
      }
    }
    return kept;
  }

  /** Flow-rate "humps" per measured step, used to shape the pulse line. */
  private _humps(): Hump[] {
    const humps: Hump[] = [];
    let prevTarget = 0;
    for (let i = 0; i < this._steps.length; i++) {
      const s = this._steps[i];
      const prevEnd = i > 0 ? this._steps[i - 1].endTimeS : 0;
      const dur = s.endTimeS - prevEnd;
      if (s.kind === "measured") {
        const delta = s.targetWaterG - prevTarget;
        humps.push({ start: prevEnd, dur, flow: dur > 0 ? delta / dur : 0 });
      }
      prevTarget = s.targetWaterG;
    }
    return humps;
  }

  private _pulseGeometry(totalS: number): PulseGeometry {
    const humps = this._humps();
    const maxFlow = Math.max(0.001, ...humps.map((h) => h.flow));

    const yAt = (t: number): number => {
      for (const h of humps) {
        if (h.dur > 0 && t >= h.start && t <= h.start + h.dur) {
          const local = (t - h.start) / h.dur;
          const amp = PULSE_MAX_AMP * (h.flow / maxFlow);
          return PULSE_BASELINE - amp * (0.5 - 0.5 * Math.cos(2 * Math.PI * local));
        }
      }
      return PULSE_BASELINE;
    };

    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= PULSE_SAMPLES; i++) {
      const t = (i / PULSE_SAMPLES) * totalS;
      points.push({ x: (t / totalS) * PULSE_W, y: yAt(t) });
    }

    const elapsedClamped = Math.min(this._elapsedS, totalS);
    const markerX = (elapsedClamped / totalS) * PULSE_W;
    const markerY = yAt(elapsedClamped);

    const toPath = (pts: { x: number; y: number }[]) =>
      pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

    const pastPoints = points.filter((p) => p.x <= markerX);
    pastPoints.push({ x: markerX, y: markerY });

    return {
      fullPath: toPath(points),
      pastPath: toPath(pastPoints),
      markerX,
      markerY,
    };
  }

  private _chapterLabels(totalS: number): { leftPct: number; text: string }[] {
    const humps = this._humps();
    const labels: { leftPct: number; text: string }[] = [];
    let humpI = 0;
    for (let i = 0; i < this._steps.length; i++) {
      const s = this._steps[i];
      if (s.kind === "done") continue;
      let mid: number;
      if (s.kind === "measured") {
        const h = humps[humpI++];
        mid = h.start + h.dur / 2;
      } else {
        const prevEnd = i > 0 ? this._steps[i - 1].endTimeS : 0;
        mid = (prevEnd + s.endTimeS) / 2;
      }
      labels.push({ leftPct: (mid / totalS) * 100, text: s.chapterLabel });
    }
    return labels;
  }

  render() {
    if (!this._config || !this._steps.length) return html``;

    const activeRecipe = RECIPES.find((r) => r.id === this._recipeId) ?? RECIPES[0];
    const idx = this._currentStepIndex();
    const step = this._steps[idx];
    const totalS = this._steps[this._steps.length - 1].endTimeS;
    const liveTarget = this._liveTargetG(idx);
    const locked = this._recipeLocked;
    const waterG = this._currentWaterG();
    const next = this._steps[idx + 1];

    let heroLabel: string;
    let heroValue: string;
    let heroTarget = "";
    let heroUnit = "";

    if (step.kind === "measured") {
      heroLabel = "Pour to";
      heroValue = String(liveTarget);
      heroTarget = `/ ${step.targetWaterG}`;
      heroUnit = "g";
    } else if (step.kind === "timed") {
      heroLabel = step.heroLabel;
      heroValue = fmt(Math.max(0, step.endTimeS - this._elapsedS));
    } else {
      heroLabel = step.heroLabel;
      heroValue = String(waterG);
      heroUnit = "g";
    }

    const pulse = this._pulseGeometry(totalS);
    const labels = this._chapterLabels(totalS);

    return html`
      <ha-card>
        <div class="content">
          <div class="recipe-tabs">
            ${RECIPES.map(
              (r) => html`
                <button
                  type="button"
                  class="tab ${r.id === this._recipeId ? "active" : ""}"
                  ?disabled=${locked}
                  @click=${() => this._switchRecipe(r.id)}
                >
                  ${r.name}
                </button>
              `
            )}
          </div>

          <div class="recipe-controls ${locked ? "is-locked" : ""}">
            <div class="control-row">
              <span class="control-label">Cups</span>
              <div class="stepper">
                <button
                  type="button"
                  aria-label="Fewer cups"
                  ?disabled=${locked}
                  @click=${() => this._changeCups(-1)}
                >
                  &minus;
                </button>
                <span class="stepper-value"
                  >${this._cups} ${this._cups === 1 ? "cup" : "cups"}</span
                >
                <button
                  type="button"
                  aria-label="More cups"
                  ?disabled=${locked}
                  @click=${() => this._changeCups(1)}
                >
                  &plus;
                </button>
              </div>
            </div>
            <div class="recipe-summary">
              ${this._doseG()}g coffee · ${waterG}g water · ${activeRecipe.grindSize} grind
            </div>
          </div>

          <div class="now-label">Now</div>
          <div class="now-step">${step.label}</div>

          <div class="hero">
            <div class="hero-label">${heroLabel}</div>
            <div class="hero-value">
              <span class="hero-number">${heroValue}</span>
              ${heroTarget ? html`<span class="hero-target">${heroTarget}</span>` : ""}
              ${heroUnit ? html`<span class="hero-unit">${heroUnit}</span>` : ""}
            </div>
          </div>

          <p class="instruction">${step.instruction}</p>

          ${next
            ? html`<div class="next-row">Next: <strong>${nextRowText(next)}</strong></div>`
            : ""}

          <div class="pulse-wrap">
            <div class="pulse-labels">
              ${labels.map((l) => html`<span style="left:${l.leftPct}%">${l.text}</span>`)}
            </div>
            <svg
              class="pulse-svg"
              viewBox="0 0 ${PULSE_W} ${PULSE_H}"
              preserveAspectRatio="none"
            >
              ${svg`<defs>
                <linearGradient id="v60PulseGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stop-color="var(--v60-accent)" />
                  <stop offset="1" stop-color="var(--v60-accent-pale)" />
                </linearGradient>
              </defs>`}
              ${svg`<path class="pulse-future" d=${pulse.fullPath}></path>`}
              ${svg`<path class="pulse-past" d=${pulse.pastPath}></path>`}
              ${svg`<circle class="pulse-dot" cx=${pulse.markerX} cy=${pulse.markerY} r="3.2"></circle>`}
            </svg>
            <div class="track-axis">
              ${this._axisTicks(totalS).map((t, i, arr) => {
                const pos = (t / totalS) * 100;
                const align = i === 0 ? "left" : i === arr.length - 1 ? "right" : "center";
                const style =
                  align === "left"
                    ? `left:0`
                    : align === "right"
                    ? `right:0`
                    : `left:${pos}%; transform:translateX(-50%)`;
                return html`<span style=${style}>${fmt(t)}</span>`;
              })}
            </div>
          </div>

          <div class="controls">
            ${this._runState === "running"
              ? html`<button class="btn-primary" @click=${this._pause}>Pause</button>`
              : html`<button class="btn-primary" @click=${this._start}>
                  ${this._runState === "paused" ? "Resume" : "Start"}
                </button>`}
            <button class="btn-secondary" @click=${this._reset}>Reset</button>
          </div>

          <div class="toggle-row">
            <button class="chip ${this._soundOn ? "on" : ""}" @click=${this._toggleSound}>
              Sound ${this._soundOn ? "on" : "off"}
            </button>
          </div>
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      --v60-bg: #0a1210;
      --v60-surface: rgba(238, 246, 242, 0.055);
      --v60-surface-strong: rgba(238, 246, 242, 0.1);
      --v60-ink: #eef6f1;
      --v60-muted: #8fab9b;
      --v60-divider: rgba(238, 246, 242, 0.13);
      --v60-accent: #698f5b;
      --v60-accent-pale: #acbe9d;
      --v60-accent-ink: #12190f;
      --v60-accent-soft: rgba(105, 143, 91, 0.18);
      --v60-font-ui: "Roboto", "Noto Sans", ui-sans-serif, system-ui, -apple-system, sans-serif;
      --v60-font-mono: "Roboto Mono", ui-monospace, "SF Mono", "Cascadia Code",
        "DejaVu Sans Mono", Consolas, monospace;
      display: block;
      container-type: inline-size;
    }
    ha-card {
      background: var(--v60-bg);
      color: var(--v60-ink);
      border-radius: 24px;
      padding-bottom: 8px;
      font-family: var(--v60-font-ui);
    }
    .content {
      padding: 24px 22px 18px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .recipe-tabs {
      display: flex;
      gap: 6px;
      padding: 4px;
      border-radius: 14px;
      background: var(--v60-surface);
      border: 1px solid var(--v60-divider);
    }
    .tab {
      flex: 1;
      padding: 8px;
      border-radius: 10px;
      border: none;
      background: transparent;
      color: var(--v60-muted);
      font-family: var(--v60-font-ui);
      font-weight: 600;
      font-size: 0.88em;
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .tab.active {
      color: var(--v60-accent-ink);
      background: var(--v60-accent);
    }
    .tab:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .recipe-controls {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 12px 14px;
      border-radius: 14px;
      background: var(--v60-surface);
      border: 1px solid var(--v60-divider);
    }
    .control-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .control-label {
      flex: 0 0 auto;
      font-size: 0.78em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--v60-muted);
    }
    .stepper {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .stepper button {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid var(--v60-divider);
      background: var(--v60-surface-strong);
      color: var(--v60-ink);
      font-size: 1.1em;
      line-height: 1;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.1s ease;
    }
    .stepper button:active {
      transform: scale(0.92);
    }
    .stepper button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .stepper-value {
      min-width: 4.5em;
      text-align: center;
      font-family: var(--v60-font-mono);
      font-variant-numeric: tabular-nums;
      font-weight: 600;
    }
    .recipe-summary {
      font-size: 0.8em;
      font-family: var(--v60-font-mono);
      color: var(--v60-muted);
      font-variant-numeric: tabular-nums;
    }
    .recipe-controls.is-locked {
      opacity: 0.6;
    }

    .now-label {
      font-size: 0.78em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--v60-muted);
    }
    .now-step {
      font-size: clamp(1.5rem, 10cqi, 2rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.01em;
      color: var(--v60-ink);
    }

    .hero-label {
      font-size: 0.78em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--v60-muted);
      margin-bottom: 4px;
    }
    .hero-value {
      display: flex;
      align-items: baseline;
      gap: 10px;
      flex-wrap: wrap;
    }
    .hero-number,
    .hero-unit {
      font-family: var(--v60-font-mono);
      font-weight: 700;
      line-height: 1;
      font-variant-numeric: tabular-nums;
      background: linear-gradient(90deg, var(--v60-accent), var(--v60-accent-pale));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .hero-number {
      font-size: 4.5rem;
      font-size: clamp(3.25rem, 22cqi, 6rem);
    }
    .hero-unit {
      font-size: 1.8rem;
      font-size: clamp(1.4rem, 7cqi, 2.2rem);
    }
    .hero-target {
      font-family: var(--v60-font-mono);
      font-weight: 700;
      font-size: 1.8rem;
      font-size: clamp(1.4rem, 7cqi, 2.2rem);
      line-height: 1;
      font-variant-numeric: tabular-nums;
      color: var(--v60-muted);
    }
    .instruction {
      margin: 0;
      font-size: 1.15em;
      font-weight: 500;
      line-height: 1.45;
      color: var(--v60-ink);
    }

    .next-row {
      font-size: 0.92em;
      color: var(--v60-muted);
    }
    .next-row strong {
      color: var(--v60-ink);
      font-weight: 600;
    }

    .pulse-wrap {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .pulse-labels {
      position: relative;
      height: 1.2em;
      font-family: var(--v60-font-mono);
      font-size: 0.68em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      color: var(--v60-muted);
    }
    .pulse-labels span {
      position: absolute;
      transform: translateX(-50%);
      white-space: nowrap;
    }
    .pulse-svg {
      width: 100%;
      height: 60px;
      display: block;
      overflow: visible;
    }
    .pulse-future {
      fill: none;
      stroke: var(--v60-accent-pale);
      stroke-opacity: 0.45;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .pulse-past {
      fill: none;
      stroke: url(#v60PulseGrad);
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .pulse-dot {
      fill: var(--v60-ink);
      stroke: var(--v60-accent);
      stroke-width: 2;
    }
    .track-axis {
      position: relative;
      height: 1.2em;
    }
    .track-axis span {
      position: absolute;
      font-family: var(--v60-font-mono);
      font-size: 0.75em;
      font-variant-numeric: tabular-nums;
      color: var(--v60-muted);
    }

    .controls {
      display: flex;
      gap: 10px;
      margin-top: 4px;
    }
    .btn-primary {
      flex: 1;
      min-height: 58px;
      border-radius: 16px;
      border: none;
      background: var(--v60-accent);
      color: var(--v60-accent-ink);
      font-size: 1.1em;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 0 0 1px rgba(105, 143, 91, 0.5), 0 8px 24px -8px rgba(105, 143, 91, 0.5);
      transition: transform 0.1s ease, filter 0.15s ease;
    }
    .btn-primary:hover {
      filter: brightness(1.06);
    }
    .btn-primary:active {
      transform: scale(0.98);
    }
    .btn-secondary {
      min-width: 96px;
      border-radius: 16px;
      border: 1px solid var(--v60-divider);
      background: var(--v60-surface-strong);
      color: var(--v60-ink);
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.1s ease;
    }
    .btn-secondary:active {
      transform: scale(0.98);
    }

    .toggle-row {
      display: flex;
      gap: 10px;
    }
    .chip {
      flex: 1;
      padding: 11px;
      border-radius: 14px;
      border: 1px solid var(--v60-divider);
      background: var(--v60-surface);
      color: var(--v60-muted);
      font-weight: 600;
      font-size: 0.86em;
      cursor: pointer;
      transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
    }
    .chip.on {
      color: var(--v60-ink);
      border-color: var(--v60-accent-pale);
      background: var(--v60-accent-soft);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "v60-timer-card": V60TimerCard;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "v60-timer-card",
  name: "Pour-Over Timer",
  description: "Interactive timer for James Hoffmann's V60 and French press recipes.",
  preview: true,
});
