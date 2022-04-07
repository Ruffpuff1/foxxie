import { events, getModeration, isOnServer, resolveToNull, TypeCodes } from '../../../lib/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { GuildAuditLogsEntry, GuildMember, User } from 'discord.js';
import type { GuildModerationManager } from '../../../lib/moderation';

@ApplyOptions<ListenerOptions>({
    enabled: isOnServer(),
    event: events.GUILD_MEMBER_REMOVE_LOG_KICK
})
export default class FoxxieListener extends Listener {

    public async run(member: GuildMember): Promise<void> {
        // return if self
        if (member.id === process.env.CLIENT_ID) return;
        const { guild, user } = member;

        const moderation = getModeration(guild);
        if (moderation.cache.has(member.id)) {
            moderation.cache.delete(member.id);
            return;
        }

        const kick = await this.checkKick(member);
        if (!kick) return;

        await this.createKickLog(user, kick, moderation);
    }

    async createKickLog(user: User, kick: GuildAuditLogsEntry, moderation: GuildModerationManager): Promise<unknown> {
        return moderation.create(
            {
                userId: user.id,
                moderatorId: kick.executor?.id || process.env.CLIENT_ID,
                reason: kick.reason,
                type: TypeCodes.Kick,
                duration: null
            }
        ).create();
    }

    async checkKick(member: GuildMember): Promise<GuildAuditLogsEntry | null | undefined> {
        return resolveToNull(
            member.guild
                .fetchAuditLogs({ type: 'MEMBER_KICK' })
                .then(results => results.entries
                    .filter(entry => (entry.target as User).id === member.id)
                    .sort((a, b) => parseInt((BigInt(a.id) - BigInt(b.id)).toString()))
                    .last()
                ));
    }

}