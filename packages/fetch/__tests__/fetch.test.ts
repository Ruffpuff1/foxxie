import { fetch, HttpMethodEnum } from '../dist';
import nock from 'nock';

describe('fetch', () => {
    let nockScopeHttp: nock.Scope;
    let nockScopeHttps: nock.Scope;

    beforeAll(() => {
        nockScopeHttp = nock('http://localhost')
            .persist()
            .get('/simpleget')
            .times(Infinity)
            .reply(200, { test: true })
            .get('/404')
            .times(Infinity)
            .reply(404, { success: false });

        nockScopeHttps = nock('https://localhost') //
            .persist()
            .get('/simpleget')
            .times(Infinity)
            .reply(200, { test: true });
    });

    afterAll(() => {
        nockScopeHttp.persist(false);
        nockScopeHttps.persist(false);
        nock.restore();
    });

    describe('Successful fetch', () => {
        test('GIVEN fetch w/ JSON response THEN returns JSON', async () => {
            const result = await fetch('http://localhost/simpleget', HttpMethodEnum.Get) //
                .json<{ test: boolean }>();

            expect(result.test).toBe(true);
        });
    });
});
