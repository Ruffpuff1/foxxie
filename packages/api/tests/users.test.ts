import { api, PronounEnum, RESTJSONErrorCodes } from '../src';

describe('/users endpoint', () => {
    jest.setTimeout(20000);

    test('WHEN fetching users endpoint with user, return user object', async () => {
        const result = await api() //
            .users('486396074282450946')
            .get();

        expect(result.userId).toBe('486396074282450946');
    });

    test('WHEN fetching user with bans, return array of user ban objects', async () => {
        const result = await api() //
            .users('682357166799323136')
            .bans //
            .get();

        const first = result.bans[0];
        expect(typeof first.reason).toBe('string');
    });

    test('WHEN fetching user with no bans, return empty array', async () => {
        const result = await api() //
            .users('486396074282450946')
            .bans //
            .get();

        const { length } = result.bans;
        expect(length).toBe(0);
    });

    test("WHEN fetching user with pronouns, return user's pronoun object", async () => {
        const result = await api() //
            .users('486396074282450946')
            .pronouns //
            .get();

        expect(result.pronouns).toBe(PronounEnum.HeThey);
    });

    test('WHEN posting a user that already exists, return error object', async () => {
        const result = await api() //
            .users('486396074282450946')
            .post({
                pronouns: 0
            });

        expect(Reflect.get(result, 'code')).toBe(RESTJSONErrorCodes.UserAlreadyExists);
    });

    test('WHEN fetching user, include attributes', async () => {
        const result = await api() //
            .users('486396074282450946')
            .get();

        console.log(result);

        expect(result.attributes.email).toBe('mail@ruffpuff.dev');
    });
});
