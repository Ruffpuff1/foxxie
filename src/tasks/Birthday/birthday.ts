import { Task } from '#lib/Container/Stores/Tasks/Task';
import { LanguageKeys } from '#lib/I18n';
import { PartialResponseValue, ResponseType } from '#lib/schedule/manager/ScheduleEntry';
import { ScheduleData } from '#lib/Types';
import { getAge, nextBirthday } from '#utils/birthday';
import { Schedules } from '#utils/constants';
import { fetchChannel } from '#utils/Discord';
import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { type TFunction } from '@sapphire/plugin-i18next';
import type { Guild, GuildMember } from 'discord.js';
import { getFixedT } from 'i18next';

const enum PartResult {
    NotSet,
    Invalid,
    Success
}

@ApplyOptions<Task.Options>({
    name: Schedules.Birthday
})
export class UserTask extends Task {
    private matchRegex = /{member(\.(age|nick|username|tag|guild))?}/g;

    public async run(data: ScheduleData<Schedules.Birthday>): Promise<PartialResponseValue | null> {
        const guild = this.container.client.guilds.cache.get(data.guildId);
        if (!guild) return null;

        const member = await resolveToNull(guild.members.fetch(data.userId));
        if (!member) return null;

        const { rolesBirthday } = await this.container.settings.readGuild(guild);
        const [message, t] = [null, getFixedT('en-US')];

        const results = await Promise.all([
            this.handleMessage(message!, guild, member, data, t),
            this.handleRole(member, rolesBirthday)
        ]);

        const isSuccess = results.includes(PartResult.Success);
        if (!isSuccess) return null;

        // Re-schedule the task as there was at least one success:
        const next = nextBirthday(data.month, data.day, { nextYearIfToday: true });
        return { type: ResponseType.Update, value: next };
    }

    private async handleRole(member: GuildMember, roleId: string | null): Promise<PartResult> {
        if (!roleId) return PartResult.NotSet;

        const role = member.guild.roles.cache.get(roleId);
        if (!role) return PartResult.Invalid;

        const me = this.container.client.user ? member.guild.members.cache.get(this.container.client.user.id) : null;

        if (me && me.roles.highest.position > role.position) {
            await this.addBirthdayRole(member, role.id);
        }

        return PartResult.Success;
    }

    private async addBirthdayRole(member: GuildMember, roleId: string | null): Promise<void> {
        if (!roleId) return;

        await member.roles.add(roleId);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        await this.container.schedule.add(Schedules.RemoveBirthdayRole, tomorrow, {
            data: {
                roleId,
                guildId: member.guild.id,
                userId: member.id
            }
        });
    }

    private async handleMessage(
        message: string,
        guild: Guild,
        member: GuildMember,
        data: ScheduleData<Schedules.Birthday>,
        t: TFunction
    ): Promise<PartResult> {
        const channel = await fetchChannel(guild, 'channelsBirthday');
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
