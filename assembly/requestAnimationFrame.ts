declare function _requestAnimationFrame(fn: usize): i32

export {_requestAnimationFrame}

export type AnimationFrameCallback = (time: f64) => void

// @ts-expect-error func decos
@global
export function requestAnimationFrame(fn: AnimationFrameCallback): i32 {
	return _requestAnimationFrame(fn.index)
}

// @ts-expect-error func decos
@global
export declare function cancelAnimationFrame(id: i32): void
