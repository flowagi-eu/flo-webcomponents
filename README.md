# flo-webcomponents
Flo gives you back control over rendering + events (minimal library to extend WebComponents, no build tools needed)

![Describe Image Here](/example.png)

## Extend WebComponents with Flo:
```js
class Counter extends Flo {

    count = 0;

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
```

# Full Example (see also ./example):
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flo App</title>
</head>

<body>
    <list-counters></list-counters>

    <script type="module">
        import "./flo.js";

        import "./components/counter.js";
        import "./components/list-counters.js";
    </script>
</body>
</html>
```

## Install
Note: You'll need a webserver to work with modules:

```
git clone https://github.com/flowagi-eu/flo-webcomponents
cd example
python3 -m http.server 8080
```
