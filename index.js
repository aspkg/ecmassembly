// @ts-check

export class ECMAssembly {
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
		requestAnimationFrame: {
			_requestAnimationFrame: fnIndex => {
				if (typeof requestAnimationFrame === 'undefined')
					throw new Error('No requestAnimationFrame function detected. Install a polyfill in your environment first.')

				requestAnimationFrame(time => {
					this.getFn(fnIndex)(time)
				})
			},
		},

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
