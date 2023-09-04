import { GamesEnum, VillagerKey, KKSliderSongs, PersonalitiesEnum, SpeciesEnum, Villager, MonthsEnum, StarSignEnum } from '@foxxie/celestia-api-types';

export const Rhinos: Villager[] = [
    {
        key: VillagerKey.Azalea,
        keyJp: 'ペチュニア',
        gender: 'Female',
        personality: PersonalitiesEnum.Snooty,
        species: SpeciesEnum.Rhino,
        favoriteSaying: 'Colorful petals, deep roots.',
        catchphrase: 'merci',
        description: "Azalea is as elegant as a rose and equally as thorny. If you catch her in a bad mood, don't take it personally.",
        games: [GamesEnum.DoubutsuNoMori, GamesEnum.NewHorizons, GamesEnum.PocketCamp, GamesEnum.HappyHomeParadise],
        art: 'https://dodo.ac/np/images/e/ef/Azalea_amiibo.png',
        song: KKSliderSongs.KKLovers,
        birthday: {
            month: MonthsEnum.December,
            day: 18, 
            zodiac: StarSignEnum.Sagittarius
        }
    }
];
