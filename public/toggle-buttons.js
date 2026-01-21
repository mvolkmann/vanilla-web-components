const sharedStyles = new CSSStyleSheet();
sharedStyles.replaceSync(`
  :host {
    display: flex;
    gap: 0.25rem;
  }

  button {
    background-color: var(--button-bg-color, lightgreen);
    border: none;
    border-radius: 0.5rem;
    color: var(--button-color, black);
    font-weight: bold;
    padding: 0.5rem;
  }

  button.selected {
    background-color: var(--button-selected-bg-color, green);
    color: var(--button-selected-color, white);
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
    for (const button of this.shadowRoot.querySelectorAll("button")) {
      const label = button.textContent;
      button.classList.toggle("selected", label === value);
    }
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
}

customElements.define("toggle-buttons", ToggleButtons);
