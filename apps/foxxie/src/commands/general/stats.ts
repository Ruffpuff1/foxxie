import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { MenuBuilder } from '#utils/builders';
import { GuildOnlyCommand, RegisterCommand } from '#utils/decorators';
import { sendLoadingMessage, sendMessage } from '#utils/functions';
import { PermissionFlagsBits } from 'discord.js';

@GuildOnlyCommand()
@RegisterCommand((command) =>
	command
		.setAliases('uptime', 'up')
		.setDescription(StatsCommand.Language.Description)
		.setDetailedDescription(StatsCommand.Language.DetailedDescription)
		.setRequiredClientPermissions(PermissionFlagsBits.EmbedLinks)
		.setRequiredUserPermissions(PermissionFlagsBits.EmbedLinks)
)
export class StatsCommand extends FoxxieCommand {
	public async messageRun(message: GuildMessage, args: FoxxieCommand.Args) {
		await sendLoadingMessage(message);
		const embed = await MenuBuilder.Stats(args);
		await sendMessage(message, embed);
	}

	private static Language = LanguageKeys.Commands.General.Stats;
}
