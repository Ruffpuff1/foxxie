import { RequiresClientPermissions } from '@sapphire/decorators';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { GuildBuilder, UserBuilder } from '#utils/builders';
import { floatPromise } from '#utils/common';
import { GuildOnlyCommand, MessageSubcommand, RegisterSubcommand, RequiresMemberPermissions } from '#utils/decorators';
import { sendLoadingMessage, sendMessage } from '#utils/functions/messages';
import { PermissionFlagsBits } from 'discord.js';

@GuildOnlyCommand()
@RegisterSubcommand((command) =>
	command
		.setAliases('i', 'notes', 'warnings')
		.setDescription(InfoCommand.Language.Description)
		.setDetailedDescription(LanguageKeys.Commands.General.Stats.DetailedDescription)
		.setFlags(InfoCommand.AllFlags)
		.setRequiredClientPermissions(PermissionFlagsBits.EmbedLinks)
)
export class InfoCommand extends FoxxieSubcommand {
	@MessageSubcommand(InfoCommand.SubcommandKeys.Guild, false, ['server', 'serverinfo'])
	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	public static async MessageRunGuild(...[message, args]: FoxxieSubcommand.MessageRunArgs) {
		await sendLoadingMessage(message);
		const embed = await GuildBuilder.GuildInfo(message.guild, args.t, message.member);
		return sendMessage(message, embed);
	}

	@MessageSubcommand(InfoCommand.SubcommandKeys.User, true, ['u'])
	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	public static async MessageRunUser(...[message, args]: FoxxieSubcommand.MessageRunArgs) {
		const user = await args.pick('username').catch(() => message.author);

		await floatPromise(user.fetch());
		await sendLoadingMessage(message);

		const display = await UserBuilder.UserInfo(user, message, {
			banner: args.getFlags(...InfoCommand.Flags.Banner),
			notes: args.getFlags(...InfoCommand.Flags.Note),
			warnings: args.getFlags(...InfoCommand.Flags.Warning)
		});

		await sendMessage(message, display);
	}

	private static get AllFlags() {
		return [...InfoCommand.Flags.Warning, ...InfoCommand.Flags.Note, ...InfoCommand.Flags.Banner];
	}

	private static Flags = {
		Banner: ['b', 'banner'],
		Note: ['n', 'note', 'notes'],
		Warning: ['w', 'warn', 'warnings', 'warning']
	};

	private static Language = LanguageKeys.Commands.General.Info;

	private static SubcommandKeys = {
		Guild: 'guild',
		User: 'user'
	};
}
