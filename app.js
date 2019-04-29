import './components/list/list.js';
import './components/searchInput/searchInput.js';
import './components/sortableHeader/sortableHeader.js';

const listElement = document.querySelector('sortable-list');
const searchInputElement = document.querySelector('search-input')
const columns = [
    {
        key: 'mass',
        value: 'Mass'
    },
    {
        key: 'name',
        value: 'Description'
    },
    {
        key: 'recclass',
        value: 'Classification'
    },
    {
        key: 'year',
        value: 'Date'
    }
];

listElement.columns = columns;

searchInputElement.addEventListener('onChange', ({ detail }) => {
    fetch(`http://5cc47e573f761f001422d5e9.mockapi.io/api/v1/meteorites?sortBy=recclass&search=${detail}`)
        .then(response => response.json())
        .then(json => {
            listElement.items = json;
        });
});

fetch('http://5cc47e573f761f001422d5e9.mockapi.io/api/v1/meteorites?sortBy=recclass&search=')
    .then(response => response.json())
    .then(json => {
        listElement.items = json;
    });