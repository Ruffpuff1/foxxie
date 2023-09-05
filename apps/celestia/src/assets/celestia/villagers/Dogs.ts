import { AmiiboSeriesEnum, CoffeeBeansEnum, CoffeeMilkEnum, CoffeeSugarEnum, GamesEnum, KKSliderSongs, MonthsEnum, PersonalitiesEnum, SpeciesEnum, StarSignEnum, Villager, VillagerKey } from '@foxxie/celestia-api-types';

export const Dogs: Villager[] = [
    {
        key: VillagerKey.Bones,
        keyJp: 'トミ',
        gender: 'Male',
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
        art: {
            villager: 'https://dodo.ac/np/images/2/2b/Bones_NH.png',
            card: 'https://dodo.ac/np/images/0/07/342_Bones_amiibo_card_NA.png',
            icon: 'https://dodo.ac/np/images/4/41/Bones_NH_Villager_Icon.png'
        },
        siblings: 'Eldest of 7 kids',
        skill: 'Telling jokes',
        goal: 'Explorer',
        description:
            "In this world, there are folks with the brains and folks with the heart. Jury's out on where Bones fits into that system.",
        song: KKSliderSongs.KKEtude,
        birthday: {
            month: MonthsEnum.August,
            day: 4,
            zodiac: StarSignEnum.Leo
        },
        amiibo: {
            series: AmiiboSeriesEnum.Four,
            cardNumber: 342
        }
    }
];
