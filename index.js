// @ts-check

//// Library code ////////////////////////////////////

const promises = new Map()

class ECMAssembly {
	table
	__pin

	get wasmExports() {
		return this._exports
	}
	set wasmExports(e) {
		this.table = e.table
		this.__pin = e.__pin
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
				// Prevent the thing pointed to by argPtr from being collectd, because the callback needs it later.
				this.__pin(argPtr)

				Promise.resolve().then(() => {
					// At this point, is the callback collected? Did we need to
					// __pin the callback too, and it currently works by
					// accident?

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

const wasmModule = loader.instantiateSync(
	// fs.readFileSync(__dirname + "/build/optimized.wasm"),
	fs.readFileSync(__dirname + '/build/untouched.wasm'),
	imports,
)

module.exports = es.wasmExports = wasmModule.exports
