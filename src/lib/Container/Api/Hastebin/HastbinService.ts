import { EnvKeys } from '#lib/types';
import { Urls } from '#utils/constants';
import makeRequest from '@aero/http';
import { envParseString } from '@skyra/env-utilities';

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
		return envParseString(EnvKeys.HasteToken);
	}
}

export interface HastebinPostData {
	key: string;
}
