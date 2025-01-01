import type { ScheduleData } from '#lib/types';
import { Schedules } from '#utils/constants';
import { floatPromise } from '#utils/util';
import { isDev, resolveToNull, seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { PermissionFlagsBits } from 'discord-api-types/v9';

@ApplyOptions<ScheduledTask.Options>({
    name: Schedules.RemoveBirthdayRole,
    enabled: !isDev()
})
export class UserTask extends ScheduledTask {
    public async run(data: ScheduleData<Schedules.RemoveBirthdayRole>): Promise<void | null> {
        const guild = this.container.client.guilds.cache.get(data.guildId);
        if (!guild) return null;

        if (!guild.available) {
            await this.container.tasks.create(Schedules.RemoveBirthdayRole, data, seconds(20));
            return;
        }

        const member = await resolveToNull(guild.members.fetch(data.userId));
        if (!member) return null;

        const role = guild.roles.cache.get(data.roleId);
        if (!role) return null;

        const { me } = guild;
        if (me?.permissions.has(PermissionFlagsBits.ManageRoles) && me?.roles.highest.position > role.position) {
            await floatPromise(member.roles.remove(role));
        }
    }
}
