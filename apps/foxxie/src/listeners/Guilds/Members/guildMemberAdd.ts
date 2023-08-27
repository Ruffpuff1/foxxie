import { GuildSettings } from '#lib/database';
import { EventArgs, Events } from '#lib/types';
import { getPersistRoles } from '#utils/Discord';
import { isDev } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({
    event: Events.GuildMemberAdd,
    enabled: !isDev()
})
export class UserListener extends Listener<Events.GuildMemberAdd> {
    public async run(...[member]: EventArgs<Events.GuildMemberAdd>): Promise<void> {
        if (member.pending) return;

        const [muteRoleId, settings] = await this.container.db.guilds.acquire(member.guild.id, settings => [
            settings[GuildSettings.Roles.Muted],
            settings
        ]);
        if (muteRoleId) {
            const persistRoles = getPersistRoles(member.guild);

            const memberRoles = await persistRoles.get(member.id);
            if (memberRoles.includes(muteRoleId)) return;
        }

        this.container.client.emit(Events.GuildMemberJoin, member, settings);
    }
}
