import { GuildModerationManager, PersistRoleManager } from '#lib/Structures';
import { StarboardManager } from '#lib/Structures/managers/StarboardManager';
import { EnvKeys } from '#lib/Types/Env';
import { EnvParse } from '@foxxie/env';
import { Result, container } from '@sapphire/framework';
import { Guild, GuildAuditLogsEntry, GuildAuditLogsResolvable, GuildResolvable } from 'discord.js';

/**
 * Utility service for a Discord guild.
 */
export class GuildUtilityService {
    public guild: Guild;

    /**
     * This guild's moderation manager.
     */
    public moderation: GuildModerationManager;

    /**
     * This guild's persist roles manager.
     */
    public persistRoles: PersistRoleManager;

    /**
     * This guild's starboard manager.
     */
    public starboard: StarboardManager;

    /**
     * Constructs a new utility service for the given guild.
     * @param resolvable A guild resolvable to link this server to.
     */
    public constructor(resolvable: GuildResolvable) {
        const guild = container.client.guilds.resolve(resolvable);
        this.guild = guild!;

        this.moderation = new GuildModerationManager(this.guild);

        this.persistRoles = new PersistRoleManager(this.guild);

        this.starboard = new StarboardManager(this.guild);
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
