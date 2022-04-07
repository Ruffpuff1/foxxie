import { events, floatPromise, getPersistRoles, isOnServer, prepareAutomationEmbed, resolveToNull, transformAutomationMessage } from '../../../lib/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import type { GuildMember, TextChannel } from 'discord.js';
import { aquireSettings, guildSettings, writeSettings } from 'lib/database';
import { FoxxieEmbed } from 'lib/discord';
import { languageKeys } from 'lib/i18n';

@ApplyOptions<ListenerOptions>({
    enabled: isOnServer(),
    event: Events.GuildMemberRemove
})
export default class FoxxieListener extends Listener {

    public async run(member: GuildMember): Promise<void> {
        // return if self
        if (member.id === process.env.CLIENT_ID) return;
        const [message, embed, channelId, timer, persist, t] = await aquireSettings(member.guild, settings => {
            return [
                settings[guildSettings.messages.goodbye],
                settings[guildSettings.embeds.goodbye],
                settings[guildSettings.channels.goodbye],
                settings[guildSettings.messages.goodbyeAutoDelete],
                settings[guildSettings.persistRolesEnabled],
                settings.getLanguage()
            ];
        });

        if (persist) await this.managePersistRoles(member);
        this.container.client.emit(events.MEMBER_COUNT, member.guild, t);

        if (!channelId) return;
        const channel = <null | TextChannel>await resolveToNull(member.guild.channels.fetch(channelId));
        if (!channel) {
            await writeSettings(member.guild, settings => settings[guildSettings.channels.goodbye] = null);
            return;
        }

        const embeds: FoxxieEmbed[] = [];
        const base: string = embed ? '' : t(languageKeys.listeners.guildMemberRemoveFarewellDefault);
        const content = transformAutomationMessage(message || base, member, t) || null;

        if (embed) {
            const sendEmbed = new FoxxieEmbed(member.guild, embed);
            if (embed.color) sendEmbed.setColor(embed.color);
            embeds.push(prepareAutomationEmbed(sendEmbed, member, t));
        }

        const sent = await resolveToNull(channel.send({ embeds, content, allowedMentions: { parse: ['roles', 'users'] } }));
        if (sent && timer) setInterval(() => floatPromise(sent.delete()), timer);
    }

    async managePersistRoles(member: GuildMember): Promise<void> {
        const persistRoles = await getPersistRoles(member);

        for (const id of [...member.roles.cache.keys()]) {
            await persistRoles.add(member.id, id);
        }
    }

}