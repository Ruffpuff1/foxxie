import { Listener, ListenerOptions } from '@sapphire/framework';
import { events, isOnServer, minutes, sendTemporaryMessage } from '../../../lib/util';
import { ApplyOptions } from '@sapphire/decorators';
import type { GuildMessage } from '../../../lib/types/Discord';
import { aquireSettings, GuildEntity, guildSettings, LevelingRole } from '../../../lib/database';
import { isBooster, random, randomArray } from '@ruffpuff/utilities';
import { Permissions, Role } from 'discord.js';
import type { TFunction } from '@sapphire/plugin-i18next';
import { languageKeys } from '../../../lib/i18n';

@ApplyOptions<ListenerOptions>({
    event: events.USER_MESSAGE,
    enabled: isOnServer()
})
export default class extends Listener {

    public cache = new Set<string>();

    public async run(msg: GuildMessage): Promise<void> {
        if (msg.editedAt) return;

        const [enabled, messagesEnabled, t] = await aquireSettings(msg.guild, (settings: GuildEntity) => {
            return [
                settings[guildSettings.leveling.enabled],
                settings[guildSettings.leveling.messagesEnabled],
                settings.getLanguage()
            ];
        });

        if (!enabled) return;

        const key = `${msg.guild.id}.${msg.author.id}`;
        if (this.cache.has(key)) return;
        this.cache.add(key);
        setTimeout(() => this.cache.delete(key), minutes(1));

        const member = await this.container.db.members.ensure(msg.member.id, msg.guild.id);
        const oldPoints = member.points;

        const filler = this.getLevel(oldPoints) < 15 ? 8 : 4;

        const pointsToAdd: number = random(3, filler) + (isBooster(msg.member) ? 0.5 : 0);
        const newPoints = oldPoints + pointsToAdd;

        member.points = newPoints;
        member.save();

        await this.checkLevel(msg, oldPoints, newPoints, messagesEnabled, t);
    }

    private async checkLevel(msg: GuildMessage, oldPoints: number, newPoints: number, messagesEnabled: boolean, t: TFunction) {
        if (!messagesEnabled) return;

        const previousLevel = this.getLevel(oldPoints);
        const nextLevel = this.getLevel(newPoints);

        if (previousLevel === nextLevel) return;

        const addedRole = await this.checkRole(msg, newPoints, nextLevel);

        if (!addedRole) await sendTemporaryMessage(msg, this.getLevelMessage(msg, nextLevel, t), minutes(3));
    }

    private async checkRole(msg: GuildMessage, newPoints: number, next: number): Promise<boolean> {
        if (!msg.guild.me?.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return false;

        const settings = await aquireSettings(msg.guild, (settings: GuildEntity) => {
            const role = this.getRole(settings, newPoints);
            if (role === null) return null;

            const messages = settings[guildSettings.leveling.messagesEnabled];
            const t = settings.getLanguage();

            return { messages, role, t };
        });
        if (settings === null) return false;

        const role = msg.guild.roles.cache.has(settings.role.id) ? msg.guild.roles.cache.get(settings.role.id) : null;
        if (!role) return false;

        if (role.position >= msg.guild.me?.roles.highest.position) return false;
        if (msg.member.roles.cache.has(role.id)) return false;
        await msg.member.roles.add(role.id);

        await sendTemporaryMessage(msg, { content: this.getRoleLevelMessage(msg, next, role, settings.t), allowedMentions: { roles: [], users: [msg.author.id] } }, minutes(3));

        return true;
    }

    private getRole(settings: GuildEntity, points: number): LevelingRole | null {
        let latest: LevelingRole | null = null;
        for (const role of settings[guildSettings.leveling.roles]) {
            if (role.points > points) break;
            latest = role;
        }

        return latest;
    }

    private getRoleLevelMessage(msg: GuildMessage, level: number, role: Role, t: TFunction): string {
        const arr = t(languageKeys.listeners.pointsRoleMessages) as unknown as string[];
        const picked = randomArray(t(languageKeys.listeners.pointsRoleMessages));
        let number = arr.indexOf(picked);

        if (number === -1) number = 0;

        return t(`${languageKeys.listeners.pointsRoleMessages}.${number}`, { ...this.getVars(msg), level, role: role.toString() });
    }

    private getLevelMessage(msg: GuildMessage, level: number, t: TFunction): string {
        const arr = t(languageKeys.listeners.pointsMessages) as unknown as string[];
        const picked = randomArray(t(languageKeys.listeners.pointsMessages));
        let number = arr.indexOf(picked);

        if (number === -1) number = 0;

        return t(`${languageKeys.listeners.pointsMessages}.${number}`, { ...this.getVars(msg), level });
    }

    private getVars(msg: GuildMessage): Record<string, string> {
        return {
            nick: msg.member.displayName,
            guild: msg.guild.name,
            user: msg.author.username,
            mention: msg.author.toString()
        };
    }

    private getLevel(points: number): number {
        return Math.floor(0.2 * Math.sqrt(points));
    }

}