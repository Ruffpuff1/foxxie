export function isNullOrUndefined(value: unknown): boolean {
    return value === null || value === undefined;
}

export function isNullishOrEmpty(value: unknown): boolean {
    return value === '' || isNullOrUndefined(value);
}

export function isNullishOrZero(value: unknown): boolean {
    return value === 0 || isNullOrUndefined(value);
}