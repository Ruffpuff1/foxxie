import { cast } from '@ruffpuff/utilities';
import { Argument, ArgumentContext, ArgumentResult } from '@sapphire/framework';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';

export default class UserArgument extends Argument<FoxxieCommand> {
	public run(parameter: string, context: ArgumentContext): ArgumentResult<FoxxieCommand> {
		const resolved = cast<FoxxieCommand>(this.container.stores.get('commands').get(parameter.toLowerCase()));
		if (resolved) return this.ok(resolved);

		return this.error({ context, identifier: LanguageKeys.Arguments.Command, parameter });
	}
}
