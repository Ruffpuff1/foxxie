// eslint-disable-next-line @typescript-eslint/no-var-requires
import fetch from '@foxxie/centra';
import { Urls } from '../constants';

const image = /https?:\/\/i\.imgur\.com\/(\w+)\.(?:jpg|png)/i;
const album = /https?:\/\/imgur\.com(?:\/a)?\/(\w+)/i;

export interface ImgurSuccessPayload {
    id: string;
    description: string;
    link: string;
}

export interface ImgurErrorPayload {
    error: string;
    request: string;
    method: string;
}

export type ImgurPayload = {
    data: ImgurSuccessPayload | ImgurErrorPayload;
    success: boolean;
    status: number;
}

export async function getImgurLink(url: string): Promise<string> {
    if (image.test(url)) return url;
    if (album.test(url)) {
        const imgur = <ImgurPayload>await fetch(Urls.Imgur)
            .header('Authorization', `Client-ID ${process.env.IMGUR_TOKEN}`)
            .path('album')
            .path(album.exec(url)?.[1] as string)
            .path('images')
            .json();

        if (!imgur.success || !imgur.data) throw new Error('Failed fetching from imgur.');
        return (imgur.data as ImgurSuccessPayload).link;
    }

    const imgur = <ImgurPayload>await fetch(Urls.Imgur, 'POST')
        .header('Authorization', `Client-ID ${process.env.IMGUR_TOKEN}`)
        .path('/image')
        .body({ image: url })
        .json();

    if (!imgur.success) throw new Error('Failed uploading to imgur.');
    return (imgur.data as ImgurSuccessPayload).link;
}