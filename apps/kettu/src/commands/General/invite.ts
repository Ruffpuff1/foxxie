import { Command } from '@sapphire/framework';
import { hyperlink, bold, italic, underscore } from '@discordjs/builders';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { RegisterChatInputCommand, toLocalizationMap } from '@foxxie/commands';
import { LanguageKeys } from '#lib/i18n';
import { getGuildIds } from '#utils/util';

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.Invite)
            .setDescription(LanguageKeys.Commands.General.InviteDescription)
            .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.General.InviteDescription))
            .addEphemeralOption(true),
    {
        idHints: ['945871213144711260', '945871213144711260'],
        guildIds: getGuildIds()
    }
)
export class UserCommand extends Command {
    private readonly urls = [
        bold(`• ${hyperlink('Foxxie', this.invite('825130284382289920', '103079267392'))} (Moderation)`),
        bold(`• ${hyperlink('Kettu', this.invite('945242473683353600', '268435456'))} (Tools)`)
    ];

    public chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Invite>) {
        const { t } = args!;
        const content = `${italic(bold(underscore(t(LanguageKeys.Commands.General.InviteHeader))))}\n\n${this.urls.join('\n')}\n\n${italic(
            t(LanguageKeys.Commands.General.InviteBody)
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
