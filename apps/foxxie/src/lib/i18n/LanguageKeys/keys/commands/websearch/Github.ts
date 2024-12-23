import { FT, T } from '#lib/types';

export const Description = T('commands/websearch/github:description');
export const Name = T('commands/websearch/github:name');
export const OptionsNumber = T('commands/websearch/github:optionsNumber');
export const OptionsOwner = T('commands/websearch/github:optionsOwner');
export const OptionsRepository = T('commands/websearch/github:optionsRepository');
export const OptionsUser = T('commands/websearch/github:optionsUser');
export const Repository = T('commands/websearch/github:repository');
export const RepositoryIssueClosed = T('commands/websearch/github:repositoryIssueClosed');
export const RepositoryIssueMerged = T('commands/websearch/github:repositoryIssueMerged');
export const RepositoryIssueOpened = T('commands/websearch/github:repositoryIssueOpened');
export const RepositoryIssuePRNotFound = FT<{ number: number }>('commands/websearch/github:repositoryIssuePRNotFound');
export const RepositoryIssuePRNotFoundWithSelectMenuData = FT<{ number: number }>(
	'commands/websearch/github:repositoryIssuePRNotFoundWithSelectMenuData'
);
export const RepositoryNotFound = FT<{ repository: string; user: string }>('commands/websearch/github:repositoryNotFound');
export const RepositorySelectMenuPages = T<string[]>('commands/websearch/github:repositorySelectMenuPages');
export const RepositoryTitles = T<{
	archived: string;
	bio: string;
	contributors: string;
	description: string;
	forks: string;
	language: string;
	license: string;
	location: string;
	occupation: string;
	openIssues: string;
	stars: string;
	website: string;
}>('commands/websearch/github:repositoryTitles');
export const User = T('commands/websearch/github:user');
export const UserCreated = T('commands/websearch/github:userCreated');
export const UserNotFound = T('commands/websearch/github:userNotFound');
export const UserUpdated = T('commands/websearch/github:userUpdated');
