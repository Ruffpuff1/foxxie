import { api, Api, Endpoints, PronounEnum, RESTJSONErrorCodes, RESTPostAPIUsersUserJSONBody } from '@foxxie/api';

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

export async function fetchFoxxieApi<T extends keyof Endpoints>(cb: (api: Api) => Promise<Endpoints[T]>): Promise<Endpoints[T]> {
    try {
        const result = await cb(api());
        const isErr = Reflect.has(result, 'code');
        if (isErr) throw new FoxxieAPIError(result as any);

        return result as Endpoints[T];
    } catch (err) {
        throw err;
    }
}

export async function fetchApiUser(userId: string) {
    return fetchFoxxieApi<'GET /users/:id'>(api => api.users(userId).get());
}

export async function fetchApiUserButFallbackToCreating(userId: string, data: RESTPostAPIUsersUserJSONBody) {
    try {
        const result = await fetchApiUser(userId);
        return result;
    } catch (err) {
        if (err instanceof FoxxieAPIError && err.code === RESTJSONErrorCodes.UserNotFound) {
            const result = await fetchFoxxieApi(api => api.users(userId).post(data));
            return result;
        }

        throw err;
    }
}

export class FoxxieAPIError extends Error {
    public code: number;

    public message: string;

    public error: string;

    public constructor(data: { code: number; message?: string; error: string }) {
        super();
        this.code = data.code;
        this.message = data.message || data.error;
    }
}
