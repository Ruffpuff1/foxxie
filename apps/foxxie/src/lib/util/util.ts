import makeRequest from '@aero/http';
import { isImageAttachment } from '@sapphire/discord.js-utilities';
import { ArgType, container } from '@sapphire/framework';
import { first } from '@sapphire/iterator-utilities/first';
import { SubcommandMapping } from '@sapphire/plugin-subcommands';
import { cast, isNullishOrEmpty, isNumber } from '@sapphire/utilities';
import { envParseString } from '@skyra/env-utilities';
import { DetailedDescription } from '#lib/types';
import { ScheduleEntry } from '#root/Core/structures/schedule/index';
import {
	APIUser,
	EmbedAuthorData,
	EmbedBuilder,
	GuildChannel,
	GuildMember,
	ImageURLOptions,
	makeURLSearchParams,
	Message,
	PermissionFlagsBits,
	RESTGetAPIChannelMessageReactionUsersResult,
	Routes,
	Snowflake,
	SnowflakeUtil,
	StickerFormatType,
	ThreadChannel,
	User,
	UserResolvable
} from 'discord.js';
import { hostname, totalmem } from 'node:os';

export interface ImageAttachment {
	height: number;
	proxyURL: string;
	url: string;
	width: number;
}

export interface MappedTask<T extends ScheduleEntry.TaskId = ScheduleEntry.TaskId> {
	data: ScheduleEntry.TaskData[T];
	id: number;
	name: T;
	time: Date;
}

export async function fetchReactionUsers(channelId: string, messageId: string, reactions: string[]) {
	const users: Set<string> = new Set();
	let rawUsers: APIUser[] = [];

	for (const reaction of reactions) {
		do {
			rawUsers = cast<RESTGetAPIChannelMessageReactionUsersResult>(
				await container.client.rest.get(Routes.channelMessageReaction(channelId, messageId, reaction), {
					query: makeURLSearchParams({
						after: rawUsers.length ? rawUsers[rawUsers.length - 1].id : undefined,
						limit: 100
					})
				})
			);
			for (const user of rawUsers) users.add(user.id);
		} while (rawUsers.length === 100);
	}

	return users;
}

export function fetchTasks<T extends ScheduleEntry.TaskId = ScheduleEntry.TaskId>(type: T, cb?: (task: MappedTask<T>) => boolean): MappedTask<T>[] {
	const cache = container.schedule.queue;
	const filtered = cache.filter((a) => Boolean(a)).filter((a) => a.taskId === type);

	const mapped = filtered.map((job) => ({
		data: job.data as ScheduleEntry.TaskData[T],
		id: job.id,
		name: job.taskId as T,
		time: new Date(job.time)
	}));

	return cb ? mapped.filter((task) => cb(task)) : mapped;
}

export function findTask<T extends ScheduleEntry.TaskId = ScheduleEntry.TaskId>(
	type: T,
	cb: (task: MappedTask<T>) => boolean
): MappedTask<T> | undefined {
	const tasks = fetchTasks(type);
	return tasks.find((task) => cb(task));
}

export function getContent(message: Message): null | string {
	if (message.content) return message.content;
	for (const embed of message.embeds) {
		if (embed.description) return embed.description;
		if (embed.fields.length) return embed.fields[0].value;
	}
	return null;
}

export function getDisplayAvatar(user: APIUser | User, options?: Readonly<ImageURLOptions>) {
	if (user.avatar === null) {
		const id = usesPomelo(user) ? Number(BigInt(user.id) >> 22n) % 6 : Number(user.discriminator) % 5;
		return container.client.rest.cdn.defaultAvatar(id);
	}

	return container.client.rest.cdn.avatar(user.id, user.avatar, { ...options, forceStatic: false });
}

export function getEmbedAuthor(user: APIUser | User, url?: string | undefined): EmbedAuthorData {
	return { iconURL: getDisplayAvatar(user, { size: 128 }), name: getTag(user), url };
}

export function getFullEmbedAuthor(user: APIUser | GuildMember | User, url?: string | undefined): EmbedAuthorData {
	return {
		iconURL: user instanceof GuildMember ? user.displayAvatarURL() : getDisplayAvatar(user, { size: 128 }),
		name: `${user instanceof GuildMember ? user.displayName : getTag(user)} (${user.id})`,
		url
	};
}

/**
 * Get the image url from a message.
 * @param message The Message instance to get the image url from
 */
export function getImage(message: Message): null | string {
	return first(getImages(message)) ?? null;
}

export function* getImages(message: Message): IterableIterator<string> {
	for (const attachment of message.attachments.values()) {
		if (isImageAttachment(attachment)) yield attachment.proxyURL ?? attachment.url;
	}

	for (const embed of message.embeds) {
		if (embed.image) {
			yield embed.image.proxyURL ?? embed.image.url;
		}

		if (embed.thumbnail) {
			yield embed.thumbnail.proxyURL ?? embed.thumbnail.url;
		}
	}

	for (const sticker of message.stickers.values()) {
		// Skip if the sticker is a lottie sticker:
		if (sticker.format === StickerFormatType.Lottie) continue;

		yield sticker.url;
	}
}

export function getTag(user: APIUser | User) {
	return usesPomelo(user) ? `${user.username}` : `${user.username}#${user.discriminator}`;
}

