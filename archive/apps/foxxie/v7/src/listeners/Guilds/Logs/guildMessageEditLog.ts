import { GuildSettings } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { EventArgs, FoxxieEvents } from '#lib/Types';
import { Colors } from '#utils/constants';
import { floatPromise, getAttachment } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { EmbedBuilder, Message, TimestampStyles, hyperlink, time } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: FoxxieEvents.MessageUpdate
})
export class UserListener extends Listener<FoxxieEvents.MessageUpdate> {
    public async run(...[old, message]: EventArgs<FoxxieEvents.MessageUpdate>): Promise<void> {
        if (message.author?.bot || !message.guild) return;

        await floatPromise(old.fetch());
        const attachment = getAttachment(old as Message<boolean>);

        this.container.client.emit(FoxxieEvents.GuildMessageLog, message.guild, GuildSettings.Channels.Logs.MessageEdit, t =>
            new EmbedBuilder()
                .setColor(Colors.Orange)
                .setTimestamp(Date.now())
                .setAuthor({
                    name: t(LanguageKeys.Guilds.Logs.ActionEdit),
                    iconURL: message.author?.avatarURL() ?? undefined
                })
                .setDescription(
                    [
                        t(LanguageKeys.Guilds.Logs.ArgsUser, { user: message.author }),
                        t(LanguageKeys.Guilds.Logs.ArgsChannel, {
                            channel: message.channel
                        }),
                        `**Message Created**: ${time(old.createdAt, TimestampStyles.RelativeTime)}`,
                        attachment ? `**Attachment**: ${hyperlink('Here', old.url)}` : null,
                        old.content ? `**Before**: ${old.content}` : null,
                        '',
                        message.content ? `**After**: ${message.content}` : null
                    ]
                        .filter(a => a !== null)
                        .join('\n')
                )
        );
    }
}
