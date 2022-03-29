import { sanitize } from '../src';

describe('sanitize', () => {
    test('WHEN given a string clean it', () => {
        const str = 'óńé';
        const expected = 'one';

        expect(sanitize(str)).toEqual(expected);
    });

    test('WHEN given a string with @ symbol clean it', () => {
        const str = '@śś';
        const expected = 'ass';

        expect(sanitize(str)).toEqual(expected);
    });
});
