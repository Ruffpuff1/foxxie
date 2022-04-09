import { acquireSettings, GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import type { ScheduleData } from '#lib/types';
import { getAge, nextBirthday } from '#utils/birthday';
import { Schedules } from '#utils/constants';
import { fetchChannel } from '#utils/Discord';
import { days, isDev, resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import type { TFunction } from '@foxxie/i18n';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import type { Guild, GuildMember } from 'discord.js';

const enum PartResult {
    NotSet,
    Invalid,
    Success
}

@ApplyOptions<ScheduledTask.Options>({
    name: Schedules.Birthday,
    enabled: !isDev()
})
export class UserTask extends ScheduledTask {
    private matchRegex = /{member(\.(age|nick|username|tag|guild))?}/g;

    public async run(data: ScheduleData<Schedules.Birthday>): Promise<void | null> {
        const guild = this.container.client.guilds.cache.get(data.guildId);
        if (!guild) return null;

        const member = await resolveToNull(guild.members.fetch(data.userId));
        if (!member) return null;

        const [roleId, message, t] = await acquireSettings(guild, settings => [
            settings[GuildSettings.Birthday.Role],
            settings[GuildSettings.Birthday.Message],
            settings.getLanguage()
        ]);

        const results = await Promise.all([this.handleMessage(message!, guild, member, data, t), this.handleRole(member, roleId!)]);

        const isSuccess = results.includes(PartResult.Success);
        if (!isSuccess) return null;

        const next = nextBirthday(data.month, data.day, {
            nextYearIfToday: true,
            timeZoneOffset: 7
        });

        await this.container.tasks.create(Schedules.Birthday, data, next.getTime() - Date.now());
    }

    private async handleRole(member: GuildMember, roleId: string): Promise<PartResult> {
        if (!roleId) return PartResult.NotSet;

        const role = member.guild.roles.cache.get(roleId);
        if (!role) return PartResult.Invalid;

        if ((member.guild.me?.roles.highest.position as number) > role.position) {
            await this.addBirthdayRole(member, role.id);
        }

        return PartResult.Success;
    }

    private async addBirthdayRole(member: GuildMember, roleId: string): Promise<void> {
        await member.roles.add(roleId);

        await this.container.tasks.create(
            Schedules.RemoveBirthdayRole,
            {
                roleId,
                guildId: member.guild.id,
                userId: member.id
            },
            days(1)
        );
    }

    private async handleMessage(message: string, guild: Guild, member: GuildMember, data: ScheduleData<Schedules.Birthday>, t: TFunction): Promise<PartResult> {
        const channel = await fetchChannel(guild, GuildSettings.Birthday.Channel);
        if (!channel) return PartResult.NotSet;

        const content = this.parseMessage(message, member, data, t);

        const sent = await resolveToNull(
            channel.send({
                content,
                allowedMentions: { parse: ['roles', 'users'] }
            })
        );

        if (sent) return PartResult.Success;
        return PartResult.Invalid;
    }

    private parseMessage(message: string, member: GuildMember, data: ScheduleData<Schedules.Birthday>, t: TFunction): string {
        const age = getAge(data);
        const messageKey = LanguageKeys.Tasks[`BirthdayMessage${age ? 'Age' : ''}`];

        return (message || t(messageKey)).replace(this.matchRegex, match => {
            switch (match) {
                case BirthdayMessageMatches.Member:
                    return member.toString();
                case BirthdayMessageMatches.Age:
                    return age ? `${age}` : t(LanguageKeys.Tasks.BirthdayYearOlder);
                case BirthdayMessageMatches.Nick:
                    return member.displayName;
                case BirthdayMessageMatches.Username:
                    return member.user.username;
                case BirthdayMessageMatches.Tag:
                    return member.user.tag;
                case BirthdayMessageMatches.Guild:
                    return member.guild.name;
                default:
                    return '';
            }
        });
    }
}

const enum BirthdayMessageMatches {
    Member = '{member}',
    Age = '{member.age}',
    Nick = '{member.nick}',
    Username = '{member.username}',
    Tag = '{member.tag}',
    Guild = '{member.guild}'
}
