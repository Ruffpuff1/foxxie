import {
    AmiiboSeriesEnum,
    CoffeeBeansEnum,
    CoffeeMilkEnum,
    CoffeeSugarEnum,
    GamesEnum,
    GenderEnum,
    KKSliderSongs,
    MonthsEnum,
    PersonalitiesEnum,
    SpeciesEnum,
    StarSignEnum,
    Villager,
    VillagerKey
} from '@foxxie/celestia-api-types';

export const Sanrio: Villager[] = [
    {
        key: VillagerKey.Chai,
        keyJp: 'フィーカ',
        gender: GenderEnum.Female,
        personality: PersonalitiesEnum.Peppy,
        species: SpeciesEnum.Elephant,
        favoriteSaying: 'He who chases two rabbits catches none.',
        catchphrase: 'flap flap',
        description:
            "Stepping into Chai's camper is like stepping into the world of Cinnamoroll. In short, it smells delicious in there.",
        games: [
            GamesEnum.NewLeaf,
            GamesEnum.HappyHomeDesigner,
            GamesEnum.NewHorizons,
            GamesEnum.HappyHomeParadise,
            GamesEnum.PocketCamp
        ],
        art: {
            villager: 'https://dodo.ac/np/images/8/84/Chai_NH_Model.png',
            card: 'https://dodo.ac/np/images/0/02/004_Chai_Sanrio_amiibo_card_NA.png',
            icon: 'https://dodo.ac/np/images/a/ac/Chai_NH_Villager_Icon.png'
        },
        song: KKSliderSongs.KKBossa,
        skill: 'Napping',
        goal: 'Café owner',
        siblings: null,
        coffeeRequest: {
            beans: CoffeeBeansEnum.Blend,
            milk: CoffeeMilkEnum.NoneAtAll,
            sugar: CoffeeSugarEnum.NoneAtAll
        },
        birthday: {
            month: MonthsEnum.March,
            day: 6,
            zodiac: StarSignEnum.Pisces
        },
        amiibo: {
            series: AmiiboSeriesEnum.Sanrio,
            cardNumber: 4
        }
    },
    {
        key: VillagerKey.Chelsea,
        keyJp: 'チェルシ',
        gender: GenderEnum.Female,
        personality: PersonalitiesEnum.Normal,
        species: SpeciesEnum.Deer,
        favoriteSaying: 'Always look a gift horse in the mouth.',
        catchphrase: 'pound cake',
        description:
            'Chelsea always brings the essentials when going on a camping trip: her collection of My Melody paraphernalia and a bowl of cookie dough.',
        games: [
            GamesEnum.NewLeaf,
            GamesEnum.HappyHomeDesigner,
            GamesEnum.NewHorizons,
            GamesEnum.HappyHomeParadise,
            GamesEnum.PocketCamp
        ],
        art: {
            villager: 'https://dodo.ac/np/images/c/c1/Chelsea_NH_Model.png',
            card: 'https://dodo.ac/np/images/9/93/005_Chelsea_Sanrio_amiibo_card_NA.png',
            icon: 'https://dodo.ac/np/images/4/40/Chelsea_NH_Villager_Icon.png'
        },
        song: KKSliderSongs.KKStroll,
        skill: 'Making sweets',
        goal: 'Pastry chef',
        siblings: 'Eldest of 2 kids',
        coffeeRequest: {
            beans: CoffeeBeansEnum.Mocha,
            milk: CoffeeMilkEnum.Lots,
            sugar: CoffeeSugarEnum.ThreeSpoonfuls
        },
        birthday: {
            month: MonthsEnum.January,
            day: 18,
            zodiac: StarSignEnum.Capricorn
        },
        amiibo: {
            series: AmiiboSeriesEnum.Sanrio,
            cardNumber: 5
        }
    },
    {
        key: VillagerKey.Etoile,
        keyJp: 'エトワール',
        gender: GenderEnum.Female,
        personality: PersonalitiesEnum.Normal,
        species: SpeciesEnum.Sheep,
        favoriteSaying: 'Who knows what the stars have in store for us?',
        catchphrase: 'fuzzy',
        description:
            'Inspired by Kiki and Lala, Étoile wants to make the world a better place. Of course, first she has to actually SEE the world. Hence the camper.',
        games: [
            GamesEnum.NewLeaf,
            GamesEnum.HappyHomeDesigner,
            GamesEnum.NewHorizons,
            GamesEnum.HappyHomeParadise,
            GamesEnum.PocketCamp
        ],
        art: {
            villager: 'https://dodo.ac/np/images/c/c1/Etoile_NH_Model.png',
            card: 'https://dodo.ac/np/images/0/04/003_%C3%89toile_Sanrio_amiibo_card_NA.png',
            icon: 'https://dodo.ac/np/images/2/21/%C3%89toile_NH_Villager_Icon.png'
        },
        song: KKSliderSongs.KKLullaby,
        skill: 'Handiwork',
        goal: 'Interior designer',
        siblings: 'Older twin sister',
        coffeeRequest: {
            beans: CoffeeBeansEnum.Kilimanjaro,
            milk: CoffeeMilkEnum.Lots,
            sugar: CoffeeSugarEnum.ThreeSpoonfuls
        },
        birthday: {
            month: MonthsEnum.December,
            day: 25,
            zodiac: StarSignEnum.Capricorn
        },
        amiibo: {
            series: AmiiboSeriesEnum.Sanrio,
            cardNumber: 3
        }
    },
    {
        key: VillagerKey.Marty,
        keyJp: 'マーティ',
        gender: GenderEnum.Male,
        personality: PersonalitiesEnum.Lazy,
        species: SpeciesEnum.Cub,
        favoriteSaying: 'Just wait until I get started!',
        catchphrase: 'pompom',
        description:
            'Years ago, Marty took on an epic quest to taste every flavor of pudding in the world. His love of Pompompurin may or may not be at the root of this...',
        games: [
            GamesEnum.NewLeaf,
            GamesEnum.HappyHomeDesigner,
            GamesEnum.NewHorizons,
            GamesEnum.HappyHomeParadise,
            GamesEnum.PocketCamp
        ],
        art: {
            villager: 'https://dodo.ac/np/images/e/e1/Marty_NH_Model.png',
            card: 'https://dodo.ac/np/images/e/ea/002_Marty_Sanrio_amiibo_card_NA.png',
            icon: 'https://dodo.ac/np/images/0/08/Marty_NH_Villager_Icon.png'
        },
        song: KKSliderSongs.MyPlace,
        skill: 'Hiding shoes',
        goal: 'Baker',
        siblings: 'Eldest of 2 kids',
        coffeeRequest: {
            beans: CoffeeBeansEnum.BlueMountain,
            milk: CoffeeMilkEnum.NoneAtAll,
            sugar: CoffeeSugarEnum.NoneAtAll
        },
        birthday: {
            month: MonthsEnum.April,
            day: 16,
            zodiac: StarSignEnum.Aries
        },
        amiibo: {
            series: AmiiboSeriesEnum.Sanrio,
            cardNumber: 2
        }
    },
    {
        key: VillagerKey.Rilla,
        keyJp: 'リラ',
        gender: GenderEnum.Female,
        personality: PersonalitiesEnum.Peppy,
        species: SpeciesEnum.Gorilla,
        favoriteSaying: "Where there's a will, there's a way.",
        catchphrase: 'hello',
        description:
            "No matter where her travels take her, Rilla always packs her favorite Hello Kitty shirt. She's had it since she was a little girl. Can you tell?",
        games: [
            GamesEnum.NewLeaf,
            GamesEnum.HappyHomeDesigner,
            GamesEnum.NewHorizons,
            GamesEnum.HappyHomeParadise,
            GamesEnum.PocketCamp
        ],
        art: {
            villager: 'https://dodo.ac/np/images/2/25/Rilla_NH_Model.png',
            card: 'https://dodo.ac/np/images/a/a2/001_Rilla_Sanrio_amiibo_card_NA.png',
            icon: 'https://dodo.ac/np/images/b/bc/Rilla_NH_Villager_Icon.png'
        },
        song: KKSliderSongs.BubblegumKK,
        skill: 'Baking',
        goal: 'Kitty White',
        siblings: 'Older twin sister',
        coffeeRequest: {
            beans: CoffeeBeansEnum.BlueMountain,
            milk: CoffeeMilkEnum.NoneAtAll,
            sugar: CoffeeSugarEnum.NoneAtAll
        },
        birthday: {
            month: MonthsEnum.November,
            day: 1,
            zodiac: StarSignEnum.Scorpio
        },
        amiibo: {
            series: AmiiboSeriesEnum.Sanrio,
            cardNumber: 1
        }
    },
    {
        key: VillagerKey.Toby,
        keyJp: 'トビ',
        gender: GenderEnum.Male,
        personality: PersonalitiesEnum.Smug,
        species: SpeciesEnum.Rabbit,
        favoriteSaying: "Toby or not Toby? I don't know, I'm asking you.",
        catchphrase: 'ribbit',
        description:
            "If Toby put as much time into maintaining his camper as he does into his Kerokerokeroppi collection, he wouldn't have to take it to the shop all the time.",
        games: [
            GamesEnum.NewLeaf,
            GamesEnum.HappyHomeDesigner,
            GamesEnum.NewHorizons,
            GamesEnum.HappyHomeParadise,
            GamesEnum.PocketCamp
        ],
        art: {
            villager: 'https://dodo.ac/np/images/5/59/Toby_NH_Model.png',
            card: 'https://dodo.ac/np/images/5/54/006_Toby_Sanrio_amiibo_card_NA.png',
            icon: 'https://dodo.ac/np/images/1/12/Toby_NH_Villager_Icon.png'
        },
        song: KKSliderSongs.KingKK,
        skill: 'Simming',
        goal: 'Weatherperson',
        siblings: 'Youngest of 5 kids',
        coffeeRequest: {
            beans: CoffeeBeansEnum.Mocha,
            milk: CoffeeMilkEnum.TheRegularAmount,
            sugar: CoffeeSugarEnum.TwoSpoonfuls
        },
        birthday: {
            month: MonthsEnum.July,
            day: 10,
            zodiac: StarSignEnum.Cancer
        },
        amiibo: {
            series: AmiiboSeriesEnum.Sanrio,
            cardNumber: 6
        }
    }
];
