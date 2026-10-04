# Pour-Over Timer Card

An interactive Lovelace card for Home Assistant that walks you through
three of James Hoffmann's published brew methods — V60, 1 Cup V60, and
French press — with tabs to switch between them. Each recipe tracks a
live "pour to Xg / target" readout while you're pouring, switches to a
countdown during rests/pauses/steeps/drawdown, and chimes at every step
change.

Steps are modeled on Hoffmann's published techniques and scale from a
simple "number of cups" control (1 cup = 15g coffee : 250g water, his own
ratio). The 1 Cup V60 technique's source material only describes a fixed
single-cup batch; scaling it to more cups via this control is this app's
extrapolation, not something the video specifies. Edit the templates in
`src/recipe.ts` if you want to match a specific video more precisely, or
add another recipe entirely.

**Sourcing note:** step timings are cross-referenced against multiple
independent written recipe summaries of each video (not the videos
themselves — no tool here can read a YouTube transcript), so treat them
as "corroborated by several sources," not "verified against the
original." The one deliberately-unverified number across all three
recipes is the French press settle time and the V60 total drawdown time,
where sources disagree by up to a minute — those are left at a value in
the middle of the cited range.

This card runs entirely in the browser: no Home Assistant entities or
backend integration are required. While a brew is running it requests a
screen wake lock automatically (where the browser supports it), released
on pause/reset/finish.

## Installation

### HACS (custom repository)

1. HACS → Frontend → the "..." menu → **Custom repositories**.
2. Add this repository's URL, category **Lovelace**.
3. Install "Pour-Over Timer Card", then reload your browser.

### Manual

1. Copy `v60-timer-card.js` to `config/www/v60-timer-card.js`.
2. In **Settings → Dashboards → Resources**, add:
   ```yaml
   url: /local/v60-timer-card.js
   type: module
   ```

## Usage

Add the card via the dashboard UI ("Pour-Over Timer"), or in YAML:

```yaml
type: custom:v60-timer-card
title: Pour-Over Timer
cups: 2
sound_enabled: true
default_recipe: v60 # or "v60-1cup", "frenchpress"
```

Water temperature isn't configurable — both recipes just call for a kettle
boil, so there's nothing useful to set.

| Option           | Default         | Description                                       |
| ---------------- | --------------- | --------------------------------------------------- |
| `title`          | `Pour-Over Timer` | Card header (not currently rendered on the face — reserved for future use) |
| `cups`           | `2`             | Batch size: each cup is 15g coffee : 250g water      |
| `sound_enabled`  | `true`          | Play a chime on step changes and at finish (also toggleable live on the card) |
| `default_recipe` | `v60`           | Which tab is active on load: `v60`, `v60-1cup`, or `frenchpress` |

Switching tabs or adjusting cups is locked out while a brew is running or
paused, to avoid rewriting the recipe mid-brew.

## Development

```bash
npm install
npm run build   # one-off build -> v60-timer-card.js
npm run watch    # rebuild on change
```

## License

MIT
