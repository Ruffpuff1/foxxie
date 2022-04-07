import { PaginatedMessage } from '../../lib/discord';
import { Message, Permissions, Util } from 'discord.js';
import { FoxxieEmbed } from '../../lib/discord';
import { FoxxieCommand } from '../../lib/structures';
import { languageKeys } from '../../lib/i18n';
import { chunk } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['sl'],
    description: languageKeys.commands.system.serverlistDescription,
    requiredClientPermissions: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ADD_REACTIONS],
    ownerOnly: true
})
export default class extends FoxxieCommand {

    async messageRun(message: Message, { t }: FoxxieCommand.Args): Promise<PaginatedMessage> {
        const template = new FoxxieEmbed(message)
            .setColor(await this.container.db.fetchColor(message))
            .setAuthor(t(languageKeys.commands.system.serverlistTitle, {
                name: this.container.client.user?.username
            }), this.container.client.user?.displayAvatarURL({ dynamic: true }));

        const display = new PaginatedMessage({ template }).setPromptMessage(t(languageKeys.system.reactionHandlerPrompt));

        display.pageIndexPrefix = t(languageKeys.commands.system.serverlistFooter, { joinArrays: '\n', size: this.container.client.guilds.cache.size });

        const pages = chunk(
            this.container.client.guilds.cache
                .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
                .map(r => r)
                .map((guild, idx) => [
                    `**${t(languageKeys.globals.numberFormat, { value: idx + 1 })}**.`,
                    Util.escapeMarkdown(guild.name),
                    `[${guild.id}] | **${guild.memberCount}**`,
                    t(languageKeys.commands.system.serverlistMembers)
                ].join(' ')),
            10
        );

        for (const page of pages) display.addPageEmbed(embed => embed.setDescription(page.join('\n')));

        return display.run(message);
    }

}