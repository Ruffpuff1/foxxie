import { CoffeeBeansEnum, CoffeeMilkEnum, CoffeeSugarEnum, GamesEnum, GenderEnum, KKSliderSongs, PersonalitiesEnum, SpeciesEnum, Villager, VillagerEnum } from '../types';

export const Penguins: Villager[] = [
    {
        key: VillagerEnum.Boomer,
        keyJp: 'ショーイ',
        gender: GenderEnum.Male,
        personality: PersonalitiesEnum.Lazy,
        species: SpeciesEnum.Penguin,
        favoriteSaying: 'Flying is believing',
        catchphrase: 'human',
        description: "If you see him get a certain thousand-yard stare in his eyes, don't worry. His mind has just gone blank again.",
        games: [
            GamesEnum.AnimalCrossing,
            GamesEnum.CityFolk,
            GamesEnum.NewLeaf,
            GamesEnum.NewHorizons,
            GamesEnum.HappyHomeDesigner,
            GamesEnum.AmiiboFestival,
            GamesEnum.PocketCamp,
            GamesEnum.HappyHomeParadise
        ],
        coffeeRequest: {
            beans: CoffeeBeansEnum.Blend,
            milk: CoffeeMilkEnum.ALittleBit,
            sugar: CoffeeSugarEnum.OneSpoonful
        },
        art: 'https://dodo.ac/np/images/7/7d/Boomer_NH.png',
        siblings: 'Eldest of 6 kids',
        skill: 'Oversleeping',
        goal: 'Pilot',
        song: KKSliderSongs.Farewell
    },
    {
        key: VillagerEnum.Chabwick,
        keyJp: 'のぶお',
        gender: GenderEnum.Male,
        personality: PersonalitiesEnum.Lazy,
        species: SpeciesEnum.Penguin,
        favoriteSaying: 'Live, laugh, lasagna.',
        catchphrase: 'blargh',
        description:
            "Chabwick never gets cold...except for his ears. He'll wear a T-shirt in a snowstorm and eat a frozen treat when it's hailing, but he won't go anywhere without his earmuffs.",
        games: [GamesEnum.DoubutsuNoMori, GamesEnum.NewHorizons, GamesEnum.PocketCamp, GamesEnum.HappyHomeParadise],
        art: 'https://dodo.ac/np/images/6/60/Chabwick_amiibo.png',
        song: KKSliderSongs.KKDub
    }
];
