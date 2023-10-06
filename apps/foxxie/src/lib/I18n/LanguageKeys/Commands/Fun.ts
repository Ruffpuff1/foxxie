import { GetUserInfoResult } from '#Api/LastFm';
import { DetailedDescription, DetailedDescriptionArgs, FT, T } from '#lib/Types';

export const AnimalcrossingCoffee = FT<{ beans: string; milk: string; sugar: string }>('commands/fun:animalcrossingCoffee');
export const AnimalcrossingDetailedDescription = FT<DetailedDescriptionArgs, DetailedDescription>(
    'commands/fun:animalcrossingDetailedDescription'
);

export const AnimalcrossingFooter = T('commands/fun:animalcrossingFooter');
export const AnimalcrossingNoVillager = FT<{ villager: string }>('commands/fun:animalcrossingNoVillager');
export const AnimalcrossingNoVillagerProvided = T('commands/fun:animalcrossingNoVillagerProvided');
export const AnimalcrossingTitles = T<{
    birthday: string;
    catchphrase: string;
    coffee: string;
    game: string;
    gender: string;
    goal: string;
    personality: string;
    saying: string;
    series: string;
    siblings: string;
    skill: string;
    song: string;
    species: string;
    zodiac: string;
}>('commands/fun:animalcrossingTitles');

export const LastFmArtistListeners = FT<{ count: number }>('commands/fun:lastFmArtistListeners');
export const LastFmArtistPlaysByYou = FT<{ count: number }>('commands/fun:lastFmArtistPlaysByYou');
export const LastFmArtistPlaysByYouLastWeek = FT<{ count: number }>('commands/fun:lastFmArtistPlaysByYouLastWeek');
export const LastFmChatInputOptionArtistName = T('commands/fun:lastFmChatInputOptionArtistName');
export const LastFmChatInputOptionArtistDescription = T('commands/fun:lastFmChatInputOptionArtistDescription');
export const LastFmChatInputSubcommandArtistName = T('commands/fun:lastFmChatInputSubcommandArtistName');
export const LastFmChatInputSubcommandArtistDescription = T('commands/fun:lastFmChatInputSubcommandArtistDescription');
export const LastFmDetailedDescription = FT<DetailedDescriptionArgs, DetailedDescription>(
    'commands/fun:lastFmDetailedDescription'
);
export const LastFmStatsMostActiveDayOfWeek = FT<{ day: string }>('commands/fun:lastFmStatsMostActiveDayOfWeek');
export const LastFmNotLoggedIn = T('commands/fun:lastFmNotLoggedIn');
export const LastFmPlayListeners = FT<{ count: number }>('commands/fun:lastFmPlayListeners');
export const LastFmPlayNowPlaying = T('commands/fun:lastFmPlayNowPlaying');
export const LastFmPlayPlays = FT<{ count: number }>('commands/fun:lastFmPlayPlays');
export const LastFmPlayPlaysBy = FT<{ count: number; target: string }>('commands/fun:lastFmPlayPlaysBy');
export const LastFmPlayPlaysByYou = FT<{ count: number }>('commands/fun:lastFmPlayPlaysByYou');
export const LastFmPlayWasPlaying = T('commands/fun:lastFmPlayWasPlaying');
export const LastFmTitles = T<{
    about: string;
    lastFmStats: string;
    months: string;
    statistics: string;
    summary: string;
    years: string;
}>('commands/fun:lastFmTitles');
export const LastFmTrackNotFoundForUser = FT<{ user: GetUserInfoResult['user'] }>('commands/fun:lastFmTrackNotFoundForUser');
export const LastFmUserNotLoggedIn = FT<{ user: string }>('commands/fun:lastFmUserNotLoggedIn');
