import { EnvKeys } from '#lib/types';
import { EnvParse } from '@foxxie/env';
import { Result, container } from '@sapphire/framework';
import { Guild, GuildAuditLogsEntry, GuildAuditLogsResolvable, GuildResolvable } from 'discord.js';
import { GuildPollService } from './GuildPollService';

/**
 * Utility service for a Discord guild.
 */
export class GuildUtilityService {
	public polls: GuildPollService;

	private guild: Guild;

	/**
	 * Constructs a new utility service for the given guild.
	 * @param resolvable A guild resolvable to link this server to.
	 */
	public constructor(resolvable: GuildResolvable) {
		const guild = container.client.guilds.resolve(resolvable);
		this.guild = guild!;

		this.polls = new GuildPollService(this.guild);
	}

	/**
	 * Fetches an audit log entry from the guild given parameters.
	 * @param type The type of the audit log to fetch
	 * @param cb A callback specified to filter the results by.
	 * @returns The filtered audit log entry or `null` if none could be found
	 */
	public async fetchAuditEntry<T extends GuildAuditLogsResolvable>(
		type: T,
		cb: (result: GuildAuditLogsEntry<T>) => boolean = () => true
	): Promise<GuildAuditLogsEntry<T> | null> {
		const result = await Result.fromAsync(this.guild.fetchAuditLogs({ type }));

		if (result.isErr()) return null;
		const entry = result.unwrap().entries.filter(cb).first();
		if (!entry) return null;

		return entry;
	}

	/**
	 * Accesses the client's guild member in the server if currently cached. If not, returns `null`.
	 */
	public get maybeMe() {
		return this.guild.members.cache.get(EnvParse.string(EnvKeys.ClientId)) ?? null;
	}
}
