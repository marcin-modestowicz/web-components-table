const template = document.createElement('template');
template.innerHTML = `
    <style>
        button {
            display: flex;
            align-items: center;
            font-size: 1.2rem;
            font-weight: bold;
            background: none;
            border: none;
            cursor: pointer;
        }

        .arrow {
            margin-left: 5px;
            border-color: #333 transparent transparent transparent;
            border-style: solid;
            border-width: 5px;
            height: 0;
            width: 0;
            opacity: 0;
            transition: transform 0.8s, opacity 0.5s;
            transform: rotate(90deg) translateY(2.5px);
        }

        .asc .arrow,
        .desc .arrow {
            opacity: 1;
        }

        .desc .arrow {
            transform: rotate(0deg) translateY(2.5px);
        }

        .asc .arrow {
            transform: rotate(180deg) translateY(2.5px);
        }
    </style>
    <button>
        <slot>Title</slot>
        <div class="arrow"></div>
    </button>
`;

class SortableHeader extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this.buttonElement = this._shadowRoot.querySelector('button');
        this.buttonElement.addEventListener('click', () => {
            this._toggle();
        });

        this.direction = null;
        this.key = null;
    }

    static get observedAttributes() {
        return ['key'];
    }
    
    attributeChangedCallback(name, _, newValue) {
        if (name === 'key') {
            this.key = newValue;
        }
    }

    _toggle() {
        switch(this.direction) {
            case 'asc':
            this.direction = 'desc';
            break;

            case 'desc':
            this.direction = null;
            break;
            
            default:
            this.direction = 'asc'
        }

        this.dispatchEvent(
            new CustomEvent(
                'headerSortChange',
                {
                    detail: {
                        direction: this.direction,
                        key: this.key
                    },
            })
        );
    }

    _render() {
        this.buttonElement.className = this.direction || '';
    }

    set direction(value) {
        this._direction = value;
        this._render();
    }

    get direction() {
        return this._direction;
    }

    set key(value) {
        this._key = value;
        this._render();
    }

    get key() {
        return this._key;
    }
}

window.customElements.define('sortable-header', SortableHeader);
