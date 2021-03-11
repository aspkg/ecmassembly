# ECMAssembly

(Some) JavaScript APIs brought to AssemblyScript.

So far:

- `requestAnimationFrame`
- `setTimeout`
- `Promise` (rudimentary initial implementation, still lacking things like promise chaining and static methods, etc)

# Usage

Look at [`example/index.js`](./example/index.js) to see how one would
pass JavaScript-side requirements into the Wasm module via imports object, then
look at [`example/assembly/index.ts`](./example/assembly/index.ts) to see how
to import the APIs inside of AssemblyScript code.

The gist is: on the JavaScript side import and pass things in:

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
	wasmModule.exports.doSomething()
})
```
