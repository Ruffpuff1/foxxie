import { GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { EventArgs, Events } from '#lib/types';
import { Colors } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: Events.GuildMessageDeleteLog
})
export class UserListener extends Listener<Events.GuildMessageDeleteLog> {
    public async run(...[message]: EventArgs<Events.GuildMessageDeleteLog>) {
        if (message.author?.bot || !message.guild || !message.content) return;

        this.container.client.emit(Events.GuildMessageLog, message.guild, GuildSettings.Channels.Logs.MessageDelete, t =>
            new MessageEmbed()
                .setColor(Colors.Red)
                .setTimestamp(Date.now())
                .setAuthor({
                    name: t(LanguageKeys.Guilds.Logs.ActionDelete),
                    iconURL: message.author?.avatarURL({ dynamic: true })!
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
