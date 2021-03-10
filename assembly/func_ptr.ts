declare function apiWithCallback(callback: Callback): void

type Callback = () => i32

let x = 100

export let setIt = (): i32 => {
	return x++
}

export function sendCallback(): usize {
	apiWithCallback(setIt)
	setIt()
	return load<i32>(changetype<usize>(setIt))
}

// Here is the abstract class Function<T>
// https://github.com/AssemblyScript/assemblyscript/blob/6fe4b288d31b9e08895e80e06c53c7cf426eda90/std/assembly/function.ts#L8
// you can also use function_name.index.  Here is the get index function out of the class Function<T>:
/*
  get index(this: T): u32 {
    return load<u32>(changetype<usize>(this), offsetof<Function<T>>("_index"));
  }
*/
