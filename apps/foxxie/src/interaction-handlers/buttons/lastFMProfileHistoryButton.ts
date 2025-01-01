import { FoxxieButtonInteractionHandler } from '#lib/Structures/commands/interactions/FoxxieButtonInteractionHandler';
import { RegisterButtonHandler } from '#utils/decorators';
import { ButtonParser, ParsedInfoUserAvatar } from '#utils/parsers/ButtonParser';

@RegisterButtonHandler(ButtonParser.LastFMProfileHistory)
export class UserInteractionHandler extends FoxxieButtonInteractionHandler {
	public override async handle(...[interaction, result]: FoxxieButtonInteractionHandler.RunArgs<ParsedInfoUserAvatar>) {
		console.log(result);
		return interaction.update('history');
	}
}
