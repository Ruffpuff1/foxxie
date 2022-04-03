/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { CombineObjects } from '@ruffpuff/ts';

export type RESTGetAPIUsersResult = {
    users: RESTGetAPIUsersUserBaseObject[];
};

export type RESTGetAPIUsersUserBaseObject = {
    userId: string;
    pronouns: PronounEnum;
};

export type RESTGetAPIUsersUserResult = CombineObjects<RESTGetAPIUsersUserBaseObject, RESTGetAPIUsersUserBansResult>;

export type RESTPostAPIUsersUserJSONBody = AddUndefinedToPossiblyUndefinedPropertiesOfInterface<{
    pronouns?: PronounEnum;
}>;

export type RESTGetAPIUsersUserBansResult = {
    bans: RESTGetAPIUserUserBansBan[];
};

export type RESTGetAPIUserUserBansBan = {
    provider: 'Foxxie';
    reason: string;
    moderatorId: string;
    createdAt: string;
    userId: string;
};

export type RESTGetAPIUsersUserPronounsResult = {
    pronouns: PronounEnum;
};

export enum PronounEnum {
    None,
    HeHim,
    HeHer,
    HeIt,
    HeThey,
    TheyThem,
    TheyHe,
    TheyShe,
    TheyIt,
    SheHer,
    SheHim,
    SheIt,
    SheThey,
    ItIts,
    ItHim,
    ItHer,
    ItThem
}

type AddUndefinedToPossiblyUndefinedPropertiesOfInterface<Base> = {
    [K in keyof Base]: Base[K] extends Exclude<Base[K], undefined> ? Base[K] : Base[K] | undefined;
};
