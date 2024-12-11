import { isNullish } from '@sapphire/utilities';
import { readSettings } from '#lib/database';
import { getStarboard, Starboard } from '#lib/Database/Models/starboard';
import { GuildMessage } from '#lib/types';
import { Client, Collection, Guild, TextChannel } from 'discord.js';

export class StarboardManager extends Collection<string, Starboard> {
	public client: Client;

	public guild: Guild;

	public syncMap = new Map<string, Promise<null | Starboard>>();

	public syncMessageMap = new WeakMap<Starboard, Promise<void>>();

	public constructor(guild: Guild) {
		super();
		this.client = guild.client;
		this.guild = guild;
	}

	public async fetch(channel: TextChannel, messageID: string): Promise<null | Starboard> {
		// If a key already exists, return it:
		const entry = super.get(messageID);
		if (entry) return entry;

		// If a key is already synchronising, return the pending promise:
		const previousPending = this.syncMap.get(messageID);
		if (previousPending) return previousPending;

		// Start a new synchronization and return the promise:
		const newPending = this.#fetchEntry(channel, messageID).finally(() => this.syncMap.delete(messageID));
		this.syncMap.set(messageID, newPending);
		return newPending;
	}

	public async getMinimumStars() {
		return (await this.#readSettings()).starboardMinimum;
	}

	public async getStarboardChannel() {
		const { starboardChannelId } = await this.#readSettings();
		if (isNullish(starboardChannelId)) return null;
		return (this.guild.channels.cache.get(starboardChannelId) ?? null) as null | TextChannel;
	}

	public override set(key: string, value: Starboard) {
		if (this.size >= 25) {
			const entry = this.reduce((acc, sMes) => (acc.lastUpdated > sMes.lastUpdated ? sMes : acc), this.first()!);
			this.delete(entry.messageId);
		}
		return super.set(key, value);
	}

	async #fetchEntry(channel: TextChannel, messageid: string): Promise<null | Starboard> {
		const message = (await channel.messages.fetch(messageid).catch(() => null)) as GuildMessage | null;
		if (!message) return null;

		const previous = await getStarboard(this.guild.id, messageid);
		if (previous) {
			await previous.downloadStarMessage();
			if (!previous.messageId) return null;
		}

		const star = previous ?? new Starboard().init(this, message);
		this.set(messageid, star);

		await star.downloadUserList();
		return star.enabled ? star : null;
	}

	#readSettings() {
		return readSettings(this.guild);
	}
}
