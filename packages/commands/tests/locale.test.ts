import { Iso6391Enum } from '@foxxie/i18n-codes';
import type { CommandInteraction } from 'discord.js';
import { getLocaleString } from '../src';

const mockInteractionEnUS = {
    locale: 'en-US'
} as CommandInteraction;

const mockInteractionEsES = {
    locale: 'es-ES'
} as CommandInteraction;

const mockInteractionJaJP = {
    locale: 'ja'
} as CommandInteraction;

const mockInteractionFrFR = {
    locale: 'fr'
} as CommandInteraction;

describe('testing locale string parsing', () => {
    test('WHEN GIVEN interaction with en-US locale, return en-US', () => {
        const value = getLocaleString(mockInteractionEnUS);
        const expected = Iso6391Enum.EnglishUnitedStates;

        expect(value).toEqual(expected);
    });

    test('WHEN GIVEN interaction with es-ES locale, return es-MX', () => {
        const value = getLocaleString(mockInteractionEsES);
        const expected = Iso6391Enum.SpanishMexico;

        expect(value).toEqual(expected);
    });

    test('WHEN GIVEN interaction with ja locale, return ja-JP', () => {
        const value = getLocaleString(mockInteractionJaJP);
        const expected = 'ja-JP';

        expect(value).toEqual(expected);
    });

    test('WHEN GIVEN interaction with fr locale, return fr-FR', () => {
        const value = getLocaleString(mockInteractionFrFR);
        const expected = Iso6391Enum.FrenchFrance;

        expect(value).toEqual(expected);
    });
});
