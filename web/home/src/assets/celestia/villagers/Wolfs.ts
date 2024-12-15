import { GamesEnum, GenderEnum, KKSliderSongs, PersonalitiesEnum, SpeciesEnum, Villager, VillagerEnum } from '../types';

export const Wolfs: Villager[] = [
    {
        key: VillagerEnum.Audie,
        keyJp: 'モニカ',
        gender: GenderEnum.Female,
        personality: PersonalitiesEnum.Peppy,
        species: SpeciesEnum.Wolf,
        favoriteSaying: "Be the kind of person your future self won't regret having been.",
        catchphrase: 'foxtrot',
        description:
            "Audie has the ability to brighten anyone's day with her warm presence. No matter where you are, you'll feel like you're on vacation when you're talking to her.",
        games: [GamesEnum.NewHorizons, GamesEnum.PocketCamp, GamesEnum.HappyHomeParadise],
        art: 'https://dodo.ac/np/images/1/1b/Audie_NH.png',
        song: KKSliderSongs.KKIsland
    }
];
