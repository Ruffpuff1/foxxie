import { PaginatedMessage } from '../../lib/discord';
import { FoxxieCommand } from '../../lib/structures';
import { Message, MessageEmbed, Util, Permissions } from 'discord.js';
import { BrandingColors, minutes } from '../../lib/util';
import { send } from '@skyra/editable-commands';
import { languageKeys } from '../../lib/i18n';
import { chunk } from '@ruffpuff/utilities';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import type { GuildMessage } from '../../lib/types/Discord';
import { Args, container } from '@sapphire/framework';
import type { ScheduleEntity } from '../../lib/database';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['rm', 'reminders', 'remindlist'],
    flags: ['c', 'channel'],
    description: languageKeys.commands.misc.remindmeDescription,
    detailedDescription: languageKeys.commands.misc.remindmeExtendedUsage,
    subCommands: ['delete', 'show', 'list', { input: 'create', default: true }]
})
export default class UserCommand extends FoxxieCommand {

    async show(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const task = await args.pick(UserCommand.reminder);

        const { text } = task.data;
        const content = args.t(languageKeys.commands.misc.remindmeShow, { text: Util.escapeMarkdown(text), date: task.time });

        return send(msg, content);
    }

    async delete(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const task = await args.pick(UserCommand.reminder);

        task.delete();

        const { id } = task;
        const content = args.t(languageKeys.commands.misc.remindmeDeleted, { id });

        return send(msg, content);
    }

    @RequiresClientPermissions([Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.EMBED_LINKS])
    async list(msg: GuildMessage, args: FoxxieCommand.Args): Promise<PaginatedMessage> {
        const tasks = this.container.schedule.queue.filter(t => t.taskId === 'reminder' && t.data.userId === msg.author.id);
        if (!tasks.length) this.error(languageKeys.commands.misc.remindmeNone);

        const template = new MessageEmbed()
            .setColor(msg.guild.me?.displayColor || BrandingColors.Primary)
            .setAuthor(args.t(languageKeys.commands.misc.remindmeList, { author: msg.author.username }), msg.member.displayAvatarURL({ dynamic: true }));

        const display = new PaginatedMessage({ template }).setPromptMessage(args.t(languageKeys.system.reactionHandlerPrompt));

        const pages = chunk(
            tasks
                .map(task => {
                    const date = task.time.getTime();
                    const text = Util.escapeMarkdown(task.data.text as string).replace(/\n/g, ' ');
                    return `\`[${task.id}]\` - ${text.length > 30 ? `${text.substring(0, 27).trim()}...` : text} - **${args.t(languageKeys.globals.fullDateTime, { date })}**`;
                }),
            5
        );

        for (const page of pages) display.addPageEmbed(embed => embed.setDescription(page.join('\n')));
        return display.run(msg);
    }

    async create(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const duration = await args.pick('timespan', { minimum: minutes(1) });
        const text = args.finished
            ? args.t(languageKeys.commands.misc.remindmeNoReason)
            : await args.rest('string', { maximum: 1024 });

        const task = await this.container.schedule.add('reminder', Date.now() + duration, {
            catchUp: true,
            data: {
                text,
                sendIn: args.getFlags('c', 'channel'),
                message: msg.id,
                channelId: msg.channel.id,
                guildId: msg.guild.id,
                userId: msg.author.id,
                timeago: new Date()
            }
        });

        return send(msg, args.t(languageKeys.commands.misc.remindmeCreated, { date: task.time, text: text.trim() }));
    }

    private static readonly reminder = Args.make<ReminderTask>((parameter, { argument, message }) => {
        const task = container.schedule.queue.find(task => task.taskId === 'reminder' && task.id === parameter && task.data.userId === message.author.id);
        if (!task) return Args.error({
            argument,
            parameter,
            identifier: languageKeys.arguments.invalidTaskId,
            context: { arg: parameter }
        });
        return Args.ok(task as ReminderTask);
    });

}

interface ReminderTask extends ScheduleEntity {
    data: {
        text: string;
        sendIn: boolean;
        userId: string;
        guildId: string;
        channelId: string;
        message: string;
        timeago: Date;
    };
}