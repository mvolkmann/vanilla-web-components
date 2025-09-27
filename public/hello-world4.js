class HelloWorld4 extends HTMLElement {
  static get observedAttributes() {
    return ["name"];
  }

  attributeChangedCallback(_name, _oldValue, _newValue) {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  get name() {
    return this.getAttribute("name");
  }

  set name(value) {
    this.setAttribute("name", value);
  }

  render() {
    const name = this.getAttribute("name") ?? "World";
    this.innerHTML = `<p>Hello, ${name}!</p>`;
  }
}

customElements.define("hello-world4", HelloWorld4);
