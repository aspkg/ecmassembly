// @ts-check

//// Library code ////////////////////////////////////

const promises = new Map()

class ECMAssembly {
	table
	__pin
	__unpin

	get wasmExports() {
		return this._exports
	}
	set wasmExports(e) {
		this.table = e.table
		this.__pin = e.__pin
		this.__unpin = e.__unpin
		this._exports = e
	}

	_exports = null

	wasmImports = {
		setTimeout: {
			_setTimeout: (fnIndex, ms) => {
				setTimeout(this.getFn(fnIndex), ms)
			},
		},

		defer: {
			_defer: callbackIndex => {
				Promise.resolve().then(this.getFn(callbackIndex))
			},
			_deferWithArg: (callbackIndex, argPtr) => {
				// Prevent the thing pointed to by argPtr from being collectd, because the callback needs it later.
				this.__pin(argPtr)

				Promise.resolve().then(() => {
					// At this point, is the callback collected? Did we need to
					// __pin the callback too, and it currently works by
					// accident?

					this.getFn(callbackIndex)(argPtr)

					this.__unpin(argPtr)
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
	env: {
		abort(message, fileName, line, column) {
			console.error('--------- Error message from AssemblyScript ---------')
			console.error('  ' + wasmModule.exports.__getString(message))
			console.error('    In file "' + wasmModule.exports.__getString(fileName) + '"')
			console.error(`    on line ${line}, column ${column}.`)
			console.error('-----------------------------------------------------')
		},
	},
}

const wasmModule = loader.instantiateSync(
	// fs.readFileSync(__dirname + "/build/optimized.wasm"),
	fs.readFileSync(__dirname + '/build/untouched.wasm'),
	imports,
)

module.exports = es.wasmExports = wasmModule.exports
