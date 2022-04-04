import { enUS } from '../../src';

describe('enUS month name parser', () => {
    test('WHEN testing for a duration, resolve duration', () => {
        const str = 'august next year';
        const result = enUS.duration(str);

        expect(typeof result).toBe('number');
    });

    test('WHEN testing for a duration with mode, resolve duration', () => {
        const str = 'august next year';
        const result = enUS.duration(str, { mode: 'monthName' });

        expect(typeof result).toBe('number');
    });
});
