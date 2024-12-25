import { FoxxieButtonInteractionHandler } from '#lib/Structures/commands/interactions/FoxxieButtonInteractionHandler';
import { UserBuilder } from '#utils/builders';
import { RegisterButtonHandler } from '#utils/decorators';
import { ButtonParser, ParsedInfoUserBanner } from '#utils/parsers/ButtonParser';

@RegisterButtonHandler(ButtonParser.InfoUserBanner)
export class UserInteractionHandler extends FoxxieButtonInteractionHandler {
	public override async run(...[interaction, result]: FoxxieButtonInteractionHandler.RunArgs<ParsedInfoUserBanner>) {
		const response = await UserBuilder.UserInfo(result.user, interaction, {
			banner: true,
			notes: result.showNotes,
			warnings: result.showWarnings
		});
		return interaction.update(response);
	}
}
