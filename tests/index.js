const assert = require('assert')
const myModule = require('..')

myModule.testPromiseThen()

myModule.testPromiseCatch()

// process.on('uncaughtException', function (err) {
//   console.error(err.stack);
//   console.log("Node NOT Exiting...");
// });

console.log('ok')
