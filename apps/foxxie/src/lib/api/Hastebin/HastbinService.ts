import makeRequest from '@aero/http';
import { envParseString } from '@skyra/env-utilities';
import { EnvKeys } from '#lib/types';
import { Urls } from '#utils/constants';

export interface HastebinPostData {
	key: string;
}

export class HastebinService {
	public async post(body: string): Promise<null | string> {
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
