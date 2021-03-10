const fs = require('fs')
const bytes = fs.readFileSync('./func_ptr.wasm')

let importObject = {
	func_ptr: {
		apiWithCallback: callbackPtr => {
			console.log('usize: ', callbackPtr)
		},
	},
	env: {
		abort: (...args) => {
			console.log('abort')
		},
	},
}

;(async () => {
	let obj = await WebAssembly.instantiate(new Uint8Array(bytes), importObject)

	console.log(obj.instance.exports)

	const {sendCallback, table} = obj.instance.exports

	let num = sendCallback()

	console.log(`returned number=${num}`)

	let table_call_value = table.get(num)()

	console.log(`table_call_value=${table_call_value}`)
})()
