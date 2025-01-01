import { FoxxieButtonInteractionHandler } from '#lib/Structures/commands/interactions/FoxxieButtonInteractionHandler';
import { UserBuilder } from '#utils/builders';
import { RegisterButtonHandler } from '#utils/decorators';
import { ButtonParser, ParsedInfoUserWarnings } from '#utils/parsers/ButtonParser';

@RegisterButtonHandler(ButtonParser.InfoUserWarnings)
export class UserInteractionHandler extends FoxxieButtonInteractionHandler {
	public override async handle(...[interaction, result]: FoxxieButtonInteractionHandler.RunArgs<ParsedInfoUserWarnings>) {
		const response = await UserBuilder.UserInfo(result.member.user, interaction, {
			banner: result.showBanner,
			notes: result.showNotes,
			warnings: true
		});
		return interaction.update(response);
	}
}
