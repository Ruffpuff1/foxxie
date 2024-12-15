import { LanguageKeys } from '../lib/i18n';
import { Argument, ArgumentContext, UserError } from '@sapphire/framework';
import type { Result } from 'lexure';

export class UserArgument extends Argument<boolean> {
    public async run(parameter: string, context: ArgumentContext): Promise<Result<boolean, UserError>> {
        const truths = context.args.t(LanguageKeys.Arguments.BooleanTruths);
        const falses = context.args.t(LanguageKeys.Arguments.BooleanFalses);

        if (truths.includes(parameter)) return this.ok(true);
        if (falses.includes(parameter)) return this.ok(false);

        return this.error({
            parameter,
            identifier: LanguageKeys.Arguments.Boolean,
            context
        });
    }
}
