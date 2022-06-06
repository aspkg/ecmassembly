# ECMAssembly

Spec'd and/or common JavaScript APIs brought to AssemblyScript.

> The name is a play on words:
> `ECMAScript -> AssemblyScript -> ECMAssembly`

Namely, this provides APIs that require task scheduling from the host
environment's (JavaScript's) event loop; APIs such as `setTimeout`, `Promise`,
etc. AssemblyScript's stdlib currently only provides APIs that can be
implemented entirely on their own in Wasm without scheduling (Wasm does not yet
provide any APIs for scheduling) therefore without the need for bindings.

> **Note**
> For DOM APIs, see [`asdom`](https://github.com/lume/asdom).

# Usage

First:

```sh
npm install ecmassembly @assemblyscript/loader
```

> **Note** > `@assemblyscript/loader` is needed, and your program will need to be manually
> loaded with the [loader API](https://github.com/AssemblyScript/assemblyscript/tree/main/lib/loader), and not with AssemblyScript's new auto-bindings
> in 0.20+, for now.

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

For example, see the `example/`'s [Wasm entrypoint](./example/index.js).

In your AssemblyScript project's `asconfig.json`, make sure the globals are included in `entries`, along with your own entry point:

```json
{
	"entries": [
		"./node_modules/ecmassembly/assembly/PromiseActions",
		"./node_modules/ecmassembly/assembly/globals.ts",
		"./path/to/your-entry-point.ts"
	]
}
```

For example, see the `example/`'s [asconfig.json](./example/asconfig.json).

In your code you can now use the available APIs similar to in regular
JavaScript, for example here is what `Promise` currently looks like:

```ts
let actions: PromiseActions<boolean> | null = null

export function runMyApp() {
	const promise = new Promise<boolean>(_actions => {
		// Temporary hack while AS does not yet support closures (no closing
		// over variable except those that are at the top-level of the module).
		actions = _actions

		// resolve after 1 second
		setTimeout(() => {
			actions!.resolve(true)
		}, 1000)
	})

	promise.then(result => {
		// this runs one second later, and `result` will be `true` here
	})
}
```

> **Note**
> AssemblyScript does not support closures for non-top-level variables yet, so
> a `Promise` constructor's executor function receives an object with `resolve` and
> `reject` methods instead of two separate `resolve` and `reject` args, for the
> time being, but this will be updated in the future once closures are supported.

Here's what `requestAnimationFrame` looks like:

```ts
// This is out here because there is no closure support for non-top-level variables yet.
let loop: (time: number) => void = (t: number) => {}

export function runMyApp() {
	// Make an infinite game loop:

	loop = (time: number) => {
		// ... render something based on the current elapsed time ...

		requestAnimationFrame(loop)
	}

	requestAnimationFrame(loop)
}
```

For example, see `example/`'s [`index-wasm.ts`](./example/assembly/index-wasm.ts) where it exercises all the APIs.

Finally, make sure when you compile your AS code you pass `--exportTable --exportRuntime` to the `asc` CLI. For example:

```sh
asc --target release --exportTable --exportRuntime
```

# Portable mode

If you plan to make your code compile to Wasm using AssemblyScript (with `asc`) _and_ plain JS using TypeScript (f.e. with `tsc`), then you should make a JS entry point that imports your AS entry point, like so:

```js
// First import JS helpers
import 'assemblyscript/std/portable/index'
import type {} from 'ecmassembly/assembly/PromiseActions-js' // placeholder type for JS

// Then import AS code so that it works in the JS target
export * from './path/to/your-entry-point.js'
```

Then you will need to write some conditional branching in order to handle the
difference between Wasm and JS runtimes when it comes to using `Promise`. The above `Promise` example would need to be updated like so:

```ts
let actions: PromiseActions<boolean> | null = null

export function runMyApp() {
	const promise = new Promise<boolean>((resolve, reject) => {
		// Temporary hack while AS does not yet support closures (no closing
		// over variable except those that are at the top-level of the module).
		// @ts-expect-error action object is for Wasm only
		actions = resolve

		// resolve after 1 second
		setTimeout(() => {
			if (ASC_TARGET == 0) resolve(time)
			else actions!.resolve(true)
		}, 1000)
	})

	promise.then(result => {
		// this runs one second later, and `result` will be `true` here
	})
}
```

Where `ASC_TARGET == 0` means we're in a JS environment, otherwise the code will use the actions object when compiled to Wasm (`ASC_TARGET != 0`).

> **Note**
> When closures for non-top-level variables arrive in AssemblyScript, this
> conditional checking will not be needed, and the `Promise` API will work exactly
> the same way in either environment.

# APIs so far

- [x] `requestAnimationFrame`/`cancelAnimationFrame`
- [x] `setTimeout`/`clearTimeout`
- [x] `setInterval`/`clearInterval`
- [x] `Promise` (rudimentary initial implementation, still lacking things like proper promise chaining and static methods, etc)
  - [ ] Complete the API, make it more to spec.
  - [ ] Remove `PromiseActions` after closure support.
- [ ] `queueMicrotask`
