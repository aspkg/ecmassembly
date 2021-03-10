import moduleExports from '../index.js'

moduleExports.testPromiseThen()

moduleExports.testPromiseCatch()

// process.on('uncaughtException', function (err) {
//   console.error(err.stack);
//   console.log("Node NOT Exiting...");
// });

console.log('ok')
