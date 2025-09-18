import { envParseString } from '@skyra/env-utilities';
import { EnvKeys } from '#lib/Types/Env';
import { createHash } from 'node:crypto';
import { request } from 'undici';

import { Call, LastFmApiReturnType, Response, ResponseStatus } from '../Resources/index.js';

export class LastFMApi {
	public static async CallApi<M extends Call>(
		parameters: Record<string, string | undefined>,
		call: M,
		generateSignature = false
	): Promise<Response<LastFmApiReturnType<M>>> {
		const queryParams = {
			api_key: LastFMApi.ApiKey,
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

			signature += LastFMApi.ApiSecret;
			queryParams.api_sig = createHash('md5').update(signature).digest('hex');
		}

		const url = new URL(LastFMApi.ApiUrl);
		const headers = {
			'User-Agent': '@foxxie/10.0.0'
		};

		Object.keys(queryParams).forEach((k) => {
			url.searchParams.append(k, (queryParams as Record<string, string>)[k]);
		});

		const httpResponse = await request(url, { body: null, headers, method: 'POST' });

		if (httpResponse.statusCode === 404) {
			return new Response({ error: ResponseStatus.MissingParameters, message: 'Not found', success: false });
		}

		const content = (await httpResponse.body.json()) as LastFmApiReturnType<M>;

		return new Response<LastFmApiReturnType<M>>({ content, success: true });
	}

	private static readonly ApiKey = envParseString(EnvKeys.LastFmToken);

	private static readonly ApiSecret = process.env.LASTFM_SECRET!;

	private static readonly ApiUrl = 'http://ws.audioscrobbler.com/2.0/';
}
