// @ts-check

//// Library code ////////////////////////////////////

const promises = new Map()

class ECMAssembly {
	table

	get wasmExports() {
		return this._exports
	}
	set wasmExports(e) {
		this.table = e.table
		this._exports = e
	}

	_exports = null

	wasmImports = {
		setTimeout: {
			// TODO which of the two is faster? I'm guessing the second one (with fnPointerToIndex) is.
			// Is new Uint32Array faster, or is calling into wasmExports.fnPointerToIndex faster?

			// setTimeout(fnPtr, ms) {
			// 	let index = new Uint32Array(wasmExports.memory.buffer, fnPtr, 1)[0]
			// 	let fn = wasmExports.table.get(index)
			// 	setTimeout(fn, ms)
			// },

			_setTimeout: (fnIndex, ms) => {
				setTimeout(this.getFn(fnIndex), ms)
			},
		},

		defer: {
			_defer: callbackIndex => {
				Promise.resolve().then(this.getFn(callbackIndex))
			},
			_defer2: (callbackIndex, argPtr) => {
				Promise.resolve().then(() => {
					this.getFn(callbackIndex)(argPtr)
				})
			},
		},
	}

	getFn(fnIndex) {
		if (!this.wasmExports)
			throw new Error(
				'Make sure you set .wasmExports after instantiating the Wasm module but before running the Wasm module.',
			)
		return this.table.get(fnIndex)
	}
}

//// End user code ////////////////////////////////////

const fs = require('fs')
const loader = require('@assemblyscript/loader')

const es = new ECMAssembly()

const imports = {
	...es.wasmImports,
	logf32: {
		logf32(n) {
			console.log(n)
		},
	},
}

console.log('Load module')

const wasmModule = loader.instantiateSync(
	// fs.readFileSync(__dirname + "/build/optimized.wasm"),
	fs.readFileSync(__dirname + '/build/untouched.wasm'),
	imports,
)

console.log('set wasmExports')

module.exports = es.wasmExports = wasmModule.exports
