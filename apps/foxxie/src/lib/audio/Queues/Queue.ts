import { map, reverse } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import type { Player } from '@skyra/audio';
import type { Guild, VoiceChannel } from 'discord.js';
import type { QueueManager } from './QueueManager';
import type { NP, Song } from '../types';
import type { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities';
import { deserializeEntry, serializeEntry } from '../util';
import { QueueKeys, Events, Hash } from '#lib/types';

export class Queue {
    public readonly redisKeys: QueueKeys;

    public constructor(public readonly store: QueueManager, public readonly guildId: string) {
        this.redisKeys = {
            next: `audio:${this.guildId}:next`,
            position: `audio:${this.guildId}:position`,
            current: `audio:${this.guildId}:current`,
            skips: `audio:${this.guildId}:skips`,
            systemPause: `audio:${this.guildId}:systemPause`,
            replay: `audio:${this.guildId}:replay`,
            volume: `audio:${this.guildId}:volume`,
            text: `audio:${this.guildId}:text`
        };
    }

    public count(): Promise<number> {
        return this.store.redis.llen(this.redisKeys.next);
    }

    public async leave() {
        await this.player.leave();
        await this.setTextChannelId(null!);
    }

    public async pause({ system = false } = {}) {
        await this.player.pause(true);
        await this.setSystemPaused(system);
    }

    public async resume() {
        await this.player.pause(false);
        await this.setSystemPaused(false);
    }

    public async start(replaying = false): Promise<boolean> {
        const nowPlaying = await this.nowPlaying();
        if (!nowPlaying) return this.next();

        await this.player.play(nowPlaying.entry.track, {
            start: nowPlaying.position
        });
        container.client.emit(replaying ? Events.MusicSongReplayNotify : Events.MusicSongPlayNotify, this, nowPlaying);
        return true;
    }

    public async connect(channelId: string) {
        await this.player.join(channelId, { deaf: true });
    }

    public async getCurrentSong(): Promise<Song | null> {
        const value = await this.store.redis.fetch(this.redisKeys.current);
        return value ? deserializeEntry(value) : null;
    }

    public async getSystemPaused(): Promise<boolean> {
        return this.store.redis.fetch(this.redisKeys.systemPause).then(d => d === '1');
    }

    public async setSystemPaused(value: boolean): Promise<boolean> {
        await this.store.redis.insert(this.redisKeys.systemPause, value ? '1' : '0');
        return value;
    }

    public async setTextChannelId(channelId: string): Promise<string>;
    public async setTextChannelId(channelId: string | null): Promise<string | null> {
        if (channelId === null) {
            await this.store.redis.del(this.redisKeys.text);
        } else {
            await this.store.redis.insert(this.redisKeys.text, channelId);
        }

        return channelId;
    }

    public getTextChannelId(): Promise<string | null> {
        return this.store.redis.fetch(this.redisKeys.text);
    }

    public async getTextChannel(): Promise<GuildTextBasedChannelTypes | null> {
        const id = await this.getTextChannelId();
        if (id === null) return null;

        const channel = this.guild.channels.cache.get(id) ?? null;
        if (channel === null) {
            await this.setTextChannelId(null!);
            return null;
        }

        return channel as GuildTextBasedChannelTypes;
    }

    public async canStart(): Promise<boolean> {
        return await this.store.redis.exists(this.redisKeys.current, this.redisKeys.next) > 0;
    }

    public async add(...tracks: readonly Song[]): Promise<number> {
        if (!tracks.length) return 0;
        await this.store.redis.lpush(this.redisKeys.next, ...map(tracks.values(), serializeEntry));
        return tracks.length;
    }

    public async songs(start = 0, end = -1) {
        if (end === Infinity) end = -1;

        const tracks = await this.store.redis.lrange(this.redisKeys.next, start, end);
        return [...map(reverse(tracks), deserializeEntry)];
    }

    public async next({ skipped = false } = {}): Promise<boolean> {
        await this.store.redis.del(this.redisKeys.position);

        const isReplaying = await this.isReplaying();

        if (!skipped && isReplaying) {
            return this.start(true);
        }

        if (isReplaying) await this.setReplay(false);

        const entry = await this.store.redis.rpopset(this.redisKeys.next, this.redisKeys.current);

        if (entry) {
            return this.start(false);
        }

        container.client.emit(Events.MusicFinish, this);
        return false;
    }

    public async setReplay(bool: boolean): Promise<boolean> {
        await this.store.redis.insert(this.redisKeys.replay, bool ? '1' : '0');
        return bool;
    }

    public async getReplay(): Promise<boolean> {
        const d = await this.store.redis.fetch(this.redisKeys.replay);
        return d === '1';
    }

    public async nowPlaying(): Promise<NP | null> {
        const [entry, position] = await Promise.all([this.getCurrentSong(), this.store.redis.get(this.redisKeys.position)]);
        if (entry === null) return null;

        const info = await this.player.node.decode(entry.track);

        return {
            entry: { ...entry, info },
            position: isNullish(position) ? 0 : parseInt(position, 10)
        };
    }

    public async isReplaying(): Promise<boolean> {
        const d = await this.store.redis.get(this.redisKeys.replay);
        return d === '1';
    }

    public async shuffle(): Promise<void> {
        await this.store.redis.lshuffle(this.redisKeys.next);
    }

    public async createPlaylist(): Promise<[Hash, string[]]> {
        const current = await this.nowPlaying();
        const serialized = serializeEntry(current!.entry);
        const list = await this.store.redis.lrange(this.redisKeys.next, 0, -1);
        // generate the hash.
        const hash = `${Date.now().toString(36)}${container.client.options.shardCount ? container.client.options.shardCount.toString(36) : (1).toString(36)}`;
        // return the hash.
        return [hash, [...list, serialized]];
    }

    public clear(): Promise<number> {
        return this.store.redis.del(
            this.redisKeys.next,
            this.redisKeys.position,
            this.redisKeys.current,
            this.redisKeys.skips,
            this.redisKeys.systemPause,
            this.redisKeys.replay,
            this.redisKeys.volume,
            this.redisKeys.text
        );
    }

    public get player(): Player {
        return container.client.audio!.players.get(this.guildId);
    }

    public get paused(): boolean {
        return this.player.paused;
    }

    public get playing(): boolean {
        return this.player.playing;
    }

    public get guild(): Guild {
        return container.client.guilds.cache.get(this.guildId)!;
    }

    public get voiceChannel(): VoiceChannel | null {
        const id = this.voiceChannelId;
        return id ? (this.guild.channels.cache.get(id) as VoiceChannel) : null;
    }

    public get voiceChannelId(): string | null {
        return this.player.voiceState?.channel_id ?? null;
    }
}
