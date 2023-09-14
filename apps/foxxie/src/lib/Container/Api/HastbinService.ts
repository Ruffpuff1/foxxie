import { EnvKeys } from '#lib/Types/Env';
import { EnvParse } from '@foxxie/env';
import { HttpMethodEnum, fetch } from '@foxxie/fetch';
import { Urls } from '../../util/constants';

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
