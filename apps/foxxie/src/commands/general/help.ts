import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { ResponseBuilder } from '#utils/builders';
import { RegisterCommand } from '#utils/decorators';
import { sendMessage } from '#utils/functions';
import { PermissionFlagsBits } from 'discord.js';

@RegisterCommand((command) =>
	command
		.setAliases('h', 'commands')
		.setDescription(LanguageKeys.Commands.General.Help.Description)
		.setRequiredClientPermissions(PermissionFlagsBits.EmbedLinks)
		.setRequiredUserPermissions(PermissionFlagsBits.EmbedLinks)
)
export default class UserCommand extends FoxxieCommand {
	public async messageRun(...[message, args]: FoxxieCommand.MessageRunArgs) {
		// If command specified send the help menu for the command.
		const command = await args.pick('command').catch(() => null);
		if (command) return ResponseBuilder.HelpCommand(command, args);
		// Else send the full help menu.
		const embed = await ResponseBuilder.Help(args);
		return sendMessage(message, embed);
	}
}
