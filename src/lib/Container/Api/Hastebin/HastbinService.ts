import { EnvKeys } from '#lib/Types';
import { Urls } from '#utils/constants';
import { EnvParse } from '@foxxie/env';
import { HttpMethodEnum, fetch } from '@foxxie/fetch';

export class HastebinService {
    public async post(body: string): Promise<string | null> {
        const { key } = await fetch(Urls.Haste, HttpMethodEnum.Post)
            .path('documents')
            .body({ body })
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
