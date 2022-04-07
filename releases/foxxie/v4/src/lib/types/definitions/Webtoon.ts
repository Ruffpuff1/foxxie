import type { ColorResolvable } from 'discord.js';

export interface WebtoonTitles {
    author: string;
    average: string;
    favorite: string;
    genre: string;
    read: string;
    total: string;
}

export type WebtoonInfo = {
    writingAuthorName: string;
    genreInfo: {
        name: string;
        color: ColorResolvable;
    }
    title: string;
    synopsis: string;
    starScoreAverage: number;
    readCount: number;
    favoriteCount: number;
    totalServiceEpisodeCount: number;
    linkUrl: string;
    likeitCount: number;
}

export type WebtoonResult = {
    message: {
        result: {
            titleInfo: WebtoonInfo
        }
    }
}

export type WebtoonCodeQResult = {
    titleNo?: number;
    thumbnail: string;
}

export type WebtoonCodeQ = {
    message: {
        result: {
            challengeSearch: {
                titleList: WebtoonCodeQResult[]
            }
        }
    }
}