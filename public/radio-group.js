const html = String.raw;

const template = document.createElement("template");
template.innerHTML = html`
  <style>
    fieldset {
      border-color: var(--border-color, "black");
      display: inline-flex;
      flex-direction: column;
      align-items: start;
      gap: 0.5rem;

      > legend {
        color: var(--legend-color, "black");
      }

      > div {
        display: flex;
        flex-direction: var(--direction, row);
        gap: var(--gap, 1rem);

        > div {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
      }
    }

    input {
      margin: 0;
    }
  </style>
  <fieldset>
    <legend>provided by render method</legend>
    <slot name="before"></slot>
    <div>provided by render method</div>
    <slot name="after"></slot>
  </fieldset>
`;

export class RadioGroup extends HTMLElement {
  static formAssociated = true;

  #initialized = false;
  #internals = this.attachInternals();
  labels = "";
  legend = "";
  name = "";
  values = "";
  #value = ""; // managed by a getter and setter

  static get observedAttributes() {
    return ["labels", "legend", "name", "value", "values"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  attributeChangedCallback(attrName, _oldValue, newValue) {
    this[attrName] = newValue;
    // This check avoids re-rendering after
    // each attribute receives its initial value.
    if (this.#initialized) this.render();
  }

  connectedCallback() {
    this.labels = this.getAttribute("labels");
    this.legend = this.getAttribute("legend");
    this.name = this.getAttribute("name");
    this.value = this.getAttribute("value");
    this.values = this.getAttribute("values");

    //if (!name) throw new CustomError('name is a required attribute');

    this.render();
    this.#initialized = true;

    const inputs = this.shadowRoot.querySelectorAll("input");
    for (const input of inputs) {
      input.addEventListener("change", (event) => {
        this.value = event.target.value;
      });
    }
  }

  // This handles the case when the specified value
  // is not in the list of values.
  #fixValue() {
    const v = this.#value;
    if (!this.values.includes(v)) {
      this.#value = this.values.split(",")[0];
    }
  }

  get value() {
    return this.#value;
  }

  set value(v) {
    this.#value = v;
    this.#fixValue();
    this.#internals.setFormValue(this.#value);

    const inputs = this.shadowRoot.querySelectorAll("input");
    for (const input of inputs) {
      input.checked = input.value === this.#value;
    }
  }

  makeButtons() {
    this.#fixValue();
    const labelArray = this.labels.split(",");
    const valueArray = this.values.split(",").map((value) => value.trim());
    return valueArray
      .map(
        (value, index) =>
          html`<div>
            <input
              type="radio"
              id="${value}"
              name="${this.name}"
              value="${value}"
              ${value === this.value ? "checked" : ""}
            />
            <label for="${value}">${labelArray[index]}</label>
          </div>`
      )
      .join("");
  }

  render() {
    const dom = template.content.cloneNode(true);
    dom.querySelector("legend").textContent = this.legend;
    dom.querySelector("div").innerHTML = this.makeButtons();
    this.shadowRoot.replaceChildren(dom);
  }
}

customElements.define("radio-group", RadioGroup);
