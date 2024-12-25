import { Result } from '@sapphire/result';
import { Duration } from '@sapphire/time-utilities';
import { LanguageKeys } from '#lib/i18n';
import { seconds } from '#utils/common';

export interface TimeSpanOptions {
	maximum?: number;
	minimum?: number;
}

export function resolveTimeSpan(parameter: string, options?: TimeSpanOptions) {
	const duration = parse(parameter);

	if (!Number.isSafeInteger(duration)) {
		return Result.err(LanguageKeys.Arguments.TimespanTooLarge);
	}

	if (typeof options?.minimum === 'number' && duration < options.minimum) {
		return Result.err(LanguageKeys.Arguments.TimespanTooSmall);
	}

	if (typeof options?.maximum === 'number' && duration > options.maximum) {
		return Result.err(LanguageKeys.Arguments.TimespanTooLarge);
	}

	return Result.ok(duration);
}

function parse(parameter: string) {
	const number = Number(parameter);
	if (!Number.isNaN(number)) return seconds(number);

	const duration = new Duration(parameter).offset;
	if (!Number.isNaN(duration)) return duration;

	const date = Date.parse(parameter);
	if (!Number.isNaN(date)) return date - Date.now();

	return NaN;
}
