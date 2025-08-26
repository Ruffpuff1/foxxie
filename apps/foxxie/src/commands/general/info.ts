import { RequiresClientPermissions } from '@sapphire/decorators';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { ResponseBuilder, UserBuilder } from '#utils/builders';
import { GuildOnlyCommand, MessageSubcommand as MessageCommand, RegisterSubcommand, RequiresMemberPermissions } from '#utils/decorators';
import { buildAndSendResponse, sendLoadingMessage, sendMessage } from '#utils/functions/messages';
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
	@MessageCommand(InfoCommand.SubcommandKeys.Guild, false, ['server', 'serverinfo'])
	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	public static async MessageRunGuild(...[message, args]: FoxxieSubcommand.MessageRunArgs) {
		await sendLoadingMessage(message);
		const embed = await ResponseBuilder.InfoGuild(message.guild, args.t, message.member);
		return sendMessage(message, embed);
	}

	@MessageCommand('snowflake', true, ['sf', 'id'])
	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	public static async MessageRunSnowflake(...[message, args]: FoxxieSubcommand.MessageRunArgs) {
		const parameter = await args.pick('string').catch(() => null);
		return buildAndSendResponse(message, () => ResponseBuilder.Info(parameter, args));
	}

	@MessageCommand(InfoCommand.SubcommandKeys.User, false, ['u'])
	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	public static async MessageRunUser(...[message, args]: FoxxieSubcommand.MessageRunArgs) {
		const user = await args.pick('username').catch(() => message.author);

		await buildAndSendResponse(message, () =>
			UserBuilder.UserInfo(user, message, {
				banner: args.getFlags(...InfoCommand.Flags.Banner),
				notes: args.getFlags(...InfoCommand.Flags.Note),
				warnings: args.getFlags(...InfoCommand.Flags.Warning)
			})
		);
	}

	private static get AllFlags() {
		return [...InfoCommand.Flags.Warning, ...InfoCommand.Flags.Note, ...InfoCommand.Flags.Banner, ...InfoCommand.Flags.Snowflake];
	}

	public static Flags = {
		Banner: ['b', 'banner'],
		Note: ['n', 'note', 'notes'],
		Snowflake: ['sf', 'snowflake'],
		Warning: ['w', 'warn', 'warnings', 'warning']
	};

	private static Language = LanguageKeys.Commands.General.Info;

	private static SubcommandKeys = {
		Guild: 'guild',
		User: 'user'
	};
}
