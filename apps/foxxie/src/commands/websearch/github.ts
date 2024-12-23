import makeRequest from '@aero/http';
import { GithubUserRegex } from '@ruffpuff/utilities';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { applyLocalizedBuilder } from '@sapphire/plugin-i18next';
import { Result } from '@sapphire/result';
import { Github } from '#lib/api/Github/types';
import { fetchIssuesAndPrs, fuzzilySearchForIssuesAndPullRequests } from '#lib/api/Github/util';
import { getSupportedUserLanguageT, LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/structures';
import { FTFunction } from '#lib/types';
import { Colors } from '#utils/constants';
import { RegisterChatInputCommand, RegisterChatInputSubcommandMethod, RequiresMemberPermissions } from '#utils/decorators';
import {
	ActionRowBuilder,
	APISelectMenuOption,
	EmbedBuilder,
	hideLinkEmbed,
	hyperlink,
	PermissionFlagsBits,
	SlashCommandBuilder,
	StringSelectMenuBuilder
} from 'discord.js';

@ApplyOptions<FoxxieSubcommand.Options>(GithubCommand.Options)
@RegisterChatInputCommand(GithubCommand.ChatInputBuilder, GithubCommand.IdHints)
@RegisterChatInputSubcommandMethod(GithubCommand.SubcommandKeys.Repository, (interaction) => GithubCommand.ChatInputRepository(interaction))
@RegisterChatInputSubcommandMethod(GithubCommand.SubcommandKeys.User, GithubCommand.ChatInputUser)
export class GithubCommand extends FoxxieSubcommand {
	public static ChatInputBuilder(builder: SlashCommandBuilder) {
		return applyLocalizedBuilder(builder, GithubCommand.Language.Name, GithubCommand.Language.Description)
			.addSubcommand((command) =>
				applyLocalizedBuilder(command, GithubCommand.Language.User).addStringOption((option) =>
					applyLocalizedBuilder(option, GithubCommand.Language.OptionsUser).setRequired(true).setAutocomplete(true)
				)
			)
			.addSubcommand((command) =>
				applyLocalizedBuilder(command, GithubCommand.Language.Repository)
					.addStringOption((option) =>
						applyLocalizedBuilder(option, GithubCommand.Language.OptionsOwner).setRequired(true).setAutocomplete(true)
					)
					.addStringOption((option) =>
						applyLocalizedBuilder(option, GithubCommand.Language.OptionsRepository).setRequired(true).setAutocomplete(true)
					)
					.addNumberOption((option) =>
						applyLocalizedBuilder(option, GithubCommand.Language.OptionsNumber).setRequired(false).setAutocomplete(true)
					)
			);
	}

	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	protected static async ChatInputRepository(interaction: FoxxieSubcommand.Interaction): Promise<any> {
		await interaction.deferReply();
		const t = getSupportedUserLanguageT(interaction);

		const user = GithubCommand.ParseUser(interaction.options.getString('owner', true));
		const number = interaction.options.getNumber('number');
		const repo = interaction.options.getString('repository', true);

		if (number) {
			try {
				const data = await fetchIssuesAndPrs({ number, owner: user, repository: repo });

				if (!data.author.login || !data.author.url || !data.number || !data.state || !data.title) throw new Error('Invalid');

				const parts = [
					`${data.emoji} ${hyperlink(
						`#${data.number} in ${data.owner}/${data.repository}`,
						hideLinkEmbed(data.url)
					)} by ${hyperlink(data.author.login, hideLinkEmbed(data.author.url))} ${data.dateString}`,
					data.title
				];

				return interaction.editReply(parts.join('\n'));
			} catch {
				const data = await fuzzilySearchForIssuesAndPullRequests({ number: `${number}`, owner: user, repository: repo });

				if (!data.length) return interaction.editReply('not found');

				const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>() //
					.setComponents(
						new StringSelectMenuBuilder() //
							.setCustomId(`github|repo|${repo}|${user}`)
							.setOptions(
								data.map(
									(choice) =>
										({
											label: choice.name,
											value: choice.value.toString()
										}) satisfies APISelectMenuOption
								)
							)
					);

				await interaction.deleteReply();
				return interaction.followUp({
					components: [actionRow],
					content: 'not found',
					ephemeral: true
				});
			}
		}

		const result = await Result.fromAsync(GithubCommand.FetchRepoResult(user, repo));
		if (result.isErr() || !result.unwrap()) return interaction.editReply('not found');
		const display = GithubCommand.BuildRepoEmbed(t, result.unwrap(), 0);

		return display.run(interaction, interaction.user);
	}

	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	protected static async ChatInputUser(interaction: FoxxieSubcommand.Interaction): Promise<any> {
		await interaction.deferReply();
		const t = getSupportedUserLanguageT(interaction);

		const user = GithubCommand.ParseUser(interaction.options.getString('user', true));
		const result = await Result.fromAsync(GithubCommand.FetchUserResult(user));

		if (result.isErr() || !result.unwrap()) return interaction.editReply('not found');

		const embed = GithubCommand.BuildUserEmbed(t, result.unwrap()!, 0);

		return interaction.editReply({ embeds: [embed] });
	}

	private static BuildRepoEmbed(t: FTFunction, repo: Github.Repo, color: number | undefined) {
		const [none, yes, no] = [t(LanguageKeys.Globals.None), t(LanguageKeys.Globals.Yes), t(LanguageKeys.Globals.No)];
		const titles = t(LanguageKeys.Commands.Websearch.Github.RepositoryTitles);

		const template = new EmbedBuilder()
			.setColor(color || Colors.White)
			.setAuthor({ iconURL: repo.owner.avatar_url, name: `${repo.owner.login}/${repo.name}`, url: repo.html_url })
			.setThumbnail(repo.owner.avatar_url);

		const display = new PaginatedMessage({ template });
		const PageLabels = t(LanguageKeys.Commands.Websearch.Github.RepositorySelectMenuPages);

		return display //
			.setSelectMenuOptions((pageIndex) => ({ label: PageLabels[pageIndex - 1] }))
			.addPageEmbed((embed) => {
				if (repo.description) embed.addFields({ name: titles.description, value: repo.description });

				return embed
					.addFields(
						{
							inline: true,
							name: titles.stars,
							value: repo.stargazers_count ? t(LanguageKeys.Globals.NumberFormat, { value: repo.stargazers_count }) : none
						},
						{
							inline: true,
							name: titles.license,
							value: repo.license ? repo.license.name : none
						},
						{
							inline: true,
							name: titles.archived,
							value: repo.archived ? yes : no
						}
					)
					.setDescription(['created', 'updated'].join('\n'));
			})
			.addAsyncPageEmbed(async (embed) => {
				const contributors = await GithubCommand.FetchContributors(repo.contributors_url, t);

				return embed.addFields(
					{
						inline: true,
						name: titles.openIssues,
						value: repo.open_issues ? t(LanguageKeys.Globals.NumberFormat, { value: repo.open_issues }) : none
					},
					{
						inline: true,
						name: titles.forks,
						value: repo.forks ? t(LanguageKeys.Globals.NumberFormat, { value: repo.forks }) : none
					},
					{
						inline: true,
						name: titles.language,
						value: repo.language ?? none
					},
					{
						name: titles.contributors,
						value: t(LanguageKeys.Globals.And, { value: contributors })
					}
				);
			});
	}

	private static BuildUserEmbed(t: FTFunction, user: Github.User, color: number | undefined) {
		const none = t(LanguageKeys.Globals.None);
		const titles = t(LanguageKeys.Commands.Websearch.Github.RepositoryTitles);

		const embed = new EmbedBuilder()
			.setColor(color || Colors.White)
			.setAuthor({
				iconURL: user.avatar_url as string,
				name: user.name ? `${user.name} [${user.login}]` : (user.login as string),
				url: user.html_url as string
			})
			.setThumbnail(user.avatar_url as string)
			.setDescription(['created', 'updated at'].join('\n'));

		if (user.bio) embed.addFields({ name: titles.bio, value: user.bio });

		return embed.addFields(
			{
				inline: true,
				name: titles.occupation,
				value: user.company || none
			},
			{ inline: true, name: titles.location, value: user.location || none },
			{ inline: true, name: titles.website, value: user.blog || none }
		);
	}

	private static async FetchContributors(url: string, _: FTFunction) {
		const result = await Result.fromAsync(async () =>
			makeRequest(url) //
				.json<Github.User[]>()
		);

		if (result.isErr() || !result.unwrap()?.length) return [];

		const list = result.unwrap()!.map((entry) => hyperlink(entry.login, entry.html_url));

		let length = 0;
		const max = 920;
		const newList: string[] = [];

		for (const user of list) {
			if (length + user.length > max) break;
			length += user.length;

			newList.push(user);
		}

		const more = list.length - newList.length;
		if (more === 0) return newList;

		return [...newList, `and ${more} more.`];
	}

	private static async FetchRepoResult(owner: string, repo: string) {
		const result = await makeRequest(GithubCommand.BaseURL) //
			.path('repos') //
			.path(owner)
			.path(repo)
			.json<Github.Repo>();

		if (Reflect.has(result, 'message')) throw new Error(Reflect.get(result, 'message'));
		return result;
	}

	private static async FetchUserResult(user: string) {
		const result = await makeRequest(GithubCommand.BaseURL) //
			.path('users') //
			.path(user) //
			.json<Github.User>();

		if (Reflect.has(result, 'message')) throw new Error(Reflect.get(result, 'message'));

		return result;
	}

	private static ParseUser(user: string) {
		const res = GithubUserRegex.exec(user);
		if (!res) return user;
		return res.groups?.login || user;
	}

	public static BaseURL = 'https://api.github.com/';

	public static IdHints = [
		'1318534740382318613' // Nightly
	];

	public static Language = LanguageKeys.Commands.Websearch.Github;

	public static Options: FoxxieSubcommand.Options = {
		aliases: ['git', 'github'],
		description: GithubCommand.Language.Description
	};

	public static SubcommandKeys = {
		Repository: 'repository',
		User: 'user'
	};
}
