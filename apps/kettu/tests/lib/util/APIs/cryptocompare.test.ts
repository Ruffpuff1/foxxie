import { cryptoCompare } from '../../../../src/lib/util/APIs';

describe('cryptocompare', () => {
    test('WHEN fetching return error', async () => {
        const result = await cryptoCompare('USD', 'test');

        expect(result.Response).toEqual('Error');
    });
});
