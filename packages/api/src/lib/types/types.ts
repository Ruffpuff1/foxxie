import type { RESTGetAPIUsersUserBansResult, RESTGetAPIUsersUserPronounsResult, RESTGetAPIUsersUserResult, RESTPostAPIUsersUserJSONBody } from './rest';

export interface Api {
    users: ApiUsers;
}

interface ApiUsers {
    (userId: string): ApiUsersUser;
}

/**
 * @endpoint /users/{user.id}
 */
interface ApiUsersUser {
    /**
     * Get a user by ID. Returns a user object.
     * @method GET
     */
    get(): Promise<RESTGetAPIUsersUserResult>;

    /**
     * Create a new user, on success returns the user object.
     * If the user already exists returns a 20001 user already exists error.
     * @method POST
     */
    post(body?: RESTPostAPIUsersUserJSONBody): Promise<RESTGetAPIUsersUserResult>;

    /**
     * Bans endpoint
     */
    bans: ApiUsersUserBans;

    /**
     * Pronouns endpoint
     */
    pronouns: ApiUsersUserPronouns;
}

/**
 * @endpoint /users/{user.id}/bans
 */
interface ApiUsersUserBans {
    /**
     * Get a user's ban objects.
     * Will be an empty array if the user has no bans.
     * @method GET
     */
    get(): Promise<RESTGetAPIUsersUserBansResult>;
}

/**
 * @endpoint /users/{user.id}/pronouns
 */
interface ApiUsersUserPronouns {
    /**
     * Returns a user's pronoun object.
     * Pronoun integer will be a number between 0 and 16.
     * @method GET
     */
    get(): Promise<RESTGetAPIUsersUserPronounsResult>;
}
