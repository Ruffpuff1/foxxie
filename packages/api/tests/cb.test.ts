import { cb, EndpointsEnum, FoxxieApiError } from '../src';

jest.setTimeout(10000);

describe('testing callback wrappers', () => {
    test('EXPECT array of partial users', async () => {
        const result = await cb<EndpointsEnum.GetUsers>(api => api.users.get());
        const first = result.users[0];

        expect(typeof first.userId).toBe('string');
    });

    test('EXPECT return of FoxxieApiError', async () => {
        try {
            await cb<EndpointsEnum.GetUsersUser>(api => api.users('e').get());
        } catch (e) {
            expect(e).toBeInstanceOf(FoxxieApiError);
        }
    });
});
