class HelloWorld3 extends HTMLElement {
  static get observedAttributes() {
    return ["name"];
  }

  // Underscores in the parameter names prevent the linter
  // from complaining about them never being read.
  attributeChangedCallback(_name, _oldValue, _newValue) {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const name = this.getAttribute("name") ?? "World";
    this.innerHTML = `<p>Hello, ${name}!</p>`;
  }
}

customElements.define("hello-world3", HelloWorld3);
