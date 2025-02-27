import { DiscordSnowflake } from '@sapphire/snowflake';
import { api } from '#lib/discord';
import { LoggerManager } from '#lib/moderation/managers/LoggerManager';
import { createReferPromise, ReferredPromise, seconds } from '#utils/common';
import { APIAuditLogEntry, AuditLogEvent, Collection, Snowflake } from 'discord.js';

const MaximumTimeForAuditLogEntryCreate = seconds(3);
const MaximumTimeForContextRetrieval = seconds(15);
const MaximumTimeForAuditLogRewind = seconds(60);

/**
 * A manager to handle cross-piece data sharing for logs. This structure has two
 * main purposes:
 *
 * - Pass context data from the moderation system to a listener.
 * - Pass context data from audit logs to a listener.
 *
 * The listener will wait for the context data to be set, and either of two
 * sources can set the data, resolving the listener's promise.
 *
 * This manager is designed to have a single consumer and multiple producers,
 * therefore, `wait` is called only once.
 *
 * Foxxie's actions will always call the `set` method before an action is taken,
 * aborting it with the `unset` method if the action fails. This way,
 * information can be passed to the logging listener without wait.
 *
 * Audit logs will always call the `setFromAuditLogs` method after the action
 * has been taken (when `wait` is called), resolving the promise. As such, it is
 * important for the consumer to call `wait` as soon as possible.
 *
 * Consumers may call `unset` to clear the context data if it won't be used due
 * to the guild's configuration settings. However, it may not call `wait` twice.
 */
export abstract class LoggerTypeManager {
	protected readonly auditLogEventType: AuditLogEvent;

	/**
	 * The manager that created this instance.
	 */
	protected readonly manager: LoggerTypeManager.Manager;

	#context = new Collection<Snowflake, { entry: LoggerTypeContext; timeout: NodeJS.Timeout }>();
	#promises = new Collection<Snowflake, ReferredPromise<LoggerTypeContext | null>>();

	public constructor(manager: LoggerTypeManager.Manager, auditLogEventType: AuditLogEvent) {
		this.manager = manager;
		this.auditLogEventType = auditLogEventType;
	}

	/**
	 * Returns whether or not the context data is set, which will always be true
	 * when an action was taken by Foxxie.
	 * @param id The ID of the context data to check.
	 */
	public isSet(id: Snowflake) {
		return this.#context.has(id);
	}

	/**
	 * Sets the context data for the given ID, happens before {@linkcode wait}
	 * is called.
	 * @param id The ID of the context data to set.
	 * @param data The context data to set.
	 */
	public set(id: Snowflake, entry: LoggerTypeContext) {
		this.#context.set(id, {
			entry,
			timeout: setTimeout(() => this.#context.delete(id), MaximumTimeForContextRetrieval).unref()
		});
	}

	/**
	 * Sets the context data from the audit logs, will always happen after
	 * {@linkcode wait} is called.
	 * @param id The ID of the context data to set.
	 * @param data The context data to set.
	 */
	public setFromAuditLogs(id: Snowflake, data: LoggerTypeContext) {
		this.#promises.get(id)?.resolve(data);
	}

	/**
	 * Unsets the context data for the given ID, useful when the action failed.
	 * @param id The ID of the context data to unset.
	 */
	public unset(id: Snowflake) {
		const entry = this.#context.get(id);
		if (entry) {
			clearTimeout(entry.timeout);
			this.#context.delete(id);
		}
	}

	/**
	 * Wait for the context data to be set.
	 * @param id The ID of the context data to wait for.
	 */
	public async wait(id: Snowflake, signal?: AbortSignal): Promise<LoggerTypeContext | null> {
		// 1. If the context data was set beforehand by Foxxie, return it
		// immediately.
		const existing = this.#context.get(id);
		if (existing) {
			clearTimeout(existing.timeout);
			this.#context.delete(id);
			return existing.entry;
		}

		const existingPromise = this.#promises.get(id);
		if (existingPromise) return existingPromise.promise;

		// 2. The action was not taken by Foxxie, fallback to audit logs.
		// If the bot cannot view audit logs, return null immediately.
		if (!this.manager.canViewAuditLogs) return null;

		signal?.throwIfAborted();

		// 3. Wait for audit logs to set the context data.
		const referPromise = createReferPromise<LoggerTypeContext | null>();
		const timeout = setTimeout(() => this.#fetch(referPromise, id, signal), MaximumTimeForAuditLogEntryCreate);
		signal?.addEventListener('abort', () => referPromise.resolve(null));

		this.#promises.set(id, referPromise);
		try {
			return await referPromise.promise;
		} finally {
			clearTimeout(timeout);
			this.#promises.delete(id);
		}
	}

	/**
	 * Fetches the audit logs for a specific type of event.
	 *
	 * @param type - The type of audit log event to fetch.
	 * @param signal - An optional `AbortSignal` to abort the request.
	 * @returns A promise that resolves to the fetched audit logs.
	 */
	protected fetchAuditLogs(signal?: AbortSignal) {
		return api().guilds.getAuditLogs(this.manager.guild.id, { action_type: this.auditLogEventType }, { signal });
	}

	/**
	 * Fetches the audit logs for the given ID.
	 *
	 * @param id - The target's user ID to fetch the audit logs for.
	 * @param signal - The signal to abort the operation.
	 * @returns The last audit log entry for the given target ID, in the last
	 * minute, or null if no entry was found for the type.
	 */
	protected async fetchAuditLogsFor(id: Snowflake, signal?: AbortSignal): Promise<LoggerTypeContext | null> {
		const entries = await this.fetchAuditLogs(signal);
		const oldestTimestamp = Date.now() - MaximumTimeForAuditLogRewind;
		for (const entry of entries.audit_log_entries) {
			// If the target ID is not the desired one, skip:
			if (entry.target_id !== id) continue;
			// If the entry is older than the desired one, skip:
			if (DiscordSnowflake.timestampFrom(entry.id) < oldestTimestamp) break;
			// If the entry is the desired one, return it:
			if (await this.filterAuditLogEntry(entry)) {
				return { reason: entry.reason, userId: entry.user_id! };
			}
		}

		return null;
	}

	protected filterAuditLogEntry(entry: LoggerTypeManager.AuditLogEntry): boolean | Promise<boolean>;

	protected filterAuditLogEntry(): boolean | Promise<boolean> {
		return true;
	}

	/**
	 * Fetches the audit logs for the given ID, resolving or rejecting the
	 * promise accordingly.
	 *
	 * @param referPromise - The promise to resolve or reject.
	 * @param id - The target's user ID to fetch the audit logs for.
	 * @param signal - The signal to abort the operation.
	 */
	async #fetch(referPromise: ReferredPromise<LoggerTypeContext | null>, id: Snowflake, signal?: AbortSignal) {
		try {
			const data = await this.fetchAuditLogsFor(id, signal);
			return referPromise.resolve(data);
		} catch (error) {
			return referPromise.reject(error as Error);
		}
	}
}

export namespace LoggerTypeManager {
	export type AuditLogEntry = APIAuditLogEntry;
	export type Manager = LoggerManager;
}

export interface LoggerTypeContext {
	reason?: null | string;
	userId: Snowflake;
}
