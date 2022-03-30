import { LanguageKeys, translate } from '#lib/i18n';
import { Identifiers } from '@sapphire/framework';

describe('translate', () => {
    test('GIVEN identifier THEN returns languageKey', () => {
        expect(translate(Identifiers.PreconditionClientPermissions)).toBe(LanguageKeys.Preconditions.ClientPermissions);
    });
});
