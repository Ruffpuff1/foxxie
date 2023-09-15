import { GuildSettings } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { EventArgs, FoxxieEvents } from '#lib/Types';
import { Colors } from '#utils/constants';
import { isDev } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: FoxxieEvents.GuildMemberUpdate,
    enabled: !isDev()
})
export class UserListener extends Listener<FoxxieEvents.GuildMemberUpdate> {
    public async run(...[previous, next]: EventArgs<FoxxieEvents.GuildMemberUpdate>): Promise<void> {
        if (!(previous.pending && !next.pending)) return;
        // fetch t and settings.
        const [t, settings] = await this.container.db.guilds.acquire(next.guild.id, settings => [
            settings.getLanguage(),
            settings
        ]);

        // emit the member join event once screening passes.
        this.container.client.emit(FoxxieEvents.GuildMemberJoin, next, settings);
        // emit the logging event for screening logs.
        this.container.client.emit(FoxxieEvents.GuildMessageLog, next.guild, GuildSettings.Channels.Logs.MemberScreening, () =>
            new EmbedBuilder()
                .setAuthor({
                    name: t(LanguageKeys.Guilds.Logs.ActionMemberScreening),
                    iconURL: next.displayAvatarURL()
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
