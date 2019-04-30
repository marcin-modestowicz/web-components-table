const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: block;
            font-family: sans-serif;
        }

        th,
        td {
            padding: .5rem;
        }
    </style>
    <table>
        <thead>
        </thead>
        <tbody>
        </tbody>
    </table>
`;

class SortableTable extends HTMLElement {
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

            this.columns.forEach(({ key }) => {
                const cellElement = document.createElement('td');

                cellElement.textContent = item[key] || '';
                rowFragment.childNodes[0].appendChild(cellElement);
            });

            this.listElement.appendChild(rowFragment);
        });
    }

    _handleHeaderChange(key, value) {
        this.sortableHeaderElements.forEach(element => {
            if (element.key !== key) {
                element.direction = null;
            }
        });

        this.dispatchEvent(
            new CustomEvent(
                'tableSortChange',
                {
                    detail: {
                        direction: value,
                        key,
                    },
                }
            )
        );
    }

    _renderHeader() {
        this.headerElement.innerHTML = '';
        const rowFragment = document.createDocumentFragment();

        rowFragment.append(document.createElement('tr'));

        this._columns.forEach(column => {
            const cellElement = document.createElement('th');
            const headerElement = document.createElement('sortable-header');

            headerElement.setAttribute('key', column.key);
            headerElement.textContent = column.value;
            headerElement.addEventListener(
                'headerSortChange',
                ({ detail: { key, direction } }) => this._handleHeaderChange(key, direction)
            );

            cellElement.appendChild(headerElement);
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
        this._renderHeader();
    }

    get columns() {
        return this._columns;
    }

    get sortableHeaderElements() {
        return this.columns.map(({ key }) => this.headerElement.querySelector(`[key="${key}"]`))
    }
}

window.customElements.define('sortable-table', SortableTable);