import { GuildUtilityService } from '#lib/Container/Utility/Services/Guild/GuildUtilityService';
import { GuildSettings, acquireSettings } from '#lib/Database';
import { EventArgs, FoxxieEvents } from '#lib/Types';
import { TypeCodes, TypeVariationAppealNames } from '#utils/moderation';
import { cast, seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { AuditLogEvent, GuildMember, User } from 'discord.js';
import { setTimeout as sleep } from 'node:timers/promises';

@ApplyOptions<ListenerOptions>({ event: FoxxieEvents.GuildMemberUpdate })
export class UserListener extends Listener {
    public async run(...[previous, next]: EventArgs<FoxxieEvents.GuildMemberUpdate>) {
        const prevRoles = previous.roles.cache;
        const nextRoles = next.roles.cache;
        const guild = this.container.utilities.guild(next.guild);

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

        if (added.includes(muteRole) && muteAdd) return this.mute(next, guild);
        else if (removed.includes(muteRole) && muteRemove) return this.unmute(next, guild);
    }

    private async mute(next: GuildMember, guild: GuildUtilityService) {
        const { user } = next;
        const deleted = this.container.redis ? await this.container.redis!.del(`guild:${next.guild.id}:mute:${user.id}`) : null;

        if (deleted) return;
        await sleep(seconds(5));

        const log = await guild.fetchAuditEntry(
            AuditLogEvent.MemberRoleUpdate,
            log => cast<User>(log.target)?.id === next.user.id
        );
        if (!log) return;

        const created = await guild.moderation
            .create({
                userId: user.id,
                moderatorId: log.executor?.id || process.env.CLIENT_ID,
                reason: log.reason,
                type: TypeCodes.Mute,
                duration: null
            })
            .create();

        if (created) await guild.moderation.actions.cancelTask(user.id, TypeVariationAppealNames.Mute);
    }

    private async unmute(next: GuildMember, guild: GuildUtilityService) {
        const { user } = next;
        const deleted = this.container.redis ? await this.container.redis!.del(`guild:${next.guild.id}:unmute:${user.id}`) : null;

        if (deleted) return;
        await sleep(seconds(5));

        const log = await guild.fetchAuditEntry(
            AuditLogEvent.MemberRoleUpdate,
            log => cast<User>(log.target)?.id === next.user.id
        );
        if (!log) return;

        const created = await guild.moderation
            .create({
                userId: user.id,
                moderatorId: log.executor?.id || process.env.CLIENT_ID,
                reason: log.reason,
                type: TypeCodes.UnMute,
                duration: null
            })
            .create();

        if (created) await guild.moderation.actions.cancelTask(user.id, TypeVariationAppealNames.Mute);
    }
}
