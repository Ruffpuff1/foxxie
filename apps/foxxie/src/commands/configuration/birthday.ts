import { RequiresClientPermissions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { Args, container } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { chunk } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { GuildMessage } from '#lib/types';
import { BirthdayData, constructBirthdayData, mapBirthday, nextBirthday } from '#utils/birthday';
import { Schedules } from '#utils/constants';
import { GuildOnlyCommand, MessageSubcommand, RegisterSubcommand, RequiresMemberPermissions } from '#utils/decorators';
import { sendLoadingMessage } from '#utils/functions/messages';
import { resolveBirthday } from '#utils/resolvers';
import { fetchTasks, resolveClientColor } from '#utils/util';
import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';

@GuildOnlyCommand()
@RegisterSubcommand((command) =>
	command
		.setAliases('bd', 'bday')
		.setDescription(LanguageKeys.Commands.Configuration.BirthdayDescription)
		.setDetailedDescription(LanguageKeys.Commands.Configuration.BirthdayDetailedDescription)
)
export class BirthdayCommand extends FoxxieSubcommand {
	@MessageSubcommand('list', true)
	@RequiresClientPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions])
	@RequiresMemberPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions])
	public static async MessageRunList(msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<void> {
		const loading = await sendLoadingMessage(msg);
		let tasks = fetchTasks(Schedules.Birthday);
		tasks = tasks.filter((s) => s.data.guildId === msg.guildId);

		const template = new EmbedBuilder()
			.setAuthor({ name: `Upcoming birthdays in ${msg.guild.name}` })
			.setThumbnail(msg.guild.iconURL()!)
			.setColor(await resolveClientColor(msg))
			.setFooter({ text: `${tasks.length} birthdays in ${msg.guild.name}` });

		const display = new PaginatedMessage({ template });

		for (const page of chunk(tasks, 10)) {
			display.addAsyncPageBuilder(async (builder) => {
				const description = await Promise.all(page.map(async (p) => mapBirthday(p, args.t, msg.guild)));

				const embed = new EmbedBuilder().setDescription(description.join('\n\n'));

				return builder.setEmbeds([embed]).setContent(null!);
			});
		}

		await display.run(loading, msg.author);
	}

	@MessageSubcommand('set')
	public static async MessageRunSet(msg: GuildMessage, args: FoxxieSubcommand.Args) {
		const date = await args.pick(BirthdayCommand.BirthdayArgument);
		const tasks = fetchTasks(Schedules.Birthday);
		const task = tasks.find((task) => task.data.userId === msg.author.id && task.data.guildId === msg.guild.id);

		if (task) await container.schedule.remove(task.id);
		const birthday = nextBirthday(date.month, date.day, { timeZoneOffset: 7 });
		await container.schedule.add(Schedules.Birthday, birthday, { data: constructBirthdayData(date, msg) });

		await send(msg, args.t(LanguageKeys.Commands.Configuration.BirthdaySetSuccess, { birthday }));
	}

	private static BirthdayArgument = Args.make<BirthdayData>((parameter, { args, argument }) => {
		const resolved = resolveBirthday(parameter, args.t);
		return resolved.isErr()
			? Args.error({ argument, context: resolved.unwrapErr().context, identifier: resolved.unwrapErr().identifier, parameter })
			: Args.ok(resolved.unwrap());
	});
}
