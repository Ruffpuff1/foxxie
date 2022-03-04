import { LanguageKeys } from '#lib/i18n';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { RegisterChatInputCommand } from '#utils/decorators';
import { enUS } from '#utils/util';
import { bold, hyperlink, italic, underscore } from '@discordjs/builders';
import { Command } from '@sapphire/framework';

@RegisterChatInputCommand(
    CommandName.Donate,
    builder =>
        builder //
            .setDescription(enUS(LanguageKeys.Commands.General.DonateDescription)) //
            .addBooleanOption(option =>
                option //
                    .setName('ephemeral')
                    .setDescription(enUS(LanguageKeys.System.OptionEphemeralDefaultTrue))
            ),
    ['945897471513612318', '945897471513612318']
)
export class UserCommand extends Command {
    private readonly urls = [
        bold(`• ${hyperlink('Ko-Fi', '<https://ko-fi.com/ruffpuff>')}`),
        bold(`• ${hyperlink('Paypal', 'https://www.paypal.com/donate/?business=HGFBP7UD695CC&no_recurring=0&currency_code=USD')}`)
    ];

    public chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Donate>) {
        return interaction.reply({
            content: `${italic(bold(underscore(args!.t(LanguageKeys.Commands.General.DonateHeader))))}\n\n${this.urls.join('\n')}`,
            ephemeral: args!.ephemeral ?? true
        });
    }
}
