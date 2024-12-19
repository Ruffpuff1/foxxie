import { FT, T } from '#lib/types';
import { PermissionsString } from 'discord.js';

export const Administrator = FT<{ name: string }>('preconditions:administrator');
export const ClientPermissions = FT<{ missing: string[] }>('preconditions:clientPermissions');
export const CommandDisabled = FT<{ context: 'chatinput' | never }>('preconditions:commandDisabled');
export const CommandDisabledGuild = FT<{ name: string }>('preconditions:commandDisabledGuild');
export const Cooldown = FT<{ remaining: number }>('preconditions:cooldown');
export const LastFMLogin = T('preconditions:lastFMLogin');
export const Leveling = T('preconditions:leveling');
export const MemberPermissions = FT<{ count: number; missing: PermissionsString[] }>('preconditions:memberPermissions');
export const MessageSubcommandNoMatch = T('preconditions:messageSubcommandNoMatch');
export const MissingChatInputHandler = T('preconditions:missingChatInputHandler');
export const Moderator = FT<{ name: string }>('preconditions:moderator');
export const Nsfw = FT<{ name: string }>('preconditions:nsfw');
export const PermNodes = T('preconditions:permNodes');
