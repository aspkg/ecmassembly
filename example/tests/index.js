import moduleExports from '../index.js'

moduleExports.testPromiseThen()
moduleExports.testPromiseCatch()
moduleExports.testRAF()

// process.on('uncaughtException', function (err) {
//   console.error(err.stack);
//   console.log("Node NOT Exiting...");
// });

console.log('ok')
