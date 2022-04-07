import type { Collection, Guild, GuildResolvable, Invite, Role } from 'discord.js';
import { GuildModerationManager } from '../../moderation';
import { container } from '@sapphire/framework';
import { aquireSettings, GuildEntity, guildSettings, writeSettings } from '../../database';
import { StarboardManager, PersistRoleManager } from '../../structures/managers';
import { languageKeys } from 'lib/i18n';
import { toTitleCase } from '@ruffpuff/utilities';
import { resolveToNull } from '../common';

const guildInvites = new WeakMap<Guild, Collection<string, Invite>>();

interface GuildUtilities {
	readonly moderation: GuildModerationManager;
    readonly persistRoles: PersistRoleManager;
    readonly starboard: StarboardManager;
}

const cache = new WeakMap<Guild, GuildUtilities>();

export function getGuildUtilities(resolvable: GuildResolvable): GuildUtilities {
    const guild = container.client.guilds.resolve(resolvable);
    const previous = cache.get(guild as Guild);
    if (previous !== undefined) return previous;

    const entry: GuildUtilities = {
        moderation: new GuildModerationManager(guild as Guild),
        persistRoles: new PersistRoleManager(guild as Guild),
        starboard: new StarboardManager(guild as Guild)
    };
    cache.set(guild as Guild, entry);

    return entry;
}

export const getStarboard = getProperty('starboard');
export const getModeration = getProperty('moderation');
export const getPersistRoles = getProperty('persistRoles');

function getProperty<K extends keyof GuildUtilities>(property: K) {
    return (resolvable: GuildResolvable): GuildUtilities[K] => getGuildUtilities(resolvable)[property];
}

export async function getMuteRole(guild: Guild): Promise<Role | undefined> {
    const id: string = await aquireSettings(guild, guildSettings.roles.muted);
    if (!id) return undefined;

    const role = guild.roles.cache.get(id);
    if (!role) await writeSettings(guild, (settings: GuildEntity) => settings[guildSettings.roles.muted] = null);
    return role;
}

export function isTCS(guild: Guild): boolean {
    return guild.id === process.env.THE_CORNER_STORE_ID;
}

export function getInviteCache(guild: Guild): Collection<string, Invite> | undefined {
    return guildInvites.get(guild);
}

export async function setInviteCache(guild: Guild) {
    const invites = await resolveToNull(guild.invites.fetch());
    if (invites) guildInvites.set(guild, invites);
    return invites;
}

export async function checkInviteCache(guild, t) {
    const existingCache = getInviteCache(guild);
    const invites = await setInviteCache(guild);

    const invite = invites.find(i => existingCache?.get(i.code)?.uses < i.uses);
    return invite ? invite.code : invites?.first()?.code ?? toTitleCase(t(languageKeys.globals.none));
}