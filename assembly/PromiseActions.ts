import {Promise} from './Promise'

// We shouldn't have to export this (this class should not even exist) once AS supports closures.

@global
export class PromiseActions<T, E extends Error = Error> {
	/*friend*/ constructor(private promise: Promise<T, E>) {}

	resolve(result: T): void {
		// @ts-ignore, internal access
		if (this.promise.__isSettled) return
		// @ts-ignore, internal access
		this.promise.__isSettled = true

		// @ts-ignore, internal access
		this.promise.__result.push(result)

		// @ts-ignore, internal access
		this.promise.__runThen()
	}

	reject(reason: E): void {
		// @ts-ignore, internal access
		if (this.promise.__isSettled) return
		// @ts-ignore, internal access
		this.promise.__isSettled = true

		// @ts-ignore, internal access
		this.promise.__error.push(reason)

		// @ts-ignore, internal access
		this.promise.__runCatch()
	}
}
