import moduleExports from '../index.js'

moduleExports.testPromiseThen()
moduleExports.testPromiseCatch()

setTimeout(() => {
	moduleExports.testRAF()
}, 2500)

// process.on('uncaughtException', function (err) {
//   console.error(err.stack);
//   console.log("Node NOT Exiting...");
// });

console.log('ok')
