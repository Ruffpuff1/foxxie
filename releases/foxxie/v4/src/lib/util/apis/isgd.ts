import fetch from '@foxxie/centra';
import { Urls } from '../constants';

export interface IsgdResponse {
    errorcode?: number;
    errormessage?: string;
    shorturl?: string;
}

export async function isgdCustom(url: string, name: string): Promise<string> {
    const parsed = name.replace(/[^a-zA-Z0-9_]\s*/ugi, '_');

    const result = <IsgdResponse>await fetch(Urls.Isgd)
        .query({ format: 'json', url, shorturl: parsed })
        .json();

    if (result.errorcode || !result.shorturl) throw result.errormessage;
    return result.shorturl;
}

export async function isgdShorten(url: string): Promise<string> {
    const result = <IsgdResponse>await fetch(Urls.Isgd)
        .query({ format: 'json', url })
        .json();

    if (result.errorcode || !result.shorturl) throw result.errormessage;
    return result.shorturl;
}