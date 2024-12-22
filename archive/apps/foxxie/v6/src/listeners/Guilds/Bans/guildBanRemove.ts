import { EventArgs, Events } from '#lib/types';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { isDev, seconds } from '@ruffpuff/utilities';
import { fetchAuditEntry, getModeration } from '#utils/Discord';
import { setTimeout as sleep } from 'node:timers/promises';
import { TypeCodes, TypeVariationAppealNames } from '#utils/moderation';

@ApplyOptions<ListenerOptions>({
    event: Events.GuildBanRemove,
    enabled: !isDev()
})
export class UserListener extends Listener<Events.GuildBanRemove> {
    public async run(...[ban]: EventArgs<Events.GuildBanRemove>): Promise<void> {
        const moderation = getModeration(ban.guild);
        const deleted = this.container.redis ? await this.container.redis!.del(`guild:${ban.guild.id}:unban:${ban.user.id}`) : null;

        if (deleted) return;
        await sleep(seconds(5));

        const log = await fetchAuditEntry(ban.guild, 'MEMBER_BAN_REMOVE', log => log.target?.id === ban.user.id);
        if (!log) return;

        const created = await moderation
            .create({
                userId: ban.user.id,
                moderatorId: log.executor?.id || process.env.CLIENT_ID,
                reason: null,
                type: TypeCodes.UnBan,
                duration: null
            })
            .create();

        if (created) await moderation.actions.cancelTask(ban.user.id, TypeVariationAppealNames.Ban);
    }
}
