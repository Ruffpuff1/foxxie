import { GamesEnum, VillagerKey, KKSliderSongs, PersonalitiesEnum, SpeciesEnum, Villager, MonthsEnum, StarSignEnum, AmiiboSeriesEnum } from '@foxxie/celestia-api-types';

export const Rhinos: Villager[] = [
    {
        key: VillagerKey.Azalea,
        keyJp: 'ペチュニア',
        gender: 'Female',
        personality: PersonalitiesEnum.Snooty,
        species: SpeciesEnum.Rhino,
        favoriteSaying: 'Colorful petals, deep roots.',
        catchphrase: 'merci',
        description:
            "Azalea is as elegant as a rose and equally as thorny. If you catch her in a bad mood, don't take it personally.",
        games: [GamesEnum.DoubutsuNoMori, GamesEnum.NewHorizons, GamesEnum.PocketCamp, GamesEnum.HappyHomeParadise],
        art: {
            villager: 'https://dodo.ac/np/images/e/ef/Azalea_amiibo.png',
            card: 'https://dodo.ac/np/images/9/99/446_Azalea_amiibo_card_NA.png',
            icon: 'https://dodo.ac/np/images/d/d4/Azalea_NH_Villager_Icon.png'
        },
        siblings: null,
        goal: null,
        skill: null,
        song: KKSliderSongs.KKLovers,
        birthday: {
            month: MonthsEnum.December,
            day: 18,
            zodiac: StarSignEnum.Sagittarius
        },
        amiibo: {
            series: AmiiboSeriesEnum.Five,
            cardNumber: 446
        }
    }
];
