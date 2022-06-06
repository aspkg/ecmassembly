declare global {
	// For now, for JS we don't need a class, just a placeholder
	type PromiseActions<T, E = Error> = {
		resolve(result: T): void
		reject(reason: E): void
	}
}

export {}
