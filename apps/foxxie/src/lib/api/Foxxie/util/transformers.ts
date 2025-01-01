import type {
	Channel,
	ChannelType,
	DMChannel,
	Guild,
	GuildChannel,
	GuildMember,
	NewsChannel,
	PermissionOverwrites,
	Role,
	TextChannel,
	ThreadChannel,
	ThreadChannelType,
	User,
	VoiceChannel
} from 'discord.js';

import {
	isDMChannel,
	isGuildBasedChannelByGuildKey,
	isNewsChannel,
	isTextChannel,
	isThreadChannel,
	isVoiceChannel
} from '@sapphire/discord.js-utilities';

// #region Guild

export interface FlattenedChannel {
	createdTimestamp: number;
	id: string;
	type: ChannelType;
}

export interface FlattenedDMChannel extends FlattenedChannel {
	recipient: null | string;
	type: ChannelType.DM;
}

// #endregion Guild

// #region Role

export interface FlattenedGuild
	extends Pick<
		Guild,
		| 'afkChannelId'
		| 'afkTimeout'
		| 'applicationId'
		| 'approximateMemberCount'
		| 'approximatePresenceCount'
		| 'available'
		| 'banner'
		| 'defaultMessageNotifications'
		| 'description'
		| 'explicitContentFilter'
		| 'features'
		| 'icon'
		| 'id'
		| 'joinedTimestamp'
		| 'mfaLevel'
		| 'name'
		| 'ownerId'
		| 'partnered'
		| 'preferredLocale'
		| 'premiumSubscriptionCount'
		| 'premiumTier'
		| 'splash'
		| 'systemChannelId'
		| 'vanityURLCode'
		| 'verificationLevel'
		| 'verified'
		| 'widgetEnabled'
	> {
	channels: FlattenedGuildChannel[];

	roles: FlattenedRole[];
}

export interface FlattenedGuildChannel extends FlattenedChannel {
	guildId: string;
	name: string;
	parentId: null | string;
	permissionOverwrites: [string, PermissionOverwrites][];
	rawPosition: number;
	type: ChannelType;
}

// #endregion Role

// #region Channel

export interface FlattenedMember {
	guildId: string;

	id: string;

	joinedTimestamp: null | number;

	premiumSinceTimestamp: null | number;

	roles: FlattenedRole[];

	user: FlattenedUser;
}
export interface FlattenedNewsChannel extends FlattenedGuildChannel {
	nsfw: boolean;
	topic: null | string;
	type: ChannelType.GuildAnnouncement;
}
export interface FlattenedNewsThreadChannel extends FlattenedChannel {
	type: ChannelType.AnnouncementThread;
}
export interface FlattenedPrivateThreadChannel extends FlattenedChannel {
	type: ChannelType.PrivateThread;
}
export interface FlattenedPublicThreadChannel extends FlattenedChannel {
	type: ChannelType.PublicThread;
}
export interface FlattenedRole {
	color: number;

	guildId: string;

	hoist: boolean;

	id: string;

	managed: boolean;

	mentionable: boolean;

	name: string;

	permissions: string;

	rawPosition: number;
}
export interface FlattenedTextChannel extends FlattenedGuildChannel {
	nsfw: boolean;
	rateLimitPerUser: number;
	topic: null | string;
	type: ChannelType.GuildText;
}

export interface FlattenedThreadChannel extends Pick<FlattenedGuildChannel, 'createdTimestamp' | 'id'> {
	archived: boolean;
	archivedTimestamp: null | number;
	guildId: string;
	name: string;
	parentId: null | string;
	permissionOverwrites: [string, PermissionOverwrites][];
	rateLimitPerUser: null | number;
	rawPosition: null | number;
	type: ThreadChannelType;
}

export interface FlattenedUser {
	avatar: null | string;

	bot: boolean;

	discriminator: string;

	id: string;

	username: string;
}

export interface FlattenedVoiceChannel extends FlattenedGuildChannel {
	bitrate: number;
	type: ChannelType.GuildVoice;
	userLimit: number;
}

export function flattenChannel(channel: NewsChannel): FlattenedNewsChannel;

export function flattenChannel(channel: TextChannel): FlattenedTextChannel;

export function flattenChannel(channel: VoiceChannel): FlattenedVoiceChannel;

export function flattenChannel(channel: DMChannel): FlattenedDMChannel;

export function flattenChannel(channel: ThreadChannel): FlattenedThreadChannel;

export function flattenChannel(channel: Channel): FlattenedChannel;

export function flattenChannel(channel: Channel | ThreadChannel) {
	if (isThreadChannel(channel)) return flattenChannelThread(channel as ThreadChannel);
	if (isNewsChannel(channel)) return flattenChannelNews(channel as NewsChannel);
	if (isTextChannel(channel)) return flattenChannelText(channel as TextChannel);
	if (isVoiceChannel(channel)) return flattenChannelVoice(channel as VoiceChannel);
	if (isGuildBasedChannelByGuildKey(channel)) return flattenChannelGuild(channel as GuildChannel);
	if (isDMChannel(channel)) return flattenChannelDM(channel as DMChannel);
	return flattenChannelFallback(channel);
}

