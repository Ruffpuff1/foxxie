import { EnvKeys } from '#lib/types';
import { Urls } from '#utils/constants';
import { EnvParse } from '@foxxie/env';
import makeRequest from '@aero/http';

export class HastebinService {
	public async post(body: string): Promise<string | null> {
		const { key } = await makeRequest(Urls.Haste)
			.path('documents')
			.body({ body })
			.method('POST')
			.auth(this.token, 'Bearer')
			.json<HastebinPostData>();

		return key ?? null;
	}

	private get token() {
		return EnvParse.string(EnvKeys.HasteToken);
	}
}

export interface HastebinPostData {
	key: string;
}
