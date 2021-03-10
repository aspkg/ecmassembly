declare function _defer(fn: usize): void

export {_defer}

export function defer<T>(fn: T): void {
	if (!isFunction<T>(fn)) throw new Error('Must pass a function.')
	_defer(changetype<usize>(fn))
}
