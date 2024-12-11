export function asc(a: number | string | bigint, b: number | string | bigint): -1 | 0 | 1 {
	return a < b ? -1 : a > b ? 1 : 0;
}

export function desc(a: number | string | bigint, b: number | string | bigint): -1 | 0 | 1 {
	return a > b ? -1 : a < b ? 1 : 0;
}
