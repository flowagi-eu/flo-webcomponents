class ListCounters extends Flo {

    template() {
        return `
	  <div class="counters"></div>
	  <button id="setFirstTo10">Set First Counter to 10</button>
	  <button id="setSecondTo20">Set Second Counter to 20</button>
	  <button id="incrementAll">Increment All</button>
        `;
    }

    mounted() {
	    const container = this.$('.counters');
            const counters = [];

            for (let i = 0; i < 2; i++) {
                const counter = document.createElement("flo-counter");
                counter.id = `counter${i + 1}`;
                container.appendChild(counter);
                counters.push(counter);
            }


            this.$("#setFirstTo10").addEventListener("click", () => {
                counters[0].count = 10;
                counters[0].render(); // Manually call render
            });

            this.$("#setSecondTo20").addEventListener("click", () => {
                counters[1].count = 20;
                counters[1].render(); // Manually call render
            });

            this.$("#incrementAll").addEventListener("click", () => {
                counters.forEach((counter, i) => {
                    counter.count++;
                    counter.render(); // Manually call render
                });
            });

    }

}

customElements.define("list-counters", ListCounters);
