import { LanguageKeys } from '#lib/i18n';
import { Argument, ArgumentContext, UserError } from '@sapphire/framework';
import type { Result } from 'lexure';
import type { LanguageString } from '#lib/types';
import i18next from 'i18next';
import { cast } from '@ruffpuff/utilities';

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
