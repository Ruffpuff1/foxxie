import { DeepReadonly, PickByValue } from '@sapphire/utilities';
import { GuildData } from '.';
import { Snowflake } from 'discord.js';
import { SerializedEmoji } from '#utils/discord';

export type ReadonlyGuildData = DeepReadonly<GuildData>;
export type ReadonlyGuildDataValue = DeepReadonly<GuildDataValue>;

export type GuildSettingsOfType<T> = PickByValue<GuildData, T>;

export type { guilds as GuildData, moderation as ModerationData } from '@prisma/client';

export interface PermissionsNode {
	allow: readonly Snowflake[];
	deny: readonly Snowflake[];
	id: Snowflake;
}

export type GuildDataKey = keyof GuildData;
export type GuildDataValue = GuildData[GuildDataKey];

export interface ReactionRole {
	channel: Snowflake;
	emoji: SerializedEmoji;
	message: Snowflake | null;
	role: Snowflake;
}

export interface StickyRole {
	roles: readonly Snowflake[];
	user: Snowflake;
}

export enum FoxxieLocale {
	EnglishUS = 'en-US',
	SpanishMX = 'es-ES'
}

export type FoxxieLocaleType = `${FoxxieLocale}`;
