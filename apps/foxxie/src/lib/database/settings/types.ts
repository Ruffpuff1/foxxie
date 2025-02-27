import { DeepReadonly, PickByValue } from '@sapphire/utilities';
import { GuildData } from '#lib/database';
import { SerializedEmoji } from '#utils/functions';
import { Snowflake } from 'discord.js';

export enum FoxxieLocale {
	EnglishUS = 'en-US',
	SpanishMX = 'es-ES'
}
export type FoxxieLocaleType = `${FoxxieLocale}`;

export type GuildDataKey = keyof GuildData;

export type { guilds as GuildData, moderation as ModerationData } from '@prisma/client';

export type GuildDataValue = GuildData[GuildDataKey];

export type GuildSettingsOfType<T> = PickByValue<GuildData, T>;
export interface PermissionsNode {
	allow: readonly Snowflake[];
	deny: readonly Snowflake[];
	id: Snowflake;
}

export interface ReactionRole {
	channel: Snowflake;
	emoji: SerializedEmoji;
	message: null | Snowflake;
	role: Snowflake;
}

export type ReadonlyGuildData = DeepReadonly<GuildData>;

export type ReadonlyGuildDataValue = DeepReadonly<GuildDataValue>;

export interface StickyRole {
	roles: readonly Snowflake[];
	user: Snowflake;
}

export interface Tag {
	aliases: string[];
	color: number;
	content: string;
	delete: boolean;
	embed: boolean;
	id: string;
}
