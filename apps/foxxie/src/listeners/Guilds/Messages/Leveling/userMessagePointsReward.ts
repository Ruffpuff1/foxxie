import { acquireSettings, GuildEntity, GuildSettings, LevelingRole } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { EventArgs, Events, GuildMessage, LevelingRoleKey } from '#lib/types';
import { sendTemporaryMessage } from '#utils/Discord';
import { floatPromise } from '#utils/util';
import { isDev, minutes, randomArray, seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { TFunction } from '@sapphire/plugin-i18next';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import type { Guild, GuildMember, Role } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: Events.PointsReward,
    enabled: !isDev()
})
export class UserListener extends Listener<Events.PointsReward> {
    public async run(...[msg, level]: EventArgs<Events.PointsReward>): Promise<void> {
        await this.runRole(msg, level);
        await this.runLevel(msg, level);
    }

    private async runRole(msg: GuildMessage, level: number) {
        // If client cannot give roles, return immediately.
        if (!msg.guild.me!.permissions.has(PermissionFlagsBits.ManageRoles)) return;

        const settings = await this.fetchRoleSettings(msg.guild, level);
        if (settings === null) return;

        const role = this.pickRole(msg, settings.role.latest!);
        if (role === null) return;

        if (role.position >= msg.guild.me!.roles.highest.position) return;
        if (msg.member.roles.cache.has(role.id)) return;

        await floatPromise(msg.member.roles.add(role));

        // add any of the extra roles
        for (const lvlRole of settings.role.extra) {
            // filter out the already given roles.
            if (lvlRole.id === role.id) continue;

            // get the role for this levelrole.
            const _role = msg.guild.roles.cache.get(lvlRole.id);
            if (!_role) continue;

            // if role is above client, return.
            if (_role.position >= msg.guild.me!.roles.highest.position) continue;

            if (msg.member.roles.cache.has(_role.id)) continue;

            await floatPromise(msg.member.roles.add(_role));
        }

        if (!settings.announce) return;

        const content = this.getRoleContent(settings.t, msg.member, level, role);
        await sendTemporaryMessage(msg, content, minutes(3));

        const key = this.getKey(msg);
        if (this.container.redis) await this.container.redis.pinsertex(key, seconds(30), '1');
    }

    private async runLevel(msg: GuildMessage, level: number): Promise<void> {
        const settings = await this.getLevelSettings(msg.guild);
        if (!settings.announce) return;

        const isSent = this.container.redis ? await this.container.redis.get(this.getKey(msg)) === '1' : false;

        if (!isSent) {
            const content = this.getLevelContent(settings.t, msg.member, level);
            await sendTemporaryMessage(msg, content, minutes(3));
        }
    }

    private getLevelContent(t: TFunction, member: GuildMember, level: number): string {
        const arr = t(LanguageKeys.Listeners.Events.PointsMessages, {
            level,
            nick: member.displayName,
            guild: member.guild.name,
            user: member.user.username,
            mention: member.toString()
        });

        return randomArray(arr);
    }

    private async getLevelSettings(guild: Guild) {
        return acquireSettings(guild, settings => {
            const isEnabled = settings[GuildSettings.Leveling.MessagesEnabled];
            if (!isEnabled) return { announce: false } as const;

            return {
                announce: true,
                t: settings.getLanguage()
            } as const;
        });
    }

    private getRoleContent(t: TFunction, member: GuildMember, level: number, role: Role): string {
        const arr = t(LanguageKeys.Listeners.Events.PointsRoleMessages, {
            level,
            role: role.toString(),
            nick: member.displayName,
            guild: member.guild.name,
            user: member.user.username,
            mention: member.toString()
        });
        return randomArray(arr);
    }

    private getKey(msg: GuildMessage): LevelingRoleKey {
        return `leveling:${msg.guild.id}:${msg.member.id}:role`;
    }

    private async fetchRoleSettings(guild: Guild, level: number) {
        return acquireSettings(guild, settings => {
            const role = this.getRole(settings, level);
            if (role.latest === null) return null;

            const shouldSend = settings[GuildSettings.Leveling.MessagesEnabled];
            if (!shouldSend) return { announce: false, role } as const;

            return {
                announce: true,
                role,
                t: settings.getLanguage()
            };
        });
    }

    private getRole(settings: GuildEntity, level: number) {
        let latest: LevelingRole | null = null;
        const extra: LevelingRole[] = [];

        for (const role of settings[GuildSettings.Leveling.Roles]) {
            if (role.level > level) break;
            extra.push(role);
            latest = role;
        }

        return { latest, extra };
    }

    private pickRole(msg: GuildMessage, lvlrole: LevelingRole) {
        const { cache } = msg.guild.roles;
        const role = cache.get(lvlrole.id);
        if (role !== undefined) return role;

        return null;
    }
}
