import { Identifiers } from "@sapphire/framework";
import { translate, LanguageKeys } from "../../../src/lib/i18n";

describe('translate', () => {
    test('GIVEN argument identifier THEN returns arguments:{identifier}', () => {
        expect(translate(Identifiers.PreconditionClientPermissions)).toBe(LanguageKeys.Preconditions.ClientPermissions)
    })
})