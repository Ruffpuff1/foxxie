import { envParseString } from '@skyra/env-utilities';
import { EnvKeys } from '#lib/types';
import { createHash } from 'node:crypto';
import { request } from 'undici';

import { Call, LastFmApiReturnType } from '../types/Calls.js';
import { ResponseStatus } from '../types/ResponseStatus.js';
import { Response } from '../util/Response.js';

export class LastfmApi {
	private readonly _apiKey: string;
	private readonly _apiSecret: string;
	private apiUrl: string = 'http://ws.audioscrobbler.com/2.0/';

	public constructor() {
		this._apiKey = envParseString(EnvKeys.LastFmToken);
		this._apiSecret = process.env.LASTFM_SECRET!;
	}

	public async callApi<M extends Call>(
		parameters: Record<string, string | undefined>,
		call: M,
		generateSignature = false
	): Promise<Response<LastFmApiReturnType<M>>> {
		const queryParams = {
			api_key: this._apiKey,
			format: 'json',
			method: call,
			...parameters
		} as Record<string, unknown>;

		if (generateSignature) {
			delete queryParams.api_sig;

			let signature = '';

			for (const [key, value] of Object.entries(queryParams)
				.sort(([key], [bKey]) => key.localeCompare(bKey))
				.filter(([key]) => key !== 'format')) {
				signature += key;
				signature += `${value}`;
			}

			signature += this._apiSecret;
			queryParams.api_sig = createHash('md5').update(signature).digest('hex');
		}

		const url = new URL(this.apiUrl);
		const headers = {
			'User-Agent': '@foxxie/10.0.0'
		};

		Object.keys(queryParams).forEach((k) => {
			url.searchParams.append(k, (queryParams as Record<string, string>)[k]);
		});

		try {
			const httpResponse = await request(url, { body: null, headers, method: 'POST' });

			if (httpResponse.statusCode === 404) {
				return new Response({ error: ResponseStatus.MissingParameters, message: 'Not found', success: false });
			}

			const content = (await httpResponse.body.json()) as LastFmApiReturnType<M>;

			return new Response<LastFmApiReturnType<M>>({ content, success: true });
		} catch (err) {
			return new Response({ error: ResponseStatus.Failure, success: false });
		}
	}
}
