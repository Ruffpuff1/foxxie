import { EnvParse } from '../dist';

process.env.STRING = 'string';
process.env.INT = '17';
process.env.BOOL = 'true';
process.env.ARRAY = 'one two three';
process.env.EXISTS = 'value';
process.env.NOTEXIST = '';

describe('env utils', () => {
    const envParse = new EnvParse();

    describe('string parsing', () => {
        test('GIVEN a string key, allow it to be resolved to a string', () => {
            const value = envParse.string('STRING');
            expect(value).toBe('string');
        });

        test('GIVEN an invalid string key, throws error', () => {
            // @ts-expect-error
            expect(() => envParse.string('STRONG')).toThrowError();
        });
    });
});

declare module '../dist' {
    interface Env {
        STRING: string;
    }
}
