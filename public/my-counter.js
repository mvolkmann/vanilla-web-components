console.log("my-counter.js: entered");
const html = String.raw;

const template = document.createElement("template");
template.innerHTML = html`
  <style>
    :host {
      --font-size: 2rem;
      font-size: var(--font-size);
    }

    .counter {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    button {
      background-color: var(--button-bg-color, lightgreen);
      border: none;
      border-radius: 50%;
      font-size: var(--font-size);
      height: calc(var(--font-size) * 1.2);
      width: calc(var(--font-size) * 1.2);
    }

    button:disabled {
      opacity: 0.7;
    }
  </style>
  <div>
    <button type="button">-</button>
    <span></span>
    <button type="button">+</button>
  </div>
`;

/**
 * This is a counter web component.
 * TODO: Are this JSDoc comments necessary for CEM?
 * @attr {number} [count=3] - initial count
 * @property {number} count - current count
 * @tag my-counter
 */
class MyCounter extends HTMLElement {
  #count = 0;
  #decBtn;
  #span;

  decrement() {
    if (this.count > 0) this.#update(-1);
  }

  increment() {
    this.#update(1);
  }

  render() {
    console.log("my-counter.js render: entered");
    const dom = template.content.cloneNode(true);
    const [decBtn, incBtn] = dom.querySelectorAll("button");
    this.#decBtn = decBtn;
    decBtn.addEventListener("click", decrement);
    incBtn.addEventListener("click", increment);
    this.#span = dom.querySelector("span");
    this.#update();
    this.shadowRoot.replaceChildren(dom);
  }

  #update(delta) {
    this.#count += delta;
    this.#span.textContent = this.#count;
    this.#decBtn.toggleAttribute("disabled", this.count === 0);
  }
}

customElements.define("my-counter", MyCounter);
