import { Schedules } from '#utils/constants';
import { minutes, years, chunk } from '@ruffpuff/utilities';
import { fetchTasks, resolveClientColor } from '#utils/util';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import type { TFunction } from '@sapphire/plugin-i18next';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { EmbedBuilder, escapeMarkdown, GuildMember, Message, TextChannel, time, TimestampStyles } from 'discord.js';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { LanguageKeys } from '#lib/I18n';
import { GuildMessage } from '#lib/Types';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { sendLoadingMessageInChannel } from '#utils/Discord';
import { SubcommandKeys } from '#lib/Container/Stores/Commands/Keys/index';

const flags = ['c', 'channel'];
type JSONEmbed = ReturnType<EmbedBuilder['toJSON']>;

@ApplyOptions<FoxxieSubcommand.Options>({
    aliases: ['remindme', 'rm'],
    description: LanguageKeys.Commands.Misc.ReminderDescription,
    detailedDescription: LanguageKeys.Commands.Misc.ReminderDetailedDescription,
    flags: [...flags, 'all'],
    options: ['content'],
    quotes: [],
    subcommands: [
        { name: SubcommandKeys.Misc.List, messageRun: SubcommandKeys.Misc.List },
        { name: SubcommandKeys.Misc.Show, messageRun: SubcommandKeys.Misc.Show },
        { name: SubcommandKeys.Misc.Delete, messageRun: SubcommandKeys.Misc.Delete },
        { name: SubcommandKeys.Misc.Remove, messageRun: SubcommandKeys.Misc.Delete },
        { name: SubcommandKeys.Misc.Cancel, messageRun: SubcommandKeys.Misc.Delete },
        { name: SubcommandKeys.Misc.Create, default: true, messageRun: SubcommandKeys.Misc.Create }
    ]
})
export class UserCommand extends FoxxieSubcommand {
    @RequiresClientPermissions([PermissionFlagsBits.AddReactions, PermissionFlagsBits.EmbedLinks])
    public async [SubcommandKeys.Misc.List](msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<void> {
        return this.buildAndShowDisplay(msg, msg.member, args.t);
    }

    public async [SubcommandKeys.Misc.Create](msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<void> {
        const duration = await args.pick('timespan', {
            minimum: minutes(1),
            maximum: years(5)
        });
        const repeat = await args.pick('timespan', { minimum: minutes(1), maximum: years(1) }).catch(() => null);
        const channel = await args.pick('guildTextChannel').catch(() => null);
        const content = (await args.rest('string')) ?? args.t(LanguageKeys.Commands.Misc.ReminderDefault);

        let json: JSONEmbed | null = null;
        try {
            const parsed = JSON.parse(
                content
                    .replace(/^{\s+"embed":\s+/i, '')
                    .replace(/}$/i, '')
                    .trim()
            );

            const embed = new EmbedBuilder(parsed);
            if (parsed.color) embed.setColor(parsed.color);

            json = embed.toJSON();
        } catch {
            /* noop */
        }

        const { id } = await this.container.schedule.add(Schedules.Reminder, new Date(Date.now() + duration), {
            data: {
                channelId: channel?.id || null,
                createdChannelId: msg.channel.id,
                userId: msg.author.id,
                text: json ? args.getOption('content') : content,
                json,
                repeat,
                timeago: new Date()
            }
        });

        const message = args.t(LanguageKeys.Commands.Misc.ReminderCreateSuccess, { id });
        await send(msg, message);
    }

    public async [SubcommandKeys.Misc.Delete](msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<Message> {
        if (args.getFlags('all')) return this.deleteAll(msg, args);

        const task = await args.pick('reminder', {
            userId: msg.author.id
        });
        await this.container.schedule.remove(task.id);

        return send(
            msg,
            args.t(LanguageKeys.Commands.Misc.ReminderDeleteSuccess, {
                ids: [task.id]
            })
        );
    }

    // public async edit(msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<Message> {
    //     const task = await args.pick(UserCommand.Reminder, {
    //         userId: msg.author.id
    //     });
    //     const text = await args.rest('string', { maximum: 1024 });

    //     let json: ReturnType<EmbedBuilder['toJSON']> | null = null;
    //     try {
    //         const parsed = JSON.parse(
    //             text
    //                 .replace(/^{\s+"embed":\s+/i, '')
    //                 .replace(/}$/i, '')
    //                 .trim()
    //         );

    //         const embed = new EmbedBuilder(parsed);
    //         if (parsed.color) embed.setColor(parsed.color);

    //         json = embed.toJSON();
    //     } catch {
    //         /* noop */
    //     }

    //     const { time, data } = task;

    //     // delete the old task.
    //     await this.container.schedule.remove(task.id);
    //     // create a new one with the new text.

    //     await this.container.schedule.add(
    //         Schedules.Reminder,

    //         new Date(time.getTime()),
    //         {
    //             data: {
    //                 ...data,
    //                 text,
    //                 json
    //             }
    //         }
    //     );

    //     return send(
    //         msg,
    //         args.t(LanguageKeys.Commands.Misc.ReminderEditSuccess, {
    //             old: data.text,
    //             new: text
    //         })
    //     );
    // }

    public async [SubcommandKeys.Misc.Show](msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<Message> {
        const task = await args.pick('reminder', {
            userId: msg.author.id
        });

        const { text } = task.data;
        const content = args.t(LanguageKeys.Commands.Misc.ReminderShow, {
            text: escapeMarkdown(text!),
            date: task.time
        });

        return send(msg, content);
    }

    private async buildAndShowDisplay(msg: GuildMessage, member: GuildMember, t: TFunction) {
        const loading = await sendLoadingMessageInChannel(msg.channel as TextChannel);

        const tasks = await fetchTasks(Schedules.Reminder).filter(job => job.data.userId === msg.author.id);
        if (!tasks.length) this.error(LanguageKeys.Commands.Misc.ReminderNone);

        const color = await resolveClientColor(msg);

        const template = new EmbedBuilder() //
            .setColor(color)
            .setAuthor({
                name: t(LanguageKeys.Commands.Misc.ReminderList, {
                    author: member.user.username
                }),
                iconURL: member.displayAvatarURL()
            });

        const display = new PaginatedMessage({ template }); // .setPromptMessage(t(LanguageKeys.System.ReactionHandlerPrompt));

        const pages = chunk(
            tasks.map(task => {
                const text = escapeMarkdown(task.data.text!).replace(/\n/g, ' ');
                return `\`[${task.id}]\` - ${text.length > 30 ? `${text.substring(0, 27).trim()}...` : text} - **${time(new Date(task.time), TimestampStyles.LongDateTime)}**`;
            }),
            5
        );

        for (const page of pages) display.addPageEmbed(embed => embed.setDescription(page.join('\n')));
        await display.run(msg);
        await loading.delete();
    }

    private async deleteAll(msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<Message> {
        const filtered = (await fetchTasks(Schedules.Reminder)).filter(job => job.data.userId === msg.author.id);

        const ids: string[] = [];
        for (const task of filtered) {
            await this.container.schedule.remove(task.id);
            ids.push(String(task.id));
        }

        return ids.length
            ? send(
                  msg,
                  args.t(LanguageKeys.Commands.Misc.ReminderDeleteSuccess, {
                      ids
                  })
              )
            : send(msg, args.t(LanguageKeys.Commands.Misc.ReminderDeleteNone));
    }
}
