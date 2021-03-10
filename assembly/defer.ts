import {fnPointerToIndex, ptr} from './utils'

/////////////////////////////////////////

declare function _defer(fn: usize): void

export {_defer}

export function defer<T>(fn: T): void {
	if (!isFunction<T>(fn)) throw new Error('Must pass a function of type `() => void`.')
	_defer(fnPointerToIndex(ptr(fn)))
}

/////////////////////////////////////////

declare function _deferWithArg(fn: usize, arg: usize): void

export {_deferWithArg}

export function deferWithArg<T>(fn: T, arg: usize): void {
	if (!isFunction<T>(fn)) throw new Error('Must pass a function of type `() => void`.')
	_deferWithArg(fnPointerToIndex(ptr(fn)), arg)
}
