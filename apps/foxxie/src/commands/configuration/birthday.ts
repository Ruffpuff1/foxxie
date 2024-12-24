import { RequiresClientPermissions } from '@sapphire/decorators';
import { Args, container } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { BirthdayBuilder, BirthdayData, constructBirthdayData, nextBirthday, resolveBirthday } from '#modules/birthday';
import { Schedules } from '#utils/constants';
import { GuildOnlyCommand, MessageSubcommand, RegisterSubcommand, RequiresMemberPermissions } from '#utils/decorators';
import { findTask } from '#utils/util';
import { PermissionFlagsBits } from 'discord.js';

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
	public static async MessageRunList(...[, args]: FoxxieSubcommand.MessageRunArgs) {
		return BirthdayBuilder.List(args);
	}

	@MessageSubcommand(BirthdayCommand.SubcommandKeys.Set)
	public static async MessageRunSet(msg: GuildMessage, args: FoxxieSubcommand.Args) {
		const date = await args.pick(BirthdayCommand.BirthdayArgument);
		const task = findTask(Schedules.Birthday, (task) => task.data.userId === msg.author.id && task.data.guildId === msg.guild.id);

		if (task) await container.schedule.remove(task.id);
		const birthday = nextBirthday(date.month, date.day, { timeZoneOffset: 7 });

		await container.schedule.add(Schedules.Birthday, birthday, { data: constructBirthdayData(date, msg) });
		await send(msg, args.t(LanguageKeys.Commands.Configuration.Birthday.SetSuccess, { birthday }));
	}

	private static BirthdayArgument = Args.make<BirthdayData>((parameter, { args, argument }) => {
		const resolved = resolveBirthday(parameter, args.t);
		return resolved.isErr()
			? Args.error({ argument, context: resolved.unwrapErr().context, identifier: resolved.unwrapErr().identifier, parameter })
			: Args.ok(resolved.unwrap());
	});

	private static SubcommandKeys = {
		List: 'list',
		Set: 'set'
	};
}
