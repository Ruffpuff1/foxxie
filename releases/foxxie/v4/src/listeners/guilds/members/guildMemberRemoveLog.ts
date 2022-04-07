import { Colors, floatPromise, isOnServer, resolveToNull } from '../../../lib/util';
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
        const [channelId, t] = await aquireSettings(member.guild, settings => {
            return [
                settings[guildSettings.channels.logs.memberLeave],
                settings.getLanguage()
            ];
        });

        if (!channelId) return;
        const channel = <TextChannel | null>await resolveToNull(member.guild.channels.fetch(channelId));
        if (!channel) {
            await writeSettings(member.guild, settings => settings[guildSettings.channels.logs.memberJoin] = null);
            return;
        }

        const memberEnt = await this.container.db.members.ensure(member.id, member.guild.id);
        const count = memberEnt.messageCount;

        const content = [
            t(member.guild, languageKeys.guilds.logs.argsMember, { member }),
            t(member.guild, languageKeys.guilds.logs.argsJoinedAt, { date: member.joinedAt }),
            t(member.guild, languageKeys.guilds.logs.argsMessageCount, { count }),
            t(member.guild, languageKeys.guilds.logs.argsDate, { date: Date.now() })
        ];

        const embed = new FoxxieEmbed(member.guild)
            .setColor(Colors.Red)
            .setDescription(content)
            .setTimestamp()
            .setAuthor(t(member.guild, languageKeys.guilds.logs.actionMemberLeft), member.displayAvatarURL({ dynamic: true }));

        await floatPromise(channel.send({ embeds: [embed] }));
    }

}