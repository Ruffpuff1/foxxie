import { FT, T } from '../../../types';

export const anime = {
    count: 'commands/websearch:anime.count',
    date: 'commands/websearch:anime.date',
    description: 'commands/websearch:anime.description',
    duration: 'commands/websearch:anime.duration',
    extendedUsage: 'commands/websearch:anime.extendedUsage',
    noResults: 'commands/websearch:anime.noResults',
    nsfw: 'commands/websearch:anime.nsfw',
    popularity: 'commands/websearch:anime.popularity',
    ranking: 'commands/websearch:anime.ranking',
    rating: 'commands/websearch:anime.rating'
};
export const github = {
    description: 'commands/websearch:github.description',
    extendedUsage: 'commands/websearch:github.extendedUsage',
    joined: 'commands/websearch:github.joined',
    modified: 'commands/websearch:github.modified',
    noUser: 'commands/websearch:github.noUser'
};

export const npmCreated = FT<{ created: Date }>('commands/websearch:npmCreated');
export const npmDescription = T('commands/websearch:npmDescription');
export const npmExtendedUsage = T('commands/websearch:npmExtendedUsage');
export const npmNoDependencies = T('commands/websearch:npmNoDependencies');
export const npmNoResults = FT<{ pack: string }>('commands/settings:npmNoResults');
export const npmTitles = T<{
    author: string;
    dependencies: string;
    description: string;
    license: string;
    main: string;
    maintainers: string;
}>('commands/websearch:npmTitles');
export const npmUpdated = T('commands/websearch:npmUpdated');

export const pokemon = {
    description: 'commands/websearch:pokemon.description',
    extendedUsage: 'commands/websearch:pokemon.extendedUsage',
    externalResource: 'commands/websearch:pokemon.externalResource',
    genderless: 'commands/websearch:pokemon.genderless',
    noEggGroups: 'commands/websearch:pokemon.noEggGroups',
    noEvolutions: 'commands/websearch:pokemon.noEvolutions',
    noExist: 'commands/websearch:pokemon.noExist'
};

export const dogDescription = T('commands/websearch:dogDescription');
export const dogTitle = T('commands/websearch:dogTitle');

export const foxDescription = T('commands/websearch:foxDescription');
export const foxTitle = T('commands/websearch:foxTitle');

export const defineDescription = T('commands/websearch:defineDescription');
export const defineExtendedUsage = T('commands/websearch:defineExtendedUsage');
export const defineNotFound = T('commands/websearch:defineNotFound');

export const webtoonDescription = T('commands/websearch:webtoonDescription');
export const webtoonExtendedUsage = T('commands/websearch:webtoonExtendedUsage');
export const webtoonNotFound = FT<{ search: string }, string>('commands/websearch:webtoonNotFound');
export const webtoonTitles = T<{
    author: string;
    average: string;
    favorite: string;
    genre: string;
    read: string;
    total: string;
}>('commands/websearch:webtoonTitles');