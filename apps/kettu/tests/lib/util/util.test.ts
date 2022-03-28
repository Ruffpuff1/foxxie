import { formatAuthor, getGuildIds } from '../../../src/lib/util/util';
import { userData } from '../../mocks/instances';

describe('Util tests', () => {
    test('WHEN given an APIUser, return formatted user title', () => {
        const formatted = formatAuthor(userData);
        const expected = 'Ruffpuff#0017 [486396074282450946]';

        expect(formatted).toEqual(expected);
    });

    test('WHEN fetching guildIds, RETURN an empty array', () => {
        const ids = getGuildIds();
        expect(ids).toStrictEqual([]);
    });
});
