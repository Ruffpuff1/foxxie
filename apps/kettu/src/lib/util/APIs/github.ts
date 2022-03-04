/**
 * @license MIT
 * @Copyright The Sapphire Community 2021
 */
import { fetch } from '@foxxie/fetch';
import type { Github } from '@foxxie/types';
import { cast, gql } from '@ruffpuff/utilities';
import { fromAsync, isErr } from '@sapphire/framework';

export type PullRequestState =
    /** A pull request that has been closed without being merged. */
    | 'CLOSED'
    /** A pull request that has been closed by being merged. */
    | 'MERGED'
    /** A pull request that is still open. */
    | 'OPEN';

export type IssueState =
    /** An issue that has been closed */
    | 'CLOSED'
    /** An issue that is still open */
    | 'OPEN';

/** The query root of GitHub's GraphQL interface. */
export interface Query {
    __typename?: 'Query';
    /** Lookup a given repository by the owner and repository name. */
    repository?: Maybe<Repository>;
    /** Lookup a given repository by the owner and repository name. */
    repositoryIssuesAndPrs?: Maybe<Repository>;
    /** Lookup a given repository by the owner and repository name. */
    search?: Maybe<GraphQLConnection<SearchResultItem>>;

    searchUsers?: Maybe<GraphQLConnection<Github.User>>;
}

/** A repository contains the content for a project. */
interface Repository {
    __typename?: 'Repository';
    /** Returns a single issue from the current repository by number. */
    issue?: Maybe<Issue>;
    /** The name of the repository. */
    name: Scalars['String'];
    /** The repository's name with owner. */
    nameWithOwner: Scalars['String'];
    /** The User owner of the repository. */
    owner: RepositoryOwner;
    /** Returns a single pull request from the current repository by number. */
    pullRequest?: Maybe<PullRequest>;
    /** The HTTP URL for this repository */
    url: Scalars['URI'];
    /** A list of issues that have been opened in the repository. */
    issues?: Maybe<GraphQLConnection<Issue>>;
    /** A list of pull requests that have been opened in the repository. */
    pullRequests?: Maybe<GraphQLConnection<PullRequest>>;
}

/** Represents an owner of a Repository. */
interface RepositoryOwner {
    /** The username used to login. */
    login: Scalars['String'];
    /** The HTTP URL for the owner. */
    url: Scalars['URI'];
}

/** An Issue is a place to discuss ideas, enhancements, tasks, and bugs for a project. */
interface Issue {
    __typename?: 'Issue';
    /** The actor who authored the comment. */
    author?: Maybe<Actor>;
    /** Identifies the date and time when the object was closed. */
    closedAt?: Maybe<Scalars['DateTime']>;
    /** Identifies the date and time when the object was created. */
    createdAt: Scalars['DateTime'];
    /** Identifies the issue number. */
    number: Scalars['Int'];
    /** Identifies the state of the issue. */
    state: IssueState;
    /** Identifies the issue title. */
    title: Scalars['String'];
    /** The HTTP URL for this issue */
    url: Scalars['URI'];
}

/** A repository pull request. */
export interface PullRequest {
    __typename?: 'PullRequest';
    /** The actor who authored the comment. */
    author?: Maybe<Actor>;
    /** Identifies the date and time when the object was closed. */
    closedAt?: Maybe<Scalars['DateTime']>;
    /** Identifies the date and time when the object was created. */
    createdAt: Scalars['DateTime'];
    /** The date and time that the pull request was merged. */
    mergedAt?: Maybe<Scalars['DateTime']>;
    /** Identifies the pull request number. */
    number: Scalars['Int'];
    /** Identifies if the pull request is a draft. */
    isDraft: Scalars['Boolean'];
    /** Identifies the state of the pull request. */
    state: PullRequestState;
    /** Identifies the pull request title. */
    title: Scalars['String'];
    /** The HTTP URL for this pull request. */
    url: Scalars['URI'];
}

/** Represents an object which can take actions on GitHub. Typically a User or Bot. */
interface Actor {
    /** The username of the actor. */
    login: Scalars['String'];
    /** The HTTP URL for this actor. */
    url: Scalars['URI'];
}

