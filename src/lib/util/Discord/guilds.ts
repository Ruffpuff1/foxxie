import { GuildModerationManager, PersistRoleManager } from '#lib/structures';
import { container } from '@sapphire/framework';
import type { Guild, GuildResolvable } from 'discord.js';

interface GuildUtilities {
    readonly moderation: GuildModerationManager;
    readonly persistRoles: PersistRoleManager;
}

const cache = new WeakMap<Guild, GuildUtilities>();

function getGuildUtilities(resolvable: GuildResolvable): GuildUtilities {
    const guild = container.client.guilds.resolve(resolvable);
    const previous = cache.get(guild!);
    if (previous !== undefined) return previous;

    const entry: GuildUtilities = {
        moderation: new GuildModerationManager(guild!),
        persistRoles: new PersistRoleManager(guild!)
    };

    cache.set(guild!, entry);

    return entry;
}

export const getModeration = getProperty('moderation');
export const getPersistRoles = getProperty('persistRoles');

function getProperty<K extends keyof GuildUtilities>(property: K) {
    return (resolvable: GuildResolvable): GuildUtilities[K] => getGuildUtilities(resolvable)[property];
}
