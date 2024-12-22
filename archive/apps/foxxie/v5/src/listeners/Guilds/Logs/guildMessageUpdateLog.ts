import { container, Listener } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { EventArgs, Events } from '#lib/types';
import { acquireSettings, GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { MessageEmbed } from 'discord.js';
import { Colors } from '#utils/constants';

@ApplyOptions<Listener.Options>({
    enabled: !container.client.development,
    event: Events.GuildMessageUpdateLog
})
export class UserListener extends Listener<Events.GuildMessageUpdateLog> {
    public async run(...[old, msg]: EventArgs<Events.GuildMessageUpdateLog>): Promise<void> {
        if (old.partial) await old.fetch();
        if (msg.partial) await msg.fetch();

        if (!msg.guild || !msg.guild.available || msg.author!.bot || old.content === msg.content) return;

        const [ignoredChannels, t] = await acquireSettings(msg.guild, settings => [settings[GuildSettings.Channels.IgnoreAll], settings.getLanguage()]);
        if (ignoredChannels.includes(msg.channel.id)) return;

        this.container.client.emit(Events.GuildMessageLog, msg.guild, GuildSettings.Channels.Logs.MessageEdit, () =>
            new MessageEmbed()
                .setColor(Colors.Orange)
                .setTimestamp()
                .setAuthor({
                    name: t(LanguageKeys.Guilds.Logs.ActionEdit),
                    iconURL: msg.member!.displayAvatarURL({ dynamic: true })
                })
                .setDescription(
                    [
                        t(LanguageKeys.Guilds.Logs.ArgsUser, {
                            user: msg.author
                        }),
                        t(LanguageKeys.Guilds.Logs.ArgsChannel, {
                            channel: msg.channel
                        }),
                        `${t(LanguageKeys.Guilds.Logs.ArgsLink, {
                            link: msg.url
                        })}\n`,
                        t(LanguageKeys.Guilds.Logs.ArgsMessages, {
                            old: old.cleanContent,
                            new: msg.cleanContent
                        })
                    ].join('\n')
                )
        );
    }
}
