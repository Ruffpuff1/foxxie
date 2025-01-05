import { AutoCompleteCommand, ChatInputCommand, SubCommandCommand } from '#lib/Container/Utility';
import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import { RegisterChatInputCommand } from '#utils/Decorators/RegisterChatInputCommand';
import { NameAndDescriptionToLocalizedSubCommands } from '#utils/chatInputDecorators';
import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/pieces';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['fm', 'lfm'],
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
    detailedDescription: LanguageKeys.Commands.Fun.LastFmDetailedDescription,
    subcommands: container.utilities.subCommands.get(SubCommandCommand.LastFm)
})
@RegisterChatInputCommand(
    {
        name: 'lastfm',
        description: 'Fetch data from Last.fm music service.',
        translate: false,
        dmPermission: false,
        defaultMemberPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]).bitfield,
        nsfw: false,
        options: NameAndDescriptionToLocalizedSubCommands(
            {
                name: LanguageKeys.Commands.Fun.LastFmChatInputSubcommandArtistName,
                description: LanguageKeys.Commands.Fun.LastFmChatInputSubcommandArtistDescription,
                translate: true
            },
            {
                name: 'importspotify',
                description: 'import your spotify stats'
            },
            {
                name: LanguageKeys.Commands.Fun.LastFmChatInputSubcommandGlobalWhoKnows,
                description: LanguageKeys.Commands.Fun.LastFmChatInputSubcommandGlobalWhoKnowsDescription,
                translate: true
            },
            { name: 'stats', description: 'search for lastfm user stats' },
            { name: 'update', description: 'updating ur stats lolz' }
        )
    },
    container.utilities.chatInputCommands.getRegisterOptions(ChatInputCommand.LastFm)
)
export class UserCommand extends FoxxieCommand {
    public autocompleteRun = container.utilities.autoCompleteCommands.get(AutoCompleteCommand.LastFm);
}
