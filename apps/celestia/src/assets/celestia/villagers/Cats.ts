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

export const Cats: Villager[] = [
    {
        key: VillagerKey.Bob,
        keyJp: 'ニコバン',
        gender: 'Male',
        personality: PersonalitiesEnum.Lazy,
        species: SpeciesEnum.Cat,
        favoriteSaying: 'You only live once...or nine times.',
        catchphrase: 'pthhpth',
        description:
            "Bob is an easygoing kind of guy. He doesn't worry too much about what he does or says, which doesn't always end well",
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
        art: {
            villager: 'https://dodo.ac/np/images/e/ea/Bob_NH.png',
            card: 'https://dodo.ac/np/images/d/d2/018_Bob_amiibo_card_NA.png',
            icon: 'https://dodo.ac/np/images/f/f4/Bob_NH_Villager_Icon.png'
        },
        siblings: 'Fourth of 6 kids',
        skill: 'Shadow puppetry',
        goal: 'Detective',
        song: KKSliderSongs.Neapolitan,
        birthday: {
            month: MonthsEnum.January,
            day: 1,
            zodiac: StarSignEnum.Capricorn
        },
        amiibo: {
            series: AmiiboSeriesEnum.One,
            cardNumber: 18
        }
    }
];
