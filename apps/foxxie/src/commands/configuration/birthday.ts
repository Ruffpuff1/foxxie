import { RequiresClientPermissions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { Args, container } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { chunk } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { BirthdayData, constructBirthdayData, mapBirthday, nextBirthday } from '#utils/birthday';
import { Schedules } from '#utils/constants';
import { GuildOnlyCommand, MessageSubcommand, RegisterSubcommand, RequiresMemberPermissions } from '#utils/decorators';
import { sendLoadingMessage, sendMessage } from '#utils/functions';
import { resolveBirthday } from '#utils/resolvers';
import { fetchTasks, resolveClientColor } from '#utils/util';
import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';

@GuildOnlyCommand()
@RegisterSubcommand((command) =>
	command
		.setAliases('bd', 'bday')
		.setDescription(LanguageKeys.Commands.Configuration.Birthday.Description)
		.setDetailedDescription(LanguageKeys.Commands.Configuration.Birthday.DetailedDescription)
)
export class BirthdayCommand extends FoxxieSubcommand {
	@MessageSubcommand(BirthdayCommand.SubcommandKeys.List, true)
	@RequiresClientPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions])
	@RequiresMemberPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions])
	public static async MessageRunList(message: GuildMessage, args: FoxxieSubcommand.Args) {
		const loading = await sendLoadingMessage(message);
		let tasks = fetchTasks(Schedules.Birthday);
		tasks = tasks.filter((s) => s.data.guildId === message.guildId);

		if (!tasks.length) {
			return sendMessage(message, args.t(LanguageKeys.Commands.Configuration.Birthday.ListNone, { prefix: args.commandContext.commandPrefix }));
		}

		const template = new EmbedBuilder()
			.setAuthor({ name: args.t(LanguageKeys.Commands.Configuration.Birthday.ListTitle, { guild: message.guild.name }) })
			.setThumbnail(message.guild.iconURL()!)
			.setColor(await resolveClientColor(message, message.member.displayColor))
			.setFooter({
				text: args.t(LanguageKeys.Commands.Configuration.Birthday.ListFooter, { count: tasks.length, guild: message.guild.name })
			});

		const display = new PaginatedMessage({ template });

		for (const page of chunk(tasks, 10)) {
			display.addAsyncPageBuilder(async (builder) => {
				const description = await Promise.all(page.map(async (p) => mapBirthday(p, args.t, message.guild)));

				const embed = new EmbedBuilder().setDescription(description.join('\n\n'));

				return builder.setEmbeds([embed]).setContent(null!);
			});
		}

		return display.run(loading, message.author);
	}

	@MessageSubcommand(BirthdayCommand.SubcommandKeys.Set)
	public static async MessageRunSet(msg: GuildMessage, args: FoxxieSubcommand.Args) {
		const date = await args.pick(BirthdayCommand.BirthdayArgument);
		const tasks = fetchTasks(Schedules.Birthday);
		const task = tasks.find((task) => task.data.userId === msg.author.id && task.data.guildId === msg.guild.id);

		if (task) await container.schedule.remove(task.id);
		const birthday = nextBirthday(date.month, date.day, { timeZoneOffset: 7 });
		await container.schedule.add(Schedules.Birthday, birthday, { data: constructBirthdayData(date, msg) });

		await send(msg, args.t(LanguageKeys.Commands.Configuration.Birthday.SetSuccess, { birthday }));
	}

	public static SubcommandKeys = {
		List: 'list',
		Set: 'set'
	};

	private static BirthdayArgument = Args.make<BirthdayData>((parameter, { args, argument }) => {
		const resolved = resolveBirthday(parameter, args.t);
		return resolved.isErr()
			? Args.error({ argument, context: resolved.unwrapErr().context, identifier: resolved.unwrapErr().identifier, parameter })
			: Args.ok(resolved.unwrap());
	});
}
