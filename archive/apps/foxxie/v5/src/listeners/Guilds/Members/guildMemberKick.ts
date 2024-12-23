import { Events, EventArgs } from '#lib/types';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchAuditEntry, getModeration } from '#utils/Discord';
import { isDev, seconds } from '@ruffpuff/utilities';
import { setTimeout as sleep } from 'node:timers/promises';
import { idToTimestamp } from '#utils/util';
import { TypeCodes } from '#utils/moderation';

@ApplyOptions<ListenerOptions>({
    enabled: !isDev(),
    event: Events.GuildMemberRemove
})
export class UserListener extends Listener<Events.GuildMemberRemove> {
    public async run(...[member]: EventArgs<Events.GuildMemberRemove>): Promise<void> {
        const moderation = getModeration(member.guild);
        const deleted = await this.container.redis!.del(`guild:${member.guild.id}:kick:${member.id}`);

        if (deleted) return;
        await sleep(seconds(1.5));

        const log = await fetchAuditEntry(member.guild, 'MEMBER_KICK', log => log.target?.id === member.id);
        if (!log) return;

        if (Date.now() - idToTimestamp(log.id)! > seconds(15)) return;

        await moderation
            .create({
                userId: member.id,
                moderatorId: log.executor?.id || process.env.CLIENT_ID,
                reason: log.reason,
                type: TypeCodes.Kick,
                duration: null
            })
            .create();
    }
}
