import { GamesEnum, GenderEnum, KKSliderSongs, PersonalitiesEnum, SpeciesEnum, Villager, VillagerEnum } from '../types';

export const Octopuses: Villager[] = [
    {
        key: VillagerEnum.Cephalobot,
        keyJp: 'ギーガー',
        gender: GenderEnum.Male,
        personality: PersonalitiesEnum.Smug,
        species: SpeciesEnum.Octopus,
        favoriteSaying: 'Take me to your pizza.',
        catchphrase: 'donk donk',
        description: "With his metallic body and sci-fi flair, Cephalobot looks like he can shoot laser beams out of his eyes. Wait... He can't actually do that, right?",
        games: [GamesEnum.NewHorizons, GamesEnum.PocketCamp, GamesEnum.HappyHomeParadise],
        art: 'https://dodo.ac/np/images/b/b5/Cephalobot_amiibo.png',
        song: KKSliderSongs.KKRobotSynth
    }
];
