import { GuildModerationManager, PersistRoleManager } from '#lib/structures';
import { container, fromAsync, isErr } from '@sapphire/framework';
import type { Guild, GuildAuditLogsAction, GuildAuditLogsEntry, GuildResolvable } from 'discord.js';

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

export async function fetchAuditEntry<T extends GuildAuditLogsAction>(
    guild: Guild,
    type: T,
    cb: (result: GuildAuditLogsEntry<T>) => boolean = () => true
): Promise<GuildAuditLogsEntry<T> | null> {
    const result = await fromAsync(guild.fetchAuditLogs({ type }));

    if (isErr(result)) return null;
    const entry = result.value.entries.filter(cb).first();
    if (!entry) return null;

    return entry;
}
