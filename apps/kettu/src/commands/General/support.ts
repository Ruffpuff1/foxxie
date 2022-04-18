import { LanguageKeys } from '#lib/i18n';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { RegisterChatInputCommand, toLocalizationMap } from '@foxxie/commands';
import { bold, hyperlink } from '@discordjs/builders';
import { Command } from '@sapphire/framework';
import { getGuildIds } from '#utils/util';

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.Support)
            .setDescription(LanguageKeys.Commands.General.SupportDescription)
            .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.General.SupportDescription))
            .addEphemeralOption(true),
    {
        idHints: ['945899247973335071', '945899247973335071'],
        guildIds: getGuildIds()
    }
)
export class UserCommand extends Command {
    private readonly url = bold(hyperlink('The Corner Store', '<https://discord.gg/ZAZ4yRezC7>'));

    public chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Support>) {
        const { url } = this;
        return interaction.reply({
            content: args!.t(LanguageKeys.Commands.General.SupportMessage, { url }),
            ephemeral: args!.ephemeral ?? true
        });
    }
}
