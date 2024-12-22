import { Events, EventArgs } from '#lib/types';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { acquireSettings, GuildSettings } from '#lib/database';
import { Colors } from '#utils/constants';
import { MessageEmbed } from 'discord.js';
import { LanguageKeys } from '#lib/i18n';

@ApplyOptions<ListenerOptions>({
    event: Events.GuildMemberRemove
})
export class UserListener extends Listener<Events.GuildMemberRemove> {
    public async run(...[member]: EventArgs<Events.GuildMemberRemove>): Promise<void> {
        const t = await acquireSettings(member.guild, s => s.getLanguage());
        const entity = await this.container.db.members.ensure(member.id, member.guild.id);

        this.container.client.emit(Events.GuildMessageLog, member.guild, GuildSettings.Channels.Logs.MemberLeave, () =>
            new MessageEmbed()
                .setColor(Colors.Red)
                .setTimestamp()
                .setAuthor({ name: t(LanguageKeys.Guilds.Logs.ActionMemberLeave), iconURL: member.displayAvatarURL({ dynamic: true }) })
                .setDescription(
                    [
                        t(LanguageKeys.Guilds.Logs.ArgsUser, { user: member.user }),
                        t(LanguageKeys.Guilds.Logs.ArgsJoinedAt, { date: member.joinedAt }),
                        t(LanguageKeys.Guilds.Logs.ArgsMessageCount, { count: entity.messageCount })
                    ].join('\n')
                )
        );
    }
}
