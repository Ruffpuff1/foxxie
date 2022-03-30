import { getLocale } from '#utils/decorators';
import type { CommandInteraction } from 'discord.js';

describe('decorator functions', () => {
    test('WHEN given an interaction with a locale, return the locale T function', () => {
        const t = getLocale({ locale: 'en-US' } as CommandInteraction);
        expect(t.lng).toEqual('en-US');
    });
});
