import type { Endpoints } from '@octokit/types';
/**
 * Types used in Kettu for Github's REST API.
 * @link https://docs.github.com/en/rest/reference
 */
export namespace Github {
	export type Repo = Endpoints['GET /repos/{owner}/{repo}']['response']['data'];

	export type User = Endpoints['GET /users/{username}']['response']['data'];

	export interface UserNotFound {
		documentation_url: string;
		message: string;
	}

	export type UserResult = User | UserNotFound;
}
