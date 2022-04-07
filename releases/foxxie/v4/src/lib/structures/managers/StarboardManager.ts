/* eslint-disable require-atomic-updates */
import Collection from '@discordjs/collection';
import type { Guild, TextChannel } from 'discord.js';
import { resolveToNull } from '../../util';
import { aquireSettings, guildSettings, StarEntity } from '../../database';
import type { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities';
import type { GuildMessage } from '../../types/Discord';
import { container } from '@sapphire/framework';

export class StarboardManager extends Collection<string, StarEntity> {

    public guild: Guild;

    public syncMap = new Map<string, Promise<StarEntity | null>>();

    public syncMessages = new WeakMap<StarEntity, Promise<void>>();

    public constructor(guild: Guild) {
        super();
        this.guild = guild;
    }

    public set(key: string, value: StarEntity): this {
        if (this.size >= 25) {
            const entry = this.reduce((acc, sMes) => (acc.lastUpdated > sMes.lastUpdated ? sMes : acc), this.first()!);
            this.delete(entry.messageId);
        }
        return super.set(key, value);
    }

    public async getStarboardChannel(): Promise<TextChannel | null> {
        const channelId = await aquireSettings(this.guild, guildSettings.starboard.channel);
        if (!channelId) return null;
        return resolveToNull(this.guild.channels.fetch(channelId)) as Promise<TextChannel | null>;
    }

    public getMinimumStars(): Promise<number> {
        return aquireSettings(this.guild, guildSettings.starboard.minimum);
    }

    public async fetch(channel: GuildTextBasedChannelTypes, messageId: string): Promise<StarEntity | null> {
        const entry = super.get(messageId);
        if (entry) return entry;

        const pending = this.syncMap.get(messageId);
        if (pending) return pending;

        const newPending = this.fetchEntry(channel, messageId).finally(() => this.syncMap.delete(messageId));
        this.syncMap.set(messageId, newPending);
        return newPending;
    }

    private async fetchEntry(channel: GuildTextBasedChannelTypes, messageId: string): Promise<StarEntity | null> {
        const message = (await channel.messages.fetch(messageId).catch(() => null)) as GuildMessage | null;
        if (!message) return null;

        const { starboards } = container.db;
        const previous = await starboards.findOne({ guildId: this.guild.id, messageId });
        if (previous) {
            previous.init(this, message);
            await previous.downloadStarMessage();
            if (!previous.hasId()) return null;
        }

        const star = previous ?? new StarEntity().init(this, message);
        this.set(messageId, star);

        await star.downloadUserList();
        return star.enabled ? star : null;
    }

}