/** A list of results that matched against a search query. */
interface GraphQLConnection<T extends Github.User | Repository | Issue | PullRequest> {
    /** The number of repositories that matched the search query. */
    repositoryCount: T extends Github.User ? never : number;
    /** A list of nodes. */
    nodes: T[];
}

/** The results of a search. */
type SearchResultItem = Repository;

interface Scalars {
    ID: string;
    String: string;
    Int: number;
    /** An ISO-8601 encoded date string. */
    Date: any;
    /** An ISO-8601 encoded UTC date string. */
    DateTime: any;
    /** A Git object ID. */
    URI: any;
    /** The `Boolean` scalar type represents `true` or `false`. */
    Boolean: boolean;
}

type Maybe<T> = T | null;

export interface IssueOrPrDetails {
    author: {
        login?: string;
        url?: string;
    };
    dateString: string;
    emoji: string;
    issueOrPr: 'ISSUE' | 'PR';
    number?: number;
    owner: string;
    repository: string;
    state?: PullRequestState | IssueState;
    title?: string;
    url: string;
}

interface GhSearchRepositoriesParameters {
    repository: string;
}

export interface GhSearchIssuesAndPullRequestsParameters extends GhSearchRepositoriesParameters {
    owner: string;
    number: string;
}

export interface FetchIssuesAndPrsParameters extends GhSearchRepositoriesParameters {
    owner: string;
    number: number;
}

export interface GraphQLResponse<T extends 'searchRepositories' | 'searchIssuesAndPrs' | 'data' | 'searchUsers'> {
    data: T extends 'data'
        ? Record<'repository', Query['repository']>
        : T extends 'searchRepositories'
        ? Record<'search', Query['search']>
        : T extends 'searchIssuesAndPrs'
        ? Record<'repository', Query['repositoryIssuesAndPrs']>
        : T extends 'searchUsers'
        ? Record<'search', Query['searchUsers']>
        : never;
}

export const enum GithubOptionType {
    User = 'user',
    Owner = 'owner',
    Repo = 'repo'
}

export const repositorySearch = gql`
    query ($repository: String!) {
        search(type: REPOSITORY, query: $repository, first: 20) {
            nodes {
                ... on Repository {
                    name
                    visibility
                }
            }
        }
    }
`;

export const userSearch = gql`
    query ($user: String!) {
        search(type: USER, query: $user, first: 20) {
            nodes {
                ... on User {
                    login
                }
                ... on Organization {
                    login
                }
            }
        }
    }
`;

export const GithubUserDefaults: Label[] = [
    {
        login: 'Ruffpuff1',
        label: '⭐ Ruffpuff1'
    },
    {
        login: 'FoxxieBot',
        label: '⭐ FoxxieBot'
    },
    {
        login: 'sapphiredev',
        label: '⭐ SapphireDev'
    },
    {
        login: 'discordjs',
        label: '⭐ Discordjs'
    },
    {
        login: 'nodejs',
        label: '⭐ Nodejs'
    }
];

export interface Label {
    label: `⭐ ${string}`;
    login: string;
}

const graphQLBaseURL = 'https://api.github.com/graphql';

export async function fetchFuzzyRepo(owner: string, repository: string) {
    const result = await fromAsync(async () =>
        fetch(graphQLBaseURL, 'POST') //
            .header({
                'User-Agent': '@kettu',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
            })
            .body(
                JSON.stringify({
                    query: repositorySearch,
                    variables: { repository: `${owner}/${repository}` }
                })
            )
            .json<GraphQLResponse<'searchRepositories'>>()
    );

    if (isErr(result) || !result.value?.data?.search?.nodes) {
        return [];
    }

    return result.value!.data.search!.nodes.filter(repo => cast<Github.Repo>(repo).visibility === 'PUBLIC');
}

export async function fetchFuzzyUser(user: string) {
    const result = await fromAsync(async () =>
        fetch(graphQLBaseURL, 'POST') //
            .header({
                'User-Agent': '@kettu',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
            })
            .body(
                JSON.stringify({
                    query: userSearch,
                    variables: { user }
                })
            )
            .json<GraphQLResponse<'searchUsers'>>()
    );

    if (isErr(result) || !result.value?.data?.search?.nodes || !user) {
        return GithubUserDefaults;
    }

    return result.value.data.search!.nodes;
}
