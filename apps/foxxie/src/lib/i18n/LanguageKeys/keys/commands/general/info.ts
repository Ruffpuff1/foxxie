import { FT, T } from '#lib/types';
import { GuildExplicitContentFilter, GuildVerificationLevel } from 'discord.js';

export const ServerCreated = FT<{ created: Date; owner: string }>('commands/general/info:serverCreated');
export const ServerEmojis = FT<{ animated: number; static: number }>('commands/general/info:serverEmojis');
export const ServerMessages = FT<{ messages: number }>('commands/general/info:serverMessages');
export const ServerRolesAndMore = FT<{ count: number }>('commands/general/info:serverRolesAndMore');
export const ServerSecurity = FT<{ content: GuildExplicitContentFilter; filter: GuildVerificationLevel }>('commands/general/info:serverSecurity');
export const ServerTitles = T<{
	members: string;
	security: string;
	stats: string;
}>('commands/general/info:serverTitles');
export const ServerTitlesChannels = FT<{ count: number }, string>('commands/general/info:serverTitles.channels');
export const ServerTitlesEmojis = FT<{ count: number }, string>('commands/general/info:serverTitles.emojis');
export const ServerTitlesRoles = FT<{ count: number }, string>('commands/general/info:serverTitles.roles');
