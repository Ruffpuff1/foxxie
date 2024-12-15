import { LanguageKeys } from '#lib/i18n';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { RegisterChatInputCommand } from '#utils/decorators';
import { enUS } from '#utils/util';
import { bold, hyperlink } from '@discordjs/builders';
import { Command } from '@sapphire/framework';

@RegisterChatInputCommand(
    CommandName.Support,
    builder =>
        builder //
            .setDescription(enUS(LanguageKeys.Commands.General.SupportDescription))
            .addBooleanOption(option =>
                option //
                    .setName('ephemeral')
                    .setDescription(enUS(LanguageKeys.System.OptionEphemeralDefaultTrue))
            ),
    ['945899247973335071', '945899247973335071']
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
