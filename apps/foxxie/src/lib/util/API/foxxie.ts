import {
    cb,
    Endpoints,
    EndpointsEnum,
    FoxxieApiError,
    PronounEnum,
    RESTJSONErrorCodes,
    RESTPostAPIUsersUserBansJSONBody,
    RESTPostAPIUsersUserJSONBody
} from '@foxxie/api';

function pronounEnumToString(key: PronounEnum) {
    switch (key) {
        case PronounEnum.None:
            return '';
        case PronounEnum.HeHim:
            return 'He/Him';
        case PronounEnum.HeHer:
            return 'He/Her';
        case PronounEnum.HeIt:
            return 'He/It';
        case PronounEnum.HeThey:
            return 'He/They';
        case PronounEnum.TheyThem:
            return 'They/Them';
        case PronounEnum.TheyHe:
            return 'They/He';
        case PronounEnum.TheyShe:
            return 'They/She';
        case PronounEnum.TheyIt:
            return 'They/It';
        case PronounEnum.SheHer:
            return 'She/Her';
        case PronounEnum.SheHim:
            return 'She/Him';
        case PronounEnum.SheIt:
            return 'She/It';
        case PronounEnum.SheThey:
            return 'She/They';
        case PronounEnum.ItIts:
            return 'It/Its';
        case PronounEnum.ItHim:
            return 'It/Him';
        case PronounEnum.ItHer:
            return 'It/Her';
        case PronounEnum.ItThem:
            return 'It/Them';
        case PronounEnum.Other:
            return 'Other';
        case PronounEnum.UseName:
            return 'Use Name';
        case PronounEnum.Ask:
            return 'Ask';
    }
}

/**
 * Transforms a pronoun integer into a string, or vice versa.
 * @param key Pronoun string, integer, or null.
 * @returns Pronoun string, integer, or null.
 */
export function pronouns(key: PronounEnum | null) {
    if (key === null || key === PronounEnum.None) return null;
    return pronounEnumToString(key);
}

export async function fetchApiUserButFallbackToCreating(userId: string, data: RESTPostAPIUsersUserJSONBody = {}) {
    try {
        const result = await cb<EndpointsEnum.GetUsersUser>(api => api.users(userId).get());
        return result;
    } catch (err) {
        if (err instanceof FoxxieApiError && err.code === RESTJSONErrorCodes.UserNotFound) {
            const result = await cb<EndpointsEnum.PostUsersUser>(api => api.users(userId).post(data));
            return result as User;
        }

        throw err;
    }
}

export async function fetchApiUserButFallbackToMock(userId: string): Promise<User> {
    try {
        const result = await cb<EndpointsEnum.GetUsersUser>(api => api.users(userId).get());
        return result;
    } catch (err) {
        if (err instanceof FoxxieApiError && err.code === RESTJSONErrorCodes.UserNotFound) {
            return {
                userId,
                pronouns: 0,
                bans: [],
                attributes: {
                    color: null,
                    email: null,
                    location: null,
                    twitter: null,
                    github: null
                },
                whitelisted: false
            };
        }

        throw err;
    }
}

type User = Endpoints[EndpointsEnum.GetUsersUser];
type A = keyof User;

interface UserCb<T extends User, R> {
    (model: T): Promise<R> | R;
}

export async function fetchUserProps<K>(userId: string, cb: UserCb<User, K>): Promise<K>;
export async function fetchUserProps<K1 extends A, K2 extends A>(userId: string, keys: [K1, K2]): Promise<[User[K1], User[K2]]>;
export async function fetchUserProps<K extends A>(userId: string, keys: K): Promise<User[K]>;
export async function fetchUserProps<K>(userId: string, keys: A | [A, A] | UserCb<User, K>) {
    const user = await fetchApiUserButFallbackToMock(userId);

    if (Array.isArray(keys)) {
        return keys.map(k => user[k]);
    } else if (typeof keys === 'function') {
        return keys(user);
    } 
        return user[keys];
    
}

export async function postApiBan(data: RESTPostAPIUsersUserBansJSONBody): Promise<Endpoints[EndpointsEnum.PostUsersUserBans]> {
    try {
        const result = await cb<EndpointsEnum.PostUsersUserBans>(api => api.users(data.userId).bans.post(data));
        return result;
    } catch (err) {
        if (err instanceof FoxxieApiError && err.code === RESTJSONErrorCodes.InvalidBan) throw err;
        return null!;
    }
}
