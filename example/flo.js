export class Flo extends HTMLElement {
    constructor() {
        super().attachShadow({ mode: "open" });
    }

    connectedCallback() {
	const template = this.template?.() ?? "";
        this.shadowRoot.innerHTML = `<style>${this.css?.() ?? ""}</style>${template}`;
        Object.keys(this.dataset).forEach(key => key !== "id" && typeof this[key] !== "function" && (this[key] = this.dataset[key]));

	if (/\bon[a-z]+\s*=/i.test(template)) {
        	this.bindInlineEvents();
    	}

        this.mounted?.();
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
