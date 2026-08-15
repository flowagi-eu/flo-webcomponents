export class Flo extends HTMLElement {
    constructor() {
        super().attachShadow({ mode: "open" });
    }

    connectedCallback() {
	this.shadowRoot.innerHTML = `<style>${this.css?.() ?? ""}</style>${this.template?.() ?? ""}`;
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
            composed: true
        }));
    }

    get parent() {
        return this.getRootNode().host || this.parentNode;
    }
}

window.Flo = Flo;
window.fire = (name, detail = {}) => window.dispatchEvent(new CustomEvent(name, { detail }));
