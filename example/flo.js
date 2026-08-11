class Flo extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({
            mode: "open"
        });
    }

    connectedCallback() {

	
let style = "";
let template = "";

if (typeof this.style === "function") {
    style = this.style() ?? "";
}

if (typeof this.template === "function") {
    template = this.template() ?? "";
}

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
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

    emit(name, detail = {}) {

        this.dispatchEvent(new CustomEvent(name, {
            detail,
            bubbles: true,
            composed: true
        }));

    }

    on(name, callback) {

        this.addEventListener(name, e => {
            callback(e.detail, e);
        });

    }

}

window.Flo = Flo;
