import { SubcommandKeys } from '#lib/Container/Stores/Commands/Keys/index';
import { IdHints } from '#lib/discord';
import { getSupportedLanguageT, getSupportedUserLanguageT, LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { GuildMessage } from '#lib/types';
import { minutes, years } from '#utils/common';
import { Schedules } from '#utils/constants';
import { sendLoadingMessage } from '#utils/functions/messages';
import { fetchTasks, MappedTask, resolveClientColor } from '#utils/util';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistry } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { applyLocalizedBuilder, TFunction } from '@sapphire/plugin-i18next';
import { chunk } from '@sapphire/utilities';
import {
	Awaitable,
	ChatInputCommandInteraction,
	EmbedBuilder,
	escapeMarkdown,
	GuildMember,
	InteractionContextType,
	Message,
	PermissionFlagsBits,
	time,
	TimestampStyles,
	User
} from 'discord.js';

const flags = ['c', 'channel'];
export type JSONEmbed = ReturnType<EmbedBuilder['toJSON']>;
const Root = LanguageKeys.Commands.Moderation.Utilities.Case;

@ApplyOptions<FoxxieSubcommand.Options>({
	aliases: ['remindme', 'rm'],
	description: LanguageKeys.Commands.Misc.ReminderDescription,
	detailedDescription: LanguageKeys.Commands.Misc.ReminderDetailedDescription,
	flags: [...flags, 'all'],
	options: ['content'],
	quotes: [],
	subcommands: [
		{ name: SubcommandKeys.Misc.List, messageRun: `messageRunList`, chatInputRun: 'chatInputRunList' },
		{ name: SubcommandKeys.Misc.Show, messageRun: SubcommandKeys.Misc.Show },
		{ name: SubcommandKeys.Misc.Delete, messageRun: SubcommandKeys.Misc.Delete },
		{ name: SubcommandKeys.Misc.Remove, messageRun: SubcommandKeys.Misc.Delete },
		{ name: SubcommandKeys.Misc.Cancel, messageRun: SubcommandKeys.Misc.Delete },
		{ name: SubcommandKeys.Misc.Create, default: true, messageRun: SubcommandKeys.Misc.Create }
	]
})
export class UserCommand extends FoxxieSubcommand {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): Awaitable<void> {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName('reminder')
					.setDescription('mnaager reminders')
					.setContexts(InteractionContextType.Guild)
					.addSubcommand((subcommand) =>
						applyLocalizedBuilder(subcommand, Root.List) //
							.addBooleanOption((option) => applyLocalizedBuilder(option, Root.OptionsShow))
					),
			{
				idHints: [IdHints.Nightly.Misc.Reminder]
			}
		);
	}

	@RequiresClientPermissions([PermissionFlagsBits.AddReactions, PermissionFlagsBits.EmbedLinks])
	public async messageRunList(msg: GuildMessage, args: FoxxieSubcommand.Args) {
		const loading = await sendLoadingMessage(msg);

		const tasks = await fetchTasks(Schedules.Reminder).filter((job) => job.data.userId === msg.author.id);
		if (!tasks.length) {
			await loading.delete();
			this.error(LanguageKeys.Commands.Misc.ReminderNone);
		}

		await this.#buildAndShowDisplay(msg, msg.member, args.t, tasks);
		return loading.delete();
	}

	@RequiresClientPermissions([PermissionFlagsBits.AddReactions, PermissionFlagsBits.EmbedLinks])
	public async chatInputRunList(interaction: FoxxieSubcommand.Interaction) {
		const show = interaction.options.getBoolean('show') ?? false;
		await interaction.deferReply({ ephemeral: !show });

		const tasks = await fetchTasks(Schedules.Reminder).filter((job) => job.data.userId === interaction.user.id);
		if (!tasks.length) {
			this.error(LanguageKeys.Commands.Misc.ReminderNone);
		}

		const entity = interaction.guild
			? await interaction.guild.members.fetch(interaction.user.id)
			: await this.container.client.users.fetch(interaction.user.id);

		const t = show ? getSupportedLanguageT(interaction) : getSupportedUserLanguageT(interaction);
		await this.#buildAndShowDisplay(interaction, entity, t, tasks);
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

		const tasks = await args.repeat('reminder', {
			userId: msg.author.id
		});

		for (const task of tasks) await this.container.schedule.remove(task.id);

		return send(
			msg,
			args.t(LanguageKeys.Commands.Misc.ReminderDeleteSuccess, {
				ids: tasks.map((t) => t.id)
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

	async #buildAndShowDisplay(
		input: GuildMessage | ChatInputCommandInteraction,
		entity: GuildMember | User,
		t: TFunction,
		tasks: MappedTask<Schedules.Reminder>[]
	) {
		const user = entity instanceof User ? entity : entity.user;

		const template = new EmbedBuilder() //
			.setColor(await resolveClientColor(input))
			.setAuthor({
				name: t(LanguageKeys.Commands.Misc.ReminderList, {
					author: user.username
				}),
				iconURL: user.displayAvatarURL()
			});

		const display = new PaginatedMessage({ template }); // .setPromptMessage(t(LanguageKeys.System.ReactionHandlerPrompt));
		const pages = chunk(
			tasks.map((task) => this.#mapTask(task)),
			5
		);

		for (const page of pages) display.addPageEmbed((embed) => embed.setDescription(page.join('\n')));
		return display.run(input);
	}

	#mapTask(task: MappedTask<Schedules.Reminder>) {
		const text = escapeMarkdown(task.data.text!).replace(/\n/g, ' ');
		return `\`[${task.id}]\` - ${text.length > 30 ? `${text.substring(0, 27).trim()}...` : text} - **${time(new Date(task.time), TimestampStyles.LongDateTime)}**`;
	}

	private async deleteAll(msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<Message> {
		const filtered = (await fetchTasks(Schedules.Reminder)).filter((job) => job.data.userId === msg.author.id);

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