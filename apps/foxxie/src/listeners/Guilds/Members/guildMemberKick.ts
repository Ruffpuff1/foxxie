import { EventArgs, FoxxieEvents } from '#lib/types';
import { fetchAuditEntry, getModeration } from '#utils/Discord';
import { TypeCodes } from '#utils/moderation';
import { idToTimestamp } from '#utils/util';
import { cast, isDev, seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { AuditLogEvent, User } from 'discord.js';
import { setTimeout as sleep } from 'node:timers/promises';

@ApplyOptions<ListenerOptions>({
    enabled: !isDev(),
    event: FoxxieEvents.GuildMemberRemove
})
export class UserListener extends Listener<FoxxieEvents.GuildMemberRemove> {
    public async run(...[member]: EventArgs<FoxxieEvents.GuildMemberRemove>): Promise<void> {
        const moderation = getModeration(member.guild);
        const deleted = await this.container.redis!.del(`guild:${member.guild.id}:kick:${member.id}`);

        if (deleted) return;
        await sleep(seconds(1.5));

        const log = await fetchAuditEntry(member.guild, AuditLogEvent.MemberKick, log => cast<User>(log.target)?.id === member.id);
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
