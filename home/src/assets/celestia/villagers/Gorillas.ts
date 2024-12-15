import { CoffeeBeansEnum, CoffeeMilkEnum, CoffeeSugarEnum, GamesEnum, GenderEnum, KKSliderSongs, PersonalitiesEnum, SpeciesEnum, Villager, VillagerEnum } from '../types';

export const Gorillas: Villager[] = [
    {
        key: VillagerEnum.Boone,
        keyJp: 'まんたろう',
        gender: GenderEnum.Male,
        personality: PersonalitiesEnum.Jock,
        species: SpeciesEnum.Gorilla,
        favoriteSaying: 'Never settle for second best.',
        catchphrase: 'baboom',
        description:
            "People think Boone's all about muscles and protein shakes, but there's nothing he loves more than watching a lovely sunset...while drinking a protein shake.",
        games: [
            GamesEnum.WildWorld,
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
        art: 'https://dodo.ac/np/images/1/19/Boone_NH.png',
        siblings: 'Second of 4 kids',
        skill: 'Dancing',
        goal: 'Rugby player',
        song: KKSliderSongs.KKCasbah
    }
];
