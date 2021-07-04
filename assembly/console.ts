import { Promise } from "./Promise"

declare function _log(data: string): void

/* So Far, supports:
- Strings
- Numbers
- UintArrays
- IntArrays
- Functions
- ArrayBuffer
- Map
- Set
- DataView
- Promise
- Array
- StaticArray
- Infinity
Add more to the list if you think of any!
*/

export namespace console {
    export function log<T>(data: T): void {

        // -- String
        if (data instanceof String) {
            _log(changetype<string>(data))
        }
        // -- Number
        else if (isFloat(data) || isInteger(data) || isSigned(data)) {
            _log(f64(data).toString())
        }
        // -- Uint(8/16/32/64)Array
        else if (data instanceof Uint8Array || data instanceof Uint16Array || data instanceof Uint32Array || data instanceof Uint64Array || data instanceof Uint8ClampedArray) {
            _log(`UintArray(${data.length}) [${data.toString()}]`)
        }
        // -- Int(8/16/32/64)Array
        else if (data instanceof Int8Array || data instanceof Int16Array || data instanceof Int32Array || data instanceof Int64Array) {
            _log(`IntArray(${data.length}) [${data.toString()}]`)
        }
        // -- StaticArray
        else if (data instanceof StaticArray) {
            _log(data.toString())
        }
        // -- Array
        else if (data instanceof Array) {
            _log(data.toString())
        }
        // -- ArrayBuffer
        else if (data instanceof ArrayBuffer) {
            let array = Uint8Array.wrap(data)
            let hex = ''
            for (let i = 0; i < data.byteLength; i++) {
                if (i === data.byteLength - 1) {
                    hex += array[i].toString(16)
                } else {
                    hex += `${array[i].toString(16)} `
                }
            }
            _log(`ArrayBuffer {\n  [Uint8Contents]: <${hex}>,\n  byteLength: ${data.byteLength}\n}`)
        }
        // -- Map
        else if (data instanceof Map) {
            _log('[object Map]')
        }
        // -- Set
        else if (data instanceof Set) {
            _log('[object Set]')
        }
        // -- Promise
        else if (data instanceof Promise) {
            _log('[object Promise]')
        }
        // -- Functions
        else if (typeof data === 'function') {
            _log('[Function: ' + 'Unknown' + ']')
            // Function.name not working... _log('[Function: ' + data.name + ']')
        }
        // -- DataView
        else if (data instanceof DataView) {
            let array = Uint8Array.wrap(data.buffer)
            let hex = ''
            for (let i = 0; i < data.byteLength; i++) {
                if (i === data.byteLength - 1) {
                    hex += array[i].toString(16)
                } else {
                    hex += `${array[i].toString(16)} `
                }
            }
            _log(`DataView {\n  byteLength: ${data.byteLength},\n  byteOffset: ${data.byteOffset},\n  buffer: ArrayBuffer {\n    [Uint8Contents]: <${hex}>,\n    byteLength: ${data.byteLength}\n  }\n}`)
        }
        // -- Unknown
        else {
            _log('Unknown')
        }

    }
}