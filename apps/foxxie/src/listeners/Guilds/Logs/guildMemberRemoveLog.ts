import { GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { Colors } from '#utils/constants';
import { isDev } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: FoxxieEvents.GuildMemberRemove,
    enabled: !isDev()
})
export class UserListener extends Listener<FoxxieEvents.GuildMemberRemove> {
    public async run(...[member]: EventArgs<FoxxieEvents.GuildMemberRemove>): Promise<void> {
        const entity = await this.container.db.members.ensure(member.id, member.guild.id);

        this.container.client.emit(FoxxieEvents.GuildMessageLog, member.guild, GuildSettings.Channels.Logs.MemberLeave, t =>
            new EmbedBuilder()
                .setColor(Colors.Red)
                .setTimestamp()
                .setAuthor({
                    name: t(LanguageKeys.Guilds.Logs.ActionMemberLeave),
                    iconURL: member.displayAvatarURL()
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
