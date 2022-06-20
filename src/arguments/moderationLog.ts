import { LanguageKeys } from '#lib/i18n';
import { Argument, ArgumentContext, UserError } from '@sapphire/framework';
import type { Result } from 'lexure';
import { getModeration } from '#utils/Discord';

export default class UserArgument extends Argument<number> {
    public async run(parameter: string, context: ArgumentContext): Promise<Result<number, UserError>> {
        const latest = context.args.t(LanguageKeys.Arguments.Latest);
        if (parameter.toLowerCase() === latest) {
            const id = await getModeration(context.message.guild!).getCurrentId();
            if (id === 0) return this.error({ parameter, identifier: LanguageKeys.Arguments.ModerationLogNone })

            return this.ok(id);
        }

        return this.container.stores.get('arguments').get('integer')!.run(parameter, context) as Result<number, UserError>;
    }
}
