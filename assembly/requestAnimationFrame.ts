import {fnPointerToIndex, ptr} from './utils'

declare function _requestAnimationFrame(fn: usize): void

export {_requestAnimationFrame}

export function requestAnimationFrame<T>(fn: T): void {
	if (!isFunction<T>(fn)) throw new Error('Must pass a function of type `() => void`.')
	_requestAnimationFrame(fnPointerToIndex(ptr(fn)))
}

export declare function cancelAnimationFrame(id: i32): void
