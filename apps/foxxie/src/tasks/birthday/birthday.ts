import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { readSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { PartialResponseValue, ResponseType, ScheduleEntry, Task } from '#lib/schedule';
import { getAge, nextBirthday } from '#utils/birthday';
import { Schedules } from '#utils/constants';
import { fetchChannel } from '#utils/functions';
import { Guild, GuildMember } from 'discord.js';
import { getFixedT, TFunction } from 'i18next';

const enum BirthdayMessageMatches {
	Age = '{member.age}',
	Guild = '{member.guild}',
	Member = '{member}',
	Nick = '{member.nick}',
	Tag = '{member.tag}',
	Username = '{member.username}'
}

@ApplyOptions<Task.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	name: Schedules.Birthday
}))
export class UserTask extends Task {
	private matchRegex = /{member(\.(age|nick|username|tag|guild))?}/g;

	public async run(data: ScheduleEntry.TaskData[Schedules.Birthday]): Promise<null | PartialResponseValue> {
		const guild = this.container.client.guilds.cache.get(data.guildId);
		if (!guild) return null;

		const member = await resolveToNull(guild.members.fetch(data.userId));
		if (!member) return null;

		const { birthdayRole } = await readSettings(guild);
		const [message, t] = [null, getFixedT('en-US')];

		const results = await Promise.all([this.handleMessage(message!, guild, member, data, t), this.handleRole(member, birthdayRole)]);

		const isSuccess = results.includes(PartResult.Success);
		if (!isSuccess) return null;

		// Re-schedule the task as there was at least one success:
		const next = nextBirthday(data.month, data.day, { nextYearIfToday: true });
		return { type: ResponseType.Update, value: next };
	}

	private async addBirthdayRole(member: GuildMember, roleId: null | string): Promise<void> {
		if (!roleId) return;

		await member.roles.add(roleId);
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		await this.container.schedule.add(Schedules.RemoveBirthdayRole, tomorrow, {
			data: {
				guildId: member.guild.id,
				roleId,
				userId: member.id
			}
		});
	}

	private async handleMessage(
		message: string,
		guild: Guild,
		member: GuildMember,
		data: ScheduleEntry.TaskData[Schedules.Birthday],
		t: TFunction
	): Promise<PartResult> {
		const channel = await fetchChannel(guild, 'birthdayChannel');
		if (!channel) return PartResult.NotSet;

		const content = this.parseMessage(message, member, data, t);

		const sent = await resolveToNull(
			channel.send({
				allowedMentions: { parse: ['roles', 'users'] },
				content
			})
		);

		if (sent) return PartResult.Success;
		return PartResult.Invalid;
	}

	private async handleRole(member: GuildMember, roleId: null | string): Promise<PartResult> {
		if (!roleId) return PartResult.NotSet;

		const role = member.guild.roles.cache.get(roleId);
		if (!role) return PartResult.Invalid;

		const me = this.container.client.user ? member.guild.members.cache.get(this.container.client.user.id) : null;

		if (me && me.roles.highest.position > role.position) {
			await this.addBirthdayRole(member, role.id);
		}

		return PartResult.Success;
	}

	private parseMessage(message: string, member: GuildMember, data: ScheduleEntry.TaskData[Schedules.Birthday], t: TFunction): string {
		const age = getAge(data);
		const messageKey = LanguageKeys.Tasks[`BirthdayMessage${age ? 'Age' : ''}`];

		return (message || t(messageKey)).replace(this.matchRegex, (match) => {
			switch (match) {
				case BirthdayMessageMatches.Age:
					return age ? `${age}` : t(LanguageKeys.Tasks.BirthdayYearOlder);
				case BirthdayMessageMatches.Guild:
					return member.guild.name;
				case BirthdayMessageMatches.Member:
					return member.toString();
				case BirthdayMessageMatches.Nick:
					return member.displayName;
				case BirthdayMessageMatches.Tag:
					return member.user.tag;
				case BirthdayMessageMatches.Username:
					return member.user.username;
				default:
					return '';
			}
		});
	}
}

const enum PartResult {
	NotSet,
	Invalid,
	Success
}
