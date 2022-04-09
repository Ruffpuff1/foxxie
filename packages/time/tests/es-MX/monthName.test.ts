import { esMX } from '../../src';

describe('esMX month name parser', () => {
    test('WHEN testing for a time, resolve time', () => {
        const str = 'marzo';
        const result = esMX.monthName(str);

        expect(result!.time).toBeInstanceOf(Date);
    });

    test('WHEN testing for a duration, resolve duration', () => {
        const str = 'marzo';
        const result = esMX.monthName(str);

        expect(typeof result!.duration).toBe('number');
    });
});
