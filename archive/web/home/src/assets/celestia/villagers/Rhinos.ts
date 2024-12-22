import { GamesEnum, GenderEnum, KKSliderSongs, PersonalitiesEnum, SpeciesEnum, Villager, VillagerEnum } from '../types';

export const Rhinos: Villager[] = [
    {
        key: VillagerEnum.Azalea,
        keyJp: 'ペチュニア',
        gender: GenderEnum.Female,
        personality: PersonalitiesEnum.Snooty,
        species: SpeciesEnum.Rhino,
        favoriteSaying: 'Colorful petals, deep roots.',
        catchphrase: 'merci',
        description: "Azalea is as elegant as a rose and equally as thorny. If you catch her in a bad mood, don't take it personally.",
        games: [GamesEnum.DoubutsuNoMori, GamesEnum.NewHorizons, GamesEnum.PocketCamp, GamesEnum.HappyHomeParadise],
        art: 'https://dodo.ac/np/images/e/ef/Azalea_amiibo.png',
        song: KKSliderSongs.KKLovers
    }
];
