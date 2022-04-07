import fetch from '@foxxie/centra';
import { Urls } from '../constants';

export interface HastebinPostData {
    key: string;
}

export async function getHaste(body: string): Promise<string | null> {
    const { key } = await <Promise<HastebinPostData>>fetch(Urls.Haste, 'POST')
        .path('documents')
        .body(body)
        .json();

    return key ?? null;
}