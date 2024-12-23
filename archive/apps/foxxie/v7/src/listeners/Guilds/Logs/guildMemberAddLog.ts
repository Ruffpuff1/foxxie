import { GuildSettings } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { EventArgs, FoxxieEvents } from '#lib/Types';
import { Colors } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: FoxxieEvents.GuildMemberAdd,
    enabled: true
})
export class UserListener extends Listener<FoxxieEvents.GuildMemberAdd> {
    public run(...[member]: EventArgs<FoxxieEvents.GuildMemberAdd>): void {
        this.container.client.emit(FoxxieEvents.GuildMessageLog, member.guild, GuildSettings.Channels.Logs.MemberJoin, t =>
            new EmbedBuilder()
                .setColor(Colors.Green)
                .setTimestamp(member.joinedTimestamp)
                .setAuthor({
                    name: t(LanguageKeys.Guilds.Logs.ActionMemberJoin),
                    iconURL: member.displayAvatarURL()
                })
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
