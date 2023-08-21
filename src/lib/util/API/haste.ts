import { fetch } from '@foxxie/fetch';
import { Urls } from '../constants';

export interface HastebinPostData {
    key: string;
    success: boolean;
}

export async function getHaste(body: string): Promise<string | null> {
    const { key } = await fetch(Urls.Haste, 'POST') //
        .path('api')
        .path('documents')
        .body({ body })
        .json<HastebinPostData>();

    return key ?? null;
}
