import { getModeration, isOnServer, resolveToNull, TypeCodes } from '../../../lib/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { GuildBan, User } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    enabled: isOnServer()
})
export default class FoxxieListener extends Listener {

    public async run(ban: GuildBan): Promise<void> {
        const moderation = getModeration(ban.guild);
        if (moderation.cache.has(ban.user.id)) {
            moderation.cache.delete(ban.user.id);
            return;
        }

        const fetchedBan = await resolveToNull(
            ban.guild
                .fetchAuditLogs({ type: 'MEMBER_BAN_ADD' })
                .then(result => result.entries
                    .filter(entry => (entry.target as User).id === ban.user.id)
                    .first()
                ));

        if (!fetchedBan) return;

        await moderation.create(
            {
                userId: ban.user.id,
                moderatorId: fetchedBan.executor?.id || process.env.CLIENT_ID,
                reason: fetchedBan.reason,
                type: TypeCodes.Ban,
                duration: null
            }
        ).create();
    }

}