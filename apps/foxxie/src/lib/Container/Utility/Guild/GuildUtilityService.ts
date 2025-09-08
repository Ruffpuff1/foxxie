import { container } from '@sapphire/framework';
import { envParseString } from '@skyra/env-utilities';
import { EnvKeys } from '#lib/types';
import { Guild, GuildResolvable } from 'discord.js';

/**
 * Utility service for a Discord guild.
 */
export class GuildUtilityService {
	private guild: Guild;

	/**
	 * Constructs a new utility service for the given guild.
	 * @param resolvable A guild resolvable to link this server to.
	 */
	public constructor(resolvable: GuildResolvable) {
		const guild = container.client.guilds.resolve(resolvable);
		this.guild = guild!;
	}

	/**
	 * Accesses the client's guild member in the server if currently cached. If not, returns `null`.
	 */
	public get maybeMe() {
		return this.guild.members.cache.get(envParseString(EnvKeys.ClientId)) ?? null;
	}
}
