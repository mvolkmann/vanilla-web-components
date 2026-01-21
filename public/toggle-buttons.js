const sharedStyles = new CSSStyleSheet();
sharedStyles.replaceSync(`
  :host {
    display: flex;
  }

  button {
    --radius: var(--border-radius, 0.5rem);
    --border: var(--border-width, 1px) solid var(--border-color, gray);
    background-color: var(--button-bg-color, lightgray);
    border: var(--border);
    border-right: none;
    color: var(--button-color, black);
    font-weight: bold;
    padding: var(--radius);
    &:first-of-type {
      border-radius: var(--radius) 0 0 var(--radius);
    }
    &:last-of-type {
      border-radius: 0 var(--radius) var(--radius) 0;
      border-right: var(--border);
    }
  }

  button.selected {
    background-color: var(--button-selected-bg-color, lightgreen);
    color: var(--button-selected-color, black);
  }
`);

class ToggleButtons extends HTMLElement {
  #labels = "";
  #value = "";

  static get observedAttributes() {
    return ["labels", "value"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === "labels") {
      this.labels = newValue; // invokes setter
    } else if (name === "value") {
      this.value = newValue; // invokes setter
    }
  }

  connectedCallback() {
    this.shadowRoot.adoptedStyleSheets = [sharedStyles];
    this.render();
    this.shadowRoot.addEventListener("click", this.handleClick.bind(this));
  }

  get labels() {
    return this.#labels;
  }

  get value() {
    return this.#value;
  }

  handleClick(event) {
    this.value = event.target.textContent; // invokes setter
  }

  set labels(value) {
    if (value === this.#labels) return;
    this.#labels = value;
    this.setAttribute("labels", value);
    this.render();
  }

  set value(value) {
    if (value === this.#value) return;

    value = value.trim();
    this.#value = value;
    this.setAttribute("value", value);
    this.updateSelected();
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true, // up DOM tree
        composed: true, // can pass through shadow DOM
        detail: { value },
      }),
    );
  }

  render() {
    const root = this.shadowRoot;
    root.innerHTML = ""; // clears all existing content

    const value = this.#value;
    for (const label of this.#labels.split(",")) {
      const button = document.createElement("button");
      button.textContent = label.trim();
      if (label === value) button.classList.add("selected");
      root.appendChild(button);
    }
  }

  updateSelected() {
    const value = this.value;
    for (const button of this.shadowRoot.querySelectorAll("button")) {
      const match = button.textContent === value;
      button.classList.toggle("selected", match);
    }
  }
}

customElements.define("toggle-buttons", ToggleButtons);
