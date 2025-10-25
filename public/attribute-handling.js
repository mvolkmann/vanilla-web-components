class AttributeHandling extends HTMLElement {
  static get observedAttributes() {
    return ["car", "colors", "score"];
  }

  connectedCallback() {
    this.render();
  }

  // Underscores in the parameter names prevent the linter
  // from complaining about them never being read.
  attributeChangedCallback(_name, _oldValue, _newValue) {
    this.render();
  }

  render() {
    let score = this.getAttribute("score");
    score = score ? Number(score) : 0;
    if (Number.isNaN(score)) score = 0;

    let colors = this.getAttribute("colors");
    if (colors) colors = colors.split(",");

    let car = this.getAttribute("car");
    if (car) {
      try {
        car = JSON.parse(car);
      } catch (error) {
        console.error(error);
        car = null;
      }
    }

    this.innerHTML = `
      <style>
        section {
          border: 1px solid black;
          display: inline-block;
          padding: 0.5rem;
        }
      </style>
      <section>
        <div>score = ${score}</div>
        ${
          colors
            ? `<div>
              <h2>Colors</h2>
              <ul>${colors.map((color) => `<li>${color}</li>`).join("")}</ul>
            </div>`
            : ""
        }
        ${
          car
            ? `<div>
              ${car.year} ${car.make} ${car.model}
            </div>`
            : ""
        }
      </section>
    `;
  }
}

customElements.define("attribute-handling", AttributeHandling);
