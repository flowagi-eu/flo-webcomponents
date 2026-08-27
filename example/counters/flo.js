export class Flo extends HTMLElement {

    static hooks = {
      create: [],
      fire: [],
      connected: [],
      disconnected: []
    };

    constructor() {
        super().attachShadow({ mode: "open" });
    }

    static create(props = {}) {
        this.hooks.create.forEach(fn => fn({el:this, props}));
        const el = new this();
        Object.assign(el, props);
        return el;
    }

    connectedCallback() {
	this.constructor.hooks.connected.forEach(fn => fn({el:this}));
	const template = this.template?.() ?? "";
        this.shadowRoot.innerHTML = `<style>:host { all: initial; display: block; } ${this.css?.() ?? ""}</style>${template}`;
        Object.keys(this.dataset).forEach(key => key !== "id" && typeof this[key] !== "function" && (this[key] = this.dataset[key]));

	if (/\bon[a-z]+\s*=/i.test(template)) {
        	this.bindInlineEvents();
    	}

        this.mounted?.();
    }

    disconnectedCallback() {
    	this.constructor.hooks.disconnected.forEach(fn => fn({el:this}));
     }

    bindInlineEvents() {
    for (const el of this.shadowRoot.querySelectorAll("*")) {
        for (const attr of [...el.attributes]) {
            if (!attr.name.startsWith("on")) continue;

            const eventName = attr.name.slice(2);
            const code = attr.value;

            el.removeAttribute(attr.name);

            el.addEventListener(eventName, event => {
                new Function("event", code).call(this, event);
            });
        }
    }
    }

    $(selector) {
        return this.shadowRoot.querySelector(selector);
    }

    $$(selector) {
        return [...this.shadowRoot.querySelectorAll(selector)];
    }

    fire(name, detail = {}) {
        this.constructor.hooks.fire.forEach(fn => fn({el:this,name,detail}));
        this.dispatchEvent(new CustomEvent(name, {
            detail,
            bubbles: true,
            composed: false
        }));
    }

    get parent() {
        return this.getRootNode().host || this.parentNode;
    }
}

window.Flo = Flo;
window.fire = (name, detail = {}) => window.dispatchEvent(new CustomEvent(name, { detail }));
