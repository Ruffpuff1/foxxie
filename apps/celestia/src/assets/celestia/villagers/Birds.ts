import { GamesEnum, KKSliderSongs, MonthsEnum, PersonalitiesEnum, SpeciesEnum, StarSignEnum, Villager, VillagerKey } from '@foxxie/celestia-api-types';

export const Birds: Villager[] = [
    {
        key: VillagerKey.Ace,
        keyJp: 'フェザー',
        gender: 'Male',
        personality: PersonalitiesEnum.Jock,
        species: SpeciesEnum.Bird,
        favoriteSaying: 'If you love something, let it go. Then chase it down. What were you thinking?',
        catchphrase: 'ace',
        description: "Ace is always on the move. The only surefire way to slow him down is to point a camera at him—he'll stop just long enough to flex for the photo.",
        games: [GamesEnum.DoubutsuNoMori, GamesEnum.AnimalCrossing, GamesEnum.NewHorizons, GamesEnum.PocketCamp, GamesEnum.HappyHomeParadise],
        art: 'https://dodo.ac/np/images/9/91/Ace_amiibo.png',
        song: KKSliderSongs.KKHop,
        birthday: {
            month: MonthsEnum.August,
            day: 11,
            zodiac: StarSignEnum.Leo
        }
    }
];
