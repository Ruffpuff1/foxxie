import { LanguageKeys } from '#lib/I18n';
import { cast } from '@ruffpuff/utilities';
import { Argument, ArgumentContext, ArgumentResult } from '@sapphire/framework';

export default class UserArgument extends Argument<number> {
    public async run(parameter: string, context: ArgumentContext): Promise<ArgumentResult<number>> {
        const latest = context.args.t(LanguageKeys.Arguments.Latest);
        if (parameter.toLowerCase() === latest) {
            const id = await this.container.utilities.guild(context.message.guild!).moderation.getCurrentId();
            if (id === 0) return this.error({ parameter, identifier: LanguageKeys.Arguments.ModerationLogNone });

            return this.ok(id);
        }

        return cast<Promise<ArgumentResult<number>>>(
            this.container.stores.get('arguments').get('integer')!.run(parameter, context)
        );
    }
}
