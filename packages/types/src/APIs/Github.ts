import type { Endpoints } from '@octokit/types';

export namespace Github {
    export type User = Endpoints['GET /users/{username}']['response']['data'];

    export type Repo = Endpoints['GET /repos/{owner}/{repo}']['response']['data'];

    export interface UserNotFound {
        message: string;
        documentation_url: string;
    }

    export type UserResult = UserNotFound | User;

    {
    }
}
