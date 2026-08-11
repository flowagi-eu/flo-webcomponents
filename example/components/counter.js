class Counter extends Flo {

    count = 0;

    style() {

        return `
            :host {
                display:block;
                width:250px;
                padding:20px;
                border:1px solid #ccc;
                font-family:Arial;
            }

            button{
                width:40px;
            }

            #count{
                display:inline-block;
                width:40px;
                text-align:center;
                font-size:22px;
            }
        `;

    }

    template() {

        return `
            <h2>Counter</h2>

            <button id="minus">-</button>

            <span id="count"></span>

            <button id="plus">+</button>
        `;

    }

    mounted() {

        this.$("#plus").addEventListener("click", () => {

            this.count++;

            this.render();

            this.emit("change", {
                count: this.count
            });

        });

        this.$("#minus").addEventListener("click", () => {

            this.count--;

            this.render();

            this.emit("change", {
                count: this.count
            });

        });

    }

    render() {

        this.$("#count").textContent = this.count;

    }

}

customElements.define("flo-counter", Counter);
