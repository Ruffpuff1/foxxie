import { acquireSettings, GuildSettings } from '#lib/database';
import { EventArgs, Events } from '#lib/types';
import { getPersistRoles } from '#utils/Discord';
import { Listener } from '@sapphire/framework';

export class UserListener extends Listener<Events.GuildMemberAdd> {
    public async run(...[member]: EventArgs<Events.GuildMemberAdd>): Promise<void> {
        if (member.pending) return;

        const [roleId, settings] = await acquireSettings(member.guild, settings => [settings[GuildSettings.Roles.Muted], settings]);
        if (roleId) {
            const persistRoles = getPersistRoles(member.guild);

            const memberRoles = await persistRoles.get(member.id);
            if (memberRoles.includes(roleId)) return;
        }

        this.container.client.emit(Events.GuildMemberJoin, member, settings);
    }
}
