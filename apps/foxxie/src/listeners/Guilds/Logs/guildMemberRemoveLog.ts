import { GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { EventArgs, Events } from '#lib/types';
import { Colors } from '#utils/constants';
import { isDev } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: Events.GuildMemberRemove,
    enabled: !isDev()
})
export class UserListener extends Listener<Events.GuildMemberRemove> {
    public async run(...[member]: EventArgs<Events.GuildMemberRemove>): Promise<void> {
        const entity = await this.container.db.members.ensure(member.id, member.guild.id);

        this.container.client.emit(Events.GuildMessageLog, member.guild, GuildSettings.Channels.Logs.MemberLeave, t =>
            new MessageEmbed()
                .setColor(Colors.Red)
                .setTimestamp()
                .setAuthor({
                    name: t(LanguageKeys.Guilds.Logs.ActionMemberLeave),
                    iconURL: member.displayAvatarURL({ dynamic: true })
                })
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
