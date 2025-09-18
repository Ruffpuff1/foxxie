import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { ResponseBuilder, UserBuilder } from '#utils/builders';
import { sendLoadingMessage, sendMessage } from '#utils/functions';
import { PermissionFlagsBits } from 'discord.js';

import { Command } from '../structures/TextCommandDecorators.js';

export class GeneralCommands {
	@Command((command) =>
		command
			.setAliases('av')
			.setCategory('general')
			.setDescription(LanguageKeys.Commands.General.Avatar.Description)
			.setDetailedDescription(LanguageKeys.Commands.General.Avatar.DetailedDescription)
			.setRequiredClientPermissions(PermissionFlagsBits.EmbedLinks)
			.setRequiredUserPermissions(PermissionFlagsBits.EmbedLinks)
	)
	public static async Avatar(...[message, args]: FoxxieCommand.MessageRunArgs) {
		await sendLoadingMessage(message);
		const entity = await args.pick('member').catch(() => args.pick('username').catch(() => message.member));

		const response = await UserBuilder.UserAvatar(message, message.author, entity);
		await sendMessage(message, response);
	}

	@Command((command) =>
		command
			.setCategory('general')
			.setAliases('h', 'commands')
			.setDescription(LanguageKeys.Commands.General.Help.Description)
			.setRequiredClientPermissions(PermissionFlagsBits.EmbedLinks)
			.setRequiredUserPermissions(PermissionFlagsBits.EmbedLinks)
	)
	public static async Help(...[message, args]: FoxxieCommand.MessageRunArgs) {
		// If command specified send the help menu for the command.
		const command = await args.pick('command').catch(() => null);
		if (command) return ResponseBuilder.HelpCommand(command, args);
		// Else send the full help menu.
		const embed = await ResponseBuilder.Help(args);
		return sendMessage(message, embed);
	}

	@Command((command) =>
		command
			.setCategory('general')
			.setAliases('uptime', 'up')
			.setDescription(LanguageKeys.Commands.General.Stats.Description)
			.setDetailedDescription(LanguageKeys.Commands.General.Stats.DetailedDescription)
			.setRequiredClientPermissions(PermissionFlagsBits.EmbedLinks)
			.setRequiredUserPermissions(PermissionFlagsBits.EmbedLinks)
	)
	public static async Stats(...[message, args]: FoxxieCommand.MessageRunArgs) {
		await sendLoadingMessage(message);
		const embed = await ResponseBuilder.Stats(args);
		await sendMessage(message, embed);
	}
}
