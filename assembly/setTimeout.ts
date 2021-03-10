import {fnPointerToIndex, ptr} from './utils'

declare function _setTimeout(fn: usize, milliseconds: f32): void

export {_setTimeout}

export function setTimeout(fn: () => void, milliseconds: f32): void {
	_setTimeout(fnPointerToIndex(ptr(fn)), milliseconds)
}
