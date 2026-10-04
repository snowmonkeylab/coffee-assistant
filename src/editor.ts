import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { V60TimerCardConfig } from "./v60-timer-card";
import { RECIPES } from "./recipe";

@customElement("v60-timer-card-editor")
export class V60TimerCardEditor extends LitElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public hass?: any;

  @state() private _config!: V60TimerCardConfig;

  setConfig(config: V60TimerCardConfig): void {
    this._config = {
      title: "Pour-Over Timer",
      sound_enabled: true,
      cups: 2,
      default_recipe: RECIPES[0].id,
      ...config,
    };
  }

  private _emit(): void {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onText(key: keyof V60TimerCardConfig, isNumber: boolean) {
    return (ev: Event) => {
      const value = (ev.target as HTMLInputElement).value;
      this._config = {
        ...this._config,
        [key]: isNumber ? Number(value) : value,
      };
      this._emit();
    };
  }

  private _onSwitch(key: keyof V60TimerCardConfig) {
    return (ev: Event) => {
      const checked = (ev.target as HTMLInputElement).checked;
      this._config = { ...this._config, [key]: checked };
      this._emit();
    };
  }

  render() {
    if (!this._config) return html``;
    return html`
      <div class="form">
        <label>
          Title
          <input
            type="text"
            .value=${this._config.title ?? ""}
            @input=${this._onText("title", false)}
          />
        </label>
        <label>
          Default recipe
          <select @change=${this._onText("default_recipe", false)}>
            ${RECIPES.map(
              (r) => html`
                <option value=${r.id} ?selected=${this._config.default_recipe === r.id}>
                  ${r.name}
                </option>
              `
            )}
          </select>
        </label>
        <label>
          Cups (15g coffee : 250g water each)
          <input
            type="number"
            min="1"
            max="6"
            .value=${String(this._config.cups)}
            @input=${this._onText("cups", true)}
          />
        </label>
        <label class="checkbox">
          <input
            type="checkbox"
            .checked=${this._config.sound_enabled ?? true}
            @change=${this._onSwitch("sound_enabled")}
          />
          Play sound on step changes
        </label>
      </div>
    `;
  }

  static styles = css`
    .form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px 0;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.9em;
      color: var(--primary-text-color, #000);
    }
    label.checkbox {
      flex-direction: row;
      align-items: center;
      gap: 8px;
    }
    input[type="text"],
    input[type="number"],
    select {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #000);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "v60-timer-card-editor": V60TimerCardEditor;
  }
}
