import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { RegisterChatInputCommand } from '#utils/decorators';
import { fetch } from '@foxxie/fetch';
import { GithubUserRegex } from '@ruffpuff/utilities';
import { AutocompleteCommand, Command, fromAsync, isErr } from '@sapphire/framework';
import type { Github } from '@foxxie/types';
import { Colors } from '#utils/constants';
import type { TFunction } from '@sapphire/plugin-i18next';
import { MessageEmbed } from 'discord.js';
import { LanguageKeys } from '#lib/i18n';
import { enUS } from '#utils/util';
import { GithubOptionType, Label, fetchFuzzyRepo, fetchFuzzyUser } from '#utils/APIs';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';

@RegisterChatInputCommand(
    CommandName.Github,
    builder =>
        builder //
            .setName('github')
            .setDescription(enUS(LanguageKeys.Commands.Websearch.GithubDescription))
            .addSubcommand(command =>
                command //
                    .setName('user') //
                    .setDescription(enUS(LanguageKeys.Commands.Websearch.GithubDescriptionUser))
                    .addStringOption(option =>
                        option //
                            .setName(GithubOptionType.User)
                            .setDescription(enUS(LanguageKeys.Commands.Websearch.GithubOptionUser))
                            .setRequired(true)
                            .setAutocomplete(true)
                    )
            )
            .addSubcommand(command =>
                command //
                    .setName('repo')
                    .setDescription(enUS(LanguageKeys.Commands.Websearch.GithubDescriptionRepo))
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
            ),
    ['947857986594959390', '947873927873593364']
)
export class UserCommand extends Command {
    public chatInputRun(...[interaction, c, args]: ChatInputArgs<CommandName.Github>) {
        const subcommand = interaction.options.getSubcommand(true);
        args = args!;

        switch (subcommand) {
            case 'user':
                return this.user(interaction, c, args);
            case 'repo':
                return this.repo(interaction, c, args);
            default:
                throw new Error(`Unknown subcommand: ${subcommand}`);
        }
    }

    public async user(...[interaction, , args]: Required<ChatInputArgs<CommandName.Github>>): Promise<any> {
        await interaction.deferReply({ ephemeral: args.user.ephemeral });

        const user = this.parseUser(args.user.user);
        const result = await fromAsync(this.fetchUserResult(user));

        if (isErr(result) || !result.value) return interaction.editReply(args.t(LanguageKeys.Commands.Websearch.GithubUserNotFound, { user }));
        const embed = this.buildUserEmbed(args.t, result.value!);

        return interaction.editReply({ embeds: [embed] });
    }

    public async repo(...[interaction, , args]: Required<ChatInputArgs<CommandName.Github>>): Promise<any> {
        await interaction.deferReply({ ephemeral: args.repo.ephemeral });

        const user = this.parseUser(args.repo.owner);
        const { repo } = args.repo;

        const result = await fromAsync(this.fetchRepoResult(user, repo));
        if (isErr(result) || !result.value) return interaction.editReply(args.t(LanguageKeys.Commands.Websearch.GithubRepoNotFound, { repo, user }));
        const display = this.buildRepoEmbed(args.t, result.value);

        return display.run(interaction, interaction.user);
    }

    public async autocompleteRun(...[interaction]: Parameters<AutocompleteCommand['autocompleteRun']>) {
        const option = interaction.options.getFocused(true);

        switch (option.name) {
            case GithubOptionType.User:
            case GithubOptionType.Owner: {
                const fuzzyResult = await fetchFuzzyUser(option.value as string);
                return interaction.respond(fuzzyResult.map(entry => ({ value: entry.login, name: (entry as unknown as Label).label ?? entry.login })));
            }
            case GithubOptionType.Repo: {
                const fuzzyResult = await fetchFuzzyRepo(interaction.options.getString(GithubOptionType.Owner, true), option.value as string);
                return interaction.respond(fuzzyResult.map(entry => ({ value: entry.name, name: entry.name })));
            }
        }
    }

    private buildUserEmbed(t: TFunction, user: Github.User) {
        const none = 'None';
        const titles = t(LanguageKeys.Commands.Websearch.GithubTitles);

        const embed = new MessageEmbed()
            .setColor(Colors.Default)
            .setAuthor({ name: user.name ? `${user.name} [${user.login}]` : user.login, iconURL: user.avatar_url, url: user.html_url })
            .setThumbnail(user.avatar_url)
            .setDescription(
                [
                    t(LanguageKeys.Commands.Websearch.GithubUserCreated, { date: user.created_at }),
                    t(LanguageKeys.Commands.Websearch.GithubUserUpdated, { date: user.updated_at })
                ].join('\n')
            );

        if (user.bio) embed.addField(titles.bio, user.bio);

        return embed
            .addField(titles.occupation, user.company || none, true)
            .addField(titles.location, user.location || none, true)
            .addField(titles.website, user.blog || none, true);
    }

    private buildRepoEmbed(t: TFunction, repo: Github.Repo) {
        const [none, yes, no] = [t(LanguageKeys.Globals.None), t(LanguageKeys.Globals.Yes), t(LanguageKeys.Globals.No)];
        const titles = t(LanguageKeys.Commands.Websearch.GithubTitles);

        const template = new MessageEmbed()
            .setColor(Colors.Default)
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
                const contributors = await this.fetchContributors(repo.contributors_url);

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

    private async fetchContributors(url: string) {
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

        return [...newList, `${more} more.`];
    }

    private parseUser(user: string) {
        const res = GithubUserRegex.exec(user);
        if (!res) return user;
        return res.groups?.login || user;
    }

    private static baseURL = 'https://api.github.com/';
}
