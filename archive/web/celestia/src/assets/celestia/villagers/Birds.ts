import { AmiiboSeriesEnum, GamesEnum, KKSliderSongs, MonthsEnum, PersonalitiesEnum, SpeciesEnum, StarSignEnum, Villager, VillagerKey } from '@foxxie/celestia-api-types';

export const Birds: Villager[] = [
    {
        key: VillagerKey.Ace,
        keyJp: 'フェザー',
        gender: 'Male',
        personality: PersonalitiesEnum.Jock,
        species: SpeciesEnum.Bird,
        favoriteSaying: 'If you love something, let it go. Then chase it down. What were you thinking?',
        catchphrase: 'ace',
        description:
            "Ace is always on the move. The only surefire way to slow him down is to point a camera at him—he'll stop just long enough to flex for the photo.",
        games: [
            GamesEnum.DoubutsuNoMori,
            GamesEnum.AnimalCrossing,
            GamesEnum.NewHorizons,
            GamesEnum.PocketCamp,
            GamesEnum.HappyHomeParadise
        ],
        art: {
            villager: 'https://dodo.ac/np/images/9/91/Ace_amiibo.png',
            card: 'https://dodo.ac/np/images/2/27/443_Ace_amiibo_card_NA.png',
            icon: 'https://dodo.ac/np/images/4/4f/Ace_NH_Villager_Icon.png'
        },
        siblings: null,
        skill: null,
        goal: null,
        song: KKSliderSongs.KKHop,
        birthday: {
            month: MonthsEnum.August,
            day: 11,
            zodiac: StarSignEnum.Leo
        },
        amiibo: {
            series: AmiiboSeriesEnum.Five,
            cardNumber: 443
        }
    }
];
