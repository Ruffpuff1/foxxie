import { LanguageKeys } from '#lib/i18n';
import type { LanguageString } from '#lib/types';
import { cast } from '@ruffpuff/utilities';
import { Argument, ArgumentContext, UserError } from '@sapphire/framework';
import i18next from 'i18next';
import type { Result } from 'lexure';

export class UserArgument extends Argument<LanguageString> {
    public async run(parameter: string, context: ArgumentContext): Promise<Result<LanguageString, UserError>> {
        const { preload } = i18next.options;
        if (cast<string[]>(preload).includes(parameter)) return this.ok(cast<LanguageString>(parameter));

        return this.error({
            parameter,
            identifier: LanguageKeys.Arguments.Language,
            context: { ...context, list: preload }
        });
    }
}
