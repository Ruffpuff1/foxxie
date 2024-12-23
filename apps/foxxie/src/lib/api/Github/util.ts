import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';

import makeRequest from '@aero/http';
/**
 * @license MIT
 * @Copyright The Sapphire Community 2021
 */
import { time, TimestampStyles } from '@discordjs/builders';
import { cast, gql } from '@ruffpuff/utilities';
import { AutoCompleteLimits } from '@sapphire/discord.js-utilities';
import { Result } from '@sapphire/result';
import { cutText, isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { Emojis } from '#utils/constants';

import { Github } from './types.js';

export const enum GithubOptionType {
	Number = 'number',
	Owner = 'owner',
	Repo = 'repository',
	User = 'user'
}

export interface FetchIssuesAndPrsParameters extends GhSearchRepositoriesParameters {
	number: number;
	owner: string;
}

export interface GhSearchIssuesAndPullRequestsParameters extends GhSearchRepositoriesParameters {
	number: string;
	owner: string;
}

export interface GraphQLResponse<T extends 'data' | 'searchIssuesAndPrs' | 'searchRepositories' | 'searchUsers'> {
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
	state?: IssueState | PullRequestState;
	title?: string;
	url: string;
}

export type IssueState =
	/** An issue that has been closed */
	| 'CLOSED'
	/** An issue that is still open */
	| 'OPEN';

/** A repository pull request. */
export interface PullRequest {
	__typename?: 'PullRequest';
	/** The actor who authored the comment. */
	author?: Maybe<Actor>;
	/** Identifies the date and time when the object was closed. */
	closedAt?: Maybe<Scalars['DateTime']>;
	/** Identifies the date and time when the object was created. */
	createdAt: Scalars['DateTime'];
	/** Identifies if the pull request is a draft. */
	isDraft: Scalars['Boolean'];
	/** The date and time that the pull request was merged. */
	mergedAt?: Maybe<Scalars['DateTime']>;
	/** Identifies the pull request number. */
	number: Scalars['Int'];
	/** Identifies the state of the pull request. */
	state: PullRequestState;
	/** Identifies the pull request title. */
	title: Scalars['String'];
	/** The HTTP URL for this pull request. */
	url: Scalars['URI'];
}

export type PullRequestState =
	/** A pull request that has been closed without being merged. */
	| 'CLOSED'
	/** A pull request that has been closed by being merged. */
	| 'MERGED'
	/** A pull request that is still open. */
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

/** Represents an object which can take actions on GitHub. Typically a User or Bot. */
interface Actor {
	/** The username of the actor. */
	login: Scalars['String'];
	/** The HTTP URL for this actor. */
	url: Scalars['URI'];
}

interface GhSearchRepositoriesParameters {
	repository: string;
}

/** A list of results that matched against a search query. */
interface GraphQLConnection<T extends Github.User | Issue | PullRequest | Repository> {
	/** A list of nodes. */
	nodes: T[];
	/** The number of repositories that matched the search query. */
	repositoryCount: T extends Github.User ? never : number;
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

type Maybe<T> = null | T;

/** A repository contains the content for a project. */
interface Repository {
	__typename?: 'Repository';
	/** Returns a single issue from the current repository by number. */
	issue?: Maybe<Issue>;
	/** A list of issues that have been opened in the repository. */
	issues?: Maybe<GraphQLConnection<Issue>>;
	/** The name of the repository. */
	name: Scalars['String'];
	/** The repository's name with owner. */
	nameWithOwner: Scalars['String'];
	/** The User owner of the repository. */
	owner: RepositoryOwner;
	/** Returns a single pull request from the current repository by number. */
	pullRequest?: Maybe<PullRequest>;
	/** A list of pull requests that have been opened in the repository. */
	pullRequests?: Maybe<GraphQLConnection<PullRequest>>;
	/** The HTTP URL for this repository */
	url: Scalars['URI'];
}

/** Represents an owner of a Repository. */
interface RepositoryOwner {
	/** The username used to login. */
	login: Scalars['String'];
	/** The HTTP URL for the owner. */
	url: Scalars['URI'];
}

interface Scalars {
	/** The `Boolean` scalar type represents `true` or `false`. */
	Boolean: boolean;
	/** An ISO-8601 encoded date string. */
	Date: any;
	/** An ISO-8601 encoded UTC date string. */
	DateTime: any;
	ID: string;
	Int: number;
	String: string;
	/** A Git object ID. */
	URI: any;
}

/** The results of a search. */
type SearchResultItem = Repository;

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
		label: '⭐ Ruffpuff1',
		login: 'Ruffpuff1'
	},
	{
		label: '⭐ FoxxieBot',
		login: 'FoxxieBot'
	},
	{
		label: '⭐ SapphireDev',
		login: 'sapphiredev'
	},
	{
		label: '⭐ Discordjs',
		login: 'discordjs'
	},
	{
		label: '⭐ Nodejs',
		login: 'nodejs'
	}
];

