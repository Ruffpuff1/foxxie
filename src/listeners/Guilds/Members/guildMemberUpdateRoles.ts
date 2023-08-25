import { GuildSettings, acquireSettings } from '#lib/database';
import { GuildModerationManager } from '#lib/structures';
import { EventArgs, Events } from '#lib/types';
import { fetchAuditEntry, getModeration } from '#utils/Discord';
import { TypeCodes, TypeVariationAppealNames } from '#utils/moderation';
import { seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GuildMember } from 'discord.js';
import { setTimeout as sleep } from 'node:timers/promises';

@ApplyOptions<ListenerOptions>({ event: Events.GuildMemberUpdate })
export class UserListener extends Listener {
    public async run(...[previous, next]: EventArgs<Events.GuildMemberUpdate>) {
        const prevRoles = previous.roles.cache;
        const nextRoles = next.roles.cache;
        const moderation = getModeration(next.guild);

        if (prevRoles.equals(nextRoles)) return;

        const [muteAdd, muteRemove, muteRole] = await acquireSettings(next.guild.id, [
            'eventsMuteAdd',
            'eventsMuteRemove',
            GuildSettings.Roles.Muted
        ]);
        if ((!muteAdd && !muteRemove) || !muteRole) return;

        const added: string[] = [];
        const removed: string[] = [];

        for (const [key, role] of nextRoles.entries()) {
            if (!prevRoles.has(key)) added.push(role.id);
        }

        for (const [key, role] of prevRoles.entries()) {
            if (!nextRoles.has(key)) removed.push(role.id);
        }

        if (added.includes(muteRole) && muteAdd) this.mute(next, moderation);
        else if (removed.includes(muteRole) && muteRemove) this.unmute(next, moderation);
    }

    private async mute(next: GuildMember, moderation: GuildModerationManager) {
        const { user } = next;
        const deleted = this.container.redis ? await this.container.redis!.del(`guild:${next.guild.id}:mute:${user.id}`) : null;

        if (deleted) return;
        await sleep(seconds(5));

        const log = await fetchAuditEntry(next.guild, 'MEMBER_ROLE_UPDATE', log => log.target?.id === next.user.id);
        if (!log) return;

        const created = await moderation
            .create({
                userId: user.id,
                moderatorId: log.executor?.id || process.env.CLIENT_ID,
                reason: log.reason,
                type: TypeCodes.Mute,
                duration: null
            })
            .create();

        if (created) await moderation.actions.cancelTask(user.id, TypeVariationAppealNames.Mute);
    }

    private async unmute(next: GuildMember, moderation: GuildModerationManager) {
        const { user } = next;
        const deleted = this.container.redis ? await this.container.redis!.del(`guild:${next.guild.id}:unmute:${user.id}`) : null;

        if (deleted) return;
        await sleep(seconds(5));

        const log = await fetchAuditEntry(next.guild, 'MEMBER_ROLE_UPDATE', log => log.target?.id === next.user.id);
        if (!log) return;

        const created = await moderation
            .create({
                userId: user.id,
                moderatorId: log.executor?.id || process.env.CLIENT_ID,
                reason: log.reason,
                type: TypeCodes.UnMute,
                duration: null
            })
            .create();

        if (created) await moderation.actions.cancelTask(user.id, TypeVariationAppealNames.Mute);
    }
}
