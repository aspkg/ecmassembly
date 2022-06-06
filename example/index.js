import fs from 'fs'
import path from 'path'
import ASLoader from '@assemblyscript/loader'
import {ECMAssembly} from 'ecmassembly/index.js'
import raf from 'raf'

// You must polyfill requestAnimationFrame in Node (or else the ecmassembly lib throws a helpful error that user needs to do so).
raf.polyfill(globalThis)

const es = new ECMAssembly()

const imports = {
	...es.wasmImports,
	console: {
		log: s => console.log(wasmModule.exports.__getString(s)),
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

function dirname(url) {
	const parts = url.split(path.sep)
	parts.pop()
	return parts.join(path.sep).replace('file://', '')
}

const wasmModule = ASLoader.instantiateSync(
	fs.readFileSync(dirname(import.meta.url) + '/build/untouched.wasm'),
	imports,
)

// Before doing anything, give the exports to ECMAssembly
es.wasmExports = wasmModule.exports

// Now run anything (in this case, the example's tests/index.js file will call the exported functions).
export default wasmModule.exports
