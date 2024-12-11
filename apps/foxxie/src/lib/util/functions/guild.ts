import type { Guild, GuildResolvable } from 'discord.js';

import { LoggerManager, ModerationManager } from '#lib/moderation';
import { StickyRoleManager } from '#lib/moderation/managers/StickyRoleManager';
import { StarboardManager } from '#lib/structures';
import { resolveGuild } from '#utils/common';
import { GuildSecurity } from '#utils/Security/GuildSecurity';

interface GuildUtilities {
	readonly logger: LoggerManager;
	readonly moderation: ModerationManager;
	readonly security: GuildSecurity;
	readonly starboard: StarboardManager;
	readonly stickyRoles: StickyRoleManager;
}

export const cache = new WeakMap<Guild, GuildUtilities>();

export function getGuildUtilities(resolvable: GuildResolvable): GuildUtilities {
	const guild = resolveGuild(resolvable);
	const previous = cache.get(guild);
	if (previous !== undefined) return previous;

	const entry: GuildUtilities = {
		logger: new LoggerManager(guild),
		moderation: new ModerationManager(guild),
		security: new GuildSecurity(guild),
		starboard: new StarboardManager(guild),
		stickyRoles: new StickyRoleManager(guild)
	};
	cache.set(guild, entry);

	return entry;
}

export const getLogger = getProperty('logger');
export const getModeration = getProperty('moderation');
export const getGuildStarboard = getProperty('starboard');
export const getSecurity = getProperty('security');
export const getStickyRoles = getProperty('stickyRoles');

function getProperty<K extends keyof GuildUtilities>(property: K) {
	return (resolvable: GuildResolvable): GuildUtilities[K] => getGuildUtilities(resolvable)[property];
}