export interface Label {
	label: `⭐ ${string}`;
	login: string;
}

const graphQLBaseURL = 'https://api.github.com/graphql';

export async function fetchFuzzyRepo(owner: string, repository: string) {
	const result = await Result.fromAsync(async () =>
		makeRequest(graphQLBaseURL) //
			.header({
				Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
				'Content-Type': 'application/json',
				'User-Agent': '@kettu'
			})
			.post()
			.body(
				JSON.stringify({
					query: repositorySearch,
					variables: { repository: `${owner}/${repository}` }
				})
			)
			.json<GraphQLResponse<'searchRepositories'>>()
	);

	if (result.isErr() || !result.unwrap().data?.search?.nodes) {
		return [];
	}

	return result.unwrap()!.data.search!.nodes.filter((repo) => cast<Github.Repo>(repo).visibility === 'PUBLIC');
}

export async function fetchFuzzyUser(user: string) {
	const result = await Result.fromAsync(async () =>
		makeRequest(graphQLBaseURL) //
			.header({
				Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
				'Content-Type': 'application/json',
				'User-Agent': '@kettu'
			})
			.post()
			.body(
				JSON.stringify({
					query: userSearch,
					variables: { user }
				})
			)
			.json<GraphQLResponse<'searchUsers'>>()
	);

	if (result.isErr() || !result.unwrap()?.data?.search?.nodes || !user) {
		return GithubUserDefaults;
	}

	return result.unwrap().data.search!.nodes;
}

export async function fetchIssuesAndPrs({ number, owner, repository }: FetchIssuesAndPrsParameters): Promise<IssueOrPrDetails> {
	const result = await Result.fromAsync(async () => {
		const response = await makeRequest(graphQLBaseURL)
			.header({
				Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
				'Content-Type': 'application/json',
				'User-Agent': '@kettu'
			})
			.body({
				query: issuesAndPrQuery,
				variables: { number, owner, repository }
			})
			.post()
			.json<GraphQLResponse<'data'>>();

		return response.data;
	});

	if (result.isErr() || (isNullish(result.unwrap().repository?.pullRequest) && isNullish(result.unwrap().repository?.issue))) {
		throw new Error('no-data');
	}

	if (result.unwrap().repository?.pullRequest) {
		return getDataForPullRequest(result.unwrap().repository!);
	} else if (result.unwrap().repository?.issue) {
		return getDataForIssue(result.unwrap().repository!);
	}

	// This gets handled into a response in the githubSearch command
	throw new Error('no-data');
}

export async function fuzzilySearchForIssuesAndPullRequests({
	number,
	owner,
	repository
}: GhSearchIssuesAndPullRequestsParameters): Promise<APIApplicationCommandOptionChoice[]> {
	const result = await Result.fromAsync(async () => {
		const response = await makeRequest(graphQLBaseURL)
			.header({
				Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
				'Content-Type': 'application/json',
				'User-Agent': '@kettu'
			})
			.body({
				query: issuesAndPrSearch,
				variables: { owner, repository }
			})
			.post()
			.json<GraphQLResponse<'searchIssuesAndPrs'>>();

		return response.data;
	});

	// If there are no results or there was an error then return an empty array
	if (result.isErr() || (isNullishOrEmpty(result.unwrap().repository?.pullRequests) && isNullishOrEmpty(result.unwrap().repository?.issues))) {
		return [];
	}

	return getDataForIssuesAndPrSearch(number, result.unwrap().repository?.pullRequests?.nodes, result.unwrap().repository?.issues?.nodes);
}

