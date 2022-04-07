import { Task, ResponseType, PartialResponseValue } from '../lib/database';
import { resolveToNull, floatPromise, isOnServer } from '../lib/util';
import { Permissions } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Task.Options>({
    enabled: isOnServer()
})
export class FoxxieTask extends Task {

    async run(data: RemoveBirthdayRoleData): Promise<PartialResponseValue | null> {
        const guild = this.container.client.guilds.cache.get(data.guildId);
        if (!guild) return null;

        if (!guild.available) return { type: ResponseType.Delay, value: 20000 };

        const member = await resolveToNull(guild.members.fetch(data.userId));
        if (!member) return null;

        const role = guild.roles.cache.get(data.roleId);
        if (!role) return null;

        const { me } = guild;
        if (me?.permissions.has(Permissions.FLAGS.MANAGE_ROLES) && me?.roles.highest.position > role.position) {
            await floatPromise(member.roles.remove(role));
        }

        return { type: ResponseType.Finished };
    }

}

interface RemoveBirthdayRoleData {
    guildId: string;
    userId: string;
    roleId: string;
}