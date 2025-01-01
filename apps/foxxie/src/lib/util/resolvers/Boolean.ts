import { Resolvers, Result } from '@sapphire/framework';
import { filterNullishOrEmpty } from '@sapphire/utilities';
import { getT, LanguageKeys, SupportedLanguages } from '#lib/i18n';
import { FTFunction } from '#lib/types';

let defaultFalseValues: null | string[] = null;
let defaultTruthValues: null | string[] = null;

export function resolveBoolean(parameter: string, t: FTFunction = getT(SupportedLanguages.EnglishUnitedStates)) {
	let truths = t(LanguageKeys.Arguments.BooleanTruths).filter(filterNullishOrEmpty);
	let falses = t(LanguageKeys.Arguments.BooleanFalses).filter(filterNullishOrEmpty);

	if (!truths.length) truths = getDefaultTruthValues();
	if (!falses.length) falses = getDefaultFalseValues();

	const result = Resolvers.resolveBoolean(parameter, { falses, truths });
	if (result.isErr()) return Result.err(result.unwrapErr());
	return Result.ok(result.unwrap());
}

function getDefaultFalseValues() {
	return (defaultFalseValues ??= getT()(LanguageKeys.Arguments.BooleanFalses).filter(filterNullishOrEmpty));
}

function getDefaultTruthValues() {
	return (defaultTruthValues ??= getT()(LanguageKeys.Arguments.BooleanTruths).filter(filterNullishOrEmpty));
}