export function flattenGuild(guild: Guild): FlattenedGuild {
	return {
		afkChannelId: guild.afkChannelId,
		afkTimeout: guild.afkTimeout,
		applicationId: guild.applicationId,
		approximateMemberCount: guild.approximateMemberCount,
		approximatePresenceCount: guild.approximatePresenceCount,
		available: guild.available,
		banner: guild.banner,
		channels: guild.channels.cache.map(flattenChannel) as FlattenedGuildChannel[],
		defaultMessageNotifications: guild.defaultMessageNotifications,
		description: guild.description,
		explicitContentFilter: guild.explicitContentFilter,
		features: guild.features,
		icon: guild.icon,
		id: guild.id,
		joinedTimestamp: guild.joinedTimestamp,
		mfaLevel: guild.mfaLevel,
		name: guild.name,
		ownerId: guild.ownerId,
		partnered: guild.partnered,
		preferredLocale: guild.preferredLocale,
		premiumSubscriptionCount: guild.premiumSubscriptionCount,
		premiumTier: guild.premiumTier,
		roles: guild.roles.cache.map(flattenRole),
		splash: guild.splash,
		systemChannelId: guild.systemChannelId,
		vanityURLCode: guild.vanityURLCode,
		verificationLevel: guild.verificationLevel,
		verified: guild.verified,
		widgetEnabled: guild.widgetEnabled
	};
}

export function flattenMember(member: GuildMember): FlattenedMember {
	return {
		guildId: member.guild.id,
		id: member.id,
		joinedTimestamp: member.joinedTimestamp,
		premiumSinceTimestamp: member.premiumSinceTimestamp,
		roles: member.roles.cache.map(flattenRole),
		user: flattenUser(member.user)
	};
}

export function flattenRole(role: Role): FlattenedRole {
	return {
		color: role.color,
		guildId: role.guild.id,
		hoist: role.hoist,
		id: role.id,
		managed: role.managed,
		mentionable: role.mentionable,
		name: role.name,
		permissions: role.permissions.bitfield.toString(),
		rawPosition: role.rawPosition
	};
}

export function flattenUser(user: User): FlattenedUser {
	return {
		avatar: user.avatar,
		bot: user.bot,
		discriminator: user.discriminator,
		id: user.id,
		username: user.username
	};
}

function flattenChannelDM(channel: DMChannel): FlattenedDMChannel {
	return {
		createdTimestamp: channel.createdTimestamp ?? 0,
		id: channel.id,
		recipient: channel.recipient?.id ?? null,
		type: channel.type as FlattenedDMChannel['type']
	};
}

function flattenChannelFallback(channel: Channel): FlattenedChannel {
	return {
		createdTimestamp: channel.createdTimestamp ?? 0,
		id: channel.id,
		type: channel.type as FlattenedChannel['type']
	};
}

function flattenChannelGuild(channel: GuildChannel): FlattenedGuildChannel {
	return {
		createdTimestamp: channel.createdTimestamp,
		guildId: channel.guild.id,
		id: channel.id,
		name: channel.name,
		parentId: channel.parentId,
		permissionOverwrites: [...channel.permissionOverwrites.cache.entries()],
		rawPosition: channel.rawPosition,
		type: channel.type as FlattenedGuildChannel['type']
	};
}

// #endregion Channel

// #region User

function flattenChannelNews(channel: NewsChannel): FlattenedNewsChannel {
	return {
		createdTimestamp: channel.createdTimestamp,
		guildId: channel.guild.id,
		id: channel.id,
		name: channel.name,
		nsfw: channel.nsfw,
		parentId: channel.parentId,
		permissionOverwrites: [...channel.permissionOverwrites.cache.entries()],
		rawPosition: channel.rawPosition,
		topic: channel.topic,
		type: channel.type
	};
}

function flattenChannelText(channel: TextChannel): FlattenedTextChannel {
	return {
		createdTimestamp: channel.createdTimestamp,
		guildId: channel.guild.id,
		id: channel.id,
		name: channel.name,
		nsfw: channel.nsfw,
		parentId: channel.parentId,
		permissionOverwrites: [...channel.permissionOverwrites.cache.entries()],
		rateLimitPerUser: channel.rateLimitPerUser,
		rawPosition: channel.rawPosition,
		topic: channel.topic,
		type: channel.type as FlattenedTextChannel['type']
	};
}

// #endregion User

// #region Member

function flattenChannelThread(channel: ThreadChannel): FlattenedThreadChannel {
	return {
		archived: channel.archived ?? false,
		archivedTimestamp: channel.archiveTimestamp,
		createdTimestamp: channel.createdTimestamp ?? 0,
		guildId: channel.guildId,
		id: channel.id,
		name: channel.name,
		parentId: channel.parentId,
		permissionOverwrites: [...(channel.parent?.permissionOverwrites.cache.entries() ?? [])],
		rateLimitPerUser: channel.rateLimitPerUser,
		rawPosition: channel.parent?.rawPosition ?? null,
		type: channel.type
	};
}

function flattenChannelVoice(channel: VoiceChannel): FlattenedVoiceChannel {
	return {
		bitrate: channel.bitrate,
		createdTimestamp: channel.createdTimestamp,
		guildId: channel.guild.id,
		id: channel.id,
		name: channel.name,
		parentId: channel.parentId,
		permissionOverwrites: [...channel.permissionOverwrites.cache.entries()],
		rawPosition: channel.rawPosition,
		type: channel.type as FlattenedVoiceChannel['type'],
		userLimit: channel.userLimit
	};
}

// #endregion Member
