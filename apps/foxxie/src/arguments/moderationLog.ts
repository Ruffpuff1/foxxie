import { LanguageKeys } from '#lib/i18n';
import { getModeration } from '#utils/Discord';
import { Argument, ArgumentContext, ArgumentResult } from '@sapphire/framework';

export default class UserArgument extends Argument<number> {
    public async run(parameter: string, context: ArgumentContext): Promise<ArgumentResult<number>> {
        const latest = context.args.t(LanguageKeys.Arguments.Latest);
        if (parameter.toLowerCase() === latest) {
            const id = await getModeration(context.message.guild!).getCurrentId(context.message.guildId);
            if (id === 0) return this.error({ parameter, identifier: LanguageKeys.Arguments.ModerationLogNone });

            return this.ok(id);
        }

        return this.container.stores.get('arguments').get('integer')!.run(parameter, context) as Promise<ArgumentResult<number>>;
    }
}
