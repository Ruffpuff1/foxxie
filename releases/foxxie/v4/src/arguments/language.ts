import { languageKeys } from '../lib/i18n';
import { Argument, ArgumentContext, UserError } from '@sapphire/framework';
import type { Result } from 'lexure';
import type { Language } from '../lib/types/Augments';

export default class extends Argument<Language> {

    public async run(parameter: string, context: ArgumentContext): Promise<Result<Language, UserError>> {
        const { languages } = this.container.i18n;
        if (languages.has(parameter)) return this.ok(parameter as Language);
        return this.error({ parameter, identifier: languageKeys.arguments.invalidLanguage, context: { ...context, list: [...languages.keys()] } });
    }

}