import {defer, deferWithArg, _defer} from './defer'
import {ptr} from './utils'

// What I did.
// - Semi-support chaining. (Got a pin error)
// - Got it looking like the real API
// - Added finally()
// - Slimmed down properties (moved to Promise._)
// - Added Promise.resolve/Promise.reject
// - Handled Promise.all/Promise.race (Not implemented)
// - Added JSDoc comments

// TODO Make more performant and work around JS calls. (Should work in wasmer/wasm3 too with no bindings)

// TODO convert to callback form once closures are out.
// type Executor<T> = (resolve: (result: T) => void, reject: (error: Error | null) => void) => void
type Executor<T> = (callback: PromiseActions<T>) => void

// TODO remove defer and make a workaround (Overhead because of calls)

// We shouldn't have to export this (or this class should even exist) once AS supports closures.
export class PromiseActions<T> {
	constructor(private promise: Promise<T>) {}

	resolve(result: T): void {

		// Just slimmed down checks. Still does exactly the same thing. Checks are in the run functions.

		this.promise._.result.push(result)

		if (this.promise._.thenPointer.length) this.promise._.__runThen()
	}

	reject(reason: string): void {

		this.promise._.error.push(reason)

		if (this.promise._.catchPointer.length) this.promise._.__runCatch()
	}
}

class Hidden<T> {
	finallyPointer: Array<usize> = []
	thenPointer: Array<usize> = []
	catchPointer: Array<usize> = []
	result: Array<T> = []
	error: Array<string> = []
	constructor(private promise: Promise<T>) {}
	__runThen(): void {
		// XXX unable to pass methods as callbacks:
		// defer<(this: Promise<T>) => void>(this.anyMethod)
		// _defer(ptr(this.anyMethod))
		// _defer(ptr<(this: Promise<T>) => void>(this.anyMethod))

		// The goal here is to run the callback in the next microtask, as per Promise spec.
		deferWithArg((selfPtr: usize) => {

			const self = changetype<Promise<T>>(selfPtr)

			// -- Trigger then

			if (!self._.thenPointer.length) return

			for (let i = 0; i < self._.thenPointer.length; i++) {

				const callback = changetype<(value: T) => void>(self._.thenPointer[i])

				callback(self._.result[0])

			}

			// -- Trigger finally

			if (!self._.finallyPointer.length) return

			for (let i = 0; i < self._.finallyPointer.length; i++) {

				const callback = changetype<() => void>(self._.finallyPointer[i])

				callback()

			}

			// Clear Pointer Entries
			self._.catchPointer = []
			
			self._.thenPointer = []

			self._.finallyPointer = []

		}, ptr(this.promise))
	}
	__runCatch(): void {

		deferWithArg((selfPtr: usize) => {

			const self = changetype<Promise<T>>(selfPtr)

			// -- Trigger catch

			if (!self._.catchPointer.length) return

			for (let i = 0; i < self._.catchPointer.length; i++) {

				const callback = changetype<(reason: string) => void>(self._.catchPointer[i])

				callback(self._.error[0])

			}

			// -- Trigger finally

			if (!self._.finallyPointer.length) return

			for (let i = 0; i < self._.finallyPointer.length; i++) {

				const callback = changetype<() => void>(self._.finallyPointer[i])

				callback()

			}

			// Clear Pointer Entries
			self._.catchPointer = []
			
			self._.thenPointer = []

			self._.finallyPointer = []

		}, ptr(this.promise))

	}
}

/**
 * Creates a new Promise.
 * @param executor A callback used to initialize the promise. This callback is passed two arguments:
 * a resolve callback used to resolve the promise with a value or the result of another promise,
 * and a reject callback used to reject the promise with a provided reason or error.
 */

export class Promise<T> {
	// Try to make extra functions hide behind a  _  property. Looked pretty bad before. Pretty much, I just slimmed stuff down and removed unneeded stuff.
	public _ : Hidden<T> = new Hidden<T>(this)

	private actions: PromiseActions<T> = new PromiseActions(this)

	constructor(private executor: Executor<T>) {
		this.executor(this.actions)
	}

	/**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onresolved The callback to execute when the Promise is resolved.
     * @returns A Promise for the completion of which ever callback is executed.
     */
	
	then(onresolved: (value: T) => void): Promise<T> {
		
		this._.thenPointer.push(changetype<usize>(onresolved))
		// Push the pointer to the array. The, execute it when resolve is called.

		if (this._.result.length) this._.__runThen()

		return this

	}

	/**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */

	catch(onrejected: (reason: string) => void): Promise<T> {

		this._.catchPointer.push(changetype<usize>(onrejected))

		if (this._.error.length) this._.__runCatch()

		return this

	}

	finally(onfinally: () => void): Promise<T> {

		this._.finallyPointer.push(changetype<usize>(onfinally))
	
		return this
	
	}

	/**
	* Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
	* or rejected.
	* @param values An array of Promises.
	* @returns A new Promise.
	*/

   	static race<T>(values: Array<Promise<T>>): Promise<string> {
		return new Promise<string>((promise) => {
			promise.reject('Not Implemented')
		})
	}

	/**
    * Creates a Promise that is resolved with an array of results when all of the provided Promises
    * resolve, or rejected when any Promise is rejected.
    * @param values An array of Promises.
    * @returns A new Promise.
    */

	static all<T>(values: Array<Promise<T>>): Promise<string> {
		return new Promise<string>((promise) => {
			promise.reject('Not Implemented')
		})
	}

	/**
     * Creates a new resolved promise.
     * @returns A resolved promise.
     */

	static resolve(): Promise<void> {
		return new Promise<void>((promise) => {
			promise.resolve()
		})
	}

	/**
     * Creates a new rejected promise.
     * @returns A rejected promise.
     */

	static reject(): Promise<void> {
		return new Promise<void>((promise) => {
			promise.reject('')
		})
	}
}

// Try running this test!
// If you import as-console, it will work really nicely.
export function test(): void {

	new Promise<string>((promise) => {

		promise.resolve('Hello World!')
	
	}).then((value) => {

		//console.log('Got: ' + value)

	}).catch((reason) => {

		//console.log('Error: ' + reason)

	}).finally(() => {

		//console.log('Done.')

	})
}