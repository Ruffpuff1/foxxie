import { Argument, Resolvers } from '@sapphire/framework';
import { filterNullishOrEmpty } from '@sapphire/utilities';
import { getT, LanguageKeys } from '#lib/i18n';

export class CoreArgument extends Argument<boolean> {
	private defaultFalseValues: null | string[] = null;
	private defaultTruthValues: null | string[] = null;

	public run(parameter: string, context: Argument.Context) {
		let truths = context.args.t(LanguageKeys.Arguments.BooleanTruths).filter(filterNullishOrEmpty);
		let falses = context.args.t(LanguageKeys.Arguments.BooleanFalses).filter(filterNullishOrEmpty);

		if (!truths.length) truths = this.getDefaultTruthValues;
		if (!falses.length) falses = this.getDefaultFalseValues;

		return Resolvers.resolveBoolean(parameter, { falses, truths }) //
			.mapErrInto((identifier) => this.error({ context, identifier, parameter }));
	}

	private get getDefaultFalseValues() {
		return (this.defaultFalseValues ??= getT()(LanguageKeys.Arguments.BooleanFalses).filter(filterNullishOrEmpty));
	}

	private get getDefaultTruthValues() {
		return (this.defaultTruthValues ??= getT()(LanguageKeys.Arguments.BooleanTruths).filter(filterNullishOrEmpty));
	}
}
