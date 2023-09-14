import { GuildSettings } from '#lib/database';
import { EventArgs, FoxxieEvents } from '#lib/Types';
import { isDev } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({
    event: FoxxieEvents.GuildMemberAdd,
    enabled: !isDev()
})
export class UserListener extends Listener<FoxxieEvents.GuildMemberAdd> {
    public async run(...[member]: EventArgs<FoxxieEvents.GuildMemberAdd>): Promise<void> {
        if (member.pending) return;

        const [muteRoleId, settings] = await this.container.db.guilds.acquire(member.guild.id, settings => [
            settings[GuildSettings.Roles.Muted],
            settings
        ]);
        if (muteRoleId) {
            const { persistRoles } = this.container.utilities.guild(member.guild);

            const memberRoles = await persistRoles.get(member.id);
            if (memberRoles.includes(muteRoleId)) return;
        }

        this.container.client.emit(FoxxieEvents.GuildMemberJoin, member, settings);
    }
}
