import { EventArgs, FoxxieEvents } from '#lib/Types';
import { TypeCodes, TypeVariationAppealNames } from '#utils/moderation';
import { cast, isDev, seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { AuditLogEvent, User } from 'discord.js';
import { setTimeout as sleep } from 'node:timers/promises';

@ApplyOptions<ListenerOptions>({
    event: FoxxieEvents.GuildBanRemove,
    enabled: !isDev()
})
export class UserListener extends Listener<FoxxieEvents.GuildBanRemove> {
    public async run(...[ban]: EventArgs<FoxxieEvents.GuildBanRemove>): Promise<void> {
        const guild = this.container.utilities.guild(ban.guild);

        const deleted = this.container.redis
            ? await this.container.redis!.del(`guild:${ban.guild.id}:unban:${ban.user.id}`)
            : null;

        if (deleted) return;
        await sleep(seconds(5));

        const log = await guild.fetchAuditEntry(AuditLogEvent.MemberBanRemove, log => cast<User>(log.target)?.id === ban.user.id);
        if (!log) return;

        const created = await guild.moderation
            .create({
                userId: ban.user.id,
                moderatorId: log.executor?.id || process.env.CLIENT_ID,
                reason: null,
                type: TypeCodes.UnBan,
                duration: null
            })
            .create();

        if (created) await guild.moderation.actions.cancelTask(ban.user.id, TypeVariationAppealNames.Ban);
    }
}
