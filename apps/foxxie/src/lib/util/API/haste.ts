import { fetch } from '@foxxie/fetch';
import { Urls } from '../constants';

export interface HastebinPostData {
    key: string;
}

export async function getHaste(body: string): Promise<string | null> {
    const { key } = await fetch(Urls.Haste, 'POST') //
        .path('documents')
        .body({ body })
        .auth(process.env.HASTE_TOKEN!, 'Bearer')
        .json<HastebinPostData>();

    return key ?? null;
}
