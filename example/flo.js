export class Flo extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({
            mode: "open"
        });
    }

    connectedCallback() {

	
let css = "";
let template = "";

if (typeof this.css === "function") {
    css = this.css() ?? "";
}

if (typeof this.template === "function") {
    template = this.template() ?? "";
}

        this.shadowRoot.innerHTML = `
            <style>${css}</style>
            ${template}
        `;

	if('mounted' in this) this.mounted?.();
	if('render' in this) this.render?.();

    }

    // ---------- Helpers ----------

    $(selector) {
        return this.shadowRoot.querySelector(selector);
    }

    $$(selector) {
        return [...this.shadowRoot.querySelectorAll(selector)];
    }

    // ---------- Events ----------

    fire(name, detail = {}) {

        this.dispatchEvent(new CustomEvent(name, {
            detail,
            bubbles: true,
            composed: true
        }));

    }

}

// Flo superclass
window.Flo = Flo;

// fire() method for firing custom events
window.fire = (name, detail = {}) => {
    window.dispatchEvent(new CustomEvent(name, {
        detail
    }));
};
