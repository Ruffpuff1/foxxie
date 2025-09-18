import { FoxxieEvents } from '#lib/types';
import { ClientEvents } from 'discord.js';

export const enum PermissionLevels {
	Administrator = 7,
	BotOwner = 10,
	Everyone = 0,
	GuildOwner = 8,
	Moderator = 6
}

export type CustomFunctionGet<K extends string, TArgs, TReturn> = { __args__: TArgs; __return__: TReturn } & K;

export type CustomGet<K extends string, TCustom> = { __type__: TCustom } & K;

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

export type TypedFT<TArgs, TReturn = string> = { __args__: TArgs; __return__: TReturn } & string;
export type TypedT<TCustom = string> = { __type__: TCustom } & string;
export interface Value<T = string> {
	value: T;
}

type EventKey = keyof ClientEvents | keyof FoxxieEvents;
