import {
    Game,
    GamesEnum,
    LanguagesEnum,
    PlatformsEnum,
    RegionEnum,
    SpecialVillagerMainGameEnum,
    VillagerKey
} from '@foxxie/celestia-api-types';

export const DoubutsuNoMori: Game = {
    key: GamesEnum.DoubutsuNoMori,
    name: 'Dōbutsu no Mori',
    developer: 'Nintendo EAD',
    publisher: 'Nintendo',
    platforms: [PlatformsEnum.Nintendo64],
    releaseDate: {
        [RegionEnum.Japan]: new Date('April 14, 2001')
    },
    languages: [LanguagesEnum.Japanese],
    genre: 'Life simulation',
    modes: ['Single player'],
    villagers: [VillagerKey.Ace, VillagerKey.Bob, VillagerKey.Bones],
    specialVillagers: [
        SpecialVillagerMainGameEnum.Booker,
        SpecialVillagerMainGameEnum.Copper,
        SpecialVillagerMainGameEnum.Gracie,
        SpecialVillagerMainGameEnum.Gulliver,
        SpecialVillagerMainGameEnum.Jack,
        SpecialVillagerMainGameEnum.Jingle,
        SpecialVillagerMainGameEnum.Joan,
        SpecialVillagerMainGameEnum.KKSlider,
        SpecialVillagerMainGameEnum.Katrina,
        SpecialVillagerMainGameEnum.Lloid,
        SpecialVillagerMainGameEnum.Pelly,
        SpecialVillagerMainGameEnum.Pete,
        SpecialVillagerMainGameEnum.Phyllis,
        SpecialVillagerMainGameEnum.Porter,
        SpecialVillagerMainGameEnum.Redd,
        SpecialVillagerMainGameEnum.Resetti,
        SpecialVillagerMainGameEnum.Rover,
        SpecialVillagerMainGameEnum.Saharah,
        SpecialVillagerMainGameEnum.Timmy,
        SpecialVillagerMainGameEnum.Tommy,
        SpecialVillagerMainGameEnum.TomNook
    ]
};
