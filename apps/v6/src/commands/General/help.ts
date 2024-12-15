import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import type { GuildMessage } from '#lib/types';
import { BrandingColors } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['h', 'commands'],
    description: LanguageKeys.Commands.General.HelpDescription,
    usage: LanguageKeys.Commands.General.HelpUsage,
    requiredClientPermissions: [PermissionFlagsBits.EmbedLinks]
})
export default class UserCommand extends FoxxieCommand {
    public async messageRun(
        message: GuildMessage,
        args: FoxxieCommand.Args,
        ctx: FoxxieCommand.Context
    ): Promise<Message | PaginatedMessage> {
        const command = await args.pick('command').catch(() => null);
        if (command) return this.commandHelp(command, message, args, ctx.commandPrefix);

        return this.fullHelp(message, args);
    }

    private async fullHelp(message: GuildMessage, args: FoxxieCommand.Args) {
        const embed = new MessageEmbed() //
            .setAuthor({ name: args.t(LanguageKeys.Commands.General.HelpMenu, { name: this.container.client.user?.username }) })
            .setColor(message.guild.me!.displayColor);

        const commands = this.container.stores.get('commands');
        const categories = [...new Set(this.container.stores.get('commands').map(c => c.category!))].filter(c => c !== 'Admin');

        for (const category of categories)
            embed.addField(
                category,
                commands //
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .filter(c => c.category === category)
                    .map(c => `\`${c.name}\``)
                    .join(', ')
            );

        return send(message, { embeds: [embed] });
    }

    private async commandHelp(command: FoxxieCommand, message: GuildMessage, args: FoxxieCommand.Args, prefix: string) {
        const titles = args.t(LanguageKeys.Commands.General.HelpTitles);

        const template = new MessageEmbed() //
            .setColor(message.guild.me!.displayColor || BrandingColors.Primary)
            .setAuthor({ name: `${command.name}${command.aliases.length ? ` (${command.aliases.join(', ')})` : ''}` });

        const embed = new MessageEmbed() //
            .setDescription(args.t(command.description))
            .addField(titles.usage, `\`${prefix}${command.name}${command.usage ? ` ${args.t(command.usage)}` : ''}\``);

        const display = new PaginatedMessage({ template }) //
            .addPageEmbed(() => embed);

        return display.run(message);
    }
}
