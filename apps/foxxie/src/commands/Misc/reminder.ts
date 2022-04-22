import { PaginatedMessage } from '#external/PaginatedMessage';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import type { GuildMessage, ScheduleData } from '#lib/types';
import { Schedules } from '#utils/constants';
import { minutes, years, chunk } from '@ruffpuff/utilities';
import { fetchTasks, MappedJob, sendLoadingMessage, sortTasksByTime } from '#utils/util';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { TFunction } from '@foxxie/i18n';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { GuildMember, Message, MessageEmbed, Util } from 'discord.js';
import type { Job } from 'bull';

const flags = ['c', 'channel'];

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['remindme', 'rm'],
    description: LanguageKeys.Commands.Misc.ReminderDescription,
    detailedDescription: LanguageKeys.Commands.Misc.ReminderDetailedDescription,
    flags: [...flags, 'all'],
    options: ['content'],
    quotes: [],
    subCommands: ['delete', 'edit', 'list', 'show', { input: 'remove', output: 'delete' }, { input: 'cancel', output: 'delete' }, { input: 'create', default: true }]
})
export class UserCommand extends FoxxieCommand {
    @RequiresClientPermissions([PermissionFlagsBits.AddReactions, PermissionFlagsBits.EmbedLinks])
    public async list(msg: GuildMessage, args: FoxxieCommand.Args): Promise<PaginatedMessage> {
        return this.buildAndShowDisplay(msg, msg.member, args.t, args.color);
    }

    public async create(msg: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const duration = await args.pick('timespan', {
            minimum: minutes(1),
            maximum: years(5)
        });
        const repeat = await args.pick('timespan', { minimum: minutes(1), maximum: years(1) }).catch(() => null);
        const channel = await args.pick('guildTextChannel').catch(() => null);
        const content = (await args.rest('string')) ?? args.t(LanguageKeys.Commands.Misc.ReminderDefault);

        let json: ReturnType<MessageEmbed['toJSON']> | null = null;
        try {
            const parsed = JSON.parse(
                content
                    .replace(/^{\s+"embed":\s+/i, '')
                    .replace(/}$/i, '')
                    .trim()
            );

            const embed = new MessageEmbed(parsed);
            if (parsed.color) embed.setColor(parsed.color);

            json = embed.toJSON();
        } catch {
            /* noop */
        }

        const { id } = (await this.container.tasks.create(
            Schedules.Reminder,
            {
                channelId: channel?.id || null,
                userId: msg.author.id,
                text: json ? args.getOption('content') : content,
                json,
                repeat,
                timeago: new Date()
            },
            duration
        )) as Job<{ task: Schedules.Reminder; data: ScheduleData<Schedules.Reminder> }>;

        const message = args.t(LanguageKeys.Commands.Misc.ReminderCreateSuccess, { id });
        await send(msg, message);
    }

    public async delete(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        if (args.getFlags('all')) return this.deleteAll(msg, args);

        const task = await args.pick(UserCommand.Reminder, {
            userId: msg.author.id
        });
        await this.container.tasks.delete(task.id);

        return send(
            msg,
            args.t(LanguageKeys.Commands.Misc.ReminderDeleteSuccess, {
                ids: [task.id]
            })
        );
    }

    public async edit(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const task = await args.pick(UserCommand.Reminder, {
            userId: msg.author.id
        });
        const text = await args.rest('string', { maximum: 1024 });

        let json: ReturnType<MessageEmbed['toJSON']> | null = null;
        try {
            const parsed = JSON.parse(
                text
                    .replace(/^{\s+"embed":\s+/i, '')
                    .replace(/}$/i, '')
                    .trim()
            );

            const embed = new MessageEmbed(parsed);
            if (parsed.color) embed.setColor(parsed.color);

            json = embed.toJSON();
        } catch {
            /* noop */
        }

        const { time, data } = task;

        // delete the old task.
        await this.container.tasks.delete(task.id);
        // create a new one with the new text.

        await this.container.tasks.create(
            Schedules.Reminder,
            {
                ...data,
                text,
                json
            },
            time.getTime() - Date.now()
        );

        return send(
            msg,
            args.t(LanguageKeys.Commands.Misc.ReminderEditSuccess, {
                old: data.text,
                new: text
            })
        );
    }

    public async show(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const task = await args.pick(UserCommand.Reminder, {
            userId: msg.author.id
        });

        const { text } = task.data;
        const content = args.t(LanguageKeys.Commands.Misc.ReminderShow, {
            text: Util.escapeMarkdown(text),
            date: task.time
        });

        return send(msg, content);
    }

    private async buildAndShowDisplay(msg: GuildMessage, member: GuildMember, t: TFunction, color: number) {
        await sendLoadingMessage(msg);

        const tasks = sortTasksByTime(await fetchTasks(Schedules.Reminder)).filter(job => job.data.userId === msg.author.id);
        if (!tasks.length) this.error(LanguageKeys.Commands.Misc.ReminderNone);

        const template = new MessageEmbed().setColor(color).setAuthor({
            name: t(LanguageKeys.Commands.Misc.ReminderList, {
                author: member.user.username
            }),
            iconURL: member.displayAvatarURL({ dynamic: true })
        });

        const display = new PaginatedMessage({ template });

        const pages = chunk(
            tasks.map(task => {
                const date = task.time.getTime();
                const text = Util.escapeMarkdown(task.data.text).replace(/\n/g, ' ');
                return `\`[${task.id}]\` - ${text.length > 30 ? `${text.substring(0, 27).trim()}...` : text} - **${t(LanguageKeys.Globals.FullDateTime, { date })}**`;
            }),
            5
        );

        for (const page of pages) display.addPageEmbed(embed => embed.setDescription(page.join('\n')));
        return display.run(msg);
    }

    private async deleteAll(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const filtered = (await fetchTasks(Schedules.Reminder)).filter(job => job.data.userId === msg.author.id);

        const ids: string[] = [];
        for (const task of filtered) {
            await this.container.tasks.delete(task.id);
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

    private static readonly Reminder = Args.make<MappedJob<Schedules.Reminder>>(async (parameter, { argument, userId }) => {
        const tasks = (await fetchTasks(Schedules.Reminder)).filter(job => job.data.userId === userId);
        const task = tasks.find(task => String(task.id) === parameter);

        if (!task)
            return Args.error({
                parameter,
                argument,
                identifier: LanguageKeys.Arguments.Reminder,
                context: { parameter }
            });

        return Args.ok(task);
    });
}
