import type {
    RESTGetAPIUsersResult,
    RESTGetAPIUsersUserBansResult,
    RESTGetAPIUsersUserBaseObject,
    RESTGetAPIUsersUserPronounsResult,
    RESTGetAPIUsersUserResult,
    RESTPostAPIUsersUserBansJSONBody,
    RESTPostAPIUsersUserBansResult,
    RESTPostAPIUsersUserJSONBody
} from './rest';

/**
 * The Api routing function.
 */
export interface Api {
    /**
     * The `/users` endpoint.
     */
    users: ApiUsers;
}

/**
 * Represents the routes of the `/users` endpoint.
 */
interface ApiUsers {
    /**
     * Query a specific user by their `userId`.
     */
    (userId: string): ApiUsersUser;

    /**
     * Returns a list of Partial users in the API.
     * @method GET
     */
    get(): Promise<RESTGetAPIUsersResult>;
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
    post(body?: RESTPostAPIUsersUserJSONBody): Promise<RESTGetAPIUsersUserBaseObject>;

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
    /**
     * Add a new user ban to the user.
     * @method POST
     */
    post(body: RESTPostAPIUsersUserBansJSONBody): Promise<RESTPostAPIUsersUserBansResult>;
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
