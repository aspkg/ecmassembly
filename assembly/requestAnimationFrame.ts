import { FrameRequestCallback } from "./FrameRequestCallback"

declare function _requestAnimationFrame(fn: usize): i32

export {_requestAnimationFrame}

// @ts-expect-error func decos
@global
export function requestAnimationFrame(fn: FrameRequestCallback): i32 {
	return _requestAnimationFrame(fn.index)
}

// @ts-expect-error func decos
@global
export declare function cancelAnimationFrame(id: i32): void