export function idToTimestamp(id: number | string): null | number {
	if (isNumber(id)) return null;
	return Number(SnowflakeUtil.deconstruct(cast<string>(id)).timestamp);
}

export function setMultipleEmbedImages(embed: EmbedBuilder, urls: string[]) {
	const embeds = [embed];
	let count = 0;
	for (const url of urls) {
		if (count === 0) {
			embed.setImage(url);
		} else {
			embeds.push(new EmbedBuilder().setImage(url));

			// We only want to send 4 embeds at most
			if (count === 3) break;
		}

		count++;
	}

	return embeds;
}

export function snowflakeAge(snowflake: string) {
	const { timestamp } = SnowflakeUtil.deconstruct(snowflake);
	return Math.max(Date.now() - Number(timestamp), 0);
}

/**
 * Checks whether or not the user uses the new username change, defined by the
 * `discriminator` being `'0'` or in the future, no discriminator at all.
 * @see {@link https://dis.gd/usernames}
 * @param user The user to check.
 */
export function usesPomelo(user: APIUser | User) {
	return isNullishOrEmpty(user.discriminator) || user.discriminator === '0';
}

/**
 * Validates that a user has VIEW_CHANNEL permissions to a channel
 * @param channel The TextChannel to check
 * @param user The user for which to check permission
 * @returns Whether the user has access to the channel
 * @example validateChannelAccess(channel, message.author)
 */
export function validateChannelAccess(channel: GuildChannel | ThreadChannel, user: UserResolvable) {
	return (channel.guild !== null && channel.permissionsFor(user)?.has(PermissionFlagsBits.ViewChannel)) || false;
}

export function xpNeeded(level: number) {
	// eslint-disable-next-line no-mixed-operators
	const f = (x: number) =>
		100 + Math.min(Math.max(0, 2 * (10 * ((x - 5) / 10 - Math.floor(1 / 2 + (x - 5) / 10)) ** 2 + 10 * Math.floor(x / 10) + x - 2.5)), 2000);
	return Math.ceil(f(level));
}

export const VIDEO_EXTENSION = /\.(mp4|mov)/i;

export const IMAGE_EXTENSION = /\.(bmp|jpe?g|png|gif|webp)/i;

export function getAttachment(message: Message): ImageAttachment | null {
	if (message.attachments.size) {
		const attachment = message.attachments.find((att) => IMAGE_EXTENSION.test(att.name ?? att.url) || VIDEO_EXTENSION.test(att.name ?? att.url));

		if (attachment) {
			return {
				height: attachment.height!,
				proxyURL: attachment.proxyURL,
				url: attachment.url,
				width: attachment.width!
			};
		}
	}

	for (const embed of message.embeds) {
		if (embed.image) {
			return {
				height: embed.image.height!,
				proxyURL: embed.image.proxyURL!,
				url: embed.image.url,
				width: embed.image.width!
			};
		}
	}

	return null;
}

export function getOption(commandName: string, name: string, description: DetailedDescription) {
	return description.subcommands?.find((command) => command.command === commandName)?.options?.find((opt) => opt.name === name) || null;
}

export function getSubcommand(name: string, description: DetailedDescription) {
	return description.subcommands?.find((command) => command.command === name);
}

/**
 * Tests for a condition, if the condition is false returns `null`, otherwise returns the parsed value.
 */
export function ifNotNull<T>(condition: boolean, value: T) {
	if (!condition) return null;
	return value;
}

export function isVideo(attachment: ImageAttachment | null) {
	return attachment ? VIDEO_EXTENSION.test(attachment.url) : false;
}

export function parseDescription(description: string | string[] | undefined) {
	if (!description) return null;
	return Array.isArray(description) ? description.join('\n') : description;
}

export const getUnionArg = async <K extends keyof ArgType, T>(cb: (opt: K) => Promise<T>, ...opts: K[]) => {
	let lastError: unknown;
	for (const opt of opts) {
		try {
			return await cb(opt);
		} catch (error) {
			lastError = error;
		}
	}

	throw lastError;
};

export async function fetchCommit() {
	return makeRequest('https://api.github.com/repos/Ruffpuff1/foxxie/commits/main') //
		.json()
		.then((data: any) => data.sha.substring(0, 7))
		.catch(() => null);
}

export function getServerDetails() {
	const totalmemory = ((totalmem() / 1024 / 1024 / 1024) * 1024).toFixed(0);
	const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
	return {
		memoryPercent: ((parseInt(memoryUsed, 10) / parseInt(totalmemory, 10)) * 100).toFixed(1),
		memoryUsed,
		process: hostname(),
		totalmemory,
		totalShards: container.client.options.shardCount || 1,
		uptime: new Date(Date.now() - container.client.uptime!),
		version: envParseString('VERSION_NUM')
	} as const;
}

/**
 * Checks if the provided user ID is the same as the client's ID.
 *
 * @param userId - The user ID to check.
 */
export function isUserSelf(userId: Snowflake) {
	return userId === process.env.CLIENT_ID;
}

export function joinCustomId(...args: unknown[]) {
	return args.map((a) => `${a}`).join('-');
}

export function mapSubcommandAliases(name: string, messageRun: string, isDefault: boolean, ...aliases: string[]): SubcommandMapping[] {
	const inital = { default: isDefault, messageRun, name };
	const mapped = aliases.map((a) => ({ messageRun, name: a }) as SubcommandMapping);
	return [inital, ...mapped];
}
