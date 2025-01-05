import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { send } from '@sapphire/plugin-editable-commands';
import { chunk } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { GuildMessage } from '#lib/types';
import { minutes, years } from '#utils/common';
import { Schedules } from '#utils/constants';
import { UserUtil } from '#utils/functions';
import { sendLoadingMessage } from '#utils/functions/messages';
import { fetchTasks, MappedTask } from '#utils/util';
import { bold, EmbedBuilder, escapeMarkdown, GuildMember, hyperlink, inlineCode, Message, time, TimestampStyles, User } from 'discord.js';

const flags = ['c', 'channel'];
export type JSONEmbed = ReturnType<EmbedBuilder['toJSON']>;

@ApplyOptions<FoxxieSubcommand.Options>({
	aliases: ['remindme', 'rm'],
	description: LanguageKeys.Commands.Misc.ReminderDescription,
	detailedDescription: LanguageKeys.Commands.Misc.ReminderDetailedDescription,
	flags: [...flags, 'all'],
	options: ['content'],
	quotes: [],
	subcommands: [
		{ messageRun: `messageRunList`, name: 'list' },
		{ messageRun: 'show', name: 'show' },
		{ messageRun: 'delete', name: 'delete' },
		{ messageRun: 'delete', name: 'remove' },
		{ messageRun: 'delete', name: 'cancel' },
		{ default: true, messageRun: 'create', name: 'create' }
	]
})
export class UserCommand extends FoxxieSubcommand {
	public async create(msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<void> {
		const duration = await args.pick('timespan', {
			maximum: years(5),
			minimum: minutes(1)
		});
		const repeat = await args.pick('timespan', { maximum: years(1), minimum: minutes(1) }).catch(() => null);
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
				createdMessageId: msg.id,
				json,
				repeat,
				text: json ? args.getOption('content') : content,
				timeago: new Date(),
				userId: msg.author.id
			}
		});

		const message = args.t(LanguageKeys.Commands.Misc.ReminderCreateSuccess, { id });
		await send(msg, message);
	}

	public async delete(msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<Message> {
		if (args.getFlags('all')) return this.deleteAll(msg, args);

		const tasks = await args.repeat('reminder', {
			userId: msg.author.id
		});

		for (const task of tasks) await this.container.schedule.remove(task.id);

		return send(
			msg,
			args.t(LanguageKeys.Commands.Misc.ReminderDeleteSuccess, {
				count: tasks.length,
				ids: tasks.map((t) => t.id)
			})
		);
	}

	public async messageRunList(msg: GuildMessage, args: FoxxieSubcommand.Args) {
		const loading = await sendLoadingMessage(msg);

		const tasks = await fetchTasks(Schedules.Reminder)
			.filter((job) => job.data.userId === msg.author.id)
			.sort((a, b) => a.time.getTime() - b.time.getTime());

		if (!tasks.length) {
			this.error(LanguageKeys.Commands.Misc.ReminderNone);
		}

		await this.#buildAndShowDisplay(msg, msg.member, args.t, tasks);
		return loading.delete();
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

	public async show(msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<Message> {
		const task = await args.pick('reminder', {
			userId: msg.author.id
		});

		const { text } = task.data;
		const content = args.t(LanguageKeys.Commands.Misc.ReminderShow, {
			date: task.time,
			text: escapeMarkdown(text!)
		});

		return send(msg, content);
	}

	async #buildAndShowDisplay(input: GuildMessage, entity: GuildMember | User, t: FoxxieSubcommand.T, tasks: MappedTask<Schedules.Reminder>[]) {
		const user = entity instanceof User ? entity : entity.user;

		const title = t(LanguageKeys.Commands.Misc.ReminderList, {
			author: await UserUtil.ResolveDisplayName(user.id, input.guild)
		});

		const display = new PaginatedMessage(); // .setPromptMessage(t(LanguageKeys.System.ReactionHandlerPrompt));
		const pages = chunk(await Promise.all(tasks.map(async (task) => this.#mapTask(task))), 5);

		for (const page of pages) display.addPageBuilder((builder) => builder.setContent([title, '', page.join('\n')].join('\n')));
		return display.run(input);
	}

	async #mapTask(task: MappedTask<Schedules.Reminder>) {
		const text = escapeMarkdown(task.data.text!).replace(/\n/g, ' ');

		let id = null;
		const channel = await resolveToNull(this.container.client.channels.fetch(task.data.createdChannelId));
		if (channel && channel.isSendable()) {
			const message = await resolveToNull(channel.messages.fetch(task.data.createdMessageId));
			if (message && message.url) {
				id = hyperlink(inlineCode(`[${task.id.toLocaleString()}]`), message.url);
			}
		}

		return `${id ?? inlineCode(`[${task.id.toLocaleString()}]`)} - ${text.length > 35 ? `${text.substring(0, 27).trim()}...` : text} - ${bold(`(${task.data.channelId ? '' : ':mailbox_with_mail: '}${time(task.time, TimestampStyles.RelativeTime)})`)}`;
	}

	private async deleteAll(msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<Message> {
		const filtered = (await fetchTasks(Schedules.Reminder)).filter((job) => job.data.userId === msg.author.id);

		const ids: number[] = [];
		for (const task of filtered) {
			await this.container.schedule.remove(task.id);
			ids.push(task.id);
		}

		return ids.length
			? send(
					msg,
					args.t(LanguageKeys.Commands.Misc.ReminderDeleteSuccess, {
						count: ids.length,
						ids
					})
				)
			: send(msg, args.t(LanguageKeys.Commands.Misc.ReminderDeleteNone));
	}
}
