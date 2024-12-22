import { FT, T } from '#lib/types';

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

export * from './general/index.js';
