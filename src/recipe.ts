/**
 * Generic timed-recipe engine, scaled from a configurable coffee dose and
 * total water weight. Each recipe is a sequence of steps that are either
 * "measured" (pour to a target weight, tracked live) or "timed" (a passive
 * wait/action with a countdown but no new water). Step timings below are
 * modeled on James Hoffmann's published V60 and French press methods;
 * adjust the templates if you want to match a specific video/update more
 * precisely.
 */

export type StepKind = "measured" | "timed" | "done";

export interface RecipeStep {
  kind: StepKind;
  /** Shown as the big "Now" heading while this step is active. */
  label: string;
  /** Short label shown on this step's chapter in the pulse-line timeline. */
  chapterLabel: string;
  /** Label above the hero value for "timed"/"done" steps (ignored for "measured", which always reads "Pour to"). */
  heroLabel: string;
  /** Text for the "Next: ..." row when this step is upcoming (ignored for "measured", which auto-derives "Pour to Xg"). */
  nextLabel: string;
  instruction: string;
  /** Step end time in seconds, measured from brew start (t=0). */
  endTimeS: number;
  /** Cumulative target water weight in grams at this step's end. */
  targetWaterG: number;
}

export interface RecipeConfig {
  doseG: number;
  waterG: number;
}

interface StepTemplate {
  kind: StepKind;
  label: string;
  chapterLabel: string;
  heroLabel: string;
  nextLabel: string;
  instruction: string;
  endTimeS: number;
  /** Fraction of total water reached by endTimeS (0-1). */
  waterFraction: number;
}

export interface RecipeDefinition {
  id: string;
  name: string;
  grindSize: string;
  template: StepTemplate[];
}

// James Hoffmann's "Ultimate V60" technique, cross-referenced against two
// independent detailed write-ups (one quoting his own 15g:250mL 1-cup
// example at 60g/L, matching this app's per-cup ratio exactly): bloom at
// 2x dose (a fixed ~12% of total water under this app's locked ratio) for
// 45s, pour to 60% by 1:15, top up to 100% by 1:45, then drawdown to 3:30.
// The bloom pour's own ~10s duration is an implementation detail (no
// source times the pour itself, only the 45s bloom window as a whole).
const V60_TEMPLATE: StepTemplate[] = [
  {
    kind: "measured",
    label: "Bloom pour",
    chapterLabel: "Bloom",
    heroLabel: "",
    nextLabel: "",
    instruction: "Pour to {target}g within 10s. Keep it even.",
    endTimeS: 10,
    waterFraction: 0.12,
  },
  {
    kind: "timed",
    label: "Bloom",
    chapterLabel: "Rest",
    heroLabel: "Resting",
    nextLabel: "Swirl & wait",
    instruction: "Swirl firmly until no dry clumps remain, then wait.",
    endTimeS: 45,
    waterFraction: 0.12,
  },
  {
    kind: "measured",
    label: "First pour",
    chapterLabel: "First pour",
    heroLabel: "",
    nextLabel: "",
    instruction: "Pour to {target}g in slow circles. Keep the bed level.",
    endTimeS: 75,
    waterFraction: 0.6,
  },
  {
    kind: "measured",
    label: "Final pour",
    chapterLabel: "Final pour",
    heroLabel: "",
    nextLabel: "",
    instruction: "Pour to {target}g, a little slower. Stir once each way, then swirl.",
    endTimeS: 105,
    waterFraction: 1,
  },
  {
    kind: "timed",
    label: "Drawdown",
    chapterLabel: "Drain",
    heroLabel: "Draining",
    nextLabel: "Let it drain",
    instruction: "Let the bed drain undisturbed. Swirl once if it's draining unevenly.",
    endTimeS: 210,
    waterFraction: 1,
  },
  {
    kind: "done",
    label: "Done",
    chapterLabel: "",
    heroLabel: "Total poured",
    nextLabel: "Remove & enjoy",
    instruction: "Remove the dripper and enjoy.",
    endTimeS: 210,
    waterFraction: 1,
  },
];

// James Hoffmann's "Ultimate French Press" technique (youtube.com/watch?v=st571DYYTR8),
// cross-referenced against two independent recipe write-ups of that video:
// pour all the water in 10s, steep undisturbed to 4:00, stir down the crust
// and skim the foam/grounds, then let the fines settle for another 5:00
// (to 9:00) before lowering the plunger to just rest on the surface —
// never pushed through the grounds. The skim step's own ~10s duration is
// an implementation detail (neither source times it); everything else
// matches both write-ups.
const FRENCH_PRESS_TEMPLATE: StepTemplate[] = [
  {
    kind: "measured",
    label: "Pour",
    chapterLabel: "Pour",
    heroLabel: "",
    nextLabel: "",
    instruction: "Add all {target}g within 10s. Don't stir.",
    endTimeS: 10,
    waterFraction: 1,
  },
  {
    kind: "timed",
    label: "Steep",
    chapterLabel: "Steep",
    heroLabel: "Steeping",
    nextLabel: "Stir down the crust & skim",
    instruction: "Let it sit undisturbed. No stirring.",
    endTimeS: 240,
    waterFraction: 1,
  },
  {
    kind: "timed",
    label: "Break & skim",
    chapterLabel: "Skim",
    heroLabel: "Skim now",
    nextLabel: "Let it settle",
    instruction: "Stir the crust down, then skim off the foam and grounds with two spoons.",
    endTimeS: 250,
    waterFraction: 1,
  },
  {
    kind: "timed",
    label: "Settle",
    chapterLabel: "Settle",
    heroLabel: "Settling",
    nextLabel: "Plunge & serve",
    instruction: "Let the fine particles settle undisturbed, at least 5 minutes.",
    endTimeS: 550,
    waterFraction: 1,
  },
  {
    kind: "done",
    label: "Ready",
    chapterLabel: "",
    heroLabel: "Ready to plunge",
    nextLabel: "",
    instruction: "Lower the plunger until it just rests on the surface — don't push it through. Serve immediately.",
    endTimeS: 550,
    waterFraction: 1,
  },
];

