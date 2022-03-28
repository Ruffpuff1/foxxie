import { fetch, HttpMethodEnum } from '../src';
import nock from 'nock';
import { seconds } from '@ruffpuff/utilities';

describe('fetch', () => {
    let nockScopeHttps: nock.Scope;

    const errorStatusMessage = "Couldn't access file: The resource was not found";

    beforeAll(() => {
        nockScopeHttps = nock('https://cdn.ruffpuff.dev') //
            .persist()
            .get('/api')
            .times(Infinity)
            .reply(200, { test: true });
    });

    afterAll(() => {
        nockScopeHttps.persist(false);
        nock.restore();
    });

    describe('Http methods', () => {
        test('GIVEN an HttpMethodEnum.options, expect the method to be equal OPTIONS', () => {
            expect(HttpMethodEnum.Options).toBe('OPTIONS');
        });

        test('GIVEN an HttpMethodEnum.delete, expect the method to be equal DELETE', () => {
            expect(HttpMethodEnum.Delete).toBe('DELETE');
        });

        test('GIVEN an HttpMethodEnum.get, expect the method to be equal GET', () => {
            expect(HttpMethodEnum.Get).toBe('GET');
        });

        test('GIVEN an HttpMethodEnum.post, expect the method to be equal POST', () => {
            expect(HttpMethodEnum.Post).toBe('POST');
        });

        test('GIVEN an HttpMethodEnum.patch, expect the method to be equal PATCH', () => {
            expect(HttpMethodEnum.Patch).toBe('PATCH');
        });
    });

    describe('Error fetch', () => {
        test('GIVEN fetch w/ JSON response THEN returns JSON', async () => {
            const result = await fetch('https://cdn.ruffpuff.dev/api', HttpMethodEnum.Get) //
                .json<{ data: string }>();

            expect(result.data).toBe(errorStatusMessage);
        });
    });

    describe('Successful fetches', () => {
        test('GIVEN raw fetch for an image, return buffer', async () => {
            const result = await fetch('https://cdn.ruffpuff.dev/ruffpuff.jpg').raw();

            expect(result).toBeInstanceOf(Buffer);
        });

        test('GIVEN fetch for text, return a STRING', async () => {
            const result = await fetch('https://cdn.ruffpuff.dev').text();

            expect(typeof result).toBe('string');
        });

        describe('Fetches without content headers', () => {
            test('GIVEN fetch with json body EXPECT "sendDataAs" to be json', () => {
                const query = fetch('https://cdn.ruffpuff.dev') //
                    .body(
                        {
                            test: 'test'
                        },
                        'json'
                    );

                expect(query.sendDataAs).toBe('json');
            });
        });
    });

    describe('Fetching different methods', () => {
        test('GIVEN fetch with get method EXPECT method to be get', () => {
            const query = fetch('http://localhost').get();

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(query.httpMethod).toBe(HttpMethodEnum.Get);
        });

        test('GIVEN fetch with post method EXPECT method to be post', () => {
            const query = fetch('http://localhost').post();

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(query.httpMethod).toBe(HttpMethodEnum.Post);
        });

        test('GIVEN fetch with patch method EXPECT method to be patch', () => {
            const query = fetch('http://localhost').patch();

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(query.httpMethod).toBe(HttpMethodEnum.Patch);
        });

        test('GIVEN fetch with put method EXPECT method to be put', () => {
            const query = fetch('http://localhost').put();

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(query.httpMethod).toBe(HttpMethodEnum.Put);
        });

        test('GIVEN fetch with delete method EXPECT method to be delete', () => {
            const query = fetch('http://localhost').delete();

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(query.httpMethod).toBe(HttpMethodEnum.Delete);
        });
    });

    describe('Using various methods to edit the fetch', () => {
        test('WHEN using timeout method with fetch, add the timeout', () => {
            const query = fetch('http://localhost').timeout(seconds(10));

            expect(query.timeoutDuration).toBe(seconds(10));
        });

        test('WHEN using agent method with fetch, add the user agent', () => {
            const query = fetch('http://localhost').agent('agent');

            expect(query.ua).toBe('agent');
        });

        test('When using an object of headers, apply all headers to the request', () => {
            const query = fetch('http://localhost') //
                .header({
                    header1: 'h1',
                    header2: 'h2'
                });

            expect(Reflect.get(query.reqHeaders, 'header1')).toBe('h1');
        });

        test('When using auth method, apply auth to the request', () => {
            const query = fetch('http://localhost') //
                .auth('token');

            expect(Reflect.get(query.reqHeaders, 'authorization')).toBe('Bearer token');
        });

        describe('The follow method.', () => {
            test('Using follow with true value EXPECT redirects to be 20', () => {
                const query = fetch('http://localhost') //
                    .follow(true);

                expect(query.redirects).toBe(20);
            });

            test('Using follow with false value EXPECT redirects to be 0', () => {
                const query = fetch('http://localhost') //
                    .follow(false);

                expect(query.redirects).toBe(0);
            });

            test('Using follow with number value EXPECT redirects to be the number', () => {
                const query = fetch('http://localhost') //
                    .follow(5);

                expect(query.redirects).toBe(5);
            });
        });
    });
});
