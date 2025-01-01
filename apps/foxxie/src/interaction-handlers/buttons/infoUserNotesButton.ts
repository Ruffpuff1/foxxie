import { FoxxieButtonInteractionHandler } from '#lib/Structures/commands/interactions/FoxxieButtonInteractionHandler';
import { UserBuilder } from '#utils/builders';
import { RegisterButtonHandler } from '#utils/decorators';
import { ButtonParser, ParsedInfoUserNotes } from '#utils/parsers/ButtonParser';

@RegisterButtonHandler(ButtonParser.InfoUserNotes)
export class UserInteractionHandler extends FoxxieButtonInteractionHandler {
	public override async handle(...[interaction, result]: FoxxieButtonInteractionHandler.RunArgs<ParsedInfoUserNotes>) {
		const response = await UserBuilder.UserInfo(result.member.user, interaction, {
			banner: result.showBanner,
			notes: true,
			warnings: result.showWarnings
		});
		return interaction.update(response);
	}
}
