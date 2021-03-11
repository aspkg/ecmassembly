import {Promise, PromiseActions, setTimeout, requestAnimationFrame} from '../node_modules/ecmassembly/assembly/index'
import {logf32} from './logf32'

// User should not new PromiseActions directly, but we have to export it so
// they can create a variable that will reference it because there are no
// closures. Once closures land, this class will not be exported, and the end
// user will use callbacks passed into new Promise executors.
let actions: PromiseActions<i32> | null = null
let actions2: PromiseActions<i32> | null = null

export function testPromiseThen(): void {
	setTimeout(() => {
		logf32(1.0)
	}, 1000)

	logf32(2.0)

	const p = new Promise<i32>(_actions => {
		actions = _actions

		logf32(3.0)

		setTimeout(() => {
			// We will not need any null assertion when closures allows us to
			// remove PromiseActions and therefore the user relies on the
			// resolve/reject functions that will be passed into here, but for
			// now they rely on actions object being passed in, and there's no
			// way to reference it inside the setTimeout callback except for
			// storing it on a global variable due to lacking closures.
			actions!.resolve(10)
		}, 2000)
	})

	p.then((n: i32) => {
		logf32(1000)
	})

	logf32(4.0)
}

export function testPromiseCatch(): void {
	logf32(5.0)

	const p2 = new Promise<i32>(_actions => {
		actions2 = _actions

		logf32(6.0)

		setTimeout(() => {
			logf32(7.0)

			// We will not need any null assertion when closures allows us to
			// remove PromiseActions and therefore the user relies on the
			// resolve/reject functions that will be passed into here, but for
			// now they rely on actions object being passed in, and there's no
			// way to reference it inside the setTimeout callback except for
			// storing it on a global variable due to lacking closures.
			actions2!.reject('There was a problem!')
		}, 2000)
	})

	p2.then((n: i32) => {
		logf32(2000)
	})

	p2.catch(e => {
		logf32(3000)
	})

	logf32(8.0)
}

export function testRAF(): void {
	logf32(9.0)

	const p = new Promise<i32>(_actions => {
		actions = _actions

		logf32(10.0)

		requestAnimationFrame((t: f32) => {
			// We will not need any null assertion when closures allows us to
			// remove PromiseActions and therefore the user relies on the
			// resolve/reject functions that will be passed into here, but for
			// now they rely on actions object being passed in, and there's no
			// way to reference it inside the setTimeout callback except for
			// storing it on a global variable due to lacking closures.
			actions!.resolve(123)
		})
	})

	p.then((n: i32) => {
		logf32(4000)
	})

	logf32(11.0)
}
