import { container } from '@sapphire/framework';
import { isNullish, toTitleCase } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { LoggerManager, ModerationManager } from '#lib/moderation';
import { StickyRoleManager } from '#lib/moderation/managers/StickyRoleManager';
import { StarboardManager } from '#lib/structures';
import { FTFunction } from '#lib/types';
import { GuildSecurity } from '#utils/security/GuildSecurity';
import { guildInvite } from '#utils/transformers';
import { Channel, ChannelType, Collection, EmbedAuthorOptions, type Guild, GuildEmoji, type GuildResolvable } from 'discord.js';

interface GuildUtilities {
	readonly logger: LoggerManager;
	readonly moderation: ModerationManager;
	readonly security: GuildSecurity;
	readonly starboard: StarboardManager;
	readonly stickyRoles: StickyRoleManager;
}

export const cache = new WeakMap<Guild, GuildUtilities>();

export function getGuildUtilities(resolvable: GuildResolvable): GuildUtilities {
	const guild = resolveGuild(resolvable);
	const previous = cache.get(guild);
	if (previous !== undefined) return previous;

	const entry: GuildUtilities = {
		logger: new LoggerManager(guild),
		moderation: new ModerationManager(guild),
		security: new GuildSecurity(guild),
		starboard: new StarboardManager(guild),
		stickyRoles: new StickyRoleManager(guild)
	};
	cache.set(guild, entry);

	return entry;
}

export const getLogger = getProperty('logger');
export const getModeration = getProperty('moderation');
export const getGuildStarboard = getProperty('starboard');
export const getSecurity = getProperty('security');
export const getStickyRoles = getProperty('stickyRoles');

const guildRoleLimit = 13;

export function formatGuildChannels(channels: Collection<string, Channel>, t: FTFunction): string {
	// text voice news threads
	let news = 0;
	let text = 0;
	let threads = 0;
	let voice = 0;

	for (const channel of channels.values()) {
		switch (channel.type) {
			case ChannelType.GuildStageVoice:
			case ChannelType.GuildVoice:
				voice++;
				continue;
			case ChannelType.GuildAnnouncement:
				news++;
				continue;
			case ChannelType.AnnouncementThread:
			case ChannelType.GuildText:
				text++;
				continue;
			case ChannelType.PrivateThread:
			case ChannelType.PublicThread:
				threads++;
				continue;
			case ChannelType.DM:
			case ChannelType.GroupDM:
			case ChannelType.GuildCategory:
			case ChannelType.GuildForum:
			case ChannelType.GuildMedia:
				continue;
		}
	}

	return [
		text ? t(LanguageKeys.Guilds.Channels.GuildText, { context: 'short', count: text }) : null,
		voice ? t(LanguageKeys.Guilds.Channels.GuildVoice, { context: 'short', count: voice }) : null,
		news ? t(LanguageKeys.Guilds.Channels.GuildNews, { context: 'short', count: news }) : null,
		threads ? t(LanguageKeys.Guilds.Channels.GuildThread, { context: 'short', count: threads }) : null
	]
		.filter((a) => !isNullish(a))
		.join(', ');
}

export function formatGuildEmojis(
	animated: Collection<string, GuildEmoji>,
	nonAnimated: Collection<string, GuildEmoji>,
	hasEmojis: boolean,
	t: FTFunction
) {
	if (!hasEmojis) return toTitleCase(t(LanguageKeys.Globals.None));

	if (!animated.size || !nonAnimated.size) {
		return animated.size
			? t(LanguageKeys.Globals.NumberFormat, { value: animated.size })
			: t(LanguageKeys.Globals.NumberFormat, { value: nonAnimated.size });
	}

	return t(LanguageKeys.Commands.General.Info.GuildEmojis, { animated: animated.size, static: nonAnimated.size });
}

export function getEmojiData(guild: Guild) {
	const [animated, nonAnimated] = guild.emojis.cache.partition((emoji) => emoji.animated);
	return [animated, nonAnimated, guild.emojis.cache.size > 0] as const;
}

export function getGuildEmbedAuthor(guild: Guild): EmbedAuthorOptions {
	return {
		iconURL: guild.iconURL() ?? undefined,
		name: `${guild.name} (${guild.id})`,
		url: guild.vanityURLCode ? guildInvite(guild.vanityURLCode) : undefined
	};
}

export function getGuildRoles(guild: Guild, t: FTFunction) {
	const roles = [...guild.roles.cache.values()].sort((x, y) => Number(y.position > x.position) || Number(x.position === y.position) - 1);
	roles.pop();

	const size = roles.length;

	const mentions = roles //
		.slice(0, guildRoleLimit - 1)
		.map((role, i) =>
			role.name.startsWith('⎯⎯⎯')
				? `\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n`
				: size > guildRoleLimit
					? `${role.name},`
					: i === size - 1
						? `${t(LanguageKeys.Globals.And, { context: 'static' })} ${role.name}.`
						: `${role.name},`
		);

	return [...mentions, size > guildRoleLimit ? t(LanguageKeys.Commands.General.Info.GuildRolesAndMore, { count: size - guildRoleLimit }) : null]
		.filter((a) => !isNullish(a))
		.join(' ');
}

export function resolveGuild(resolvable: GuildResolvable): Guild {
	const guild = container.client.guilds.resolve(resolvable);
	if (guild === null) throw new TypeError(`${resolvable} resolved to null.`);

	return guild;
}

function getProperty<K extends keyof GuildUtilities>(property: K) {
	return (resolvable: GuildResolvable): GuildUtilities[K] => getGuildUtilities(resolvable)[property];
}
