import { Colors, events, floatPromise, isOnServer, resolveToNull } from '../../lib/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { GuildChannel, Message, TextChannel, User } from 'discord.js';
import { aquireSettings, GuildEntity, guildSettings } from '../../lib/database';
import { languageKeys } from '../../lib/i18n';
import type { GuildMessage } from '../../lib/types/Discord';
import { FoxxieEmbed } from '../../lib/discord';

@ApplyOptions<ListenerOptions>({
    enabled: isOnServer(),
    event: events.MESSAGE_DELETE_LOG
})
export default class FoxxieListener extends Listener {

    public async run(msg: Message): Promise<void> {
        if (msg.partial || !msg.guild || !msg.guild.available || msg.author.bot) return;
        await this.log(msg.author, msg as GuildMessage, msg.channel as GuildChannel);
    }

    async log(user: User, msg: GuildMessage, channel: GuildChannel): Promise<Message | void> {
        const [logChannelId, ignoredChannels, t] = await aquireSettings(msg.guild, (settings: GuildEntity) => {
            return [
                settings[guildSettings.channels.logsMessageDelete],
                settings[guildSettings.channels.ignoreAll],
                settings.getLanguage()
            ];
        });

        if (!logChannelId || ignoredChannels.includes(channel.id)) return;
        const logChannel = await resolveToNull(msg.guild.channels.fetch(logChannelId));
        if (!logChannel) return;

        const content = [
            t(languageKeys.guilds.logs.argsUser, { user }),
            t(languageKeys.guilds.logs.argsChannel, { channel }),
            t(languageKeys.guilds.logs.argsMessage, { content: msg.cleanContent }),
            msg.attachments.size
                ? t(languageKeys.guilds.logs.argsAttachment, {
                    attachments: msg.attachments.map(attachment =>
                        `[${t(languageKeys.guilds.logs.attachment)}](${attachment.proxyURL})`).join(' | ')
                })
                : null
        ].filter(a => !!a);

        const embed = new FoxxieEmbed(msg)
            .setColor(Colors.Red)
            .setAuthor(t(languageKeys.guilds.logs.actionDelete), user.displayAvatarURL({ dynamic: true }))
            .setDescription(content)
            .setTimestamp();

        await floatPromise((logChannel as TextChannel).send({ embeds: [embed] }));
    }

}