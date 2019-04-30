import './components/sortableTable/sortableTable.js';
import './components/searchInput/searchInput.js';
import './components/sortableHeader/sortableHeader.js';

class App {
    sortBy = null;
    sortDirection = null;
    search = null;
    columns = [
        {
            key: 'mass',
            value: 'Mass'
        },
        {
            key: 'name',
            value: 'Name'
        },
        {
            key: 'class',
            value: 'Class'
        },
        {
            key: 'year',
            value: 'Year'
        }
    ];

    constructor() {
        this.sortableTableElement = document.querySelector('sortable-table');
        this.searchInputElement = document.querySelector('search-input')

        this.searchInputElement.addEventListener('searchValueChange', ({ detail }) => {
            this.search = detail.trim();

            this._getData();
        });
        
        this.sortableTableElement.addEventListener('tableSortChange', ({ detail: { direction, key } }) => {
            this.sortBy = key;
            this.sortDirection = direction;

            this._getData();
        });

        this.sortableTableElement.columns = this.columns;

        this._getData();
    }

    _transformResponse(item) {
        const {
            mass,
            name,
            recclass,
            year
        } = item;

        return {
            mass,
            name,
            class: recclass,
            year: (new Date(year)).getFullYear()
        };
    }

    _getData() {
        const sortBy = this.sortBy && this.sortDirection
            ? `sortBy=${this.sortBy}&order=${this.sortDirection}`
            : '';
        const search = this.search
            ? `${sortBy ? '&' : ''}search=${this.search}`
            : '';

        fetch(`http://5cc47e573f761f001422d5e9.mockapi.io/api/v1/meteorites?${sortBy}${search}`)
            .then(response => response.json())
            .then(json => {
                this.sortableTableElement.items = json.map(this._transformResponse);
            });
    }
}

export default new App();
