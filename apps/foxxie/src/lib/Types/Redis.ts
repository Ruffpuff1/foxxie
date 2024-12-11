import type { Snowflake } from 'discord-api-types/v10';

export type BanKey = `guild:${Snowflake}:ban:${Snowflake}`;

export type KickKey = `guild:${Snowflake}:kick:${Snowflake}`;
export type MessageDeleteKey = `delete:${Snowflake}`;
export type MuteKey = `guild:${Snowflake}:mute:${Snowflake}`;

export type RaidCacheKey = `${RaidKey}:cache`;
export type RaidKey = `raid:${Snowflake}`;
export type RaidMessageKey = `${RaidKey}:message`;
export type RedisData<K extends RedisKeys> = K extends MessageDeleteKey ? `${Snowflake},${string},${Snowflake}` : string;
export type RedisKeys = BanKey | KickKey | MessageDeleteKey | MuteKey | RaidCacheKey | RaidMessageKey | UnbanKey | UnMuteKey | WelcomeCacheKey;
export type RedisValue<K extends RedisKeys> = K extends MessageDeleteKey ? `${Snowflake},${string},${Snowflake}` : null | string;

export type UnbanKey = `guild:${Snowflake}:unban:${Snowflake}`;

export type UnMuteKey = `guild:${Snowflake}:unmute:${Snowflake}`;

export type WelcomeCacheKey = `welcome:${Snowflake}:${Snowflake}`;
