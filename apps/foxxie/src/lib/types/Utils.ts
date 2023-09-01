import type { ModerationEntity } from '#lib/database';
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

export interface ArgumentDescription {
    name: string;
    description: string;
}

export interface SubcommandDescription {
    command: string;
    description: string | string[];
    examples: string[];
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

export type PartialModerationModelWithRoleIdExtraData = Partial<ModerationEntity> & { extraData: { roleId: string } };

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

type EventKey = keyof ClientEvents | keyof FoxxieEvents;
