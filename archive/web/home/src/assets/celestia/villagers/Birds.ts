import { GamesEnum, GenderEnum, KKSliderSongs, PersonalitiesEnum, SpeciesEnum, Villager, VillagerEnum } from '../types';

export const Birds: Villager[] = [
    {
        key: VillagerEnum.Ace,
        keyJp: 'フェザー',
        gender: GenderEnum.Male,
        personality: PersonalitiesEnum.Jock,
        species: SpeciesEnum.Bird,
        favoriteSaying: 'If you love something, let it go. Then chase it down. What were you thinking?',
        catchphrase: 'ace',
        description: "Ace is always on the move. The only surefire way to slow him down is to point a camera at him—he'll stop just long enough to flex for the photo.",
        games: [GamesEnum.DoubutsuNoMori, GamesEnum.AnimalCrossing, GamesEnum.NewHorizons, GamesEnum.PocketCamp, GamesEnum.HappyHomeParadise],
        art: 'https://dodo.ac/np/images/9/91/Ace_amiibo.png',
        song: KKSliderSongs.KKHop
    }
];
