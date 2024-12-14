import { envParseString } from '@skyra/env-utilities';
import { EnvKeys } from '#lib/types';
import { request } from 'undici';

import { Call, LastFmApiReturnType } from '../types/Calls.js';
import { ResponseStatus } from '../types/ResponseStatus.js';
import { Response } from '../util/Response.js';

export class LastfmApi {
	private readonly _apiKey: string;
	private apiUrl: string = 'http://ws.audioscrobbler.com/2.0/';

	public constructor() {
		this._apiKey = envParseString(EnvKeys.LastFmToken);
	}

	public async callApi<M extends Call>(parameters: Record<string, string | undefined>, call: M): Promise<Response<LastFmApiReturnType<M>>> {
		const queryParams = {
			api_key: this._apiKey,
			format: 'json',
			method: call,
			...parameters
		};

		const url = new URL(this.apiUrl);
		const headers = {
			'User-Agent': '@foxxie/10.0.0'
		};

		Object.keys(queryParams).forEach((k) => {
			url.searchParams.append(k, (queryParams as Record<string, string>)[k]);
		});

		const httpResponse = await request(url, { body: null, headers, method: 'GET' });

		if (httpResponse.statusCode === 404) {
			return new Response({ error: ResponseStatus.MissingParameters, message: 'Not found', success: false });
		}

		const content = (await httpResponse.body.json()) as LastFmApiReturnType<M>;

		return new Response<LastFmApiReturnType<M>>({ content, success: true });
	}
}
