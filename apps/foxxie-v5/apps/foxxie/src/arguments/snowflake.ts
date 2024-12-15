import { LanguageKeys } from '../lib/i18n';
import { Argument, ArgumentContext, ArgumentResult } from '@sapphire/framework';
import type { Snowflake } from 'discord.js';
import { idToTimestamp } from '#utils/util';

export class UserArgument extends Argument<Snowflake> {
    /**
     * The validator, requiring all numbers and 17 to 19 digits (future-proof).
     */
    private readonly regExp = /^\d{17,19}$/;

    /**
     * Stanislav's join day, known as the oldest user in Discord, and practically
     * the lowest snowflake we can get (as they're bound by the creation date).
     */
    private readonly minimum = new Date(2015, 1, 28).getTime();

    public run(parameter: string, context: ArgumentContext): ArgumentResult<string> {
        if (this.regExp.test(parameter)) {
            const timestamp = idToTimestamp(parameter)!;
            if (timestamp >= this.minimum && timestamp < Date.now()) return this.ok(parameter);
        }
        return this.error({
            parameter,
            identifier: LanguageKeys.Arguments.Snowflake,
            context
        });
    }
}
