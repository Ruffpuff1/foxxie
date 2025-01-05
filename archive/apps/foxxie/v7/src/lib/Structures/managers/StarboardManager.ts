import { GuildSettings, acquireSettings } from '#lib/Database';
import { StarEntity } from '#lib/Database/entities/StarEntity';
import type { GuildMessage } from '#lib/Types';
import { cast } from '@ruffpuff/utilities';
import type { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/pieces';
import { isNullish } from '@sapphire/utilities';
import { Collection, Guild, TextChannel } from 'discord.js';

/**
 * The StarboardManager class that manages the starboard channel
 * @version 4.0.0
 */
export class StarboardManager extends Collection<string, StarEntity> {
    /**
     * The Guild instance that manages this manager
     */
    public guild: Guild;

    /**
     * The synchronization map for [[StarEntity.fetch]] calls.
     */
    public syncMap = new Map<string, Promise<StarEntity | null>>();

    /**
     * The synchronization map for [[StarEntity.updateStarMessage]] calls.
     */
    public syncMessageMap = new WeakMap<StarEntity, Promise<void>>();

    public constructor(guild: Guild) {
        super();
        this.guild = guild;
    }

    /**
     * [LRU-System] Set an entry to the cache. Automatically removes the Least Recently Used.
     * @param key The key to add
     * @param value The StarEntity to add
     */
    public set(key: string, value: StarEntity) {
        if (this.size >= 25) {
            const entry = this.reduce((acc, sMes) => (acc.lastUpdated > sMes.lastUpdated ? sMes : acc), this.first()!);
            this.delete(entry.messageId);
        }
        return super.set(key, value);
    }

    /**
     * Get the Starboard channel
     */
    public async getStarboardChannel() {
        const channelId = await acquireSettings(this.guild, s => s.starboard[GuildSettings.Starboard.Channel]);
        if (isNullish(channelId)) return null;
        return cast<TextChannel | null>(this.guild.channels.cache.get(channelId) ?? null);
    }

    /**
     * Get the minimum amount of stars
     */
    public getMinimumStars() {
        return acquireSettings(this.guild, s => s.starboard[GuildSettings.Starboard.Minimum]);
    }

    /**
     * Fetch a StarboardMessage entry
     * @param channel The text channel the message was sent
     * @param messageId The message id
     */
    public async fetch(channel: GuildTextBasedChannelTypes, messageId: string): Promise<StarEntity | null> {
        // If a key already exists, return it:
        const entry = super.get(messageId);
        if (entry) return entry;

        // If a key is already synchronising, return the pending promise:
        const previousPending = this.syncMap.get(messageId);
        if (previousPending) return previousPending;

        // Start a new synchronization and return the promise:
        const newPending = this.fetchEntry(channel, messageId).finally(() => this.syncMap.delete(messageId));
        this.syncMap.set(messageId, newPending);
        return newPending;
    }

    private async fetchEntry(channel: GuildTextBasedChannelTypes, messageId: string): Promise<StarEntity | null> {
        const message = cast<GuildMessage | null>(await channel.messages.fetch(messageId).catch(() => null));
        if (!message) return null;

        const { starboards } = container.db;
        const previous = await starboards.findOne({ where: { guildId: this.guild.id, messageId } });

        if (previous) {
            previous.init(this, message);
            await previous.downloadStarMessage();
            await previous.downloadUserList();
            if (previous._id) {
                this.set(messageId, previous);
                return previous;
            }
        }

        const star = previous ?? new StarEntity().init(this, message);
        this.set(messageId, star);

        await star.downloadUserList();
        return star.enabled ? star : null;
    }
}
