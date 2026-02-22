"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _SortableTable_instances, _SortableTable_data, _SortableTable_headings, _SortableTable_properties, _SortableTable_propertyArray, _SortableTable_sortAscending, _SortableTable_sortHeader, _SortableTable_makeTd, _SortableTable_makeTh, _SortableTable_makeTr, _SortableTable_sort;
const template = document.createElement("template");
const html = String.raw;
template.innerHTML = html `
  <style>
    :host {
      display: inline-block;
    }
    :host([hidden]) {
      display: none;
    }
    .sort-indicator {
      color: white;
      display: inline-block;
      line-height: 1rem;
      margin-left: 0.5rem;
      width: 1rem;
    }
    table {
      border-collapse: collapse;
    }
    td,
    th {
      border: 2px solid gray;
      padding: 0.5rem;
    }
    th {
      background-color: cornflowerblue;
      color: white;
      cursor: pointer;
      > span {
        pointer-events: none;
      }
    }
  </style>
  <slot></slot>
  <table>
    <thead>
      <tr></tr>
    </thead>
    <tbody></tbody>
  </table>
  <slot name="footnote"></slot>
`;
class SortableTable extends HTMLElement {
    static get observedAttributes() {
        return ["headings", "properties"];
    }
    constructor() {
        super();
        _SortableTable_instances.add(this);
        _SortableTable_data.set(this, []);
        _SortableTable_headings.set(this, "");
        _SortableTable_properties.set(this, "");
        _SortableTable_propertyArray.set(this, []);
        _SortableTable_sortAscending.set(this, true);
        _SortableTable_sortHeader.set(this, null);
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        if (!this.hasAttribute("title")) {
            this.setAttribute("title", "sortable-table");
        }
    }
    attributeChangedCallback(attrName, _oldValue, newValue) {
        if (attrName === "headings") {
            this.headings = newValue;
        }
        else if (attrName === "properties") {
            this.properties = newValue;
        }
    }
    get data() {
        return __classPrivateFieldGet(this, _SortableTable_data, "f");
    }
    get headings() {
        return __classPrivateFieldGet(this, _SortableTable_headings, "f");
    }
    get properties() {
        return __classPrivateFieldGet(this, _SortableTable_properties, "f");
    }
    set data(data) {
        __classPrivateFieldSet(this, _SortableTable_data, data, "f");
        const tbody = this.shadowRoot.querySelector("table tbody");
        tbody.innerHTML = "";
        data.forEach((_obj, index) => tbody.appendChild(__classPrivateFieldGet(this, _SortableTable_instances, "m", _SortableTable_makeTr).call(this, index)));
    }
    set headings(headings) {
        if (headings === __classPrivateFieldGet(this, _SortableTable_headings, "f"))
            return;
        __classPrivateFieldSet(this, _SortableTable_headings, headings, "f");
        this.setAttribute("headings", headings);
        const tr = this.shadowRoot.querySelector("table thead tr");
        tr.innerHTML = "";
        const self = this;
        const values = headings.split(",").map((heading) => heading.trim());
        values.forEach((heading, i) => tr.appendChild(__classPrivateFieldGet(self, _SortableTable_instances, "m", _SortableTable_makeTh).call(self, heading, i)));
    }
    set properties(properties) {
        if (properties === __classPrivateFieldGet(this, _SortableTable_properties, "f"))
            return;
        __classPrivateFieldSet(this, _SortableTable_properties, properties, "f");
        this.setAttribute("properties", properties);
        __classPrivateFieldSet(this, _SortableTable_propertyArray, properties.split(",").map((prop) => prop.trim()), "f");
        // Trigger "set data".
        this.data = this.data;
    }
}
_SortableTable_data = new WeakMap(), _SortableTable_headings = new WeakMap(), _SortableTable_properties = new WeakMap(), _SortableTable_propertyArray = new WeakMap(), _SortableTable_sortAscending = new WeakMap(), _SortableTable_sortHeader = new WeakMap(), _SortableTable_instances = new WeakSet(), _SortableTable_makeTd = function _SortableTable_makeTd(dataIndex, prop) {
    const td = document.createElement("td");
    const value = this.data[dataIndex][prop];
    td.textContent = String(value);
    return td;
}, _SortableTable_makeTh = function _SortableTable_makeTh(heading, index) {
    const th = document.createElement("th");
    th.setAttribute("data-property", __classPrivateFieldGet(this, _SortableTable_propertyArray, "f")[index]);
    th.setAttribute("role", "button");
    th.setAttribute("title", `sort by ${heading}`);
    th.addEventListener("click", __classPrivateFieldGet(this, _SortableTable_instances, "m", _SortableTable_sort).bind(this));
    let span = document.createElement("span");
    span.textContent = heading;
    th.appendChild(span);
    span = document.createElement("span");
    span.classList.add("sort-indicator");
    th.appendChild(span);
    return th;
}, _SortableTable_makeTr = function _SortableTable_makeTr(dataIndex) {
    const tr = document.createElement("tr");
    for (const propName of __classPrivateFieldGet(this, _SortableTable_propertyArray, "f")) {
        tr.appendChild(__classPrivateFieldGet(this, _SortableTable_instances, "m", _SortableTable_makeTd).call(this, dataIndex, propName));
    }
    return tr;
}, _SortableTable_sort = function _SortableTable_sort(event) {
    let th = event.target;
    const property = th.getAttribute("data-property");
    __classPrivateFieldSet(this, _SortableTable_sortAscending, th === __classPrivateFieldGet(this, _SortableTable_sortHeader, "f") ? !__classPrivateFieldGet(this, _SortableTable_sortAscending, "f") : true, "f");
    __classPrivateFieldGet(this, _SortableTable_data, "f").sort((a, b) => {
        const aValue = a[property];
        const bValue = b[property];
        let compare = typeof aValue === "string"
            ? aValue.localeCompare(bValue)
            : typeof aValue === "number"
                ? aValue - bValue
                : 0;
        return __classPrivateFieldGet(this, _SortableTable_sortAscending, "f") ? compare : -compare;
    });
    // Trigger "set data".
    this.data = this.data;
    // Clear sort indicator from previously selected header.
    if (__classPrivateFieldGet(this, _SortableTable_sortHeader, "f")) {
        const sortIndicator = __classPrivateFieldGet(this, _SortableTable_sortHeader, "f").querySelector(".sort-indicator");
        if (sortIndicator)
            sortIndicator.textContent = "";
    }
    // Add sort indicator to currently selected header.
    const sortIndicator = th.querySelector(".sort-indicator");
    if (sortIndicator) {
        sortIndicator.textContent = __classPrivateFieldGet(this, _SortableTable_sortAscending, "f") ? "\u25B2" : "\u25BC";
    }
    __classPrivateFieldSet(this, _SortableTable_sortHeader, th, "f");
};
customElements.define("sortable-table", SortableTable);
