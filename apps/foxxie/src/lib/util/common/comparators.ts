export function asc(a: bigint | number | string, b: bigint | number | string): -1 | 0 | 1 {
	return a < b ? -1 : a > b ? 1 : 0;
}

export function desc(a: bigint | number | string, b: bigint | number | string): -1 | 0 | 1 {
	return a > b ? -1 : a < b ? 1 : 0;
}
