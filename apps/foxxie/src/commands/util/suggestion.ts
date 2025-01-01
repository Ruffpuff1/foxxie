import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { createSuggestion } from '#modules/suggestions';
import { GuildOnlyCommand, MessageSubcommand, RegisterSubcommand } from '#utils/decorators';
import { userMention } from 'discord.js';

@GuildOnlyCommand()
@RegisterSubcommand((command) => command.setAliases('suggest'))
export class SuggestionCommand extends FoxxieSubcommand {
	@MessageSubcommand(SuggestionCommand.SubcommandKeys.Create, true, ['post'])
	public static async MessageRunCreate(...[message, args]: FoxxieSubcommand.MessageRunArgs) {
		const content = await args.rest('string');
		return createSuggestion(
			message,
			{
				avatar: message.member!.displayAvatarURL(),
				id: message.author.id,
				mention: userMention(message.author.id),
				tag: message.member!.displayName
			},
			content
		);
	}

	public static Language = LanguageKeys.Commands.Util.Suggestion;

	public static SubcommandKeys = {
		Create: 'create'
	};
}
