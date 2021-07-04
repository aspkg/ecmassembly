import {fnPointerToIndex, ptr} from './utils'

declare function _setTimeout(fn: usize, milliseconds: f32): i32

export {_setTimeout}

export function setTimeout(fn: () => void, milliseconds: f32): i32 {
	return _setTimeout(fnPointerToIndex(ptr(fn)), milliseconds)
}

export declare function clearTimeout(id: i32): void
