import { StatuspageClient } from '../src';

describe('Statuspage', () => {
    test('Successfully contruct Statuspage', () => {
        const client = new StatuspageClient();
        expect(client).toBeInstanceOf(StatuspageClient);
    });

    test('FETCH incidents THEN return array', async () => {
        const client = new StatuspageClient();
        const result = await client.incidents();
        console.log(result);
        expect(Array.isArray(result)).toBe(true);
    });

    test('FETCH incidents THEN return result', async () => {
        const client = new StatuspageClient();
        const result = await client.status();
        console.log(result);
        expect(result).not.toBe(null);
    });
});
