import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { Args, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { chunk } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { FTFunction, GuildMessage } from '#lib/types';
import { BirthdayData, getAge, getDateFormat, monthOfYearContainsDay, nextBirthday, yearIsLeap } from '#utils/birthday';
import { Schedules, SubcommandKeys } from '#utils/constants';
import { RequiresMemberPermissions } from '#utils/decorators';
import { sendLoadingMessage } from '#utils/functions/messages';
import { fetchTasks, MappedTask, resolveClientColor } from '#utils/util';
import { bold, EmbedBuilder, Guild, PermissionFlagsBits, time, TimestampStyles } from 'discord.js';

@ApplyOptions<FoxxieSubcommand.Options>({
	aliases: ['bd', 'bday'],
	description: LanguageKeys.Commands.Configuration.BirthdayDescription,
	detailedDescription: LanguageKeys.Commands.Configuration.BirthdayDetailedDescription,
	runIn: [CommandOptionsRunTypeEnum.GuildAny],
	subcommands: [
		{ messageRun: SubcommandKeys.Set, name: SubcommandKeys.Set },
		{ default: true, messageRun: SubcommandKeys.List, name: SubcommandKeys.List }
	]
})
export class UserCommand extends FoxxieSubcommand {
	@RequiresClientPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions])
	@RequiresMemberPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions])
	public async [SubcommandKeys.List](msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<void> {
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
				const description = await Promise.all(page.map(async (p) => this.#mapBirthday(p, args.t, msg.guild)));

				const embed = new EmbedBuilder().setDescription(description.join('\n\n'));

				return builder.setEmbeds([embed]).setContent(null!);
			});
		}

		await display.run(loading, msg.author);
	}

	public async [SubcommandKeys.Set](msg: GuildMessage, args: FoxxieSubcommand.Args) {
		const date = await args.pick(UserCommand.Date);
		const tasks = fetchTasks(Schedules.Birthday);
		const task = tasks.find((task) => task.data.userId === msg.author.id && task.data.guildId === msg.guild.id);

		if (task) await this.container.schedule.remove(task.id);
		const birthday = nextBirthday(date.month, date.day, { timeZoneOffset: 7 });
		await this.container.schedule.add(Schedules.Birthday, birthday, { data: this.#constructData(date, msg) });

		await send(msg, args.t(LanguageKeys.Commands.Configuration.BirthdaySetSuccess, { birthday }));
	}

	#constructData(date: BirthdayData, msg: GuildMessage) {
		return {
			day: date.day,
			guildId: msg.guild.id,
			month: date.month,
			userId: msg.author.id,
			year: date.year
		};
	}

	async #mapBirthday(birthday: MappedTask<Schedules.Birthday>, t: FTFunction, guild: Guild) {
		const user = await resolveToNull(this.client.users.fetch(birthday.data.userId));
		const member = user ? guild.members.cache.get(user.id) : null;

		const age = getAge({ day: birthday.data.day, month: birthday.data.month, year: birthday.data.year }, { now: birthday.time.getTime() });

		return [
			`${bold(member?.displayName || user?.username || t(LanguageKeys.Globals.Unknown))}${age ? ` (${age})` : ''}`,
			`-# ${time(birthday.time, TimestampStyles.LongDate)}`
		].join('\n');
	}

	private static Date = Args.make<BirthdayData>((parameter, { args, argument }) => {
		const format = args.t(LanguageKeys.Globals.DateFormat);
		const regex = getDateFormat(format, 'en-US');
		const result = regex.exec(parameter);

		if (result === null) {
			return Args.error({
				argument,
				context: { formatWithYear: format },
				identifier: LanguageKeys.Arguments.Birthday,
				parameter
			});
		}

		const year = result.groups!.year === undefined ? null : Number(result.groups!.year);
		if (year !== null && (year < 1908 || year > new Date().getUTCFullYear())) {
			const msg = year < 1908 ? args.t(LanguageKeys.Arguments.BirthdayYearPast) : args.t(LanguageKeys.Arguments.BirthdayYearFuture);

			return Args.error({
				argument,
				context: { msg, year },
				identifier: LanguageKeys.Arguments.BirthdayYear,
				parameter
			});
		}

		const month = Number(result.groups!.month);
		if (month <= 0 || month > 12) {
			return Args.error({
				argument,
				context: { month },
				identifier: LanguageKeys.Arguments.BirthdayMonth,
				parameter
			});
		}

		const day = Number(result.groups!.day);
		if (day <= 0 || !monthOfYearContainsDay(year === null ? true : yearIsLeap(year), month, day)) {
			const monthKey = args.t(LanguageKeys.Arguments.BirthdayMonths)[month - 1];
			return Args.error({
				argument,
				context: { day, monthKey },
				identifier: LanguageKeys.Arguments.BirthdayDay,
				parameter
			});
		}

		return Args.ok({ day, month, year });
	});
}
