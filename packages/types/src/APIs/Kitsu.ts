export namespace Kitsu {
    type ISO8601DateTime = `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;
    type ShortDate = `${number}-${number}-${number}`;

    export interface AnimeResult {
        data: Anime[];
        meta: Meta;
        links: Links;
    }

    export interface Anime {
        id: string;
        type: 'anime';
        links: { self: string };
        attributes: AnimeAttributes;
        relationships: AnimeRelationships;
    }

    export interface AnimeAttributes {
        createdAt: ISO8601DateTime;
        updatedAt: ISO8601DateTime;
        slug: string;
        synopsis?: string;
        description?: string;
        coverImageTopOffset: number;
        titles: Titles;
        canonicalTitle?: string;
        abbreviatedTitles: string[];
        averageRating?: string;
        ratingFrequencies: Record<string, string>;
        userCount: number;
        favoritesCount: number;
        startDate?: ShortDate;
        endDate?: ShortDate;
        nextRelease: string | null;
        popularityRank?: number;
        ratingRank: number;
        ageRating: 'PG' | 'PG-13' | 'G' | 'R' | 'R18' | string;
        ageRatingGuide: string;
        subtype: 'TV' | 'movie' | 'special' | string;
        status: string;
        tba: null | string;
        posterImage: PosterImage;
        coverImage: PosterImage;
        episodeCount: number;
        episodeLength: number;
        totalLength: number;
        youtubeVideoId: string;
        showType: string;
        nsfw: boolean;
    }

    export interface AnimeRelationships {
        genres: RelationshipsLinks;
        categories: RelationshipsLinks;
        castings: RelationshipsLinks;
        installments: RelationshipsLinks;
        mappings: RelationshipsLinks;
        reviews: RelationshipsLinks;
        mediaRelationships: RelationshipsLinks;
        characters: RelationshipsLinks;
        staff: RelationshipsLinks;
        productions: RelationshipsLinks;
        quotes: RelationshipsLinks;
        episodes: RelationshipsLinks;
        streamingLinks: RelationshipsLinks;
        animeProductions: RelationshipsLinks;
        animeCharacters: RelationshipsLinks;
        animeStaff: RelationshipsLinks;
    }

    export interface RelationshipsLinks {
        links: {
            self?: string;
            related?: string;
        };
    }

    export interface PosterImage {
        tiny: string;
        large: string;
        small: string;
        medium?: string;
        original: string;
        meta: {
            dimensions: {
                tiny: ImageDimensions;
                large: ImageDimensions;
                small: ImageDimensions;
                medium?: ImageDimensions;
            };
        };
    }

    export interface ImageDimensions {
        width: number;
        height: number;
    }

    export interface Titles {
        en?: string;
        en_jp?: string;
        en_us?: string;
        ja_jp?: string;
    }

    export interface Meta {
        count: number;
    }

    export interface Links {
        first: string;
        next?: string;
        last: string;
    }
}
