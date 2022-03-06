import type { Endpoints } from '@octokit/types';

/**
 * Types used in Kettu for Github's REST API.
 * @link https://docs.github.com/en/rest/reference
 */
export namespace Github {
    export type User = Endpoints['GET /users/{username}']['response']['data'];

    export type Repo = Endpoints['GET /repos/{owner}/{repo}']['response']['data'];

    export interface UserNotFound {
        message: string;
        documentation_url: string;
    }

    export type UserResult = UserNotFound | User;
}

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

export namespace Npm {
    export interface Result {
        _id: string;
        _rev: string;
        name: string;
        'dist-tags': { latest: string };
        versions: Record<string, Package>;
        time: Time;
        maintainers: User[];
        description: string;
        keywords: string[];
        author: Author;
        license: string;
        readme: string;
        readmeFilename: string;
        error?: string;
        code?: string;
    }

    export interface Time {
        created: string;
        modified: string;
        [key: string]: string;
    }

    export interface Package {
        name: string;
        version: string;
        description: string;
        main: string;
        scripts: Record<string, string>;
        keywords: string[];
        author: Author;
        license: string;
        dependencies?: Record<string, string>;
        _id: string;
        _nodeVersion: string;
        _npmVersion: string;
        dist: Record<string, string>;
        _npmUser: User;
        directories: Record<string, unknown>;
        maintainers: User[];
        _npmOperationalInternal: { host: string; tmp: string };
        _hasShrinkwrap: boolean;
    }

    export interface Author {
        name: string;
    }

    export interface User {
        name: string;
        email: string;
    }
}

export namespace Webster {
    export interface Response {
        meta: Metadata;
        hom: number;
        hwi?: {
            hw: string;
            prs?: Prs[];
            vrs?: Vrs[];
        };
        fl?: string;
        lbs?: string[];
        psl?: string;
        def?: Definition[];
        et: string[][];
        data: string;
        shortdef: string[];
    }

    export interface Metadata {
        id: string;
        uuid: string;
        sort: string;
        src: string;
        section: string;
        stems: string[];
        offensive: boolean;
    }

    export interface Vrs {
        vl: string;
        va: string;
        prs?: Prs[];
    }

    export interface Prs {
        mw: string;
        l: string;
        l2: string;
        pun: string;
        sound: {
            audio: string;
            ref: string;
            stat: string;
        };
    }

    export interface Definition {
        sseq: Sense[][];
    }

    export type Sense = SenseDataModel[];

    export interface SenseDataModel {
        sn?: string;
        dt: (string | Vis[])[];
    }

    export interface Vis {
        t: string;
    }
}

export namespace Webtoon {
    export interface Titles {
        author: string;
        average: string;
        favorite: string;
        genre: string;
        read: string;
        total: string;
    }

