import type { Snowflake } from 'discord-api-types/v10';

export type MessageDeleteKey = `delete:${Snowflake}`;

export type RaidKey = `raid:${Snowflake}`;
export type RaidCacheKey = `${RaidKey}:cache`;
export type RaidMessageKey = `${RaidKey}:message`;

export type WelcomeCacheKey = `welcome:${Snowflake}:${Snowflake}`;
export type KickKey = `guild:${Snowflake}:kick:${Snowflake}`;
export type BanKey = `guild:${Snowflake}:ban:${Snowflake}`;
export type UnbanKey = `guild:${Snowflake}:unban:${Snowflake}`;

export type RedisKeys = KickKey | BanKey | UnbanKey | MessageDeleteKey | RaidCacheKey | RaidMessageKey | WelcomeCacheKey;

export type RedisData<K extends RedisKeys> = K extends MessageDeleteKey ? `${Snowflake},${string},${Snowflake}` : string;

export type RedisValue<K extends RedisKeys> = K extends MessageDeleteKey ? `${Snowflake},${string},${Snowflake}` : string | null;
