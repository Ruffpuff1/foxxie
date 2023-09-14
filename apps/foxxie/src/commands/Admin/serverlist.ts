import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import { PermissionLevels } from '#lib/Types';
import { chunk } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { EmbedBuilder, Message, escapeMarkdown } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['sl'],
    permissionLevel: PermissionLevels.BotOwner,
    guarded: true,
    description: LanguageKeys.Commands.Admin.ServerlistDescription
    // detailedDescription: LanguageKeys.Commands.Admin.ServerlistDetailedDescription
})
export class UserCommand extends FoxxieCommand {
    public async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<void> {
        const template = new EmbedBuilder()
            .setAuthor({
                name: args.t(LanguageKeys.Commands.Admin.ServerlistTitle, { name: this.client.user!.username }),
                iconURL: this.client.user!.displayAvatarURL()
            })
            .setColor(args.color);

        const display = new PaginatedMessage({ template });
        display.pageIndexPrefix = args.t(LanguageKeys.Commands.Admin.ServerlistFooter, { count: this.client.guilds.cache.size });

        const guildArray = this.client.guilds.cache
            .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
            .map(r => r)
            .map((guild, idx) =>
                [
                    `${args.t(LanguageKeys.Globals.NumberFormat, { value: idx + 1 })}.`,
                    escapeMarkdown(guild.name),
                    `[${guild.id}] | **${guild.memberCount}**`,
                    `${args.t(LanguageKeys.Commands.Admin.ServerlistMembers)}`
                ].join(' ')
            );

        const pages = chunk(guildArray, 10);

        for (const page of pages) display.addPageEmbed(embed => embed.setDescription(page.join('\n')));
        await display.run(msg);
    }
}
