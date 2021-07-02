import {fnPointerToIndex, ptr} from './utils'

declare function _requestAnimationFrame(fn: usize): i32

export {_requestAnimationFrame}

export function requestAnimationFrame<T>(fn: T): i32 {
	if (!isFunction<T>(fn)) throw new Error('Must pass a function of type `() => void`.')
	return _requestAnimationFrame(fnPointerToIndex(ptr(fn)))
}

export declare function cancelAnimationFrame(id: i32): void
