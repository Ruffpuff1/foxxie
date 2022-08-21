import { CoffeeBeansEnum, CoffeeMilkEnum, CoffeeSugarEnum, GamesEnum, GenderEnum, KKSliderSongs, PersonalitiesEnum, SpeciesEnum, Villager, VillagerEnum } from '../types';

export const Cats: Villager[] = [
    {
        key: VillagerEnum.Bob,
        keyJp: 'ニコバン',
        gender: GenderEnum.Male,
        personality: PersonalitiesEnum.Lazy,
        species: SpeciesEnum.Cat,
        favoriteSaying: 'You only live once...or nine times.',
        catchphrase: 'pthhpth',
        description: "Bob is an easygoing kind of guy. He doesn't worry too much about what he does or says, which doesn't always end well",
        games: [
            GamesEnum.DoubutsuNoMori,
            GamesEnum.AnimalCrossing,
            GamesEnum.WildWorld,
            GamesEnum.CityFolk,
            GamesEnum.NewLeaf,
            GamesEnum.HappyHomeDesigner,
            GamesEnum.AmiiboFestival,
            GamesEnum.PocketCamp,
            GamesEnum.NewHorizons,
            GamesEnum.HappyHomeParadise
        ],
        coffeeRequest: {
            beans: CoffeeBeansEnum.Kilimanjaro,
            milk: CoffeeMilkEnum.NoneAtAll,
            sugar: CoffeeSugarEnum.NoneAtAll
        },
        art: 'https://dodo.ac/np/images/e/ea/Bob_NH.png',
        siblings: 'Fourth of 6 kids',
        skill: 'Shadow puppetry',
        goal: 'Detective',
        song: KKSliderSongs.Neapolitan
    }
];
