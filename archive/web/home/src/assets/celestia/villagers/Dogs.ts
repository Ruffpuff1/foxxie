import { CoffeeBeansEnum, CoffeeMilkEnum, CoffeeSugarEnum, GamesEnum, GenderEnum, KKSliderSongs, PersonalitiesEnum, SpeciesEnum, Villager, VillagerEnum } from '../types';

export const Dogs: Villager[] = [
    {
        key: VillagerEnum.Bones,
        keyJp: 'トミ',
        gender: GenderEnum.Male,
        personality: PersonalitiesEnum.Lazy,
        species: SpeciesEnum.Dog,
        favoriteSaying: 'A snack a day keeps the vacuum away.',
        catchphrase: 'yip yip',
        games: [
            GamesEnum.DoubutsuNoMori,
            GamesEnum.WildWorld,
            GamesEnum.AnimalCrossing,
            GamesEnum.CityFolk,
            GamesEnum.NewLeaf,
            GamesEnum.NewHorizons,
            GamesEnum.HappyHomeDesigner,
            GamesEnum.AmiiboFestival,
            GamesEnum.HappyHomeParadise
        ],
        coffeeRequest: {
            beans: CoffeeBeansEnum.Mocha,
            milk: CoffeeMilkEnum.TheRegularAmount,
            sugar: CoffeeSugarEnum.TwoSpoonfuls
        },
        art: 'https://dodo.ac/np/images/2/2b/Bones_NH.png',
        siblings: 'Eldest of 7 kids',
        skill: 'Telling jokes',
        goal: 'Explorer',
        description: "In this world, there are folks with the brains and folks with the heart. Jury's out on where Bones fits into that system.",
        song: KKSliderSongs.KKEtude
    }
];
