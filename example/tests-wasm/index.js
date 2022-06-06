import moduleExports from '../index.js'

moduleExports.testSetTimeout()
moduleExports.testSetInterval()
moduleExports.testPromiseThen()
moduleExports.testPromiseCatch()
moduleExports.testPromiseThenFinally()
moduleExports.testPromiseCatchFinally()

setTimeout(() => moduleExports.testRAF(), 3500)

console.log('ok')
