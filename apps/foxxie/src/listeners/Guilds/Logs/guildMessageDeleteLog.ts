import { GuildSettings } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { EventArgs, FoxxieEvents } from '#lib/Types';
import { Colors } from '#utils/constants';
import { getAttachment } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { EmbedBuilder, Message, hyperlink } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: FoxxieEvents.MessageDelete
})
export class UserListener extends Listener<FoxxieEvents.MessageDelete> {
    public run(...[message]: EventArgs<FoxxieEvents.MessageDelete>): void {
        if (message.author?.bot || !message.guild) return;

        const attachment = getAttachment(message as Message<boolean>);

        this.container.client.emit(FoxxieEvents.GuildMessageLog, message.guild, GuildSettings.Channels.Logs.MessageDelete, t =>
            new EmbedBuilder()
                .setColor(Colors.Red)
                .setTimestamp(Date.now())
                .setAuthor({
                    name: t(LanguageKeys.Guilds.Logs.ActionDelete),
                    iconURL: message.author?.avatarURL() ?? undefined
                })
                .setDescription(
                    [
                        t(LanguageKeys.Guilds.Logs.ArgsUser, { user: message.author }),
                        t(LanguageKeys.Guilds.Logs.ArgsChannel, {
                            channel: message.channel
                        }),
                        message.content ? t(LanguageKeys.Guilds.Logs.ArgsMessage, { content: message.content }) : null,
                        attachment ? `**Attachment**: ${hyperlink('Here', attachment.url)}` : null
                    ]
                        .filter(a => Boolean(a))
                        .join('\n')
                )
        );
    }
}
