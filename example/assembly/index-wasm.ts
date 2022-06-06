import {FrameRequestCallback} from '../node_modules/ecmassembly/assembly/FrameRequestCallback'
import './log.js'

// User should not new PromiseActions directly, but we have to export it so
// they can create a variable that will reference it because there are no
// closures. Once closures land, this class will not be exported, and the end
// user will use callbacks passed into new Promise executors.
let actions: PromiseActions<i32> | null = null

let timeout: i32 = 0
let interval: i32 = 0

export function testSetTimeout(): void {
	setTimeout(() => {
		log('Timeout one!')
	}, 1000)

	setTimeout(() => {
		log('Timeout two!')
	})

	// We should not see the log from the cancelled timeout.
	timeout = setTimeout(() => {
		log('We should not see this!!!!!!!!!')
	}, 1000)

	setTimeout(() => {
		clearTimeout(timeout)
	}, 10)
}

export function testSetInterval(): void {
	interval = setInterval(() => {
		log('Interval one!')
	}, 750)

	setTimeout(() => {
		clearInterval(interval)

		interval = setInterval(() => {
			log('Interval two!')
		})
	}, 2500)

	setTimeout(() => {
		clearInterval(interval)
	}, 3500)
}

export function testPromiseThen(): void {
	log((2.0).toString())

	const p = new Promise<i32>(actionsOrResolve => {
		// @ts-expect-error for Wasm only
		actions = actionsOrResolve

		log((3.0).toString())

		setTimeout(() => {
			if (ASC_TARGET == 0) {
				// JS
				actionsOrResolve(1000)
			} else {
				// Wasm
				// TODO once we have closures, remove this checking, as we'll
				// have plain resolve/reject functions.

				// We will not need any null assertion when closures allows us to
				// remove PromiseActions and therefore the user relies on the
				// resolve/reject functions that will be passed into here, but for
				// now they rely on actions object being passed in, and there's no
				// way to reference it inside the setTimeout callback except for
				// storing it on a global variable due to lacking closures.
				actions!.resolve(1000)
			}
		}, 2000)
	})

	p.then((n: i32) => {
		if (n != 1000) throw new Error('It should have resolved with the correct value.')
		log(n.toString())
	}).catch((e: Error) => {
		throw new Error('catch() should not run.')
	})

	log((4.0).toString())
}

let actions2: PromiseActions<i32> | null = null

export function testPromiseCatch(): void {
	log((5.0).toString())

	const p2 = new Promise<i32>((actionsOrResolve, reject) => {
		// @ts-expect-error for Wasm only
		actions2 = actionsOrResolve

		log((6.0).toString())

		setTimeout(() => {
			log((7.0).toString())
			log('CREATE ERROR 1')
			const e = new Error('rejected1')
			// const e = {message: 'rejected1', name: 'foo'}

			log('REJECT WITH ERROR 1')
			if (ASC_TARGET == 0) reject(e)
			else actions2!.reject(e)
		}, 2000)
	})

	p2.then((n: i32) => {
		throw new Error('then() should not run.')
	}).catch(e => {
		if (e.message != 'rejected1') throw new Error('It should have rejected with the correct error')
		log((3000).toString())
	})

	log((8.0).toString())
}

let actions3: PromiseActions<i32> | null = null

export function testPromiseThenFinally(): void {
	log((8.1).toString())

	const p2 = new Promise<i32>((actionsOrResolve, reject) => {
		// @ts-expect-error for Wasm only
		actions3 = actionsOrResolve

		log((8.2).toString())

		setTimeout(() => {
			log((8.3).toString())

			if (ASC_TARGET == 0) actionsOrResolve(3200)
			else actions3!.resolve(3200)
		}, 2000)
	})

	p2.then((n: i32) => {
		if (n != 3200) throw new Error('Resolved with incorrect value.')
		log(n.toString())
	})
		.catch(e => {
			throw new Error('catch() should not run.')
		})
		.finally(() => {
			log('then.finally')
		})

	log((8.4).toString())
}

let actions4: PromiseActions<i32> | null = null

export function testPromiseCatchFinally(): void {
	log((8.5).toString())

	const p2 = new Promise<i32>((actionsOrResolve, reject) => {
		// @ts-expect-error for Wasm only
		actions4 = actionsOrResolve

		log((8.6).toString())

		setTimeout(() => {
			log((8.7).toString())
			log('CREATE ERROR 2')
			const e = new Error('rejected2')

			log('REJECT WITH ERROR 2')
			if (ASC_TARGET == 0) reject(e)
			else actions4!.reject(e)
		}, 2000)
	})

	p2.then((n: i32) => {
		throw new Error('then() should not run.')
	})
		.catch(e => {
			if (e.message != 'rejected2') throw new Error('It should have rejected with the correct error')
			log('caught error 2')
		})
		.finally(() => {
			log('catch.finally')
		})

	log((8.8).toString())
}

let actions5: PromiseActions<f64> | null = null
let count: f32 = 0.0
let loop: FrameRequestCallback = (t: number) => {}

export function testRAF(): void {
	log((9.0).toString())

	const p = new Promise<f64>((actionsOrResolve, reject) => {
		// @ts-expect-error for Wasm only
		actions5 = actionsOrResolve

		log((10.0).toString())

		requestAnimationFrame(time => {
			if (ASC_TARGET == 0) actionsOrResolve(time)
			else actions5!.resolve(time)
		})
	})

	p.then((n: f64) => {
		log((4000).toString())
		log(n.toString())
	})

	loop = (time: f64): void => {
		log(count.toString())
		log(time.toString())
		if (count++ < 100.0) requestAnimationFrame(loop)
	}

	requestAnimationFrame(loop)

	log((11.0).toString())
}
