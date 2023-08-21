import { GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { EventArgs, Events, GuildMessage } from '#lib/types';
import { Colors } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: Events.UserMessage
})
export class UserListener extends Listener<Events.UserMessage> {
    public async run(...[msg]: EventArgs<Events.UserMessage>): Promise<void> {
        if (msg.channel.type !== 'GUILD_VOICE') return;

        await this.logMessage(msg);
    }

    private async logMessage(message: GuildMessage): Promise<void> {
        this.container.client.emit(Events.GuildMessageLog, message.guild, GuildSettings.Channels.Logs.MessageVoice, t =>
            new MessageEmbed() //
                .setAuthor({
                    name: 'Voice Message Sent',
                    iconURL: message.member.avatarURL({ dynamic: true }) || message.author.avatarURL({ dynamic: true })!
                })
                .setColor(Colors.Green)
                .setTimestamp(message.createdTimestamp)
                .setDescription(
                    [
                        t(LanguageKeys.Guilds.Logs.ArgsUser, { user: message.author }),
                        t(LanguageKeys.Guilds.Logs.ArgsChannel, { channel: message.channel }),
                        t(LanguageKeys.Guilds.Logs.ArgsLink, { link: message.url }),
                        t(LanguageKeys.Guilds.Logs.ArgsMessage, { content: message.content })
                    ].join('\n')
                )
        );
    }
}
