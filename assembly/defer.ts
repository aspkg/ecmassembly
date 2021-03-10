import {fnPointerToIndex, ptr} from './utils'

declare function _defer(fn: usize): void

export {_defer}

export function defer<T>(fn: T): void {
	if (!isFunction<T>(fn)) throw new Error('Must pass a function of type `() => void`.')
	_defer(fnPointerToIndex(ptr(fn)))
}

declare function _defer2(fn: usize, arg: usize): void

export function defer2<T>(fn: T, arg: usize): void {
	if (!isFunction<T>(fn)) throw new Error('Must pass a function of type `() => void`.')
	_defer2(fnPointerToIndex(ptr(fn)), arg)
}
