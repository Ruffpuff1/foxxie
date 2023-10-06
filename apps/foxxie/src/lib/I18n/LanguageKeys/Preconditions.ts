import { FT, T } from "#lib/Types";


export const Administrator = FT<{ name: string }>('preconditions:administrator');
export const ClientPermissions = FT<{ missing: string[] }>('preconditions:clientPermissions');
export const CommandDisabled = FT<{ context: 'chatinput' | never }>('preconditions:commandDisabled');
export const CommandDisabledGuild = FT<{ name: string }>('preconditions:commandDisabledGuild');
export const Cooldown = FT<{ remaining: number }>('preconditions:cooldown');
export const LastFmUsername = T('preconditions:lastFmUsername');
export const Leveling = T('preconditions:leveling');
export const MessageSubcommandNoMatch = T('preconditions:messageSubcommandNoMatch');
export const Moderator = FT<{ name: string }>('preconditions:moderator');
export const Nsfw = FT<{ name: string }>('preconditions:nsfw');
export const PermNodes = T('preconditions:permNodes');