    export interface Info {
        writingAuthorName: string;
        genreInfo: {
            name: string;
            color: `#${string}`;
        };
        title: string;
        synopsis: string;
        starScoreAverage: number;
        readCount: number;
        favoriteCount: number;
        totalServiceEpisodeCount: number;
        linkUrl: string;
        likeitCount: number;
    }
    export interface Result {
        message: {
            result: {
                titleInfo: Info;
            };
        };
    }
    export interface CodeQResult {
        titleNo?: number;
        thumbnail: string;
    }
    export interface CodeQ {
        message: {
            result: {
                challengeSearch: {
                    titleList: CodeQResult[];
                };
            };
        };
    }
}
/**
 * Copyright 2019 Skyra Project

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
export namespace WttrIn {
    type IntegerString = `${bigint}`;
    type FloatString = `${number}`;
    export interface Weather {
        current_condition: CurrentCondition[];
        nearest_area: NearestArea[];
        request: Request[];
        weather: WeatherElement[];
    }
    export interface CurrentCondition {
        FeelsLikeC: IntegerString;
        FeelsLikeF: IntegerString;
        cloudcover: IntegerString;
        humidity: IntegerString;
        localObsDateTime: Date;
        observation_time: Hour;
        precipInches: FloatString;
        precipMM: FloatString;
        pressure: IntegerString;
        pressureInches: IntegerString;
        temp_C: IntegerString;
        temp_F: IntegerString;
        uvIndex: IntegerString;
        visibility: IntegerString;
        visibilityMiles: IntegerString;
        weatherCode: WeatherCode;
        weatherDesc: WeatherDescription[];
        weatherIconUrl: Url[];
        winddir16Point: WindDirection;
        winddirDegree: IntegerString;
        windspeedKmph: IntegerString;
        windspeedMiles: IntegerString;
    }
    export const enum WeatherCode {
        ClearOrSunny = '113',
        PartlyCloudy = '116',
        Cloudy = '119',
        Overcast = '122',
        Mist = '143',
        PatchyRainNearby = '176',
        PatchySnowNearby = '179',
        PatchySleetNearby = '182',
        PatchyFreezingDrizzleNearby = '185',
        ThunderyOutbreaksInNearby = '200',
        BlowingSnow = '227',
        Blizzard = '230',
        Fog = '248',
        FreezingFog = '260',
        PatchyLightDrizzle = '263',
        LightDrizzle = '266',
        FreezingDrizzle = '281',
        HeavyFreezingDrizzle = '284',
        PatchyLightRain = '293',
        LightRain = '296',
        ModerateRainAtTimes = '299',
        ModerateRain = '302',
        HeavyRainAtTimes = '305',
        HeavyRain = '308',
        LightFreezingRain = '311',
        ModerateOrHeavyFreezingRain = '314',
        LightSleet = '317',
        ModerateOrHeavySleet = '320',
        PatchyLightSnow = '323',
        LightSnow = '326',
        PatchyModerateSnow = '329',
        ModerateSnow = '332',
        PatchyHeavySnow = '335',
        HeavySnow = '338',
        IcePellets = '350',
        LightRainShower = '353',
        ModerateOrHeavyRainShower = '356',
        TorrentialRainShower = '359',
        LightSleetShowers = '362',
        ModerateOrHeavySleetShowers = '365',
        LightSnowShowers = '368',
        ModerateOrHeavySnowShowers = '371',
        LightShowersOfIcePellets = '374',
        ModerateOrHeavyShowersOfIcePellets = '377',
        PatchyLightRainInAreaWithThunder = '386',
        ModerateOrHeavyRainInAreaWithThunder = '389',
        PatchyLightSnowInAreaWithThunder = '392',
        ModerateOrHeavySnowInAreaWithThunder = '395'
    }
    export interface WeatherDescription {
        value: WeatherName;
    }
    export type WeatherName =
        | 'Cloudy'
        | 'Fog'
        | 'HeavyRain'
        | 'HeavyShowers'
        | 'HeavySnow'
        | 'HeavySnowShowers'
        | 'LightRain'
        | 'LightShowers'
        | 'LightSleet'
        | 'LightSleetShowers'
        | 'LightSnow'
        | 'LightSnowShowers'
        | 'PartlyCloudy'
        | 'Sunny'
        | 'ThunderyHeavyRain'
        | 'ThunderyShowers'
        | 'ThunderySnowShowers'
        | 'VeryCloudy';
    export interface NearestArea {
        areaName: ValueWrapper[];
        country: ValueWrapper[];
        latitude: FloatString;
        longitude: FloatString;
        population: IntegerString;
        region: ValueWrapper[];
        weatherUrl: Url[];
    }
    export interface ValueWrapper {
        value: string;
    }
    export interface Url {
        value: string;
    }
    export interface Request {
        query: string;
        type: 'LatLon';
    }
    export interface WeatherElement {
        astronomy: Astronomy[];
        avgtempC: IntegerString;
        avgtempF: IntegerString;
        date: Date;
        hourly: Hourly[];
        maxtempC: IntegerString;
        maxtempF: IntegerString;
        mintempC: IntegerString;
        mintempF: IntegerString;
        sunHour: FloatString;
        totalSnow_cm: FloatString;
        uvIndex: IntegerString;
    }
    export interface Astronomy {
        moon_illumination: IntegerString;
        moon_phase: MoonPhase;
        moonrise: Hour;
        moonset: Hour;
        sunrise: Hour;
        sunset: Hour;
    }
    export type MoonPhase = 'New Moon' | 'Waxing Crescent' | 'First Quarter' | 'Waxing Gibbous' | 'Full Moon' | 'Waning Gibbous' | 'Last Quarter' | 'Waning Crescent';
    export type Hour = `${bigint}:${bigint} ${'AM' | 'PM'}`;

    export interface Hourly {
        DewPointC: IntegerString;
        DewPointF: IntegerString;
        FeelsLikeC: IntegerString;
        FeelsLikeF: IntegerString;
        HeatIndexC: IntegerString;
        HeatIndexF: IntegerString;
        WindChillC: IntegerString;
        WindChillF: IntegerString;
        WindGustKmph: IntegerString;
        WindGustMiles: IntegerString;
        chanceoffog: IntegerString;
        chanceoffrost: IntegerString;
        chanceofhightemp: IntegerString;
        chanceofovercast: IntegerString;
        chanceofrain: IntegerString;
        chanceofremdry: IntegerString;
        chanceofsnow: IntegerString;
        chanceofsunshine: IntegerString;
        chanceofthunder: IntegerString;
        chanceofwindy: IntegerString;
        cloudcover: IntegerString;
        humidity: IntegerString;
        precipInches: FloatString;
        precipMM: FloatString;
        pressure: IntegerString;
        pressureInches: FloatString;
        tempC: IntegerString;
        tempF: IntegerString;
        time: IntegerString;
        uvIndex: IntegerString;
        visibility: IntegerString;
        visibilityMiles: IntegerString;
        weatherCode: WeatherCode;
        weatherDesc: WeatherDescription[];
        weatherIconUrl: Url[];
        winddir16Point: WindDirection;
        winddirDegree: IntegerString;
        windspeedKmph: IntegerString;
        windspeedMiles: IntegerString;
    }

    export type WindDirectionNorth = 'N' | 'NNE';
    export type WindDirectionNorthEast = 'NE' | 'ENE';
    export type WindDirectionEast = 'E' | 'ESE';
    export type WindDirectionSouthEast = 'SE' | 'SSE';
    export type WindDirectionSouth = 'S' | 'SSW';
    export type WindDirectionSouthWest = 'SW' | 'WSW';
    export type WindDirectionWest = 'W' | 'WNW';
    export type WindDirectionNorthWest = 'NW' | 'NNW';
    export type WindDirection =
        | WindDirectionNorth
        | WindDirectionNorthEast
        | WindDirectionEast
        | WindDirectionSouthEast
        | WindDirectionSouth
        | WindDirectionSouthWest
        | WindDirectionWest
        | WindDirectionNorthWest;

    export interface ResolvedConditions {
        precipitation: string;
        pressure: string;
        temperature: string;
        visibility: string;
        windSpeed: string;
    }
}

export namespace StatusPage {
    export interface Result {
        page: Info;
        incidents: Incident[];
    }

    export interface Incident {
        id: string;
        name: string;
        status: 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'postmortem';
        created_at: string;
        updated_at: string | null;
        monitoring_at: string | null;
        resolved_at: string | null;
        impact: 'none' | 'minor' | 'major' | 'critical';
        shortlink: string;
        started_at: string;
        page_id: string;
        incident_updates: IncidentUpdate[];
        components: Component[];
    }

    export interface IncidentUpdate {
        id: string;
        status: string;
        body: string;
        incident_id: string;
        created_at: string;
        update_at: string;
        display_at: string;
        affected_components: ComponentAffected[];
        deliever_notifications: boolean;
        custom_tweet: string | null;
        tweet_id: string | null;
    }

    export interface Component {
        id: string;
        name: string;
        status: string;
        created_at: string;
        updated_at: string;
        position: number;
        description: string;
        showcase: boolean;
        start_date: string | null;
        group_id: string | null;
        page_id: string;
        group: boolean;
        only_show_if_degraded: boolean;
    }

    export interface ComponentAffected {
        code: string;
        name: string;
        old_status: string;
        new_status: string;
    }

    export interface Info {
        id: string;
        name: string;
        url: string;
        time_zone: string;
        updated_at: string;
    }
}
