import { Command } from '@sapphire/framework';
import { hyperlink, bold, italic, underscore } from '@discordjs/builders';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { RegisterChatInputCommand } from '#utils/decorators';
import { LanguageKeys } from '#lib/i18n';
import { enUS } from '#utils/util';

@RegisterChatInputCommand(
    CommandName.Invite,
    builder =>
        builder //
            .setDescription('Invite me or my friends to join your server.') //
            .addBooleanOption(option =>
                option //
                    .setName('ephemeral')
                    .setDescription(enUS(LanguageKeys.System.OptionEphemeralDefaultTrue))
            ),
    ['945871213144711260', '945871213144711260']
)
export class UserCommand extends Command {
    private readonly urls = [
        bold(`• ${hyperlink('Foxxie', this.invite('825130284382289920', '103079267392'))} (Moderation)`),
        bold(`• ${hyperlink('Kettu', this.invite('945242473683353600'))} (Tools)`)
    ];

    public chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Invite>) {
        const content = `${italic(bold(underscore('Bot invite links')))}\n\n${this.urls.join('\n')}\n\n${italic(
            'Heres some invite links for me and my fellow bots,\nyou can also invite me by clicking the "add to server" button on my profile.'
        )}`;

        return interaction.reply({
            content,
            ephemeral: args!.ephemeral ?? true
        });
    }

    private invite(clientId: string, permissions?: `${bigint}`) {
        return `https://discord.com/oauth2/authorize?client_id=${clientId}${permissions ? `&permissions=${permissions}` : ''}&scope=bot%20applications.commands`;
    }
}
