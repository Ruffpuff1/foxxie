import { LLRCData, LongLivingReactionCollector } from '#external/LongLivingReactionCollector';
import { PaginatedMessage } from '#external/PaginatedMessage';
import { HelpEmbed } from '#lib/discord';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import type { GuildMessage } from '#lib/types';
import { getCommandPrefix } from '#utils/transformers';
import { minutes, resolveToNull, toTitleCase } from '@ruffpuff/utilities';
import { sendLoadingMessage, floatPromise } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, container, fromAsync } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { TFunction } from '@sapphire/plugin-i18next';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { Collection, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, Util } from 'discord.js';

const categories = ['categories', 'cat', 'c'];
const all = ['a', 'all'];

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['h', 'usage', 'cmds'],
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
    description: LanguageKeys.Commands.General.HelpDescription,
    detailedDescription: LanguageKeys.Commands.General.HelpDetailedDescription,
    flags: [...all, ...categories]
})
export class UserCommand extends FoxxieCommand {
    public async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message | void> {
        if (args.finished) {
            if (args.getFlags(...all)) return this.all(msg, args);
            if (args.getFlags(...categories)) return this.categoriesList(msg, args);
        }

        const category = await args.pickResult(UserCommand.Categories);
        if (category.success) return this.display(msg, args, category.value - 1);

        const command = await args.pickResult('command');

        if (command.success) {
            const result = await command.value.preconditions.messageRun(msg, command.value, { command: null });
            const globalResult = await this.container.stores.get('preconditions').messageRun(msg, command.value, { command: null });
            if (!result.success || !globalResult.success) return this.display(msg, args, null);

            const embed = this.buildCommandHelp(args, command.value, getCommandPrefix(args));
            const sent = await send(msg, { embeds: [embed] });

            const reacted = await resolveToNull(sent.react('🗑'));
            if (!reacted) return;

            const filter = (data: LLRCData) => data.messageId === sent.id && data.userId === msg.author.id && data.emoji.name === '🗑';
            const collected = await LongLivingReactionCollector.collectOne({
                time: minutes(1),
                filter
            });

            if (!collected) {
                await floatPromise(sent.reactions.removeAll());
                return;
            }
            await floatPromise(msg.delete());
            return;
        }

        return this.display(msg, args, null);
    }

    private async display(msg: Message, args: FoxxieCommand.Args, index: number | null): Promise<Message | void> {
        const prefix = getCommandPrefix(args);
        await sendLoadingMessage(msg, LanguageKeys.Commands.General.HelpLoading, {
            prefix
        });

        const display = await this.buildDisplay(msg, args);
        if (index !== null) display.setIndex(index);

        await display.run(msg, msg.author);
    }

    private async all(message: Message, args: FoxxieCommand.Args) {
        const fullContent = await this.buildHelp(message, args.t);
        const contents = Util.splitMessage(fullContent, {
            char: '\n',
            maxLength: 2000
        });

        for (const content of contents) {
            const { success } = await fromAsync(message.author.send(content));
            if (success) continue;

            this.error(LanguageKeys.Commands.General.HelpNoDM);
        }

        if (message.guild) await send(message, args.t(LanguageKeys.Commands.General.HelpDM));
    }

    private async categoriesList(msg: Message, args: FoxxieCommand.Args) {
        const commands = await UserCommand.fetchCommands(msg);
        const header = args.t(LanguageKeys.Commands.General.HelpCommands);

        const content: string[] = [];
        for (const [category, list] of commands) {
            content.push(`**${category}** → *${list.length} ${header}*`);
        }

        return send(msg, content.join('\n'));
    }

    private async buildHelp(message: Message, language: TFunction) {
        const commands = await UserCommand.fetchCommands(message);
        const header = language(LanguageKeys.Commands.General.HelpCommands);

        const helpMessage: string[] = [];
        for (const [category, list] of commands) {
            helpMessage.push(
                `**${toTitleCase(category)} ${header}**:\n`,
                list
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(this.formatCommand.bind(this, language, false))
                    .join('\n'),
                ''
            );
        }

        return helpMessage.join('\n');
    }

