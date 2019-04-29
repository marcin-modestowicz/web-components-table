const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: block;
            font-family: sans-serif;
            text-align: center;
        }
    </style>
    <table>
        <thead>
            <tr>
                <th>Mass</th>
                <th>Description</th>
                <th>Classification</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
`;

class List extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this.headerElement = this._shadowRoot.querySelector('thead');
        this.listElement = this._shadowRoot.querySelector('tbody');

        this.items = [];
        this.columns = [];
    }

    _renderList() {
        this.listElement.innerHTML = '';

        this._items.forEach(item => {
            const rowFragment = document.createDocumentFragment();
            rowFragment.appendChild(document.createElement('tr'));

            Object.keys(item).forEach(key => {
                const isInColumns = this._columns.find(column => column.key === key);

                if (isInColumns) {
                    const cellElement = document.createElement('td');

                    cellElement.textContent = item[key];
                    rowFragment.childNodes[0].appendChild(cellElement);
                }
            });

            this.listElement.appendChild(rowFragment);
        });
    }

    _renderHeader() {
        this.headerElement.innerHTML = '';
        const rowFragment = document.createDocumentFragment();

        rowFragment.append(document.createElement('tr'));

        this._columns.forEach(column => {
            const cellElement = document.createElement('th');
            cellElement.textContent = column.value;

            rowFragment.childNodes[0].appendChild(cellElement);
        });

        this.headerElement.appendChild(rowFragment);
    }

    set items(value) {
        this._items = value;
        this._renderList();
    }

    get items() {
        return this._items;
    }

    set columns(value) {
        this._columns = value;
        this._renderList();
    }

    get columns() {
        return this._columns;
    }
}

window.customElements.define('sortable-list', List);