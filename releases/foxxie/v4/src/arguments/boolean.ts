import { languageKeys } from '../lib/i18n';
import { Argument, ArgumentContext, UserError } from '@sapphire/framework';
import type { Result } from 'lexure';

export default class extends Argument<boolean> {

    public async run(parameter: string, context: ArgumentContext): Promise<Result<boolean, UserError>> {
        const truths = context.args.t(languageKeys.arguments.booleanTruths);
        const falses = context.args.t(languageKeys.arguments.booleanFalses);

        if (truths.includes(parameter)) return this.ok(true);
        if (falses.includes(parameter)) return this.ok(false);

        return this.error({ parameter, identifier: languageKeys.arguments.invalidBoolean, context });
    }

}