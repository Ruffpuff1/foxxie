import { GuildSettings, PartialResponseValue, ResponseType, Task } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { Events, ScheduleData } from '#lib/types';
import { Schedules } from '#utils/constants';
import { fetchChannel } from '#utils/Discord';
import { isDev, seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import type { APIEmbed } from 'discord-api-types/v10';
import type { Guild } from 'discord.js';

@ApplyOptions<Task.Options>({
    name: Schedules.Disboard,
    enabled: !isDev()
})
export class UserTask extends Task {
    public async run(data: ScheduleData<Schedules.Disboard>): Promise<PartialResponseValue> {
        const guild = this.container.client.guilds.cache.get(data.guildId);
        if (!guild) return { type: ResponseType.Ignore };

        if (!guild.available) return { type: ResponseType.Delay, value: seconds(20) };

        await this.sendMessage(guild);

        return { type: ResponseType.Finished };
    }

    private async sendMessage(guild: Guild): Promise<void> {
        const [message, embed, t] = await this.container.db.guilds.acquire(guild.id, settings => [
            settings[GuildSettings.Messages.Disboard],
            settings[GuildSettings.Embeds.Disboard],
            settings.getLanguage()
        ]);

        const channel = await fetchChannel(guild, GuildSettings.Channels.Disboard);
        if (!channel) return;

        const embeds: APIEmbed[] = [];
        const base = embed ? '' : t(LanguageKeys.Tasks.DisboardDefault);

        if (embed) embeds.push(embed);

        try {
            await channel.send({ content: message || base || null, embeds });
        } catch (error) {
            this.container.client.emit(Events.Error, error);
        }
    }
}
