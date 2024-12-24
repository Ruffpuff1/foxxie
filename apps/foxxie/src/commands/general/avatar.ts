import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { UserBuilder } from '#utils/builders';
import { GuildOnlyCommand, RegisterCommand } from '#utils/decorators';
import { sendLoadingMessage, sendMessage } from '#utils/functions';
import { PermissionFlagsBits } from 'discord.js';

@GuildOnlyCommand()
@RegisterCommand((command) =>
	command
		.setAliases('av')
		.setDescription(AvatarCommand.Language.Description)
		.setDetailedDescription(AvatarCommand.Language.DetailedDescription)
		.setRequiredClientPermissions(PermissionFlagsBits.EmbedLinks)
		.setRequiredUserPermissions(PermissionFlagsBits.EmbedLinks)
)
export default class AvatarCommand extends FoxxieCommand {
	public async messageRun(...[message, args]: FoxxieCommand.MessageRunArgs): Promise<void> {
		await sendLoadingMessage(message);
		const entity = await args.pick('member').catch(() => args.pick('username').catch(() => message.member));

		const response = await UserBuilder.UserAvatar(message, message.author, entity);
		await sendMessage(message, response);
	}

	private static Language = LanguageKeys.Commands.General.Avatar;
}
