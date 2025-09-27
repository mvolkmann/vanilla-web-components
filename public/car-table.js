class CarTable extends HTMLElement {
  #cars = [];

  connectedCallback() {
    this.innerHTML = html`
      <style>
        table {
          border-collapse: collapse;
          font-family: sans-serif;
        }
        th {
          background-color: lightcoral;
        }
        th,
        td {
          border: 1px solid black;
          padding: 0.5rem;
        }
      </style>
      <table>
        <thead>
          <tr>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;
  }

  get cars() {
    return this.#cars;
  }

  set cars(cars) {
    this.#cars = cars;
    const tbody = this.querySelector("tbody");
    // prettier-ignore
    tbody.innerHTML = cars.map((car) => `
      <tr>
        <td>${car.make}</td>
        <td>${car.model}</td>
        <td>${car.year}</td>
      </tr>
    `).join("");
  }
}

customElements.define("car-table", CarTable);
