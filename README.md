# flo-webcomponents
Take back control of rendering + events using WebComponents with one minimal superclass Flo is a minimal library to extend WebComponents, no build tools needed.

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
        });
        this.$("#minus").addEventListener("click", () => {
            this.count--;
            this.render();
        });
    }

    render() {
        this.$("#count").textContent = this.count;
    }
}
```

# Full Example (see also ./example):

![Describe Image Here](/example.png)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flo App</title>
</head>

<body>
    <flo-counters></flo-counters>

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

## Coding Conventions
When adding functions, like a new [Nyno Workflow](https://github.com/flowagi-eu/nyno), it's recommended to not use return statements, and instead directly set the component's variable(s), so re-rendering is easy:

```
// custom function 
async workflowLs(prev = "/") {
  const r = await fetch("http://localhost:9057/api/v1/list-files.nyno", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa("john@example.com:my-secure-password"),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prev,
    })
  });

  this.files = (await r.json()).result.prev;
}


render() {
   this.$("#files").textContent = JSON.stringify(this.files);
}

```



