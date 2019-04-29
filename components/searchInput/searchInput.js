const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: block;
            font-family: sans-serif;
            text-align: center;
        }
    </style>
    <input placeholder="Search"></input>
`;

class SearchInput extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this.inputElement = this._shadowRoot.querySelector('input');
        this.value = '';

        this.inputElement
            .addEventListener('input', event => {
                this.value = event.target.value;
                this.dispatchEvent(new CustomEvent('onChange', { detail: this.value }));
            });
    }

    _render() {
        this.inputElement.value = this.value;
    }

    set value(value) {
        this._value = value;
        this._render();
    }

    get value() {
        return this._value;
    }
}

window.customElements.define('search-input', SearchInput);
