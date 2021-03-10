export function fnPointerToIndex(fnPtr: usize): i32 {
	return load<i32>(fnPtr)
}
