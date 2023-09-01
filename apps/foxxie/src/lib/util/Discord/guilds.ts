import { GuildModerationManager, PersistRoleManager } from '#lib/structures';
import { StarboardManager } from '#lib/structures/managers/StarboardManager';
import { Result, container } from '@sapphire/framework';
import type { Guild, GuildAuditLogsEntry, GuildAuditLogsResolvable, GuildResolvable } from 'discord.js';

interface GuildUtilities {
    readonly moderation: GuildModerationManager;
    readonly persistRoles: PersistRoleManager;
    readonly starboard: StarboardManager;
}

const cache = new WeakMap<Guild, GuildUtilities>();

function getGuildUtilities(resolvable: GuildResolvable): GuildUtilities {
    const guild = container.client.guilds.resolve(resolvable);
    const previous = cache.get(guild!);
    if (previous !== undefined) return previous;

    const entry: GuildUtilities = {
        moderation: new GuildModerationManager(guild!),
        persistRoles: new PersistRoleManager(guild!),
        starboard: new StarboardManager(guild!)
    };

    cache.set(guild!, entry);

    return entry;
}

export const getModeration = getProperty('moderation');
export const getPersistRoles = getProperty('persistRoles');
export const getStarboard = getProperty('starboard');

function getProperty<K extends keyof GuildUtilities>(property: K) {
    return (resolvable: GuildResolvable): GuildUtilities[K] => getGuildUtilities(resolvable)[property];
}

export async function fetchAuditEntry<T extends GuildAuditLogsResolvable>(
    guild: Guild,
    type: T,
    cb: (result: GuildAuditLogsEntry<T>) => boolean = () => true
): Promise<GuildAuditLogsEntry<T> | null> {
    const result = await Result.fromAsync(guild.fetchAuditLogs({ type }));

    if (result.isErr()) return null;
    const entry = result.unwrap().entries.filter(cb).first();
    if (!entry) return null;

    return entry;
}
