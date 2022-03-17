import { AutocompleteCommand, Command } from '@sapphire/framework';
import { ApplicationCommandOptionChoice, MessageEmbed } from 'discord.js';
import { RegisterChatInputCommand } from '#utils/decorators';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { LanguageKeys } from '#lib/i18n';
import { enUS } from '#utils/util';
import { fetch } from '@foxxie/fetch';
import type { Npm } from '@foxxie/types';
import { toTitleCase } from '@ruffpuff/utilities';
import { Colors } from '#utils/constants';
import type { TFunction } from '@sapphire/plugin-i18next';

const LOGO = 'https://cdn.ruffpuff.dev/npm.png';

@RegisterChatInputCommand(
    CommandName.Npm,
    builder =>
        builder //
            .setDescription(enUS(LanguageKeys.Commands.Websearch.NpmDescription))
            .addStringOption(option =>
                option //
                    .setName('package')
                    .setDescription(enUS(LanguageKeys.Commands.Websearch.NpmOptionPackage))
                    .setRequired(true)
                    .setAutocomplete(true)
            )
            .addBooleanOption(option =>
                option //
                    .setName('ephemeral')
                    .setDescription(enUS(LanguageKeys.System.OptionEphemeralDefaultFalse))
                    .setRequired(false)
            ),
    []
)
export class UserCommand extends Command {
    public override async chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Npm>): Promise<void> {
        const { ephemeral, package: query, t } = args!;
        await interaction.deferReply({ ephemeral: ephemeral ?? false });
        const url = `https://registry.yarnpkg.com/${query}`;

        const data = await fetch(url).json<Npm.Result>();
        if (data.error || data.code === 'MethodNotAllowedError') {
            await interaction.editReply(t(LanguageKeys.Commands.Websearch.NpmNoResults, { package: query }));
            return;
        }

        const latest = data.versions[data['dist-tags'].latest];
        const githubTitles = t(LanguageKeys.Commands.Websearch.GithubTitles);
        const titles = t(LanguageKeys.Commands.Websearch.NpmTitles);
        const none = toTitleCase(t(LanguageKeys.Globals.None));

        const embed = new MessageEmbed()
            .setColor(interaction.guild?.me?.displayColor || Colors.Default)
            .setThumbnail(LOGO)
            .setAuthor({ name: `${data.name} [v${data['dist-tags'].latest}]`, iconURL: LOGO, url })
            .setDescription(
                [
                    t(LanguageKeys.Commands.Websearch.GithubUserCreated, { date: data.time.created }),
                    t(LanguageKeys.Commands.Websearch.GithubUserUpdated, { date: data.time[data['dist-tags'].latest] })
                ].join('\n')
            )
            .addField(githubTitles.description, latest.description.replace(/<[^>]*>/gm, '') || none)
            .addField(titles.main, latest.main || none, true)
            .addField(titles.author, latest.author?.name || latest.maintainers[0]?.name || none, true)
            .addField(githubTitles.license, latest.license || none, true)
            .addField(titles.maintainers, latest.maintainers.map(maintainer => `[${maintainer.name}](https://www.npmjs.com/~${maintainer.name})`).join(', '))
            .addField(titles.dependencies, this.formatDeps(latest, t));

        await interaction.editReply({ embeds: [embed] });
    }

    public override autocompleteRun(...[interaction]: Parameters<AutocompleteCommand['autocompleteRun']>) {
        const option = interaction.options.getFocused(true);
        if (!option.value) return interaction.respond(UserCommand.Packages);

        return interaction.respond([{ name: option.value as string, value: option.value }]);
    }

    private formatDeps(latest: Npm.Package, t: TFunction) {
        if (!latest.dependencies) return t(LanguageKeys.Commands.Websearch.NpmNoDependencies);
        const keys = Object.keys(latest.dependencies);

        const depArr: string[] = [];
        let count = 0;
        for (const k of keys) {
            if (count >= 10) break;
            depArr.push(`[${k}](https://www.npmjs.com/${k})`);
            count++;
        }

        const remaining = keys.length - depArr.length;
        if (remaining !== 0) depArr.push(t(LanguageKeys.System.AndMore, { remaining: count }));

        return t(LanguageKeys.Globals.And, { value: depArr });
    }

    private static Packages: (ApplicationCommandOptionChoice & { name: `⭐️ ${string}` })[] = [
        {
            name: '⭐️ @foxxie/fetch',
            value: '@foxxie/fetch'
        },
        {
            name: '⭐️ @ruffpuff/celestia',
            value: '@ruffpuff/celestia'
        },
        {
            name: '⭐️ @sapphire/framework',
            value: '@sapphire/framework'
        },
        {
            name: '⭐️ discord.js',
            value: 'discord.js'
        },
        {
            name: '⭐️ eslint',
            value: 'eslint'
        },
        {
            name: '⭐️ turbo',
            value: 'turbo'
        }
    ];
}
