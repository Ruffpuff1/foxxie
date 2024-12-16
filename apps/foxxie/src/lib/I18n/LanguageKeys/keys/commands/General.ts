import type { Collection, Guild, GuildChannel } from 'discord.js';

import { FT, type HelpDisplayData, T } from '#lib/types';

export const AboutDescription = T('commands/general:aboutDescription');
export const AboutSummary = FT<{
	created: Date;
	privacy: string;
	userCount: number;
	version: string;
}>('commands/general:aboutSummary');

export const AvatarDescription = T('commands/general:avatarDescription');

export const DonateDescription = T('commands/general:donateDescription');
export const DonateHeader = T('commands/general:donateHeader');

export const HelpCategories = T<{
	admin: string;
	configuration: string;
	general: string;
	misc: string;
	moderation: string;
	websearch: string;
}>('commands/general:helpCategories');
export const HelpData = FT<{ footerName: string; titleDescription: string }, { footer: string; title: string }>('commands/general:helpData');
export const HelpDescription = T('commands/general:helpDescription');
export const HelpMenu = FT<{ name: string }>('commands/general:helpMenu');
export const HelpTitles = T<{ examples: string; usage: string }>('commands/general:helpTitles');
export const HelpUsage = T('commands/general:helpUsage');

export const InfoChannelArchived = FT<{ time: Date }>('commands/general:infoChannelArchived');
export const InfoChannelCreated = FT<{ date: Date; name: string }, string>('commands/general:infoChannelCreated');
export const InfoChannelTitles = T<{
	archived: string;
	bitrate: string;
	category: string;
	channels: string;
	cooldown: string;
	members: string;
	nsfw: string;
	topic: string;
	type: string;
	userLimit: string;
}>('commands/general:infoChannelTitles');
export const InfoDescription = T('commands/general:infoDescription');
export const InfoDescriptionChannel = T('commands/general:infoDescriptionChannel');
export const InfoDescriptionEmoji = T('commands/general:infoDescriptionEmoji');
export const InfoDescriptionRole = T('commands/general:infoDescriptionRole');
export const InfoDescriptionServer = T('commands/general:infoDescriptionServer');
export const InfoDescriptionUser = T('commands/general:infoDescriptionUser');
export const InfoEmojiCreated = FT<{ date: Date; name: string }>('commands/general:infoEmojiCreated');
export const InfoEmojiTitles = T<{
	animated: string;
	links: string;
	name: string;
}>('commands/general:infoEmojiTitles');
export const InfoEmojiTwemoji = FT<{ code: string; name: string }>('commands/general:infoEmojiTwemoji');
export const InfoRoleAllPerms = T('commands/general:infoRoleAllPerms');
export const InfoRoleHoist = T('commands/general:infoRoleHoist');
export const InfoRoleManaged = T('commands/general:infoRoleManaged');
export const InfoRoleMemberList = FT<{ bots: number; users: number }>('commands/general:infoRoleMemberList');
export const InfoRoleMentionable = FT<{ role: string }>('commands/general:infoRoleMentionable');
export const InfoRoleTitleMembers = FT<{ count: number }, string>('commands/general:infoRoleTitles.members');
export const InfoRoleTitlePerms = FT<{ count: number }, string>('commands/general:infoRoleTitles.perms');
export const InfoRoleTitles = T<{
	color: string;
	created: string;
	properties: string;
}>('commands/general:infoRoleTitles');
export const InfoRoleUnicodeEmoji = FT<{ emoji: string }, string>('commands/general:infoRoleUnicodeEmoji');
export const InfoServerChannels = FT<{ channels: Collection<string, GuildChannel> }, string>('commands/general:infoServerChannels');
export const InfoServerCreated = FT<{ created: Date; owner: string }, string>('commands/general:infoServerCreated');
export const InfoServerEmojis = FT<{ animated: number; static: number }, string>('commands/general:infoServerEmojis');
export const InfoServerMessages = FT<{ messages: number }, string>('commands/general:infoServerMessages');
export const InfoServerMembers = FT<{ cache: number; size: number }, string>('commands/general:infoServerMembers');
export const InfoServerRolesAndMore = FT<{ count: number }, string>('commands/general:infoServerRolesAndMore');
export const InfoServerSecurity = FT<
	{
		content: Guild['explicitContentFilter'];
		filter: Guild['verificationLevel'];
	},
	string
>('commands/general:infoServerSecurity');
export const InfoServerTitles = T<{
	members: string;
	security: string;
	stats: string;
}>('commands/general:infoServerTitles');
export const InfoServerTitlesChannels = FT<{ count: number }, string>('commands/general:infoServerTitles.channels');
export const InfoServerTitlesEmojis = FT<{ count: number }, string>('commands/general:infoServerTitles.emojis');
export const InfoServerTitlesRoles = FT<{ count: number }, string>('commands/general:infoServerTitles.roles');
export const InfoUserDiscordJoin = FT<{ created: Date }, string>('commands/general:infoUserDiscordJoin');
export const InfoUserGuildCreate = FT<{ joined: Date; name: string }, string>('commands/general:infoUserGuildCreate');
export const InfoUserGuildJoin = FT<{ joined: Date; name: string }, string>('commands/general:infoUserGuildJoin');
export const InfoUserMessages = FT<{ messages: number }, string>('commands/general:infoUserMessages');
export const InfoUserMessagesWithPercent = FT<{ messages: number; percent: string }>('commands/general:infoUserMessagesWithPercent');
export const InfoUserSelectMenu = T<[string, string]>('commands/general:infoUserSelectMenu');
export const InfoUserTitles = T<{
	about: string;
}>('commands/general:infoUserTitles');
export const InfoUserTitlesNotes = FT<{ count: number }, string>('commands/general:infoUserTitles.notes');
export const InfoUserTitlesRoles = FT<{ count: number }, string>('commands/general:infoUserTitles.roles');
export const InfoUserTitlesWarnings = FT<{ count: number }, string>('commands/general:infoUserTitles.warnings');

export const Ping = T('commands/general:ping');
export const PingDescription = T('commands/general:pingDescription');
export const PingPong = FT<{
	dbPing: number;
	roundTrip: number;
	wsPing: number;
}>('commands/general:pingPong');

export const StatsDescription = T('commands/general:statsDescription');
export const StatsDetailedDescription = T<HelpDisplayData>('commands/general:statsDetailedDescription');
export const StatsMenu = FT<
	{
		cpuCount: string;
		cpuSpeed: string;
		cpuUsage: string;
		deps: string[];
		memoryPercent: string;
		memoryUsed: string;
		process: string;
		shard: number;
		shardTotal: number;
		totalmemory: string;
		uptime: number;
	},
	string
>('commands/general:statsMenu');

export * from './general/index.js';
