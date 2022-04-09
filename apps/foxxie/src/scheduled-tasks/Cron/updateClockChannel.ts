import { api } from '#external/Api';
import { acquireSettings, ClockEmojiStyle, GuildSettings, writeSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { Schedules } from '#utils/constants';
import { isDev, map, minutes } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { RateLimitManager } from '@sapphire/ratelimits';
import { PermissionFlagsBits, RESTJSONErrorCodes } from 'discord-api-types/v9';
import { DiscordAPIError, Guild } from 'discord.js';
import { tz } from 'moment-timezone';

@ApplyOptions<ScheduledTask.Options>({
    name: Schedules.UpdateClockChannel,
    enabled: !isDev(),
    cron: '*/5 * * * *',
    bullJobOptions: {
        removeOnComplete: true
    }
})
export class UserTask extends ScheduledTask {
    private nameRegExp = /{time}|{name}|{emoji}/gi;

    private timeRegExp = /\d{1,2}:\d{2}/;

    private signRegExp = /am|pm/i;

    private readonly rateLimits = new RateLimitManager(minutes(5), 1);

    public async run() {
        const now = Date.now();

        const promises = [...map(this.container.client.guilds.cache.values(), guild => this.runGuild(guild, now))];

        await Promise.all(promises);
        return null;
    }

    private async runGuild(guild: Guild, now: number) {
        if (!guild.available) return;

        if (this.isRateLimited(guild.id)) return;

        const { me } = guild;
        if (!me?.permissions.has(PermissionFlagsBits.ManageChannels)) return;

        const [channelId, timeZone, emoji, template, t] = await acquireSettings(guild, settings => [
            settings[GuildSettings.Channels.Clock.Channel],
            settings[GuildSettings.Channels.Clock.Timezone],
            settings[GuildSettings.Channels.Clock.EmojiStyle],
            settings[GuildSettings.Channels.Clock.Template],
            settings.getLanguage()
        ]);
        if (!channelId) return;

        const options: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
            timeZone
        };

        const name = tz(timeZone).format('z').toLowerCase();
        const time = new Intl.DateTimeFormat('en-US', options).format(now).toLowerCase();
        const formatted = this.format(template, name, time, this.getEmoji(time, emoji));

        try {
            await api()
                .channels(channelId)
                .patch({
                    data: {
                        name: formatted
                    },
                    reason: t(LanguageKeys.Tasks.UpdateClockChannelReason, {
                        time
                    })
                });
        } catch (error) {
            if (!(error instanceof DiscordAPIError)) return;
            if (error.code === RESTJSONErrorCodes.UnknownChannel) {
                await writeSettings(guild, settings => settings.clockChannel = null);
            }
        }
    }

    private getEmoji(time: string, style: ClockEmojiStyle) {
        const [sign] = time.match(this.signRegExp)!;
        const [number] = time.match(this.timeRegExp)!;

        const [hour, minute] = number.split(':');
        const parsedHour = parseInt(hour, 10);
        const parsedMin = parseInt(minute, 10);

        if (style === ClockEmojiStyle.Clock) return this.getClock(parsedHour, parsedMin);
        return this.getSceneEmoji(sign, parsedHour, parsedMin);
    }

    private getSceneEmoji(sign: string, parsedHour: number, parsedMin: number) {
        const isAfterSunset = parsedHour > 5 && sign === 'pm' || sign === 'am' && (parsedHour < 5 || parsedHour === 12);
        const isSunSet = parsedHour === 5 && parsedMin < 30;
        const isDusk = parsedHour === 5 && parsedMin >= 30;
        const isTop = parsedHour === 12 && sign === 'am';

        if (isTop) return '🌠';
        if (isAfterSunset) return '🌃';
        if (isDusk) return '🌆';
        if (isSunSet) return '🌇';
        return '';
    }

    private getClock(hour: number, min: number): string {
        switch (hour) {
            case 1:
                return min < 30 ? '🕐' : '🕜';
            case 2:
                return min < 30 ? '🕑' : '🕝';
            case 3:
                return min < 30 ? '🕒' : '🕞';
            case 4:
                return min < 30 ? '🕓' : '🕟';
            case 5:
                return min < 30 ? '🕔' : '🕠';
            case 6:
                return min < 30 ? '🕕' : '🕡';
            case 7:
                return min < 30 ? '🕖' : '🕢';
            case 8:
                return min < 30 ? '🕗' : '🕣';
            case 9:
                return min < 30 ? '🕘' : '🕤';
            case 10:
                return min < 30 ? '🕙' : '🕥';
            case 11:
                return min < 30 ? '🕚' : '🕦';
            case 12:
                return min < 30 ? '🕛' : '🕧';
            default:
                return '';
        }
    }

    private format(template: string | null, name: string, time: string, emoji: string) {
        if (!template) {
            return `${time} (${name})`;
        }

        return template.replace(this.nameRegExp, match => {
            switch (match) {
                case NameMatches.Time:
                    return time;
                case NameMatches.Name:
                    return name;
                case NameMatches.Emoji:
                    return emoji;
                default:
                    return match;
            }
        });
    }

    private isRateLimited(guildId: string): boolean {
        const rateLimit = this.rateLimits.acquire(guildId);
        if (rateLimit.limited) return true;

        rateLimit.consume();
        return false;
    }
}

const enum NameMatches {
    Emoji = '{emoji}',
    Time = '{time}',
    Name = '{name}'
}
