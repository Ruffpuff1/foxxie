import { Argument, ArgumentContext, Identifiers, Result, UserError } from '@sapphire/framework';
import { languageKeys } from '../lib/i18n';

const minimum = 0;
const maximum = 2_147_483_647;

export class UserArgument extends Argument<number> {

    public async run(parameter: string, context: ArgumentContext): Promise<Result<number, UserError>> {
        const latest = context.args.t(languageKeys.arguments.moderationEntryLatest);
        if (latest.includes(parameter)) {
            const size = await this.container.db.moderations.find({ guildId: context.message.guildId }).then(result => result.length);
            if (size === 0) return this.error({ parameter, identifier: languageKeys.arguments.invalidModerationEntries, context });
            return this.ok(size);
        }

        const parsed = Number(parameter);
        if (!Number.isInteger(parsed)) {
            return this.error({ parameter, identifier: Identifiers.ArgumentIntegerError, context: { ...context, minimum, maximum } });
        }

        if (parsed < minimum) {
            return this.error({ parameter, identifier: Identifiers.ArgumentIntegerTooSmall, context: { ...context, minimum, maximum } });
        }

        if (parsed > maximum) {
            return this.error({ parameter, identifier: Identifiers.ArgumentIntegerTooLarge, context: { ...context, minimum, maximum } });
        }

        return this.ok(parsed);
    }

}