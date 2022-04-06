import { GuildModerationManager, PersistRoleManager } from '#lib/structures';
import { cast, resolveToNull } from '@ruffpuff/utilities';
import { container, fromAsync, isErr } from '@sapphire/framework';
import type { PickByValue } from '@sapphire/utilities';
import type { Guild, GuildAuditLogsAction, GuildAuditLogsEntry, GuildResolvable, GuildTextBasedChannel } from 'discord.js';
import type { GuildModel } from '#lib/prisma';

interface GuildUtilities {
    readonly moderation: GuildModerationManager;
    readonly persistRoles: PersistRoleManager;
}

const cache = new WeakMap<Guild, GuildUtilities>();

export function getGuildUtilities(resolvable: GuildResolvable): GuildUtilities {
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

export function getAudio(resolvable: GuildResolvable) {
    return container.client.audio!.queues.get(container.client.guilds.resolveId(resolvable)!);
}

function getProperty<K extends keyof GuildUtilities>(property: K) {
    return (resolvable: GuildResolvable): GuildUtilities[K] => getGuildUtilities(resolvable)[property];
}

export async function fetchChannel<T = GuildTextBasedChannel>(resolvable: GuildResolvable, key: PickByValue<GuildModel, string | null>) {
    const guild = container.client.guilds.resolve(resolvable)!;

    const channelId = await container.prisma.guilds(guild.id, key);
    if (!channelId) return null;

    const channel = await resolveToNull(guild.channels.fetch(channelId));
    if (!channel) {

        await container.prisma.guilds(guild.id, { [key]: null });
        return null;
    }

    return cast<T>(channel);
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
