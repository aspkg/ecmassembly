import * as moduleExports from '../build-js/index-js.js'

import raf from 'raf'
raf.polyfill()

moduleExports.testSetTimeout()
moduleExports.testSetInterval()
moduleExports.testPromiseThen()
moduleExports.testPromiseCatch()
moduleExports.testPromiseThenFinally()
moduleExports.testPromiseCatchFinally()

setTimeout(() => moduleExports.testRAF(), 3500)

console.log('ok')
