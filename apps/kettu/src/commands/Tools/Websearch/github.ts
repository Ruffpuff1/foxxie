import { CommandName, ChatInputSubcommandArgs } from '#types/Interactions';
import { RegisterChatInputCommand } from '@foxxie/commands';
import { fetch } from '@foxxie/fetch';
import { GithubUserRegex } from '@ruffpuff/utilities';
import { Command, fromAsync, isErr } from '@sapphire/framework';
import type { Github } from '@foxxie/types';
import { Colors } from '#utils/constants';
import type { TFunction } from '@foxxie/i18n';
import { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageSelectOptionData } from 'discord.js';
import { LanguageKeys } from '#lib/i18n';
import { enUS, getGuildIds } from '#utils/util';
import { fetchIssuesAndPrs, fuzzilySearchForIssuesAndPullRequests, GithubOptionType } from '#utils/APIs';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { hideLinkEmbed, hyperlink } from '@discordjs/builders';

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.Github)
            .setDescription(LanguageKeys.Commands.Websearch.GithubDescription)
            .subcommand(command =>
                command //
                    .setName('user') //
                    .setDescription(LanguageKeys.Commands.Websearch.GithubDescriptionUser)
                    .addStringOption(option =>
                        option //
                            .setName(GithubOptionType.User)
                            .setDescription(enUS(LanguageKeys.Commands.Websearch.GithubOptionUser))
                            .setRequired(true)
                            .setAutocomplete(true)
                    )
            )
            .subcommand(command =>
                command //
                    .setName('repo')
                    .setDescription(LanguageKeys.Commands.Websearch.GithubDescriptionRepo)
                    .addStringOption(option =>
                        option //
                            .setName(GithubOptionType.Owner)
                            .setDescription(enUS(LanguageKeys.Commands.Websearch.GithubOptionOwner))
                            .setRequired(true)
                            .setAutocomplete(true)
                    )
                    .addStringOption(option =>
                        option //
                            .setName(GithubOptionType.Repo)
                            .setDescription(enUS(LanguageKeys.Commands.Websearch.GithubOptionRepo))
                            .setRequired(true)
                            .setAutocomplete(true)
                    )
                    .addNumberOption(option =>
                        option //
                            .setName('number')
                            .setDescription(enUS(LanguageKeys.Commands.Websearch.GithubOptionNumber))
                            .setRequired(false)
                            .setAutocomplete(true)
                    )
            ),
    {
        idHints: ['947857986594959390', '947873927873593364'],
        guildIds: getGuildIds()
    }
)
export class UserCommand extends Command {
    public async user(...[interaction, , args]: Required<ChatInputSubcommandArgs<CommandName.Github, 'user'>>): Promise<any> {
        await interaction.deferReply();

        const user = this.parseUser(args.user);
        const result = await fromAsync(this.fetchUserResult(user));

        if (isErr(result) || !result.value) return interaction.editReply(args.t(LanguageKeys.Commands.Websearch.GithubUserNotFound, { user }));
        const embed = this.buildUserEmbed(args.t, result.value!, interaction.guild?.me?.displayColor);

        return interaction.editReply({ embeds: [embed] });
    }

