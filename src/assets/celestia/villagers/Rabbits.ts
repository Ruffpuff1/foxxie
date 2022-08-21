import { CoffeeBeansEnum, CoffeeMilkEnum, CoffeeSugarEnum, GamesEnum, GenderEnum, KKSliderSongs, PersonalitiesEnum, SpeciesEnum, Villager, VillagerEnum } from '../types';

export const Rabbits: Villager[] = [
    {
        key: VillagerEnum.Bonbon,
        keyJp: 'ミミィ',
        gender: GenderEnum.Female,
        personality: PersonalitiesEnum.Peppy,
        species: SpeciesEnum.Rabbit,
        favoriteSaying: 'Hindsight is always 20/20.',
        catchphrase: 'deelish',
        description: "Bonbon is a firm believer in quantity over quality. She'll get plenty of work done, if you don't mind some of it being flat-out wrong.",
        games: [GamesEnum.NewLeaf, GamesEnum.HappyHomeDesigner, GamesEnum.AmiiboFestival, GamesEnum.NewHorizons, GamesEnum.PocketCamp, GamesEnum.HappyHomeParadise],
        coffeeRequest: {
            beans: CoffeeBeansEnum.Mocha,
            milk: CoffeeMilkEnum.TheRegularAmount,
            sugar: CoffeeSugarEnum.TwoSpoonfuls
        },
        art: 'https://dodo.ac/np/images/c/cc/Bonbon_NH.png',
        siblings: 'Youngest of 2 kids',
        skill: 'Competitive eating',
        goal: 'Swimmer',
        song: KKSliderSongs.BubblegumKK
    }
];
