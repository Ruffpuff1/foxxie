import { Argument, ArgumentContext, Identifiers, Result, UserError } from '@sapphire/framework';
import { getModeration } from '#utils/Discord';
import { LanguageKeys } from '#lib/i18n';

const minimum = 0;
const maximum = 2_147_483_647;

export class UserArgument extends Argument<number> {
    public async run(parameter: string, context: ArgumentContext): Promise<Result<number, UserError>> {
        const latest = context.args.t(LanguageKeys.Arguments.ModerationEntryLatest);
        if (latest.includes(parameter)) {
            const size = await getModeration(context.message.guild!).getCurrentId();
            if (size === 0) return this.error({ parameter, identifier: LanguageKeys.Arguments.ModerationEntryNone, context });
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
