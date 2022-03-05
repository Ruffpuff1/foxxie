import { GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { Colors, Schedules, Urls } from '#utils/constants';
import { fetchChannel } from '#utils/Discord';
import { fetch } from '@foxxie/fetch';
import type { StatusPage } from '@foxxie/types';
import { time, TimestampStyles } from '@discordjs/builders';
import { hours, isDev, map, minutes, resolveToNull, toTitleCase } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchT, TFunction } from '@sapphire/plugin-i18next';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { RESTJSONErrorCodes } from 'discord-api-types/v9';
import { DiscordAPIError, Guild, GuildTextBasedChannel, MessageEmbed } from 'discord.js';
import type { StatusMessageKey } from '#lib/types';

@ApplyOptions<ScheduledTask.Options>({
    name: Schedules.CheckStatusPage,
    cron: '*/5 * * * *',
    enabled: !isDev(),
    bullJobOptions: {
        removeOnComplete: true
    }
})
export class UserTask extends ScheduledTask {
    public async run() {
        try {
            const result = await fetch(Urls.StatusPage).path('api').path('v2').path('incidents.json').json<StatusPage.Result>();

            const { incidents } = result;

            const promises = [...map(this.container.client.guilds.cache.values(), guild => this.runGuild(guild, incidents))];

            await Promise.all(promises);
            return null;
        } catch {
            return null;
        }
    }

    private async runGuild(guild: Guild, incidents: StatusPage.Result['incidents']) {
        const channel = await fetchChannel(guild, GuildSettings.Channels.StatusUpdate);
        if (!channel) return;

        for (const incident of incidents) {
            if (new Date(incident.created_at).getTime() + hours(36) <= Date.now()) continue;
            // if last update was greater than 5 minutes ago, no use in reupdating.
            if (Date.now() - new Date(incident.updated_at!).getTime() > minutes(5)) continue;

            try {
                const resolved = this.container.redis ? await this.container.redis.fetch(this.getKey(guild.id, incident.id)) : null;
                if (resolved === null) await this.postUpdate(incident, guild, channel);
                else await this.patchUpdate(incident, guild, channel, resolved as string);
            } catch {
                continue;
            }
        }
    }

    private async patchUpdate(incident: StatusPage.Result['incidents'][0], guild: Guild, channel: GuildTextBasedChannel, messageId: string) {
        const embed = this.makeEmbed(incident, await fetchT(guild));

        const message = await resolveToNull(channel.messages.fetch(messageId));
        if (!message) {
            await this.container.redis?.del(this.getKey(guild.id, incident.id));
            return;
        }

        try {
            await message.edit({ embeds: [embed] });
        } catch (err) {
            if (!(err instanceof DiscordAPIError)) return;

            if (err.code === RESTJSONErrorCodes.UnknownMessage) await this.container.redis?.del(this.getKey(guild.id, incident.id));
        }
    }

    private async postUpdate(incident: StatusPage.Result['incidents'][0], guild: Guild, channel: GuildTextBasedChannel) {
        const embed = this.makeEmbed(incident, await fetchT(guild));

        const sent = await resolveToNull(channel.send({ embeds: [embed] }));
        if (!sent) return;

        const { redis } = this.container;
        if (!redis) return;

        await redis.pinsertex(this.getKey(guild.id, incident.id), hours(36), sent.id);
    }

    private makeEmbed(incident: StatusPage.Result['incidents'][0], t: TFunction) {
        const color = this.resolveColor(incident);

        const embed = new MessageEmbed()
            .setColor(color)
            .setTimestamp(new Date(incident.started_at))
            .setURL(incident.shortlink)
            .setAuthor({
                name: t(LanguageKeys.Tasks.CheckStatusPageTitle),
                iconURL: this.container.client.user!.displayAvatarURL({
                    dynamic: true
                })
            })
            .setTitle(incident.name);

        for (const update of incident.incident_updates.reverse()) {
            const timestamp = new Date(update.created_at).getTime();
            const string = time(Math.round(timestamp / 1000), TimestampStyles.RelativeTime);

            embed.addField(`${toTitleCase(update.status)} (${string})`, update.body);
        }

        return embed;
    }

    private getKey(guildId: string, incidentId: string): StatusMessageKey {
        return `statuspage:${guildId}:${incidentId}`;
    }

    private resolveColor(incident: StatusPage.Result['incidents'][0]) {
        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
        switch (incident.status) {
            case 'resolved':
            case 'postmortem':
                return Colors.Green;
        }

        switch (incident.impact) {
            case 'critical':
                return Colors.Red;
            case 'major':
                return Colors.Orange;
            case 'minor':
                return Colors.Yellow;
            default:
                return Colors.Black;
        }
    }
}