    private async buildDisplay(msg: Message, args: FoxxieCommand.Args) {
        const commandsByCategory = await UserCommand.fetchCommands(msg);
        const header = args.t(LanguageKeys.Commands.General.HelpCommands);

        const display = new PaginatedMessage({
            template: new MessageEmbed().setColor(args.color)
        });

        const limit = 25;

        for (const [category, commands] of commandsByCategory) {
            let pageNumber = 0;

            const menu1 = new MessageSelectMenu().setCustomId(`@foxxie/helpMenu:${msg.author.id}:1`);

            const menu2 = new MessageSelectMenu().setCustomId(`@foxxie/helpMenu:${msg.author.id}:2`);

            for (const [category] of commandsByCategory) {
                (menu1.options.length >= limit ? menu2 : menu1).addOptions([
                    {
                        label: category,
                        value: `${toTitleCase(category)} ${header}`,
                        description: args.t(LanguageKeys.System.Footer).replace(/-/, `${++pageNumber}`)
                    }
                ]);
            }

            const components: MessageActionRow[] = [new MessageActionRow().addComponents(menu1)];
            if (menu2.options.length) components.push(new MessageActionRow().addComponents(menu2));

            display.addPage({
                embeds: [
                    new MessageEmbed()
                        .setAuthor({
                            name: `${toTitleCase(category)} ${header}`,
                            iconURL: this.client.user!.displayAvatarURL({
                                dynamic: true
                            })
                        })
                        .setDescription(
                            commands
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map(this.formatCommand.bind(this, args.t, true))
                                .join('\n')
                        )
                ],
                components,
                content: null
            });
        }

        return display;
    }

    private formatCommand(t: TFunction, paginatedMessage: boolean, command: FoxxieCommand) {
        const description = t(command.description, {
            defaultPrefix: container.client.options.defaultPrefix
        });
        return paginatedMessage ? `• ${command.name} → ${description}` : `• ${command.name} → ${this.cleanDescription(description)}`;
    }

    private cleanDescription(description: string) {
        // eslint-disable-next-line no-useless-escape
        const reg = /\[[\w\.]+\]\((?<url>https:\/\/.*)\)/g;
        const url = reg.exec(description)?.groups!.url;
        if (!url) return description;

        return description.replace(reg, `<${url}>`);
    }

    private buildCommandHelp(args: FoxxieCommand.Args, command: FoxxieCommand, prefix: string): HelpEmbed {
        return new HelpEmbed().setCommand(command).display(args.t, prefix, args.color, true);
    }

    private static async fetchCommands(message: Message): Promise<Collection<string, FoxxieCommand[]>> {
        const commands = container.stores.get('commands');
        const filtered = new Collection<string, FoxxieCommand[]>();

        await Promise.all(
            commands.map(async cmd => {
                const command = cmd as FoxxieCommand;
                if (command.hidden) return;

                const result = await cmd.preconditions.messageRun(message, command, {
                    command: null!
                });
                if (!result.success) return;

                const category = filtered.get(command.fullCategory!.join(' → '));
                if (category) category.push(command);
                else filtered.set(command.fullCategory!.join(' → '), [command]);
            })
        );

        return filtered.sort(sortAlphabet);
    }

    private static Categories = Args.make<number>(async (parameter, { argument, message }) => {
        const lowercase = parameter.toLowerCase();
        const commandsByCategory = await UserCommand.fetchCommands(message);

        for (const [page, category] of [...commandsByCategory.keys()].entries()) {
            const split = category.split(' → ');
            const name = split[split.length - 1];
            if (name.toLowerCase() === lowercase) return Args.ok(page + 1);
        }

        return Args.error({ argument, parameter });
    });
}

function sortAlphabet(_: FoxxieCommand[], __: FoxxieCommand[], firstCategory: string, secondCategory: string): 1 | -1 | 0 {
    if (firstCategory > secondCategory) return 1;
    if (secondCategory > firstCategory) return -1;
    return 0;
}
