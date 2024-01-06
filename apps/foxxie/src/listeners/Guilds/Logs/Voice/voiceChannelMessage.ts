import { GuildSettings } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { EventArgs, FoxxieEvents, GuildMessage } from '#lib/Types';
import { Colors } from '#utils/constants';
import { getAttachment } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { ChannelType, EmbedBuilder, hyperlink } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: FoxxieEvents.UserMessage
})
export class UserListener extends Listener<FoxxieEvents.UserMessage> {
    public run(...[msg]: EventArgs<FoxxieEvents.UserMessage>): void {
        if (msg.channel.type !== ChannelType.GuildVoice) return;
        this.logMessage(msg);
    }

    private logMessage(message: GuildMessage): void {
        const attachment = getAttachment(message);

        this.container.client.emit(FoxxieEvents.GuildMessageLog, message.guild, GuildSettings.Channels.Logs.MessageVoice, t =>
            new EmbedBuilder() //
                .setAuthor({
                    name: 'Voice Message Sent',
                    iconURL: message.member.avatarURL() || message.author.avatarURL()!
                })
                .setColor(Colors.Green)
                .setTimestamp(message.createdTimestamp)
                .setDescription(
                    [
                        t(LanguageKeys.Guilds.Logs.ArgsUser, { user: message.author }),
                        t(LanguageKeys.Guilds.Logs.ArgsChannel, { channel: message.channel }),
                        t(LanguageKeys.Guilds.Logs.ArgsLink, { link: message.url }),
                        message.content ? t(LanguageKeys.Guilds.Logs.ArgsMessage, { content: message.content }) : null,
                        attachment ? `**Attachment**: ${hyperlink('Here', attachment.url)}` : null
                    ]
                        .filter(a => Boolean(a))
                        .join('\n')
                )
        );
    }
}
