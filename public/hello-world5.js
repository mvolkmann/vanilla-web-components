class HelloWorld5 extends HTMLElement {
  #name = ""; // private property

  static get observedAttributes() {
    return ["name"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === "name") this.name = newValue; // invokes setter below
  }

  connectedCallback() {
    this.render();
  }

  get name() {
    return this.#name;
  }

  set name(value) {
    if (value === this.#name) return;
    this.#name = value;
    this.setAttribute("name", value);
    this.render();
  }

  render() {
    const name = this.#name || "World";
    this.shadowRoot.innerHTML = `<p part="greeting">Hello, ${name}!</p>`;
  }
}

customElements.define("hello-world5", HelloWorld5);
