// @ts-check

//// Library code ////////////////////////////////////

const promises = new Map()

class ECMAssembly {
	wasmExports = null

	wasmImports = {
		setTimeout: {
			// TODO which of the two is faster? I'm guessing the second one (with fnPointerToIndex) is.
			// Is new Uint32Array faster, or is calling into wasmExports.fnPointerToIndex faster?

			// setTimeout(fnPtr, ms) {
			// 	let index = new Uint32Array(wasmExports.memory.buffer, fnPtr, 1)[0]
			// 	let fn = wasmExports.table.get(index)
			// 	setTimeout(fn, ms)
			// },

			setTimeout: (fnPtr, ms) => {
				setTimeout(this.getFn(fnPtr), ms)
			},
		},

		Promise: {
			newPromise: (promisePtr, executorPtr) => {
				console.log('new Promise', promisePtr, executorPtr)

				let resolve, reject

				const promise = new Promise((res, rej) => {
					resolve = res
					reject = rej
				})

				promises.set(promisePtr, promise)

				// const executor = this.getFn(executorPtr)
				// executor(resolve, reject)
			},

			promiseThen: (promisePtr, callbackPtr) => {
				console.log('promise.then', promisePtr, callbackPtr)
				// const promise = promises.get(promisePtr)
			},
		},
		defer: {
			_defer: callbackPtr => {
				Promise.resolve().then(this.getFn(callbackPtr))
			},
		},
	}

	getFn(fnPtr) {
		if (!this.wasmExports) throw new Error('Make sure you set wasmExports after instantiating the Wasm module.')
		return this.wasmExports.table.get(this.wasmExports.fnPointerToIndex(fnPtr))
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
