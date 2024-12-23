import { EventArgs, Events } from '#lib/types';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchAuditEntry, getModeration } from '#utils/Discord';
import { setTimeout as sleep } from 'node:timers/promises';
import { isDev, seconds } from '@ruffpuff/utilities';
import { TypeCodes, TypeVariationAppealNames } from '#utils/moderation';

@ApplyOptions<ListenerOptions>({
    event: Events.GuildBanAdd,
    enabled: !isDev()
})
export class UserListener extends Listener<Events.GuildBanAdd> {
    public async run(...[ban]: EventArgs<Events.GuildBanAdd>): Promise<void> {
        const moderation = getModeration(ban.guild);
        const deleted = await this.container.redis!.del(`guild:${ban.guild.id}:ban:${ban.user.id}`);

        if (deleted) return;
        await sleep(seconds(5));

        const log = await fetchAuditEntry(ban.guild, 'MEMBER_BAN_ADD', log => log.target?.id === ban.user.id);
        if (!log) return;

        const created = await moderation
            .create({
                userId: ban.user.id,
                moderatorId: log.executor?.id || process.env.CLIENT_ID,
                reason: log.reason,
                type: TypeCodes.Ban,
                duration: null
            })
            .create();

        if (created) await moderation.actions.cancelTask(ban.user.id, TypeVariationAppealNames.Ban);
    }
}
