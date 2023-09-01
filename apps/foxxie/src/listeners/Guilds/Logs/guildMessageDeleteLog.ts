import { GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { Colors } from '#utils/constants';
import { isDev } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: FoxxieEvents.MessageDelete,
    enabled: !isDev()
})
export class UserListener extends Listener<FoxxieEvents.MessageDelete> {
    public run(...[message]: EventArgs<FoxxieEvents.MessageDelete>): void {
        if (message.author?.bot || !message.guild || !message.content) return;

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
                        t(LanguageKeys.Guilds.Logs.ArgsMessage, { content: message.content })
                    ].join('\n')
                )
        );
    }
}
