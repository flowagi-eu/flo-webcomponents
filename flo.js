export class Flo extends HTMLElement {
    constructor() {
        super().attachShadow({ mode: "open" });
    }

    connectedCallback() {
	    this.shadowRoot.innerHTML = `<style>${this.css?.() ?? ""}</style>${this.template?.() ?? ""}`;
        Object.keys(this.dataset).forEach(key => key !== "id" && typeof this[key] !== "function" && (this[key] = this.dataset[key]));
        this.mounted?.();
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
