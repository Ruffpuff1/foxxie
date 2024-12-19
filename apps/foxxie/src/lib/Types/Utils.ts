import type { ClientEvents } from 'discord.js';

import { TFunction } from '@sapphire/plugin-i18next';

import { FoxxieEvents } from './Events.js';

export const enum PermissionLevels {
	Administrator = 7,
	BotOwner = 10,
	Everyone = 0,
	GuildOwner = 8,
	Moderator = 6
}

export interface ArgumentDescription {
	description: string;
	name: string;
}

export interface ColorData {
	base10: number;
	hex: string;
	hsl: string;
	hsv: string;
	rgb: string;
}

export type CustomFunctionGet<K extends string, TArgs, TReturn> = { __args__: TArgs; __return__: TReturn } & K;

export type CustomGet<K extends string, TCustom> = { __type__: TCustom } & K;

export interface DetailedDescription {
	arguments?: ArgumentDescription[];
	description: string;
	examples?: string[];
	subcommands?: SubcommandDescription[];
	usage?: string;
}

export interface DetailedDescriptionArgs {
	CHANNEL: string;
	prefix: string;
}

export interface Difference<T = string> {
	next: T;
	previous: T;
}

export interface EmojiObject extends EmojiObjectPartial {
	animated?: boolean;
}

export type EventArgs<T extends EventKey> = T extends keyof ClientEvents ? ClientEvents[T] : T extends keyof FoxxieEvents ? FoxxieEvents[T] : never;

export type GetTypedFTArgs<T extends TypedFT<unknown, unknown>> = T extends TypedFT<infer U, unknown> ? U : never;

export type GetTypedFTReturn<T extends TypedFT<unknown, unknown>> = T extends TypedFT<unknown, infer U> ? U : never;

export type GetTypedT<T extends TypedT<unknown>> = T extends TypedT<infer U> ? U : never;

export interface HelpDisplayData {
	cooldown?: string;
	examples?: string[];
	explainedUsage?: [string, string | string[]][];
	extendedHelp?: string;
	permissions?: string;
	reminder?: string;
	usages?: string[];
}

export type LanguageString = 'en-US' | 'es-ES';

export interface Parameter {
	parameter: string;
}
export interface RoleLanguageKeyData {
	init: string;
	name: string;
	reason: string;
}

export interface SubcommandDescription {
	command: string;
	description: string;
	examples: string[];
	options?: SubcommandOption[];
}

export interface SubcommandOption {
	description: string;
	name: string;
}
export type TypedFT<TArgs, TReturn = string> = { __args__: TArgs; __return__: TReturn } & string;
export type TypedT<TCustom = string> = { __type__: TCustom } & string;

export interface Value<T = string> {
	value: T;
}

export interface Values<T = string> {
	count: number;
	values: readonly T[];
}

interface EmojiObjectPartial {
	id: null | string;
	name: null | string;
}

type EventKey = keyof ClientEvents | keyof FoxxieEvents;
export function FT<TArgs, TReturn = string>(k: string): TypedFT<TArgs, TReturn> {
	return k as TypedFT<TArgs, TReturn>;
}

export function T<TCustom = string>(k: string): TypedT<TCustom> {
	return k as TypedT<TCustom>;
}

export const FoxxieT = (func: TFunction) => {
	return func as FTFunction;
};

export interface FTFunction {
	lng: string;
	ns?: string;

	<TArgs, TReturn>(key: TypedFT<TArgs, TReturn>, args: TArgs): TReturn;
	<TReturn>(key: TypedT<TReturn>): TReturn;
}
