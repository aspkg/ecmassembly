import {Promise, PromiseActions} from './Promise'
import {setTimeout} from './setTimeout'
import {logf32} from './logf32'

// User should not new PromiseActions directly, but we have to export it so
// they can create a variable that will reference it because there are no
// closures. Once closures land, this class will not be exported, and the end
// user will use callbacks passed into new Promise executors.
let actions: PromiseActions<i32> | null = null

function test(): void {
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

export function add(a: i32, b: i32): i32 {
	test()
	return a + b
}
