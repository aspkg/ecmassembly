declare function _setTimeout(fn: usize, milliseconds: f32): i32

export {_setTimeout}

// @ts-expect-error function decorators
@global
export function setTimeout(fn: () => void, milliseconds: f32 = 0.0): i32 {
	return _setTimeout(fn.index, milliseconds)
}

// @ts-expect-error function decorators
@global
export declare function clearTimeout(id: i32): void
