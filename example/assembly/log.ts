// @ts-expect-error
@external('console', 'log')
export declare function logf32(n: f32): void

// @ts-expect-error
@external('console', 'log')
export declare function logf64(n: f64): void

// @ts-expect-error
@external('console', 'logstr')
export declare function logstr(s: string): void
