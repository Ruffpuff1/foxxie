import {
    Game,
    GamesEnum,
    LanguagesEnum,
    PlatformsEnum,
    RegionEnum,
    SpecialVillagerMainGameEnum,
    VillagerKey
} from '@foxxie/celestia-api-types';

export const AnimalCrossing: Game = {
    key: GamesEnum.AnimalCrossing,
    name: 'Animal Crossing',
    developer: 'Nintendo EAD',
    publisher: 'Nintendo',
    platforms: [PlatformsEnum.NintendoGameCube],
    releaseDate: {
        [RegionEnum.UnitedStates]: new Date('September 16, 2002'),
        [RegionEnum.Canada]: new Date('September 16, 2002'),
        [RegionEnum.Australia]: new Date('October 17, 2003'),
        [RegionEnum.Europe]: new Date('September 24, 2004')
    },
    languages: [
        LanguagesEnum.English,
        LanguagesEnum.French,
        LanguagesEnum.Italian,
        LanguagesEnum.German,
        LanguagesEnum.Spanish
    ],
    genre: 'Life simulation',
    modes: ['Single player'],
    villagers: [VillagerKey.Ace, VillagerKey.Bob, VillagerKey.Bones],
    specialVillagers: [
        SpecialVillagerMainGameEnum.Booker,
        SpecialVillagerMainGameEnum.Copper,
        SpecialVillagerMainGameEnum.Farley,
        SpecialVillagerMainGameEnum.Franklin,
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
