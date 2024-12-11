import type { LocaleString } from 'discord.js';

import { Argument } from '@sapphire/framework';
import { LanguageKeys } from '#lib/i18n';

export class UserArgument extends Argument<LocaleString> {
	public run(parameter: string, context: Argument.Context) {
		const { languages } = this.container.i18n;
		if (languages.has(parameter)) return this.ok(parameter as LocaleString);
		return this.error({ context: { ...context, possibles: [...languages.keys()] }, identifier: LanguageKeys.Arguments.Language, parameter });
	}
}
