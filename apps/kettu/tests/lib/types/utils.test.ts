import { FT, T } from '#types/utils';

describe('t function wrapper', () => {
    test('WHEN given a string return the same string', () => {
        const TValue = T('globals:example');
        const FTValue = FT('globals:example');

        expect(TValue).toEqual('globals:example');
        expect(FTValue).toEqual('globals:example');
    });
});
