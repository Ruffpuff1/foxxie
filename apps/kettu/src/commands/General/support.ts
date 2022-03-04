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
            .setDescription('Get an invite link to my server if you need help.')
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
        return interaction.reply({
            content: `Need some help? Try coming and asking at ${this.url}.`,
            ephemeral: args!.ephemeral ?? true
        });
    }
}
