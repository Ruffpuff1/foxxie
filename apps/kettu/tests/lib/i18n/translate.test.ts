import { LanguageKeys, translate } from '../../../src/lib/i18n';
import { Identifiers } from '@sapphire/framework';

describe('translate', () => {
    test('GIVEN identifier THEN returns languageKey', () => {
        expect(translate(Identifiers.PreconditionClientPermissions)).toBe(LanguageKeys.Preconditions.ClientPermissions);
    });
});
