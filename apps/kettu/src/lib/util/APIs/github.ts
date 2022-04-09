/**
 * @license MIT
 * @Copyright The Sapphire Community 2021
 */
import { time, TimestampStyles } from '@discordjs/builders';
import { fetch } from '@foxxie/fetch';
import type { Github } from '@foxxie/types';
import { cast, gql } from '@ruffpuff/utilities';
import { fromAsync, isErr } from '@sapphire/framework';
import { Emojis } from '..';
import { cutText, isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import { AutoCompleteLimits } from '@sapphire/discord.js-utilities';
import type { TFunction } from '@foxxie/i18n';
import { LanguageKeys } from '#lib/i18n';

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

const issuesAndPrQuery = gql`
    query ($repository: String!, $owner: String!, $number: Int!) {
        repository(owner: $owner, name: $repository) {
            name
            owner {
                login
            }
            issue(number: $number) {
                number
                title
                author {
                    login
                    url
                }
                state
                url
                createdAt
                closedAt
            }
            pullRequest(number: $number) {
                number
                title
                author {
                    login
                    url
                }
                isDraft
                state
                url
                createdAt
                closedAt
                mergedAt
            }
        }
    }
`;

const issuesAndPrSearch = gql`
    query ($repository: String!, $owner: String!) {
        repository(owner: $owner, name: $repository) {
            pullRequests(first: 100, orderBy: { field: UPDATED_AT, direction: DESC }) {
                nodes {
                    ... on PullRequest {
                        number
                        title
                        state
                    }
                }
            }
            issues(first: 100, orderBy: { field: UPDATED_AT, direction: DESC }) {
                nodes {
                    ... on Issue {
                        number
                        title
                        state
                    }
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

export async function fetchIssuesAndPrs({ repository, owner, number }: FetchIssuesAndPrsParameters, t: TFunction): Promise<IssueOrPrDetails> {
    const result = await fromAsync(async () => {
        const response = await fetch(graphQLBaseURL)
            .header({
                'User-Agent': '@kettu',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
            })
            .body({
                query: issuesAndPrQuery,
                variables: { repository, owner, number }
            })
            .post()
            .json<GraphQLResponse<'data'>>();

        return response.data;
    });

    if (isErr(result) || (isNullish(result.value.repository?.pullRequest) && isNullish(result.value.repository?.issue))) {
        throw new Error('no-data');
    }

    if (result.value.repository?.pullRequest) {
        return getDataForPullRequest(result.value.repository, t);
    } else if (result.value.repository?.issue) {
        return getDataForIssue(result.value.repository, t);
    }

    // This gets handled into a response in the githubSearch command
    throw new Error('no-data');
}

export async function fuzzilySearchForIssuesAndPullRequests(
    { repository, owner, number }: GhSearchIssuesAndPullRequestsParameters,
    t: TFunction
): Promise<APIApplicationCommandOptionChoice[]> {
    const result = await fromAsync(async () => {
        const response = await fetch(graphQLBaseURL)
            .header({
                'User-Agent': '@kettu',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
            })
            .body({
                query: issuesAndPrSearch,
                variables: { repository, owner }
            })
            .post()
            .json<GraphQLResponse<'searchIssuesAndPrs'>>();

        return response.data;
    });

    // If there are no results or there was an error then return an empty array
    if (isErr(result) || (isNullishOrEmpty(result.value.repository?.pullRequests) && isNullishOrEmpty(result.value.repository?.issues))) {
        return [];
    }

    return getDataForIssuesAndPrSearch(number, result.value.repository?.pullRequests?.nodes, result.value.repository?.issues?.nodes, t);
}

function getDataForIssuesAndPrSearch(
    number: string,
    pullRequests: PullRequest[] | undefined,
    issues: Issue[] | undefined,
    t: TFunction
): APIApplicationCommandOptionChoice[] {
    const numberParsedNumber = isNullishOrEmpty(number) ? NaN : Number(number);
    const issuesHasExactNumber = issues?.find(issue => issue.number === numberParsedNumber);

    if (issuesHasExactNumber) {
        const parsedIssueState =
            issuesHasExactNumber?.state === 'OPEN' ? t(LanguageKeys.Commands.Websearch.GithubLabelIssueOpen) : t(LanguageKeys.Commands.Websearch.GithubLabelIssueClosed);

        return [
            {
                name: cutText(`(${parsedIssueState}) - ${issuesHasExactNumber.number} - ${issuesHasExactNumber.title}`, AutoCompleteLimits.MaximumLengthOfNameOfOption),
                value: issuesHasExactNumber.number
            }
        ];
    }

    const pullRequestsHaveExactNumber = pullRequests?.find(pullRequest => pullRequest.number === numberParsedNumber);

    if (pullRequestsHaveExactNumber) {
        const parsedPullRequestState =
            pullRequestsHaveExactNumber?.state === 'CLOSED'
                ? t(LanguageKeys.Commands.Websearch.GithubLabelPrClosed)
                : pullRequestsHaveExactNumber?.state === 'OPEN'
                ? t(LanguageKeys.Commands.Websearch.GithubLabelPrOpen)
                : t(LanguageKeys.Commands.Websearch.GithubLabelPrMerged);

        return [
            {
                name: cutText(
                    `(${parsedPullRequestState}) - ${pullRequestsHaveExactNumber.number} - ${pullRequestsHaveExactNumber.title}`,
                    AutoCompleteLimits.MaximumLengthOfNameOfOption
                ),
                value: pullRequestsHaveExactNumber.number
            }
        ];
    }

    const issueResults: APIApplicationCommandOptionChoice[] = [];
    const pullRequestResults: APIApplicationCommandOptionChoice[] = [];

    if (!isNullishOrEmpty(issues)) {
        for (const issue of issues) {
            const parsedIssueState =
                issue?.state === 'OPEN' ? t(LanguageKeys.Commands.Websearch.GithubLabelIssueOpen) : t(LanguageKeys.Commands.Websearch.GithubLabelIssueClosed);

            if (!Number.isNaN(numberParsedNumber)) {
                if (!issue.number.toString().charAt(0).startsWith(numberParsedNumber.toString().charAt(0))) {
                    continue;
                }
            }

            issueResults.push({
                name: cutText(`(${parsedIssueState}) - ${issue.number} - ${issue.title}`, AutoCompleteLimits.MaximumLengthOfNameOfOption),
                value: issue.number
            });
        }

        if (!issueResults.length) {
            const [is] = issues;

            const parsedIssueState =
                is?.state === 'OPEN' ? t(LanguageKeys.Commands.Websearch.GithubLabelIssueOpen) : t(LanguageKeys.Commands.Websearch.GithubLabelIssueClosed);

            issueResults.push({
                name: cutText(`(${parsedIssueState}) - ${is.number} - ${is.title}`, AutoCompleteLimits.MaximumLengthOfNameOfOption),
                value: is.number
            });
        }
    }

    if (!isNullishOrEmpty(pullRequests)) {
        for (const pullRequest of pullRequests) {
            const parsedPullRequestState =
                pullRequest?.state === 'CLOSED'
                    ? t(LanguageKeys.Commands.Websearch.GithubLabelPrClosed)
                    : pullRequest?.state === 'OPEN'
                    ? t(LanguageKeys.Commands.Websearch.GithubLabelPrOpen)
                    : t(LanguageKeys.Commands.Websearch.GithubLabelPrMerged);

            if (!Number.isNaN(numberParsedNumber)) {
                if (!pullRequest.number.toString().charAt(0).startsWith(numberParsedNumber.toString().charAt(0))) {
                    continue;
                }
            }

            pullRequestResults.push({
                name: cutText(`(${parsedPullRequestState}) - ${pullRequest.number} - ${pullRequest.title}`, AutoCompleteLimits.MaximumLengthOfNameOfOption),
                value: pullRequest.number
            });
        }

        if (!pullRequestResults.length) {
            const [req] = pullRequests;

            const parsedPullRequestState =
                req?.state === 'CLOSED'
                    ? t(LanguageKeys.Commands.Websearch.GithubLabelPrClosed)
                    : req?.state === 'OPEN'
                    ? t(LanguageKeys.Commands.Websearch.GithubLabelPrOpen)
                    : t(LanguageKeys.Commands.Websearch.GithubLabelPrMerged);

            pullRequestResults.push({
                name: cutText(`(${parsedPullRequestState}) - ${req.number} - ${req.title}`, AutoCompleteLimits.MaximumLengthOfNameOfOption),
                value: req.number
            });
        }
    }

    return [...issueResults.slice(0, 9), ...pullRequestResults.slice(0, 9)];
}

function getDataForIssue({ issue, ...repository }: Repository, t: TFunction): IssueOrPrDetails {
    const dateToUse = issue?.state === 'CLOSED' ? new Date(issue?.closedAt) : new Date(issue?.createdAt);
    const dateOffset = time(dateToUse, TimestampStyles.RelativeTime);
    const dateStringPrefix = issue?.state === 'CLOSED' ? t(LanguageKeys.Commands.Websearch.GithubLabelClosed) : t(LanguageKeys.Commands.Websearch.GithubLabelOpen);
    const dateString = `${dateStringPrefix} ${dateOffset}`;

    return {
        author: {
            login: issue?.author?.login,
            url: issue?.author?.url
        },
        dateString,
        emoji: issue?.state === 'OPEN' ? Emojis.GithubIssueOpen : Emojis.GithubIssueClosed,
        issueOrPr: 'ISSUE',
        number: issue?.number,
        owner: repository.owner.login,
        repository: repository.name,
        state: issue?.state,
        title: issue?.title,
        url: issue?.url
    };
}

function getDataForPullRequest({ pullRequest, ...repository }: Repository, t: TFunction): IssueOrPrDetails {
    const dateToUse =
        pullRequest?.state === 'CLOSED'
            ? new Date(pullRequest?.closedAt)
            : pullRequest?.state === 'OPEN'
            ? new Date(pullRequest?.createdAt)
            : new Date(pullRequest?.mergedAt);
    const dateOffset = time(dateToUse, TimestampStyles.RelativeTime);
    const dateStringPrefix =
        pullRequest?.state === 'CLOSED'
            ? t(LanguageKeys.Commands.Websearch.GithubLabelClosed)
            : pullRequest?.state === 'OPEN'
            ? t(LanguageKeys.Commands.Websearch.GithubLabelOpen)
            : t(LanguageKeys.Commands.Websearch.GithubLabelMerged);
    const dateString = `${dateStringPrefix} ${dateOffset}`;

    const getEmoji = () => {
        if (pullRequest?.state === 'CLOSED') return Emojis.GithubPRClosed;

        if (pullRequest?.state === 'OPEN') {
            if (pullRequest?.isDraft) {
                return '';
            }

            return Emojis.GithubPROpen;
        }

        return Emojis.GithubPRMerged;
    };

    return {
        author: {
            login: pullRequest?.author?.login,
            url: pullRequest?.author?.url
        },
        dateString,
        emoji: getEmoji(),
        issueOrPr: 'PR',
        number: pullRequest?.number,
        owner: repository.owner.login,
        repository: repository.name,
        state: pullRequest?.state,
        title: pullRequest?.title,
        url: pullRequest?.url
    };
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
