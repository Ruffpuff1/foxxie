import { FoxxieButtonInteractionHandler } from '#lib/Structures/commands/interactions/FoxxieButtonInteractionHandler';
import { UserBuilder } from '#utils/builders';
import { RegisterButtonHandler } from '#utils/decorators';
import { ButtonParser, ParsedInfoUserAvatar } from '#utils/parsers/ButtonParser';

@RegisterButtonHandler(ButtonParser.InfoUserAvatar)
export class UserInteractionHandler extends FoxxieButtonInteractionHandler {
	public override async handle(...[interaction, result]: FoxxieButtonInteractionHandler.RunArgs<ParsedInfoUserAvatar>) {
		const response = await UserBuilder.UserAvatar(interaction, interaction.user, result.entity);
		return interaction.update(response);
	}
}
