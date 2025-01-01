import { FoxxieButtonInteractionHandler } from '#lib/Structures/commands/interactions/FoxxieButtonInteractionHandler';
import { UserBuilder } from '#utils/builders';
import { RegisterButtonHandler } from '#utils/decorators';
import { ButtonParser } from '#utils/parsers/ButtonParser';
import { User } from 'discord.js';

@RegisterButtonHandler(ButtonParser.InfoUserReset)
export class UserInteractionHandler extends FoxxieButtonInteractionHandler {
	public override async handle(...[interaction, result]: FoxxieButtonInteractionHandler.RunArgs<User>) {
		const response = await UserBuilder.UserInfo(result, interaction);
		return interaction.update(response);
	}
}