    public async repo(...[interaction, , args]: Required<ChatInputSubcommandArgs<CommandName.Github, 'repo'>>): Promise<any> {
        await interaction.deferReply();

        const user = this.parseUser(args.repo);
        const { repo, number, t } = args;

        if (number) {
            try {
                const data = await fetchIssuesAndPrs({ repository: repo, owner: user, number }, args.t);

                if (!data.author.login || !data.author.url || !data.number || !data.state || !data.title) throw new Error('Invalid');

                const parts = [
                    `${data.emoji} ${hyperlink(
                        `#${data.number} ${args.t(LanguageKeys.Globals.In).toLowerCase()} ${data.owner}/${data.repository}`,
                        hideLinkEmbed(data.url)
                    )} ${args.t(LanguageKeys.Globals.By).toLowerCase()} ${hyperlink(data.author.login, hideLinkEmbed(data.author.url))} ${data.dateString}`,
                    data.title
                ];

                return interaction.editReply(parts.join('\n'));
            } catch {
                const data = await fuzzilySearchForIssuesAndPullRequests({ repository: repo, owner: user, number: `${number}` }, t);

                if (!data.length) return interaction.editReply(args.t(LanguageKeys.Commands.Websearch.GithubIssuePRNotFound, { number }));

                const actionRow = new MessageActionRow() //
                    .setComponents(
                        new MessageSelectMenu() //
                            .setCustomId(`github|repo|${repo}|${user}`)
                            .setOptions(data.map<MessageSelectOptionData>(choice => ({ label: choice.name, value: choice.value.toString() })))
                    );

                await interaction.deleteReply();
                return interaction.followUp({
                    content: args.t(LanguageKeys.Commands.Websearch.GithubIssuePRNotFoundWithSelectMenuData, { number }),
                    components: [actionRow],
                    ephemeral: true
                });
            }
        }

        const result = await fromAsync(this.fetchRepoResult(user, repo));
        if (isErr(result) || !result.value) return interaction.editReply(args.t(LanguageKeys.Commands.Websearch.GithubRepoNotFound, { repo, user }));
        const display = this.buildRepoEmbed(args.t, result.value, interaction.guild?.me?.displayColor);

        return display.run(interaction, interaction.user);
    }

    private buildUserEmbed(t: TFunction, user: Github.User, color: number | undefined) {
        const none = t(LanguageKeys.Globals.None);
        const titles = t(LanguageKeys.Commands.Websearch.GithubTitles);

        const embed = new MessageEmbed()
            .setColor(color || Colors.Default)
            .setAuthor({ name: user.name ? `${user.name} [${user.login}]` : (user.login as string), iconURL: user.avatar_url as string, url: user.html_url as string })
            .setThumbnail(user.avatar_url as string)
            .setDescription(
                [
                    t(LanguageKeys.Commands.Websearch.GithubUserCreated, { date: user.created_at }),
                    t(LanguageKeys.Commands.Websearch.GithubUserUpdated, { date: user.updated_at })
                ].join('\n')
            );

        if (user.bio) embed.addField(titles.bio, user.bio as string);

        return embed
            .addField(titles.occupation, (user.company as string) || none, true)
            .addField(titles.location, (user.location as string) || none, true)
            .addField(titles.website, (user.blog as string) || none, true);
    }

    private buildRepoEmbed(t: TFunction, repo: Github.Repo, color: number | undefined) {
        const [none, yes, no] = [t(LanguageKeys.Globals.None), t(LanguageKeys.Globals.Yes), t(LanguageKeys.Globals.No)];
        const titles = t(LanguageKeys.Commands.Websearch.GithubTitles);

        const template = new MessageEmbed()
            .setColor(color || Colors.Default)
            .setAuthor({ name: `${repo.owner.login}/${repo.name}`, iconURL: repo.owner.avatar_url, url: repo.html_url })
            .setThumbnail(repo.owner.avatar_url);

        const display = new PaginatedMessage({ template });
        const PageLabels = t(LanguageKeys.Commands.Websearch.GithubSelectPages);

        return display //
            .setSelectMenuOptions(pageIndex => ({ label: PageLabels[pageIndex - 1] }))
            .addPageEmbed(embed => {
                if (repo.description) embed.addField(titles.description, repo.description);

                return embed //
                    .addField(titles.stars, repo.stargazers_count ? t(LanguageKeys.Globals.Number, { value: repo.stargazers_count }) : none, true)
                    .addField(titles.license, repo.license ? repo.license.name : none, true)
                    .addField(titles.archived, repo.archived ? yes : no, true)
                    .setDescription(
                        [
                            t(LanguageKeys.Commands.Websearch.GithubUserCreated, { date: repo.created_at }),
                            t(LanguageKeys.Commands.Websearch.GithubUserUpdated, { date: repo.updated_at })
                        ].join('\n')
                    );
            })
            .addAsyncPageEmbed(async embed => {
                const contributors = await this.fetchContributors(repo.contributors_url, t);

                return embed //
                    .addField(titles.openIssues, repo.open_issues ? t(LanguageKeys.Globals.Number, { value: repo.open_issues }) : none, true)
                    .addField(titles.forks, repo.forks ? t(LanguageKeys.Globals.Number, { value: repo.forks }) : none, true)
                    .addField(titles.language, repo.language ?? none, true)
                    .addField(titles.contributors, t(LanguageKeys.Globals.And, { value: contributors }));
            });
    }

    private async fetchUserResult(user: string) {
        const result = await fetch(UserCommand.baseURL) //
            .path('users') //
            .path(user) //
            .json<Github.User>();

        if (Reflect.has(result, 'message')) throw new Error(Reflect.get(result, 'message'));

        return result;
    }

    private async fetchRepoResult(owner: string, repo: string) {
        const result = await fetch(UserCommand.baseURL) //
            .path('repos') //
            .path(owner)
            .path(repo)
            .json<Github.Repo>();

        if (Reflect.has(result, 'message')) throw new Error(Reflect.get(result, 'message'));
        return result;
    }

    private async fetchContributors(url: string, t: TFunction) {
        const result = await fromAsync(async () =>
            fetch(url) //
                .json<Github.User[]>()
        );

        if (isErr(result) || !result.value?.length) return [];

        const list = result.value!.map(entry => `[${entry.login}](${entry.html_url})`);

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

        return [...newList, t(LanguageKeys.System.AndMore, { count: more })];
    }

    private parseUser(user: string) {
        const res = GithubUserRegex.exec(user);
        if (!res) return user;
        return res.groups?.login || user;
    }

    private static baseURL = 'https://api.github.com/';
}
