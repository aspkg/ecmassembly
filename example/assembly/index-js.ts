// First import JS type helpers
import 'assemblyscript/std/portable/index'
import type {} from 'ecmassembly/assembly/PromiseActions-js'

// Then import AS code so that it works in the JS target
export * from './index-wasm.js'
