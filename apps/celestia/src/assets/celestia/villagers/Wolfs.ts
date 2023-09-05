import {
    AmiiboSeriesEnum,
    GamesEnum,
    KKSliderSongs,
    MonthsEnum,
    PersonalitiesEnum,
    SpeciesEnum,
    StarSignEnum,
    Villager,
    VillagerKey
} from '@foxxie/celestia-api-types';

export const Wolfs: Villager[] = [
    {
        key: VillagerKey.Audie,
        keyJp: 'モニカ',
        gender: 'Female',
        personality: PersonalitiesEnum.Peppy,
        species: SpeciesEnum.Wolf,
        favoriteSaying: "Be the kind of person your future self won't regret having been.",
        catchphrase: 'foxtrot',
        description:
            "Audie has the ability to brighten anyone's day with her warm presence. No matter where you are, you'll feel like you're on vacation when you're talking to her.",
        games: [GamesEnum.NewHorizons, GamesEnum.PocketCamp, GamesEnum.HappyHomeParadise],
        art: {
            villager: 'https://dodo.ac/np/images/1/1b/Audie_NH.png',
            card: 'https://dodo.ac/np/images/2/20/428_Audie_amiibo_card_NA.png',
            icon: 'https://dodo.ac/np/images/9/9e/Audie_NH_Villager_Icon.png'
        },
        siblings: null,
        skill: null,
        goal: null,
        song: KKSliderSongs.KKIsland,
        birthday: {
            month: MonthsEnum.August,
            day: 31,
            zodiac: StarSignEnum.Virgo
        },
        amiibo: {
            series: AmiiboSeriesEnum.Five,
            cardNumber: 428
        }
    }
];
