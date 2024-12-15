import { AmiiboSeriesEnum, GamesEnum, KKSliderSongs, MonthsEnum, PersonalitiesEnum, SpeciesEnum, StarSignEnum, Villager, VillagerKey } from '@foxxie/celestia-api-types';

export const Octopuses: Villager[] = [
    {
        key: VillagerKey.Cephalobot,
        keyJp: 'ギーガー',
        gender: 'Male',
        personality: PersonalitiesEnum.Smug,
        species: SpeciesEnum.Octopus,
        favoriteSaying: 'Take me to your pizza.',
        catchphrase: 'donk donk',
        description:
            "With his metallic body and sci-fi flair, Cephalobot looks like he can shoot laser beams out of his eyes. Wait... He can't actually do that, right?",
        games: [GamesEnum.NewHorizons, GamesEnum.PocketCamp, GamesEnum.HappyHomeParadise],
        art: {
            villager: 'https://dodo.ac/np/images/b/b5/Cephalobot_amiibo.png',
            card: 'https://dodo.ac/np/images/3/35/439_Cephalobot_amiibo_card_NA.png',
            icon: 'https://dodo.ac/np/images/c/c3/Cephalobot_NH_Villager_Icon.png'
        },
        siblings: null,
        skill: null,
        goal: null,
        song: KKSliderSongs.KKRobotSynth,
        birthday: {
            month: MonthsEnum.April,
            day: 1,
            zodiac: StarSignEnum.Aries
        },
        amiibo: {
            series: AmiiboSeriesEnum.Five,
            cardNumber: 439
        }
    }
];
