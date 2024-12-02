import type { ClientEvents } from 'discord.js';
import { FoxxieEvents } from './Events';

export type LanguageString = 'en-US' | 'es-MX';

interface EmojiObjectPartial {
    name: string | null;
    id: string | null;
}

export interface EmojiObject extends EmojiObjectPartial {
    animated?: boolean;
}

export interface HelpDisplayData {
    usages?: string[];
    explainedUsage?: [string, string | string[]][];
    extendedHelp?: string;
    examples?: string[];
    reminder?: string;
    cooldown?: string;
    permissions?: string;
}

export interface DetailedDescription {
    description: string;
    usage?: string;
    arguments?: ArgumentDescription[];
    examples?: string[];
    subcommands?: SubcommandDescription[];
}

export interface DetailedDescriptionArgs {
    prefix: string;
    CHANNEL: string;
}

export interface ArgumentDescription {
    name: string;
    description: string;
}

export interface SubcommandDescription {
    command: string;
    description: string;
    examples: string[];
    options?: SubcommandOption[];
}

export interface SubcommandOption {
    name: string;
    description: string;
}

export const enum PermissionLevels {
    Everyone = 0,
    Moderator = 6,
    Administrator = 7,
    GuildOwner = 8,
    Contributor = 9,
    BotOwner = 10
}

export interface RoleLanguageKeyData {
    name: string;
    reason: string;
    init: string;
}

export type PartialModerationModelWithRoleIdExtraData = Partial<{}> & { extraData: { roleId: string } };

export type EventArgs<T extends EventKey> = T extends keyof ClientEvents
    ? ClientEvents[T]
    : T extends keyof FoxxieEvents
      ? FoxxieEvents[T]
      : never;

export interface ColorData {
    hex: string;
    hsl: string;
    rgb: string;
    hsv: string;
    base10: number;
}

export const enum ConsoleState {
    Log,
    Debug,
    Warn,
    Error,
    Fatal
}

type EventKey = keyof ClientEvents | keyof FoxxieEvents;

export type CustomGet<K extends string, TCustom> = K & { __type__: TCustom };

// export function T<TCustom = string>(k: string): CustomGet<string, TCustom> {
//     return k as CustomGet<string, TCustom>;
// }

export type CustomFunctionGet<K extends string, TArgs, TReturn> = K & { __args__: TArgs; __return__: TReturn };

// export function FT<TArgs, TReturn = string>(k: string): CustomFunctionGet<string, TArgs, TReturn> {
//     return k as CustomFunctionGet<string, TArgs, TReturn>;
// }

export type TypedT<TCustom = string> = string & { __type__: TCustom };
export type GetTypedT<T extends TypedT<unknown>> = T extends TypedT<infer U> ? U : never;

export function T<TCustom = string>(k: string): TypedT<TCustom> {
    return k as TypedT<TCustom>;
}

export type TypedFT<TArgs, TReturn = string> = string & { __args__: TArgs; __return__: TReturn };
export type GetTypedFTArgs<T extends TypedFT<unknown, unknown>> = T extends TypedFT<infer U, unknown> ? U : never;
export type GetTypedFTReturn<T extends TypedFT<unknown, unknown>> = T extends TypedFT<unknown, infer U> ? U : never;

export function FT<TArgs, TReturn = string>(k: string): TypedFT<TArgs, TReturn> {
    return k as TypedFT<TArgs, TReturn>;
}

export interface Value<T = string> {
    value: T;
}

export interface Values<T = string> {
    values: readonly T[];
    count: number;
}

export interface Difference<T = string> {
    previous: T;
    next: T;
}

export interface Parameter {
    parameter: string;
}
