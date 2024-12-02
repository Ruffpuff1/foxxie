// import type { GuildSettings } from '#lib/Database';
// import { LanguageKeys } from '#lib/I18n';
// import type { CustomFunctionGet, RoleLanguageKeyData } from '#lib/Types';
// import { PermissionFlagsBits, PermissionOverwriteOptions, PermissionResolvable, PermissionsBitField } from 'discord.js';

// export const enum RoleKey {
//     Muted,
//     Embed
// }

// export interface RoleData {
//     color: number;
//     hoist: boolean;
//     mentionable: boolean;
//     permissions: PermissionResolvable;
// }

// export interface RolePermissionOverwriteOption {
//     category: RolePermissionOverwriteOptionField;
//     text: RolePermissionOverwriteOptionField | null;
//     voice: RolePermissionOverwriteOptionField | null;
// }

// export interface RolePermissionOverwriteOptionField {
//     options: PermissionOverwriteOptions;
//     permissions: PermissionResolvable;
// }

// export const roleData = new Map<RoleKey, RoleData>([
//     [
//         RoleKey.Muted,
//         {
//             color: 0,
//             hoist: false,
//             mentionable: false,
//             permissions: []
//         }
//     ],
//     [
//         RoleKey.Embed,
//         {
//             color: 0,
//             hoist: false,
//             mentionable: false,
//             permissions: []
//         }
//     ]
// ]);

// export const roleLanguageKeys = new Map<
//     RoleKey,
//     CustomFunctionGet<string, { channels: number; permissions: string[] }, RoleLanguageKeyData>
// >([
//     [RoleKey.Muted, LanguageKeys.Moderation.RoleSetupMute],
//     [RoleKey.Embed, LanguageKeys.Moderation.RoleSetupEmbedRestrict]
// ]);

// export const permissionOverwrites = new Map<RoleKey, RolePermissionOverwriteOption>([
//     [
//         RoleKey.Muted,
//         {
//             category: {
//                 options: {
//                     SendMessages: false,
//                     AddReactions: false,
//                     CreatePublicThreads: false,
//                     CreatePrivateThreads: false,
//                     SendMessagesInThreads: false,
//                     Connect: false
//                 },
//                 permissions: new PermissionsBitField([
//                     PermissionFlagsBits.SendMessages,
//                     PermissionFlagsBits.AddReactions,
//                     PermissionFlagsBits.CreatePublicThreads,
//                     PermissionFlagsBits.CreatePrivateThreads,
//                     PermissionFlagsBits.SendMessagesInThreads,
//                     PermissionFlagsBits.Connect
//                 ])
//             },
//             text: {
//                 options: {
//                     SendMessages: false,
//                     AddReactions: false,
//                     CreatePublicThreads: false,
//                     CreatePrivateThreads: false,
//                     SendMessagesInThreads: false
//                 },
//                 permissions: new PermissionsBitField([
//                     PermissionFlagsBits.SendMessages,
//                     PermissionFlagsBits.AddReactions,
//                     PermissionFlagsBits.CreatePublicThreads,
//                     PermissionFlagsBits.CreatePrivateThreads,
//                     PermissionFlagsBits.SendMessagesInThreads
//                 ])
//             },
//             voice: {
//                 options: {
//                     Connect: false
//                 },
//                 permissions: new PermissionsBitField([PermissionFlagsBits.Connect])
//             }
//         }
//     ],
//     [
//         RoleKey.Embed,
//         {
//             category: {
//                 options: {
//                     EmbedLinks: false
//                 },
//                 permissions: new PermissionsBitField(PermissionFlagsBits.EmbedLinks)
//             },
//             text: {
//                 options: {
//                     EmbedLinks: false
//                 },
//                 permissions: new PermissionsBitField(PermissionFlagsBits.EmbedLinks)
//             },
//             voice: null
//         }
//     ]
// ]);

// export type RoleSettingsKey = typeof GuildSettings.Roles.Muted | typeof GuildSettings.Roles.EmbedRestrict;
