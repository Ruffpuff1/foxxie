import { FT, T } from '#lib/types';
import { GuildExplicitContentFilter, GuildVerificationLevel } from 'discord.js';

export const Description = T('commands/general/info:description');
export const Guild = T('commands/general/info:guild');
export const GuildCreated = FT<{ created: Date; owner: string }>('commands/general/info:guildCreated');
export const GuildEmojis = FT<{ animated: number; static: number }>('commands/general/info:guildEmojis');
export const GuildMessages = FT<{ messages: number }>('commands/general/info:guildMessages');
export const GuildRolesAndMore = FT<{ count: number }>('commands/general/info:guildRolesAndMore');
export const GuildSecurity = FT<{ content: GuildExplicitContentFilter; filter: GuildVerificationLevel }>('commands/general/info:guildSecurity');
export const GuildTitles = T<{
	members: string;
	security: string;
	stats: string;
}>('commands/general/info:guildTitles');
export const GuildTitlesChannels = FT<{ count: number }>('commands/general/info:guildTitles.channels');
export const GuildTitlesEmojis = FT<{ count: number }>('commands/general/info:guildTitles.emojis');
export const GuildTitlesRoles = FT<{ count: number }>('commands/general/info:guildTitles.roles');
export const Name = T('commands/general/info:name');
export const OptionsBanner = T('commands/general/info:optionsBanner');
export const OptionsNotes = T('commands/general/info:optionsNotes');
export const OptionsShow = T('commands/general/info:optionsShow');
export const OptionsUser = T('commands/general/info:optionsUser');
export const OptionsWarnings = T('commands/general/info:optionsWarnings');
export const User = T('commands/general/info:user');
export const UserDiscordJoin = FT<{ created: Date }>('commands/general/info:userDiscordJoin');
export const UserGuildJoin = FT<{ context?: 'create'; joined: Date; name: string }>('commands/general/info:userGuildJoin');
export const UserMessages = FT<{ context: 'percent'; messages: number; percent: string } | { messages: number }>(
	'commands/general/info:userMessages'
);
export const UserTitles = T<{
	about: string;
}>('commands/general/info:userTitles');
export const UserTitlesNotes = FT<{ count: number }, string>('commands/general/info:userTitles.notes');
export const UserTitlesRoles = FT<{ count: number }, string>('commands/general/info:userTitles.roles');
export const UserTitlesWarnings = FT<{ count: number }, string>('commands/general/info:userTitles.warnings');
