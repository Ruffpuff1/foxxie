import { Result } from '@sapphire/result';
import { LanguageKeys } from '#lib/i18n';
import { FTFunction } from '#lib/types';

import { getDateFormat, monthOfYearContainsDay, yearIsLeap } from './util.js';

export function resolveBirthday(parameter: string, t: FTFunction) {
	const format = t(LanguageKeys.Globals.DateFormat);
	const regex = getDateFormat(format, 'en-US');
	const result = regex.exec(parameter);

	if (result === null) {
		return Result.err({
			context: { formatWithYear: format },
			identifier: LanguageKeys.Arguments.Birthday
		});
	}

	const year = result.groups!.year === undefined ? null : Number(result.groups!.year);
	if (year !== null && (year < 1908 || year > new Date().getUTCFullYear())) {
		const msg = year < 1908 ? t(LanguageKeys.Arguments.BirthdayYearPast) : t(LanguageKeys.Arguments.BirthdayYearFuture);

		return Result.err({
			context: { msg, year },
			identifier: LanguageKeys.Arguments.BirthdayYear
		});
	}

	const month = Number(result.groups!.month);
	if (month <= 0 || month > 12) {
		return Result.err({
			context: { month },
			identifier: LanguageKeys.Arguments.BirthdayMonth
		});
	}

	const day = Number(result.groups!.day);
	if (day <= 0 || !monthOfYearContainsDay(year === null ? true : yearIsLeap(year), month, day)) {
		const monthKey = t(LanguageKeys.Arguments.BirthdayMonths)[month - 1];
		return Result.err({
			context: { day, monthKey },
			identifier: LanguageKeys.Arguments.BirthdayDay
		});
	}

	return Result.ok({ day, month, year });
}