// James Hoffmann's "A Better 1 Cup V60 Technique" (youtube.com/watch?v=1oB1oDrDkHM),
// cross-referenced against two independent recipe write-ups of that video,
// which agree down to the second: a 50g bloom (20% of total, not the 2x-dose
// rule the Ultimate V60 uses), then four even pours to 40/60/80/100% of
// total water, each a short pour followed by a 10s pause, finishing with a
// drawdown that "should finish around 3:00, expect some variance." Unlike
// the other two recipes, this technique's source material only describes a
// single fixed 15g:250g (1 cup) batch — scaling it to more cups via this
// app's cups control is this app's extrapolation, not something the video
// specifies.
const V60_1CUP_TEMPLATE: StepTemplate[] = [
  {
    kind: "measured",
    label: "Bloom pour",
    chapterLabel: "Bloom",
    heroLabel: "",
    nextLabel: "",
    instruction: "Pour to {target}g within 10s.",
    endTimeS: 10,
    waterFraction: 0.2,
  },
  {
    kind: "timed",
    label: "Bloom",
    chapterLabel: "Rest",
    heroLabel: "Resting",
    nextLabel: "Swirl & wait",
    instruction: "Gently swirl for about 15s, then let it sit.",
    endTimeS: 45,
    waterFraction: 0.2,
  },
  {
    kind: "measured",
    label: "Pour 1",
    chapterLabel: "Pour 1",
    heroLabel: "",
    nextLabel: "",
    instruction: "Pour to {target}g. Keep the spout low and pour slowly.",
    endTimeS: 60,
    waterFraction: 0.4,
  },
  {
    kind: "timed",
    label: "Pause",
    chapterLabel: "",
    heroLabel: "Pause",
    nextLabel: "Pour 2",
    instruction: "Pause. Let it settle.",
    endTimeS: 70,
    waterFraction: 0.4,
  },
  {
    kind: "measured",
    label: "Pour 2",
    chapterLabel: "Pour 2",
    heroLabel: "",
    nextLabel: "",
    instruction: "Pour to {target}g.",
    endTimeS: 80,
    waterFraction: 0.6,
  },
  {
    kind: "timed",
    label: "Pause",
    chapterLabel: "",
    heroLabel: "Pause",
    nextLabel: "Pour 3",
    instruction: "Pause. Let it settle.",
    endTimeS: 90,
    waterFraction: 0.6,
  },
  {
    kind: "measured",
    label: "Pour 3",
    chapterLabel: "Pour 3",
    heroLabel: "",
    nextLabel: "",
    instruction: "Pour to {target}g.",
    endTimeS: 100,
    waterFraction: 0.8,
  },
  {
    kind: "timed",
    label: "Pause",
    chapterLabel: "",
    heroLabel: "Pause",
    nextLabel: "Pour 4",
    instruction: "Pause. Let it settle.",
    endTimeS: 110,
    waterFraction: 0.8,
  },
  {
    kind: "measured",
    label: "Pour 4",
    chapterLabel: "Pour 4",
    heroLabel: "",
    nextLabel: "",
    instruction: "Pour to {target}g. Finish with a gentle swirl.",
    endTimeS: 120,
    waterFraction: 1,
  },
  {
    kind: "timed",
    label: "Drawdown",
    chapterLabel: "Drain",
    heroLabel: "Draining",
    nextLabel: "Let it drain",
    instruction: "Let the bed drain undisturbed.",
    endTimeS: 180,
    waterFraction: 1,
  },
  {
    kind: "done",
    label: "Done",
    chapterLabel: "",
    heroLabel: "Total poured",
    nextLabel: "Remove & enjoy",
    instruction: "Remove the dripper and enjoy.",
    endTimeS: 180,
    waterFraction: 1,
  },
];

export const V60_RECIPE: RecipeDefinition = {
  id: "v60",
  name: "V60",
  grindSize: "Medium-fine",
  template: V60_TEMPLATE,
};
export const V60_1CUP_RECIPE: RecipeDefinition = {
  id: "v60-1cup",
  name: "1 Cup V60",
  grindSize: "Medium-fine",
  template: V60_1CUP_TEMPLATE,
};
export const FRENCH_PRESS_RECIPE: RecipeDefinition = {
  id: "frenchpress",
  name: "French Press",
  grindSize: "Medium-coarse",
  template: FRENCH_PRESS_TEMPLATE,
};
export const RECIPES: RecipeDefinition[] = [V60_RECIPE, V60_1CUP_RECIPE, FRENCH_PRESS_RECIPE];

export function buildSteps(template: StepTemplate[], config: RecipeConfig): RecipeStep[] {
  return template.map((t): RecipeStep => {
    const targetWaterG = Math.round(t.waterFraction * config.waterG);
    const instruction = t.instruction.replace("{target}", String(targetWaterG));

    return {
      kind: t.kind,
      label: t.label,
      chapterLabel: t.chapterLabel,
      heroLabel: t.heroLabel,
      nextLabel: t.nextLabel,
      instruction,
      endTimeS: t.endTimeS,
      targetWaterG,
    };
  });
}

/** Returns the active step index for a given elapsed time. */
export function stepIndexAt(steps: RecipeStep[], elapsedS: number): number {
  for (let i = 0; i < steps.length; i++) {
    if (elapsedS < steps[i].endTimeS) return i;
  }
  return steps.length - 1;
}
