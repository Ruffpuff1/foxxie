import { duration } from '../../src';

describe('enUS casual', () => {
    test('WHEN given a string resolve it to a duration', () => {
        const str = 'this evening';
        const result = duration(str);

        expect(typeof result).toBe('number');
    });

    test('WHEN given a string and mode resolve it to a duration', () => {
        const str = 'midnight';
        const result = duration(str, { mode: 'casual' });

        expect(typeof result).toBe('number');
    });

    test('WHEN given a string and mode resolve it to a duration', () => {
        const morning = 'this morning';
        const morningResult = duration(morning, { mode: 'casual' });

        const afternoon = 'this afternoon';
        const afternoonResult = duration(afternoon, { mode: 'casual' });

        const noon = 'noon';
        const noonResult = duration(noon, { mode: 'casual' });

        expect(typeof morningResult).toBe('number');
        expect(typeof afternoonResult).toBe('number');
        expect(typeof noonResult).toBe('number');
    });

    test('WHEN unsuccessfully parsing a value, return null', () => {
        const str = 'yestermorning';

        const resultMode = duration(str, { mode: 'casual' });
        const result = duration(str);

        expect(resultMode).toBeNull();
        expect(result).toBeNull();
    });
});
