import {
    AmiiboSeriesEnum,
    CoffeeBeansEnum,
    CoffeeMilkEnum,
    CoffeeSugarEnum,
    GamesEnum,
    KKSliderSongs,
    MonthsEnum,
    PersonalitiesEnum,
    SpeciesEnum,
    StarSignEnum,
    Villager,
    VillagerKey
} from '@foxxie/celestia-api-types';

export const Rabbits: Villager[] = [
    {
        key: VillagerKey.Bonbon,
        keyJp: 'ミミィ',
        gender: 'Female',
        personality: PersonalitiesEnum.Peppy,
        species: SpeciesEnum.Rabbit,
        favoriteSaying: 'Hindsight is always 20/20.',
        catchphrase: 'deelish',
        description:
            "Bonbon is a firm believer in quantity over quality. She'll get plenty of work done, if you don't mind some of it being flat-out wrong.",
        games: [
            GamesEnum.NewLeaf,
            GamesEnum.HappyHomeDesigner,
            GamesEnum.AmiiboFestival,
            GamesEnum.NewHorizons,
            GamesEnum.PocketCamp,
            GamesEnum.HappyHomeParadise
        ],
        coffeeRequest: {
            beans: CoffeeBeansEnum.Mocha,
            milk: CoffeeMilkEnum.TheRegularAmount,
            sugar: CoffeeSugarEnum.TwoSpoonfuls
        },
        art: {
            villager: 'https://dodo.ac/np/images/c/cc/Bonbon_NH.png',
            card: 'https://dodo.ac/np/images/9/92/049_Bonbon_amiibo_card_NA.png',
            icon: 'https://dodo.ac/np/images/3/3a/Bonbon_NH_Villager_Icon.png'
        },
        siblings: 'Youngest of 2 kids',
        skill: 'Competitive eating',
        goal: 'Swimmer',
        song: KKSliderSongs.BubblegumKK,
        birthday: {
            month: MonthsEnum.March,
            day: 3,
            zodiac: StarSignEnum.Pisces
        },
        amiibo: {
            series: AmiiboSeriesEnum.One,
            cardNumber: 49
        }
    }
];