function getDataForIssue({ issue, ...repository }: Repository): IssueOrPrDetails {
	const dateToUse = issue?.state === 'CLOSED' ? new Date(issue?.closedAt) : new Date(issue?.createdAt);
	const dateOffset = time(dateToUse, TimestampStyles.RelativeTime);
	const dateStringPrefix = issue?.state === 'CLOSED' ? 'closed' : 'open';
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

function getDataForIssuesAndPrSearch(
	number: string,
	pullRequests: PullRequest[] | undefined,
	issues: Issue[] | undefined
): APIApplicationCommandOptionChoice[] {
	const numberParsedNumber = isNullishOrEmpty(number) ? NaN : Number(number);
	const issuesHasExactNumber = issues?.find((issue) => issue.number === numberParsedNumber);

	if (issuesHasExactNumber) {
		const parsedIssueState = issuesHasExactNumber?.state === 'OPEN' ? 'Open Issue' : 'Closed Issue';

		return [
			{
				name: cutText(
					`(${parsedIssueState}) - ${issuesHasExactNumber.number} - ${issuesHasExactNumber.title}`,
					AutoCompleteLimits.MaximumLengthOfNameOfOption
				),
				value: issuesHasExactNumber.number
			}
		];
	}

	const pullRequestsHaveExactNumber = pullRequests?.find((pullRequest) => pullRequest.number === numberParsedNumber);

	if (pullRequestsHaveExactNumber) {
		const parsedPullRequestState =
			pullRequestsHaveExactNumber?.state === 'CLOSED'
				? 'Closed Pull Request'
				: pullRequestsHaveExactNumber?.state === 'OPEN'
					? 'Open Pull Request'
					: 'Merged Pull Request';

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
			const parsedIssueState = issue?.state === 'OPEN' ? 'Open Issue' : 'Closed Issue';

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

			const parsedIssueState = is?.state === 'OPEN' ? 'Open Issue' : 'Closed Issue';

			issueResults.push({
				name: cutText(`(${parsedIssueState}) - ${is.number} - ${is.title}`, AutoCompleteLimits.MaximumLengthOfNameOfOption),
				value: is.number
			});
		}
	}

	if (!isNullishOrEmpty(pullRequests)) {
		for (const pullRequest of pullRequests) {
			const parsedPullRequestState =
				pullRequest?.state === 'CLOSED' ? 'Closed Pull Request' : pullRequest?.state === 'OPEN' ? 'Open Pull Request' : 'Merged Pull Request';

			if (!Number.isNaN(numberParsedNumber)) {
				if (!pullRequest.number.toString().charAt(0).startsWith(numberParsedNumber.toString().charAt(0))) {
					continue;
				}
			}

			pullRequestResults.push({
				name: cutText(
					`(${parsedPullRequestState}) - ${pullRequest.number} - ${pullRequest.title}`,
					AutoCompleteLimits.MaximumLengthOfNameOfOption
				),
				value: pullRequest.number
			});
		}

		if (!pullRequestResults.length) {
			const [req] = pullRequests;

			const parsedPullRequestState =
				req?.state === 'CLOSED' ? 'Closed Pull Request' : req?.state === 'OPEN' ? 'Open Pull Request' : 'Merged Pull Request';

			pullRequestResults.push({
				name: cutText(`(${parsedPullRequestState}) - ${req.number} - ${req.title}`, AutoCompleteLimits.MaximumLengthOfNameOfOption),
				value: req.number
			});
		}
	}

	return [...issueResults.slice(0, 9), ...pullRequestResults.slice(0, 9)];
}

function getDataForPullRequest({ pullRequest, ...repository }: Repository): IssueOrPrDetails {
	const dateToUse =
		pullRequest?.state === 'CLOSED'
			? new Date(pullRequest?.closedAt)
			: pullRequest?.state === 'OPEN'
				? new Date(pullRequest?.createdAt)
				: new Date(pullRequest?.mergedAt);
	const dateOffset = time(dateToUse, TimestampStyles.RelativeTime);
	const dateStringPrefix = pullRequest?.state === 'CLOSED' ? 'closed' : pullRequest?.state === 'OPEN' ? 'open' : 'merged';
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
