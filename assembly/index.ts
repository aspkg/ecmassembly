export * from './glue'

import {Promise} from './Promise'
import {setTimeout} from './setTimeout'
import {logf32} from './logf32'

function test(): void {
	setTimeout(() => {
		logf32(1.0)
	}, 1000)

	logf32(2.0)

	const p = new Promise<i32>(actions => {
		logf32(3.0)
		// setTimeout(() => {
		actions.resolve(10)
		// }, 2000)
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
