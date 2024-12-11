import { isNullishOrEmpty } from '@sapphire/utilities';

export function maybeParseDate(value: null | string | undefined): null | number {
	if (isNullishOrEmpty(value)) return null;
	return Date.parse(value);
}

export function maybeParseNumber(value: bigint | null | string | undefined): null | number {
	if (isNullishOrEmpty(value)) return null;
	return Number(value);
}
