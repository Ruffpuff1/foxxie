import { LanguageKeys } from '#lib/i18n';
import type { FoxxieCommand } from '#lib/structures';
import { cast } from '@ruffpuff/utilities';
import { Argument, ArgumentContext, ArgumentResult } from '@sapphire/framework';

export default class UserArgument extends Argument<FoxxieCommand> {
    public async run(parameter: string, context: ArgumentContext): Promise<ArgumentResult<FoxxieCommand>> {
        const resolved = cast<FoxxieCommand>(this.container.stores.get('commands').get(parameter.toLowerCase()));
        if (resolved) return this.ok(resolved);

        return this.error({ parameter, identifier: LanguageKeys.Arguments.Command, context });
    }
}
