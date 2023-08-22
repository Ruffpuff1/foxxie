import { GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { EventArgs, Events } from '#lib/types';
import { Colors } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: Events.GuildMemberUpdate
})
export class UserListener extends Listener<Events.GuildMemberUpdate> {
    public async run(...[previous, next]: EventArgs<Events.GuildMemberUpdate>): Promise<void> {
        if (!(previous.pending && !next.pending)) return;
        // fetch t and settings.
        const [t, settings] = await this.container.db.guilds.acquire(next.guild.id, settings => [
            settings.getLanguage(),
            settings
        ]);

        // emit the member join event once screening passes.
        this.container.client.emit(Events.GuildMemberJoin, next, settings);
        // emit the logging event for screening logs.
        this.container.client.emit(Events.GuildMessageLog, next.guild, GuildSettings.Channels.Logs.MemberScreening, () =>
            new MessageEmbed()
                .setAuthor({
                    name: t(LanguageKeys.Guilds.Logs.ActionMemberScreening),
                    iconURL: next.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp()
                .setColor(Colors.Yellow)
                .setDescription(
                    [
                        t(LanguageKeys.Guilds.Logs.ArgsUser, { user: next.user }),
                        t(LanguageKeys.Guilds.Logs.ArgsTimeTaken, { time: Date.now() - next.joinedTimestamp! })
                    ].join('\n')
                )
        );
    }
}
