import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import type { GuildMessage } from '#lib/Types';
import { resolveClientColor } from '#utils/util';
import { bold, inlineCode } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['h', 'commands'],
    description: LanguageKeys.Commands.General.HelpDescription,
    usage: LanguageKeys.Commands.General.HelpUsage,
    requiredClientPermissions: [PermissionFlagsBits.EmbedLinks]
})
export default class UserCommand extends FoxxieCommand {
    public async messageRun(message: GuildMessage, args: FoxxieCommand.Args, ctx: FoxxieCommand.Context): Promise<void> {
        const command = await args.pick('command').catch(() => null);
        if (command) {
            await this.commandHelp(command, message, args, ctx.commandPrefix);
            return;
        }

        await this.fullHelp(message, args);
    }

    private async fullHelp(message: GuildMessage, args: FoxxieCommand.Args) {
        const embed = new EmbedBuilder() //
            .setAuthor({ name: args.t(LanguageKeys.Commands.General.HelpMenu, { name: this.container.client.user?.username }) })
            .setColor(resolveClientColor(message.guild));

        const commands = this.container.stores.get('commands');
        const categories = [...new Set(this.container.stores.get('commands').map(c => c.category!))]
            .filter(c => c !== 'Admin')
            .sort((a, b) => a.localeCompare(b));

        for (const category of categories)
            embed.addFields([
                {
                    name: category,
                    value: commands //
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .filter(c => c.category === category)
                        .map(c => `\`${c.name}\``)
                        .join(', ')
                }
            ]);

        return send(message, { embeds: [embed] });
    }

    private async commandHelp(command: FoxxieCommand, message: GuildMessage, args: FoxxieCommand.Args, prefix: string) {
        const titles = args.t(LanguageKeys.Commands.General.HelpTitles);

        const template = new EmbedBuilder() //
            .setColor(resolveClientColor(message.guild))
            .setAuthor({ name: `${command.name}${command.aliases.length ? ` (${command.aliases.join(', ')})` : ''}` });

        const embed = new EmbedBuilder() //
            .setDescription(
                command.detailedDescription ? args.t(command.detailedDescription).description : args.t(command.description)
            )
            .addFields([
                {
                    name: titles.usage,
                    value: inlineCode(
                        command.detailedDescription
                            ? args.t(command.detailedDescription, { prefix, CHANNEL: message.channel.name }).usage!
                            : `${prefix}${command.name}${command.usage ? ` ${args.t(command.usage)}` : ''}`
                    )
                }
            ]);

        const display = new PaginatedMessage({ template }) //
            .addPageEmbed(() => embed);

        if (!command.detailedDescription) return display.run(message);

        const detailed = args.t(command.detailedDescription, { prefix, CHANNEL: message.channel.name });

        if (detailed.arguments || detailed.examples) {
            display.addPageEmbed(e => {
                if (detailed.examples?.length) {
                    e.addFields([{ name: titles.examples, value: detailed.examples.map(inlineCode).join('\n') }]).setAuthor({
                        name: `${command.name} → examples`
                    });
                }

                if (detailed.arguments?.length) {
                    e.setDescription(
                        detailed.arguments!.map(arg => `• ${bold(arg.name)}: ${arg.description}`).join('\n')
                    ).setAuthor({
                        name: `${command.name} → arguments`
                    });
                }

                return e;
            });
        }

        if (!detailed.subcommands) return display.run(message);

        const subCommands = detailed.subcommands.sort((a, b) => a.command.localeCompare(b.command));

        if (subCommands.length) {
            for (const subCommand of subCommands) {
                display.addPageEmbed(e =>
                    e //
                        .setDescription(
                            Array.isArray(subCommand.description) ? subCommand.description.join('\n') : subCommand.description
                        )
                        .setAuthor({ name: `${command.name} → ${subCommand.command}` })
                        .addFields([{ name: titles.examples, value: subCommand.examples.map(e => inlineCode(e)).join('\n') }])
                );
            }
        }

        return display.run(message);
    }
}
