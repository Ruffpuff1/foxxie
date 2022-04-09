import { Listener } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { EventArgs, Events, GuildMessage } from '#lib/types';
import { acquireSettings, GuildSettings } from '#lib/database';
import { fetchChannel, fetchAuditEntry } from '#utils/Discord';
import { LanguageKeys } from '#lib/i18n';
import { MessageEmbed, User } from 'discord.js';
import { Colors } from '#utils/constants';
import { floatPromise, idToTimestamp } from '#utils/util';
import { resolveToNull, cast, seconds, isDev } from '@ruffpuff/utilities';
import type { TFunction } from '@foxxie/i18n';

@ApplyOptions<Listener.Options>({
    enabled: !isDev(),
    event: Events.GuildMessageDeleteLog
})
export class UserListener extends Listener<Events.GuildMessageDeleteLog> {
    public async run(...[msg]: EventArgs<Events.GuildMessageDeleteLog>): Promise<void> {
        if (msg.partial || !msg.guild || !msg.guild.available || msg.author!.bot || !msg.content && !msg.attachments.size) return;

        const [ignoredChannels, t] = await acquireSettings(msg.guild, settings => [settings[GuildSettings.Channels.IgnoreAll], settings.getLanguage()]);

        const channel = await fetchChannel(msg.guild, GuildSettings.Channels.Logs.MessageDelete);
        if (ignoredChannels.includes(msg.channel.id) || !channel) return;

        const content = [
            t(LanguageKeys.Guilds.Logs.ArgsUser, { user: msg.author }),
            t(LanguageKeys.Guilds.Logs.ArgsChannel, { channel }),
            t(LanguageKeys.Guilds.Logs.ArgsMessage, {
                content: msg.cleanContent
            }),
            msg.attachments.size
                ? t(LanguageKeys.Guilds.Logs.ArgsAttachment, {
                      attachments: msg.attachments.map(attachment => `[${t(LanguageKeys.Guilds.Logs.Attachment)}](${attachment.proxyURL})`).join(' | ')
                  })
                : null
        ].filter(a => Boolean(a));

        const embed = new MessageEmbed()
            .setColor(Colors.Red)
            .setAuthor({
                name: t(LanguageKeys.Guilds.Logs.ActionDelete),
                iconURL: msg.author!.displayAvatarURL({ dynamic: true })
            })
            .setDescription(content.join('\n'))
            .setTimestamp();

        const sent = await resolveToNull(channel.send({ embeds: [embed] }));
        if (sent) await this.checkModerator(msg.author!, msg as GuildMessage, t, cast<GuildMessage>(sent));
    }

    private async checkModerator(user: User, msg: GuildMessage, t: TFunction, sent: GuildMessage) {
        const entry = await fetchAuditEntry(msg.guild, 'MESSAGE_DELETE', entry => entry.target.id === user.id);
        if (!entry || !entry.executor) return;

        if (Date.now() - idToTimestamp(entry.id)! > seconds(10)) return;
        const [embed] = sent.embeds;

        const string = `${t(LanguageKeys.Guilds.Logs.ArgsModerator, {
            mod: entry.executor
        })}\n${embed.description}`;
        embed.setDescription(string);

        await floatPromise(sent.edit({ embeds: [embed] }));
    }
}
