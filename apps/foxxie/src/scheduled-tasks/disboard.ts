import { GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import type { ScheduleData } from '#lib/types';
import { Schedules } from '#utils/constants';
import { fetchChannel } from '#utils/Discord';
import { isDev, seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { RESTJSONErrorCodes } from 'discord-api-types/v9';
import { type Guild, MessageEmbed, DiscordAPIError } from 'discord.js';

@ApplyOptions<ScheduledTask.Options>({
    name: Schedules.Disboard,
    enabled: !isDev()
})
export class UserTask extends ScheduledTask {
    public async run(data: ScheduleData<Schedules.Disboard>) {
        const guild = this.container.client.guilds.cache.get(data.guildId);
        if (!guild) return;

        if (!guild.available) {
            this.container.tasks.create(Schedules.Disboard, data, seconds(20));
            return;
        }

        await this.sendMessage(guild);
    }

    private async sendMessage(guild: Guild): Promise<void> {
        const [message, embed, t] = await this.container.prisma.guilds(guild.id, settings => [
            settings[GuildSettings.Messages.Disboard],
            settings[GuildSettings.Embeds.Disboard],
            settings.getLanguage()
        ]);

        const channel = await fetchChannel(guild, GuildSettings.Channels.Disboard);
        if (!channel) return;

        const embeds: MessageEmbed[] = [];
        const base = embed ? '' : t(LanguageKeys.Tasks.DisboardDefault);

        if (embed) embeds.push(embed);

        try {
            await channel.send({ content: message || base || null, embeds });
        } catch (error) {
            if (!(error instanceof DiscordAPIError)) return;
            if (error.code === RESTJSONErrorCodes.UnknownChannel) {
                await this.container.prisma.guilds(guild.id, {
                    [GuildSettings.Channels.Disboard]: null
                });
            }
        }
    }
}
