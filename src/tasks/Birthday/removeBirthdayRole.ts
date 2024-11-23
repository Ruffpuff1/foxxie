import { Task } from '#lib/Container/Stores/Tasks/Task';
import { PartialResponseValue, ResponseType } from '#lib/schedule/manager/ScheduleEntry';
import { ScheduleData } from '#lib/Types';
import { Schedules } from '#utils/constants';
import { resolveToNull, seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { PermissionFlagsBits } from 'discord-api-types/v9';

@ApplyOptions<Task.Options>({
    name: Schedules.RemoveBirthdayRole
})
export class UserTask extends Task {
    public async run(data: ScheduleData<Schedules.RemoveBirthdayRole>): Promise<PartialResponseValue | null> {
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
