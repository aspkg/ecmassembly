import {
	Promise,
	PromiseActions,
	setTimeout,
	requestAnimationFrame,
	clearTimeout,
	setInterval,
	clearInterval,
	AnimationFrameCallback,
} from '../node_modules/ecmassembly/assembly/index'
import {logf32, logf64, logstr} from './log'

// User should not new PromiseActions directly, but we have to export it so
// they can create a variable that will reference it because there are no
// closures. Once closures land, this class will not be exported, and the end
// user will use callbacks passed into new Promise executors.
let actions: PromiseActions<i32, Error> | null = null

let timeout: i32 = 0
let interval: i32 = 0

export function testSetTimeout(): void {
	setTimeout(() => {
		logstr('Timeout one!')
	}, 1000)

	setTimeout(() => {
		logstr('Timeout two!')
	})

	// We should not see the log from the cancelled timeout.
	timeout = setTimeout(() => {
		logstr('We should not see this!!!!!!!!!')
	}, 1000)

	setTimeout(() => {
		clearTimeout(timeout)
	}, 10)
}

export function testSetInterval(): void {
	interval = setInterval(() => {
		logstr('Interval one!')
	}, 750)

	setTimeout(() => {
		clearInterval(interval)

		interval = setInterval(() => {
			logstr('Interval two!')
		})
	}, 2500)

	setTimeout(() => {
		clearInterval(interval)
	}, 3500)
}

export function testPromiseThen(): void {
	logf32(2.0)

	const p = new Promise<i32, Error>(_actions => {
		actions = _actions

		logf32(3.0)

		setTimeout(() => {
			// We will not need any null assertion when closures allows us to
			// remove PromiseActions and therefore the user relies on the
			// resolve/reject functions that will be passed into here, but for
			// now they rely on actions object being passed in, and there's no
			// way to reference it inside the setTimeout callback except for
			// storing it on a global variable due to lacking closures.
			actions!.resolve(1000)
		}, 2000)
	})

	p.then((n: i32) => {
		if (n != 1000) throw new Error('It should have resolved with the correct value.')
		logf32(n as f32)
	})

	p.catch((e: Error) => {
		throw new Error('catch() should not run.')
	})

	logf32(4.0)
}

let actions2: PromiseActions<i32, Error> | null = null

export function testPromiseCatch(): void {
	logf32(5.0)

	const p2 = new Promise<i32, Error>(_actions => {
		actions2 = _actions

		logf32(6.0)

		setTimeout(() => {
			logf32(7.0)

			actions2!.reject(new Error('rejected1'))
		}, 2000)
	})

	p2.then((n: i32) => {
		throw new Error('then() should not run.')
	})

	p2.catch(e => {
		if (e.message != 'rejected1') throw new Error('It should have rejected with the correct error')
		logf32(3000)
	})

	logf32(8.0)
}

let actions3: PromiseActions<i32, Error> | null = null

export function testPromiseThenFinally(): void {
	logf32(8.1)

	const p2 = new Promise<i32, Error>(_actions => {
		actions3 = _actions

		logf32(8.2)

		setTimeout(() => {
			logf32(8.3)

			actions3!.resolve(3200)
		}, 2000)
	})

	p2.then((n: i32) => {
		if (n != 3200) throw new Error('Resolved with incorrect value.')
		logf32(n as f32)
	})

	p2.catch(e => {
		throw new Error('catch() should not run.')
	})

	p2.finally(() => {
		logf32(3300)
	})

	logf32(8.4)
}

let actions4: PromiseActions<i32, Error> | null = null

export function testPromiseCatchFinally(): void {
	logf32(8.5)

	const p2 = new Promise<i32, Error>(_actions => {
		actions4 = _actions

		logf32(8.6)

		setTimeout(() => {
			logf32(8.7)

			actions4!.reject(new Error('rejected2'))
		}, 2000)
	})

	p2.then((n: i32) => {
		throw new Error('then() should not run.')
	})

	p2.catch(e => {
		if (e.message != 'rejected2') throw new Error('It should have rejected with the correct error')
		logf32(3500)
	})

	p2.finally(() => {
		logf32(3750)
	})

	logf32(8.8)
}

let actions5: PromiseActions<f64, Error> | null = null
let count: f32 = 0.0
let loop: AnimationFrameCallback = (t: f64) => {}

export function testRAF(): void {
	logf32(9.0)

	const p = new Promise<f64, Error>(_actions => {
		actions5 = _actions

		logf32(10.0)

		requestAnimationFrame(time => {
			actions5!.resolve(time)
		})
	})

	p.then((n: f64) => {
		logf32(4000)
		logf64(n)
	})

	loop = (time: f64): void => {
		logf32(count)
		logf64(time)
		if (count++ < 100.0) requestAnimationFrame(loop)
	}

	requestAnimationFrame(loop)

	logf32(11.0)
}
