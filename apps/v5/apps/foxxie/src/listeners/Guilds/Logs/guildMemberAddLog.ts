import { GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { EventArgs, Events } from '#lib/types';
import { Colors } from '#utils/constants';
import { isDev } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { fetchT } from '@sapphire/plugin-i18next';
import { MessageEmbed } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    enabled: !isDev(),
    event: Events.GuildMemberAdd
})
export class UserListener extends Listener<Events.GuildMemberAdd> {
    public async run(...[member]: EventArgs<Events.GuildMemberAdd>): Promise<void> {
        const t = await fetchT(member.guild);

        this.container.client.emit(Events.GuildMessageLog, member.guild, GuildSettings.Channels.Logs.MemberJoin, () =>
            new MessageEmbed()
                .setColor(Colors.Green)
                .setTimestamp(member.joinedTimestamp)
                .setAuthor({ name: t(LanguageKeys.Guilds.Logs.ActionMemberJoin), iconURL: member.displayAvatarURL({ dynamic: true }) })
                .setDescription(
                    [
                        t(LanguageKeys.Guilds.Logs.ArgsUser, { user: member.user }),
                        t(LanguageKeys.Guilds.Logs.ArgsCreated, { date: member.user.createdAt }),
                        t(LanguageKeys.Guilds.Logs.ArgsPosition, { position: member.guild.memberCount })
                    ].join('\n')
                )
        );
    }
}
