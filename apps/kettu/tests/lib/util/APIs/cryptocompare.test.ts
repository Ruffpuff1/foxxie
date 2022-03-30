import { cryptoCompare } from '#utils/APIs';

describe('cryptocompare', () => {
    test('WHEN fetching return error', async () => {
        const result = await cryptoCompare('USD', 'test');

        expect(result.Response).toEqual('Error');
    });
});
