import { AutoCompleteCommand, ChatInputCommand, SubCommandCommand } from '#lib/Container/Utility';
import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import { RegisterChatInputCommand } from '#utils/chatInputDecorators';
import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord-api-types/v10';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['fm'],
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
    detailedDescription: LanguageKeys.Commands.Fun.LastFmDetailedDescription,
    subcommands: container.utilities.subCommands.get(SubCommandCommand.LastFm)
})
@RegisterChatInputCommand(
    container.utilities.chatInputCommands.lastFm.chatInputCommandData(),
    container.utilities.chatInputCommands.getCommandOptions(ChatInputCommand.LastFm)
)
export class UserCommand extends FoxxieCommand {
    public autocompleteRun = container.utilities.autoCompleteCommands.get(AutoCompleteCommand.LastFm);
}
