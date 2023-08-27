import { LanguageKeys } from '#lib/i18n';
import { Argument, ArgumentContext, UserError } from '@sapphire/framework';
import type { FoxxieCommand } from '#lib/structures';
import type { Result } from 'lexure';
import { cast } from '@ruffpuff/utilities';

export default class UserArgument extends Argument<FoxxieCommand> {
    public async run(parameter: string, context: ArgumentContext): Promise<Result<FoxxieCommand, UserError>> {
        const resolved = cast<FoxxieCommand>(this.container.stores.get('commands').get(parameter.toLowerCase()));
        if (resolved) return this.ok(resolved);

        return this.error({ parameter, identifier: LanguageKeys.Arguments.Command, context });
    }
}
