# Take back control over the frontend.
Flo is a minimal WebComponent superclass (no build tools needed): 
- JavaScript: Take back control of rendering + events.
- CSS: Flo Web Components are fully isolated (Shadow DOM + `all:initial;` reset)

---

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

        this.render(); // explicitly render on-demand
    }

    render() {
        this.$("#count").textContent = this.count;
    }
}

customElements.define("flo-counter", Counter);
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
### Functionality
When adding functions, like a new [Nyno Workflow](https://github.com/flowagi-eu/nyno), it's recommended to not use return statements, and instead directly set the component's variable(s), so re-rendering is easy:

```js
class Explorer extends Flo {
 
	files = [];

	template() {
		return `
		    <h4>Explorer</h4>
		    <div id="files"></div>
		`;
	}

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

	async mounted() {
		setTimeout(async () => { 
			await this.workflowLs(); 
			this.render(); 
		});

		this.render();
	}
}
```

For testing, the above (`.textContent = JSON.stringify..`) is fine, however, when you're rendering a list of HTML items you want to avoid things like `.textContent` or `.innerHTML` and instead render custom components using the preferred static `.create` function or `.createElement` (see also example/components/list-counters.js) :

```js
const container = this.$('.container');
for (let i = 0; i < 2; i++) {
  const counter = Counter.create({counterId:i}); // optionally pass properties
  container.appendChild(counter);
}

``` 

For events, with Flo Web Components you can:
- use the global function `fire(name,data)` and listen in any component to these events using `window.addEventListener`
- or use `this.fire(name,data)` possibly with `this.parent.fire(name,component)` to fire events in the parent component, and in the parent component simply use `this.addEventListener`:

```js
class Child extends Flo {
	mounted() {
		this.$("#addNode").addEventListener(
			    "click",
			    () => {
					this.parent.fire("add-node", { custom: 'data'} );
			    }
		);
	}
}
```

```js
class Parent extends Flo {
	mounted() {
		this.addEventListener(
		    "add-node",
		    (e) => this.addNode(e.details)
		);
	}
}
```


For simple custom components defined in HTML you can also initiate property values via the data- property:
```html
<your-flo-element data-node-id="input""></your-flo-element>
```

The above example will set `.nodeId` to "input". This works only once on initiation (not reactive), before `mounted()` is called, so we don't need to worry about any side effects.

## CSS & Theme Variables

For CSS, you can add a css() function:

```
css() {

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

```


Flo uses Shadow DOM + `all: initial;` for fully isolated component styles. Global themes can still customize components through CSS variables.

```css
/* Component */
button {
    background: var(--btn-bg, #0b0c0f);
}

/* App theme */
:root {
    --btn-bg: #222;
}
```

The `var()` fallback is the component's default. Only variables explicitly used by the component are exposed for theming.

---

## Inline Data & Events

### Inline Events

Inline events let you define simple event behavior directly in the component template. Flo automatically detects `on*` attributes and turns them into event listeners, with the Flo component available as `this` and the native event available as `event`.

```html
<template>
  <button onclick="this.fire('save', { value: 'Hello' })">
    Save
  </button>
</template>
```

### `data-*` Attributes

`data-*` attributes provide a lightweight way to pass values from HTML into a Flo component. When connected, Flo copies these dataset values onto matching component properties, making them immediately available through `this`.

```html
<my-card
  data-title="Hello World"
  data-count="5"
  data-active="true">
</my-card>
```

```js
class MyCard extends Flo {
  mounted() {
    console.log(this.title);  // "Hello World"
    console.log(this.count);  // "5"
    console.log(this.active); // "true"
  }
}
```



# Flo Plugin System

Need more functionality? 

Create plugins for Web Components like [Flo Shapes (for Type Validation)](https://github.com/flowagi-eu/flo-plugin-shapes).  

```js
import { Flo } from "./flo.js";

Flo.hooks.create.push(({ el, props }) => {
  console.log("Created", el, props);
});

Flo.hooks.connected.push(({ el }) => {
  console.log("Connected", el);
});

Flo.hooks.disconnected.push(({ el }) => {
  console.log("Disconnected", el);
});

Flo.hooks.fire.push(({ el, name, detail }) => {
  console.log("Event", name, detail);
});
```

