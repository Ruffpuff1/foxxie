import { resolveColorArgument } from '../../../src/lib/util/resolvers';
import type { CommandInteraction } from 'discord.js';
import i18next from 'i18next';

const mockInteraction = {
    user: {
        avatarURL: () => 'https://cdn.ruffpuff.dev/ruffpuff.jpg'
    }
} as CommandInteraction;

describe('resolvers', () => {
    test('WHEN given a color, resolve it to a color instance', async () => {
        const parsed = await resolveColorArgument('blue', i18next.t, mockInteraction);

        // null check
        expect(parsed).not.toBe(null);
        // hex string
        expect(parsed.toHexString()).toEqual('#0000ff');

        const parsedDominant = await resolveColorArgument('dominant', i18next.t, mockInteraction);
        // dominant hex
        expect(parsedDominant.toHexString()).toEqual('#000000');
    });
});
