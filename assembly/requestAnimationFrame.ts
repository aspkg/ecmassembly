declare function _requestAnimationFrame(fn: usize): i32

export {_requestAnimationFrame}

export function requestAnimationFrame(fn: (time: f32) => void): i32 {
	return _requestAnimationFrame(fn.index)
}

export declare function cancelAnimationFrame(id: i32): void
