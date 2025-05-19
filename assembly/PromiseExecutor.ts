import {PromiseActions} from './PromiseActions'

// TODO convert to callback form once closures are out.
// type PromiseExecutor<T> = (resolve: (result: T) => void, reject: (error: Error | null) => void) => void
export type PromiseExecutor<T, E extends Error> = (resRej: PromiseActions<T, E>, rejectJSOnly: () => void) => void
