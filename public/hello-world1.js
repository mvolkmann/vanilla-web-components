class HelloWorld1 extends HTMLElement {
  connectedCallback() {
    this.innerHTML = "<p>Hello, World!</p>";
  }
}

customElements.define("hello-world1", HelloWorld1);
