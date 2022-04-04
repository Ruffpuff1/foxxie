import { api } from '../src';

describe('router', () => {
    test('WHEN querying api and using .toString, RETURN path', () => {
        const string = api() //
            .users('486396074282450946')
            .bans //
            .toString();

        expect(string).toBe('/users/486396074282450946/bans');
    });
});
