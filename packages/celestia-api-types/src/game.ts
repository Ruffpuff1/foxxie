import { SpecialVillagerEnum } from './specialVillager';
import { VillagerKey } from './villager';

export enum GamesEnum {
    DoubutsuNoMori = 'dnm',
    AnimalCrossing = 'ac',
    WildWorld = 'ww',
    CityFolk = 'cf',
    NewLeaf = 'nl',
    HappyHomeDesigner = 'hhd',
    AmiiboFestival = 'af',
    PocketCamp = 'pc',
    NewHorizons = 'nh',
    HappyHomeParadise = 'hhp'
}

export const AllGames: `${GamesEnum}`[] = [
    GamesEnum.AmiiboFestival,
    GamesEnum.AnimalCrossing,
    GamesEnum.CityFolk,
    GamesEnum.DoubutsuNoMori,
    GamesEnum.HappyHomeDesigner,
    GamesEnum.HappyHomeParadise,
    GamesEnum.NewHorizons,
    GamesEnum.NewLeaf,
    GamesEnum.PocketCamp,
    GamesEnum.WildWorld
];

export interface Game {
    key: `${GamesEnum}`;
    name: string;
    developer: string;
    publisher: string;
    platforms: `${PlatformsEnum}`[];
    releaseDate: ReleaseDate;
    languages: `${LanguagesEnum}`[];
    genre: string;
    modes: string[];
    villagers: `${VillagerKey}`[];
    specialVillagers: `${SpecialVillagerEnum}`[];
}

export type ReleaseDate = Partial<Record<RegionEnum, Date>>;

export enum PlatformsEnum {
    NintendoGameCube = 'Nintendo GameCube',
    Nintendo64 = 'Nintendo 64'
}

export enum RegionEnum {
    Australia = 'australia',
    Canada = 'canada',
    Europe = 'europe',
    Japan = 'japan',
    UnitedStates = 'unitedStates'
}

export enum LanguagesEnum {
    English = 'English',
    French = 'french',
    Italian = 'italian',
    German = 'german',
    Japanese = 'Japanese',
    Spanish = 'spanish'
}
