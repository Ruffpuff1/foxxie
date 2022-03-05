import { isNullish } from '@sapphire/utilities';
import type { Guild } from 'discord.js';
import { acquireSettings, GuildSettings, PersistRole, writeSettings } from '#lib/database';

export class PersistRoleManager {
    #guild: Guild;

    public constructor(guild: Guild) {
        this.#guild = guild;
    }

    public async get(userId: string) {
        const entries = await acquireSettings(this.#guild, GuildSettings.PersistRoles);
        return entries.find(entry => entry.userId === userId)?.roles ?? [];
    }

    public async has(userId: string, roleId: string) {
        const roles = await this.get(userId);
        return roles.includes(roleId);
    }

    public async fetch(userId: string): Promise<string[]> {
        const entries = await acquireSettings(this.#guild, GuildSettings.PersistRoles);
        const entry = entries.find(entry => entry.userId === userId);
        if (isNullish(entry)) return [];

        const roles = [...this.cleanRoles(entry.roles)];

        if (entry.roles.length === roles.length) return entry.roles;

        if (!roles.length) {
            await this.clear(userId);
            return roles;
        }

        return writeSettings(this.#guild, settings => {
            const index = settings[GuildSettings.PersistRoles].findIndex(roles => roles.userId === userId);
            if (index === -1) return [];

            const clone: PersistRole = { userId, roles };
            settings[GuildSettings.PersistRoles][index] = clone;

            return clone.roles;
        });
    }

    public remove(userId: string, roleId: string): Promise<string[]> {
        return writeSettings(this.#guild, settings => {
            const entries = settings.persistRoles;

            const index = entries.findIndex(r => r.userId === userId);

            if (index === -1) return [];

            const entry = entries[index];
            const roles = [...this.removeRole(roleId, entry.roles)];

            if (roles.length === 0) {
                entries.splice(index, 1);
            } else {
                entries[index] = { userId: entry.userId, roles };
            }

            return entry.roles;
        });
    }

    public clear(userId: string): Promise<string[]> {
        return writeSettings(this.#guild, settings => {
            const entries = settings[GuildSettings.PersistRoles];

            const index = entries.findIndex(r => r.userId === userId);

            if (index === -1) return [];

            const entry = entries[index];

            entries.splice(index, 1);

            return entry.roles;
        });
    }

    public add(userId: string, roleId: string): Promise<string[]> {
        return writeSettings(this.#guild, settings => {
            const entries = settings[GuildSettings.PersistRoles];

            const index = entries.findIndex(entry => entry.userId === userId);

            if (index === -1) {
                const entry: PersistRole = { userId, roles: [roleId] };
                entries.push(entry);
                return entry.roles;
            }

            const entry = entries[index];
            const roles = [...this.addRole(roleId, entry.roles)];

            entries[index] = { userId, roles };
            return entry.roles;
        });
    }

    private *addRole(roleId: string, ids: string[]) {
        const roles = new Set<string>();
        for (const role of this.cleanRoles(ids)) {
            if (roles.has(role)) continue;

            roles.add(role);
            yield role;
        }
        if (!roles.has(roleId)) yield roleId;
    }

    private *removeRole(roleId: string, roleIds: readonly string[]) {
        const emitted = new Set<string>();
        for (const role of this.cleanRoles(roleIds)) {
            if (role === roleId) continue;
            if (emitted.has(role)) continue;

            emitted.add(role);
            yield role;
        }
    }

    private *cleanRoles(ids: readonly string[]) {
        const { roles } = this.#guild;
        for (const id of ids) {
            if (roles.cache.has(id)) yield id;
        }
    }
}
