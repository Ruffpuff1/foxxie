import { LanguageKeys } from '#lib/i18n';
import { Argument, ArgumentContext, UserError } from '@sapphire/framework';
import type { Result } from 'lexure';
import type { LanguageString } from '#lib/types';

export class UserArgument extends Argument<LanguageString> {
    public async run(parameter: string, context: ArgumentContext): Promise<Result<LanguageString, UserError>> {
        const { languages } = this.container.i18n;
        if (languages.has(parameter)) return this.ok(parameter as LanguageString);
        return this.error({
            parameter,
            identifier: LanguageKeys.Arguments.Language,
            context: { ...context, list: [...languages.keys()] }
        });
    }
}
