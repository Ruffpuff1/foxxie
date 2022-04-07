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
    event: events.MESSAGE_UPDATE_LOG
})
export default class FoxxieListener extends Listener {

    public async run(old: Message, msg: Message): Promise<void> {
        if (old.partial || !msg.guild || !msg.guild.available || msg.author.bot) return;
        await this.log(msg.author, msg as GuildMessage, old as GuildMessage, msg.channel as GuildChannel);
    }

    async log(user: User, msg: GuildMessage, old: GuildMessage, channel: GuildChannel): Promise<Message | void> {
        const [logChannelId, ignoredChannels, t] = await aquireSettings(msg.guild, (settings: GuildEntity) => {
            return [
                settings[guildSettings.channels.logsMessageEdit],
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
            `${t(languageKeys.guilds.logs.argsLink, { link: msg.url })}\n`,
            t(languageKeys.guilds.logs.argsMessages, {
                old: old.cleanContent,
                new: msg.cleanContent,
                joinArrays: old.cleanContent.length > 45 ? '\n\n' : '\n'
            })
        ];

        const embed = new FoxxieEmbed(msg)
            .setColor(Colors.Orange)
            .setAuthor(t(languageKeys.guilds.logs.actionEdit), user.displayAvatarURL({ dynamic: true }))
            .setDescription(content)
            .setTimestamp();

        await floatPromise((logChannel as TextChannel).send({ embeds: [embed] }));
    }

}