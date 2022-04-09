import { FT, T } from '@foxxie/i18n';

export const Administrator = FT<{ name: string }>('preconditions:administrator');
export const ClientPermissions = FT<{ missing: string[] }>('preconditions:clientPermissions');
export const CommandDisabled = FT<{ context: 'chatinput' | never }>('preconditions:commandDisabled');
export const CommandDisabledGuild = FT<{ name: string }>('preconditions:commandDisabledGuild');
export const Cooldown = FT<{ remaining: number }>('preconditions:cooldown');
export const Leveling = T('preconditions:leveling');
export const Moderator = FT<{ name: string }>('preconditions:moderator');
export const MusicFoxxieVoiceChannel = T('preconditions:musicFoxxieVoiceChannel');
export const MusicNothingPlaying = T('preconditions:musicNothingPlaying');
export const MusicNotPaused = T('preconditions:musicNotPaused');
export const MusicNotPlaying = T('preconditions:musicNotPlaying');
export const MusicQueueNotEmpty = T('preconditions:musicQueueNotEmpty');
export const MusicSameVoiceChannel = T('preconditions:musicSameVoiceChannel');
export const MusicUserVoiceChannel = T('preconditions:musicUserVoiceChannel');
export const Nsfw = FT<{ name: string }>('preconditions:nsfw');
export const PermNodes = T('preconditions:permNodes');
export const Starboard = T('preconditions:starboard');
