import type { GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import type { CustomFunctionGet, RoleLanguageKeyData } from '#lib/types';
import { PermissionOverwriteOptions, PermissionResolvable, Permissions } from 'discord.js';

export const enum RoleKey {
    Muted,
    Embed
}

export interface RoleData {
    color: number;
    hoist: boolean;
    mentionable: boolean;
    permissions: PermissionResolvable;
}

export interface RolePermissionOverwriteOption {
    category: RolePermissionOverwriteOptionField;
    text: RolePermissionOverwriteOptionField | null;
    voice: RolePermissionOverwriteOptionField | null;
}

export interface RolePermissionOverwriteOptionField {
    options: PermissionOverwriteOptions;
    permissions: Permissions;
}

export const roleData = new Map<RoleKey, RoleData>([
    [
        RoleKey.Muted,
        {
            color: 0,
            hoist: false,
            mentionable: false,
            permissions: []
        }
    ],
    [
        RoleKey.Embed,
        {
            color: 0,
            hoist: false,
            mentionable: false,
            permissions: []
        }
    ]
]);

export const roleLanguageKeys = new Map<RoleKey, CustomFunctionGet<string, { channels: number; permissions: string[] }, RoleLanguageKeyData>>([
    [RoleKey.Muted, LanguageKeys.Moderation.RoleSetupMute],
    [RoleKey.Embed, LanguageKeys.Moderation.RoleSetupEmbedRestrict]
]);

export const permissionOverwrites = new Map<RoleKey, RolePermissionOverwriteOption>([
    [
        RoleKey.Muted,
        {
            category: {
                options: {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    CREATE_PUBLIC_THREADS: false,
                    CREATE_PRIVATE_THREADS: false,
                    SEND_MESSAGES_IN_THREADS: false,
                    CONNECT: false
                },
                permissions: new Permissions(['SEND_MESSAGES', 'ADD_REACTIONS', 'CREATE_PUBLIC_THREADS', 'CREATE_PRIVATE_THREADS', 'SEND_MESSAGES_IN_THREADS', 'CONNECT'])
            },
            text: {
                options: {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    CREATE_PUBLIC_THREADS: false,
                    CREATE_PRIVATE_THREADS: false,
                    SEND_MESSAGES_IN_THREADS: false,
                    USE_APPLICATION_COMMANDS: false
                },
                permissions: new Permissions(['SEND_MESSAGES', 'ADD_REACTIONS', 'CREATE_PUBLIC_THREADS', 'CREATE_PRIVATE_THREADS', 'SEND_MESSAGES_IN_THREADS'])
            },
            voice: {
                options: {
                    CONNECT: false
                },
                permissions: new Permissions(['CONNECT'])
            }
        }
    ],
    [
        RoleKey.Embed,
        {
            category: {
                options: {
                    EMBED_LINKS: false
                },
                permissions: new Permissions('EMBED_LINKS')
            },
            text: {
                options: {
                    EMBED_LINKS: false
                },
                permissions: new Permissions('EMBED_LINKS')
            },
            voice: null
        }
    ]
]);

export type RoleSettingsKey = typeof GuildSettings.Roles.Muted | typeof GuildSettings.Roles.EmbedRestrict;
