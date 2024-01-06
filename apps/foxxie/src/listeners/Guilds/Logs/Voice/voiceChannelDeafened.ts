import { GuildSettings } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { EventArgs, FoxxieEvents } from '#lib/Types';
import { Colors } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: FoxxieEvents.VoiceChannelDeafened
})
export class UserListener extends Listener<FoxxieEvents.VoiceChannelDeafened> {
    public run(...[state]: EventArgs<FoxxieEvents.VoiceChannelDeafened>): void {
        this.container.client.emit(FoxxieEvents.GuildMessageLog, state.guild, GuildSettings.Channels.Logs.MessageVoice, t =>
            new EmbedBuilder() //
                .setAuthor({
                    name: 'User Deafened',
                    iconURL: state.member?.avatarURL() || state.member?.user.avatarURL() || undefined
                })
                .setColor(Colors.Red)
                .setTimestamp(Date.now())
                .setDescription(
                    [
                        t(LanguageKeys.Guilds.Logs.ArgsUser, { user: state.member?.user }),
                        t(LanguageKeys.Guilds.Logs.ArgsChannel, { channel: state.channel })
                    ].join('\n')
                )
        );
    }
}
