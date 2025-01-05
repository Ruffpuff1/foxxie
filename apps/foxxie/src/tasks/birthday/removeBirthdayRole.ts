import { resolveToNull } from '@ruffpuff/utilities';
import { PartialResponseValue, ResponseType, ScheduleEntry } from '#root/Core/structures/schedule/index';
import { Task } from '#root/Core/structures/Task';
import { seconds } from '#utils/common';
import { Schedules } from '#utils/constants';
import { ProductionOnlyPiece, RegisterTask } from '#utils/decorators';
import { PermissionFlagsBits } from 'discord.js';

@ProductionOnlyPiece()
@RegisterTask(Schedules.RemoveBirthdayRole)
export class UserTask extends Task {
	public async run(data: ScheduleEntry.TaskData[Schedules.RemoveBirthdayRole]): Promise<null | PartialResponseValue> {
		const guild = this.container.client.guilds.cache.get(data.guildId);
		if (!guild) return null;

		if (!guild.available) {
			return { type: ResponseType.Delay, value: seconds(20) };
		}

		const member = await resolveToNull(guild.members.fetch(data.userId));
		if (!member) return null;

		const role = guild.roles.cache.get(data.roleId);
		if (!role) return null;

		const me = this.container.client.user ? member.guild.members.cache.get(this.container.client.user.id) : null;
		if (me && me.permissions.has(PermissionFlagsBits.ManageRoles) && me.roles.highest.position > role.position) {
			try {
				await member.roles.remove(role).catch(() => null);
			} catch (error) {
				if ((error as Error).name === 'AbortError') {
					return { type: ResponseType.Delay, value: seconds(5) };
				}

				this.container.logger.fatal(error);
			}
		}

		return { type: ResponseType.Finished };
	}
}
