import { seconds } from '@ruffpuff/utilities';
import { Argument, ArgumentContext, Result, UserError } from '@sapphire/framework';
import { Duration } from '@sapphire/time-utilities';
import { LanguageKeys } from '#lib/i18n';

export class UserArgument extends Argument<number> {
    public async run(parameter: string, context: ArgumentContext): Promise<Result<number, UserError>> {
        const duration = this.parseParameter(parameter);

        if (!Number.isSafeInteger(duration)) {
            return this.error({
                parameter,
                identifier: LanguageKeys.Arguments.Duration,
                context
            });
        }

        if (typeof context.minimum === 'number' && duration < context.minimum) {
            return this.error({
                parameter,
                identifier: LanguageKeys.Arguments.TimespanTooSmall,
                context: { ...context, remaining: context.minimum }
            });
        }

        if (typeof context.maximum === 'number' && duration > context.maximum) {
            return this.error({
                parameter,
                identifier: LanguageKeys.Arguments.TimespanTooLarge,
                context: { ...context, remaining: context.maximum }
            });
        }

        return this.ok(duration);
    }

    private parseParameter(parameter: string): number {
        const number = Number(parameter);
        if (!Number.isNaN(number)) return seconds(number);

        const duration = new Duration(parameter).offset;
        if (!Number.isNaN(duration)) return duration;

        const date = Date.parse(parameter);
        if (!Number.isNaN(date)) return date - Date.now();

        return NaN;
    }
}
