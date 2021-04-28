# ECMAssembly

(Some) JavaScript APIs brought to AssemblyScript.

So far:

- `requestAnimationFrame`
- `setTimeout`
- `Promise` (rudimentary initial implementation, still lacking things like promise chaining and static methods, etc)
- `Console`

> The name is a play on words:
> `ECMAScript -> AssemblyScript -> ECMAssembly`

# Usage

Look at [`example/index.js`](./example/index.js) to see how one would
pass JavaScript-side requirements into the Wasm module via imports object, then
look at [`example/assembly/index.ts`](./example/assembly/index.ts) to see how
to import the APIs inside of AssemblyScript code.

First:

```sh
npm install ecmassembly
```

On the JavaScript side pass required glue code to the Wasm module via imports:

```js
import {ECMAssembly} from 'ecmassembly/index.js'
import ASLoader from '@assemblyscript/loader'

const es = new ECMAssembly()

const imports = {
	...es.wasmImports,
	/*...All your own imports...*/
}

ASLoader.instantiateStreaming(fetch('path/to/module.wasm'), imports).then(wasmModule => {
	// After the Wasm module is created, you need to pass the exports back to the lib:
	es.wasmExports = wasmModule.exports

	// Then finally, run anything from the module that depends on setTimeout, Promise, etc:
	wasmModule.exports.runMyApp()
})
```

In your AssemblyScript code import what you need an use it:

```ts
import {Promise, setTimeout, console } from '../node_modules/ecmassembly/assembly/index'

export function runMyApp() {

	const promise = new Promise<string>(promise => {
		
		promise.resolve('Hello, World!')

	}).then(result => {
		
		console.log(result)
		// -- Console accepts amost anything. Numbers, Strings, Functions, Arrays.
	})
}
```

or

```ts
import {requestAnimationFrame} from '../node_modules/ecmassembly/assembly/index'

// This is out here because there is no closure support for non-top-level variables yet.
let loop: (time: f32) => void = (t: f32) => {}

export function runMyApp() {
	// Make an infinite game loop.

	loop = (time: f32) => {
		// ... render something based on the current elapsed time ...

		requestAnimationFrame(loop)
	}

	requestAnimationFrame(loop)
}
```
