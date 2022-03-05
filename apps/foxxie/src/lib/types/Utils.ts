import type { ModerationEntity } from '#lib/database';
import type { ClientEvents } from 'discord.js';

export type CustomGet<K extends string, TCustom> = K & { __type__: TCustom };

export function T<TCustom = string>(k: string): CustomGet<string, TCustom> {
    return k as CustomGet<string, TCustom>;
}

export type CustomFunctionGet<K extends string, TArgs, TReturn> = K & {
    __args__: TArgs;
    __return__: TReturn;
};

export function FT<TArgs, TReturn = string>(k: string): CustomFunctionGet<string, TArgs, TReturn> {
    return k as CustomFunctionGet<string, TArgs, TReturn>;
}

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

export const enum PermissionLevels {
    Everyone = 0,
    Moderator = 6,
    Administrator = 7,
    GuildOwner = 8,
    Contributor = 9,
    BotOwner = 10
}

export interface Diff {
    previous: number;
    next: number;
}

export interface RoleLanguageKeyData {
    name: string;
    reason: string;
    init: string;
}

export type PartialModerationEntityWithRoleIdExtraData = Partial<ModerationEntity> & { extraData: { roleId: string } };

export type EventArgs<T extends keyof ClientEvents> = ClientEvents[T];

export interface ColorData {
    hex: string;
    hsl: string;
    rgb: string;
    hsv: string;
    base10: number;
}
