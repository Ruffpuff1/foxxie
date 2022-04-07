import { isNullish } from '@sapphire/utilities';
import type { Guild } from 'discord.js';
import { aquireSettings, guildSettings, PersistRole, writeSettings } from 'lib/database';

export class PersistRoleManager {

    #guild: Guild;

    public constructor(guild: Guild) {
        this.#guild = guild;
    }

    public async get(userId: string) {
        const entries = <PersistRole[]>await aquireSettings(this.#guild, guildSettings.persistRoles);
        return entries.find(entry => entry.userId === userId)?.roles ?? [];
    }

    public async has(userId: string, roleId: string) {
        const roles = await this.get(userId);
        return roles.includes(roleId);
    }

    public async fetch(userId: string): Promise<string[]> {
        const entries = <PersistRole[]>await aquireSettings(this.#guild, guildSettings.persistRoles);
        const entry = entries.find(entry => entry.userId === userId);
        if (isNullish(entry)) return [];

        const roles = [...this.cleanRoles(entry.roles)];

        if (entry.roles.length === roles.length) return entry.roles;

        if (!roles.length) {
            await this.clear(userId);
            return roles;
        }

        return writeSettings(this.#guild, settings => {
            const index = settings[guildSettings.persistRoles].findIndex(roles => roles.userId === userId);
            if (index === -1) return [];

            const clone: PersistRole = { userId, roles };
            settings[guildSettings.persistRoles][index] = clone;

            return clone.roles;
        });
    }

    public clear(userId: string): Promise<string[]> {
        return writeSettings(this.#guild, settings => {
            const entries = settings[guildSettings.persistRoles];

            const index = entries.findIndex(r => r.userId === userId);

            if (index === -1) return [];

            const entry = entries[index];

            entries.splice(index, 1);

            return entry.roles;
        });
    }

    public add(userId: string, roleId: string): Promise<string[]> {
        return writeSettings(this.#guild, settings => {
            const entries = settings[guildSettings.persistRoles];

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

    private *cleanRoles(ids: string[]) {
        const { roles } = this.#guild;
        for (const id of ids) {
            if (roles.cache.has(id)) yield id;
        }
    }

}