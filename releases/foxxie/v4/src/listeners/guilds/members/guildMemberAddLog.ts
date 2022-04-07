import { checkInviteCache, Colors, floatPromise, isOnServer, resolveToNull } from '../../../lib/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import type { GuildMember, TextChannel } from 'discord.js';
import { aquireSettings, guildSettings, writeSettings } from 'lib/database';
import { FoxxieEmbed } from 'lib/discord';
import { languageKeys } from 'lib/i18n';

@ApplyOptions<ListenerOptions>({
    enabled: isOnServer(),
    event: Events.GuildMemberAdd
})
export default class FoxxieListener extends Listener {

    public async run(member: GuildMember): Promise<void> {
        // return if self
        if (member.id === process.env.CLIENT_ID) return;
        const [channelId, t] = await aquireSettings(member.guild, settings => {
            return [
                settings[guildSettings.channels.logs.memberJoin],
                settings.getLanguage()
            ];
        });

        if (!channelId) return;
        const channel = <TextChannel | null>await resolveToNull(member.guild.channels.fetch(channelId));
        if (!channel) {
            await writeSettings(member.guild, settings => settings[guildSettings.channels.logs.memberJoin] = null);
            return;
        }

        const content = [
            t(languageKeys.guilds.logs.argsMember, { member }),
            t(languageKeys.guilds.logs.argsCreated, { date: member.user.createdAt }),
            t(languageKeys.guilds.logs.argsPosition, { position: member.guild.memberCount }),
            // invite args for logging relies on internal caching and may not entirely be up to date. will default to first invite if none present.
            t(languageKeys.guilds.logs.argsInvite, { invite: await checkInviteCache(member.guild, t) }),
            t(languageKeys.guilds.logs.argsDate, { date: Date.now() })
        ];

        const embed = new FoxxieEmbed(member.guild)
            .setColor(Colors.Green)
            .setDescription(content)
            .setTimestamp(member.joinedTimestamp)
            .setAuthor(t(languageKeys.guilds.logs.actionMemberJoin), member.displayAvatarURL({ dynamic: true }));

        await floatPromise(channel.send({ embeds: [embed] }));
    }

}