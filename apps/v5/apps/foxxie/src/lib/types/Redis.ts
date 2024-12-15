import type { Snowflake } from 'discord-api-types/v9';

export type AfkKey = `afk:${Snowflake}:${Snowflake}`;

export type AudioKey = `audio:${Snowflake}`;
export type AudioNextKey = `${AudioKey}:next`;
export type AudioPositionKey = `${AudioKey}:position`;
export type AudioCurrentKey = `${AudioKey}:current`;
export type AudioSkipsKey = `${AudioKey}:skips`;
export type AudioSystemPauseKey = `${AudioKey}:systemPause`;
export type AudioReplayKey = `${AudioKey}:replay`;
export type AudioVolumeKey = `${AudioKey}:volume`;
export type AudioTextKey = `${AudioKey}:text`;

export type LevelingKey = `leveling:${Snowflake}:${Snowflake}`;
export type LevelingRoleKey = `${LevelingKey}:role`;

export type MessageDeleteKey = `delete:${Snowflake}`;

export type RaidKey = `raid:${Snowflake}`;
export type RaidCacheKey = `${RaidKey}:cache`;
export type RaidMessageKey = `${RaidKey}:message`;

export type SpotifyKey = `spotify:`;
export type SpotifyPlaylistKey = `${SpotifyKey}playlists:${string}`;
export type SpotifyTrackKey = `${SpotifyKey}tracks:${string}`;

export type StatusMessageKey = `statuspage:${Snowflake}:${string}`;

export type WelcomeCacheKey = `welcome:${Snowflake}:${Snowflake}`;

export type Hash = string;

export type KickKey = `guild:${Snowflake}:kick:${Snowflake}`;

export type BanKey = `guild:${Snowflake}:ban:${Snowflake}`;

export type UnbanKey = `guild:${Snowflake}:unban:${Snowflake}`;

export interface QueueKeys {
    readonly next: AudioNextKey;
    readonly position: AudioPositionKey;
    readonly current: AudioCurrentKey;
    readonly skips: AudioSkipsKey;
    readonly systemPause: AudioSystemPauseKey;
    readonly replay: AudioReplayKey;
    readonly volume: AudioVolumeKey;
    readonly text: AudioTextKey;
}

export type RedisKeys =
    | AfkKey
    | AudioNextKey
    | AudioPositionKey
    | AudioCurrentKey
    | AudioSkipsKey
    | AudioSystemPauseKey
    | AudioReplayKey
    | AudioVolumeKey
    | AudioTextKey
    | KickKey
    | BanKey
    | UnbanKey
    | LevelingKey
    | LevelingRoleKey
    | MessageDeleteKey
    | RaidCacheKey
    | RaidMessageKey
    | SpotifyTrackKey
    | SpotifyPlaylistKey
    | StatusMessageKey
    | WelcomeCacheKey;

export type RedisData<K extends RedisKeys> = K extends StatusMessageKey
    ? Snowflake
    : K extends AudioTextKey
    ? Snowflake | null
    : K extends AudioSystemPauseKey
    ? '1' | '0'
    : K extends MessageDeleteKey
    ? `${Snowflake},${string},${Snowflake}`
    : K extends AudioReplayKey
    ? '1' | '0'
    : string;

export type RedisValue<K extends RedisKeys> = K extends AudioSystemPauseKey
    ? '1' | '0'
    : K extends MessageDeleteKey
    ? `${Snowflake},${string},${Snowflake}`
    : K extends AudioReplayKey
    ? '1' | '0'
    : string | null;
