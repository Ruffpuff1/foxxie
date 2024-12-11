import { DetailedDescription, GuildMessage } from '#lib/types';
import { ArgType, container } from '@sapphire/framework';
import { cast, isNullishOrEmpty, isNumber, isThenable } from '@sapphire/utilities';
import {
	APIEmbedField,
	APIUser,
	ChatInputCommandInteraction,
	ColorResolvable,
	EmbedAuthorData,
	GuildResolvable,
	ImageURLOptions,
	makeURLSearchParams,
	Message,
	RESTGetAPIChannelMessageReactionUsersResult,
	Routes,
	Snowflake,
	SnowflakeUtil,
	User
} from 'discord.js';
import { ScheduleEntry } from '#lib/schedule';
import { cpus, hostname, loadavg, totalmem } from 'node:os';
import { readSettings } from '#lib/database';
import { BrandingColors } from './constants.js';
import { resolveToNull } from '@ruffpuff/utilities';

/**
 * Checks whether or not the user uses the new username change, defined by the
 * `discriminator` being `'0'` or in the future, no discriminator at all.
 * @see {@link https://dis.gd/usernames}
 * @param user The user to check.
 */
export function usesPomelo(user: User | APIUser) {
	return isNullishOrEmpty(user.discriminator) || user.discriminator === '0';
}

export function getDisplayAvatar(user: User | APIUser, options?: Readonly<ImageURLOptions>) {
	if (user.avatar === null) {
		const id = usesPomelo(user) ? Number(BigInt(user.id) >> 22n) % 6 : Number(user.discriminator) % 5;
		return container.client.rest.cdn.defaultAvatar(id);
	}

	return container.client.rest.cdn.avatar(user.id, user.avatar, { ...options, forceStatic: false });
}

export function getTag(user: User | APIUser) {
	return usesPomelo(user) ? `${user.username}` : `${user.username}#${user.discriminator}`;
}

export function getEmbedAuthor(user: User | APIUser, url?: string | undefined): EmbedAuthorData {
	return { name: getTag(user), iconURL: getDisplayAvatar(user, { size: 128 }), url };
}

export function getFullEmbedAuthor(user: User | APIUser, url?: string | undefined): EmbedAuthorData {
	return { name: `${getTag(user)} [${user.id}]`, iconURL: getDisplayAvatar(user, { size: 128 }), url };
}

/**
 * Attaches a logging catch method to a promise, "floating it".
 * @param promise The promise to float.
 */
export function floatPromise(promise: Promise<unknown>) {
	if (isThenable(promise))
		promise.catch((error: Error) => {
			container.logger.debug(error);
		});
	return promise;
}

export async function resolveKey(message: GuildMessage | ChatInputCommandInteraction, key: string, ...variables: any[]): Promise<string> {
	const guild = await readSettings(message instanceof Message ? message.guild.id : message.guildId!);
	const result = container.i18n.getT(guild.language)(key, { ...variables });

	return result;
}

export function fetchTasks<T extends ScheduleEntry.TaskId = ScheduleEntry.TaskId>(type: T): MappedTask<T>[] {
	const cache = container.schedule.queue;

	const filtered = cache.filter((a) => Boolean(a)).filter((a) => a.taskId === type);

	return filtered.map((job) => ({
		id: job.id,
		time: new Date(job.time),
		data: job.data as ScheduleEntry.TaskData[T],
		name: job.taskId as T
	}));
}

export interface MappedTask<T extends ScheduleEntry.TaskId = ScheduleEntry.TaskId> {
	id: number;
	time: Date;
	data: ScheduleEntry.TaskData[T];
	name: T;
}

export function getServerDetails() {
	const totalmemory = ((totalmem() / 1024 / 1024 / 1024) * 1024).toFixed(0);
	const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
	return {
		totalmemory,
		memoryUsed,
		memoryPercent: ((parseInt(memoryUsed, 10) / parseInt(totalmemory, 10)) * 100).toFixed(1),
		process: hostname(),
		cpuCount: cpus().length,
		cpuUsage: (loadavg()[0] * 10).toFixed(1),
		cpuSpeed: (cpus()[0].speed / 1000).toFixed(1),
		uptime: Date.now() - container.client.uptime!,
		version: process.env.CLIENT_VERSION!,
		totalShards: container.client.options.shardCount || 1
	};
}

export function idToTimestamp(id: string | number): number | null {
	if (isNumber(id)) return null;
	return Number(SnowflakeUtil.deconstruct(cast<string>(id)).timestamp);
}

export async function fetchReactionUsers(channelId: string, messageId: string, reactions: string[]) {
	const users: Set<string> = new Set();
	let rawUsers: APIUser[] = [];

	for (const reaction of reactions) {
		do {
			rawUsers = cast<RESTGetAPIChannelMessageReactionUsersResult>(
				await container.client.rest.get(Routes.channelMessageReaction(channelId, messageId, reaction), {
					query: makeURLSearchParams({
						limit: 100,
						after: rawUsers.length ? rawUsers[rawUsers.length - 1].id : undefined
					})
				})
			);
			for (const user of rawUsers) users.add(user.id);
		} while (rawUsers.length === 100);
	}

	return users;
}

export function snowflakeAge(snowflake: string) {
	const { timestamp } = SnowflakeUtil.deconstruct(snowflake);
	return Math.max(Date.now() - Number(timestamp), 0);
}

export interface ImageAttachment {
	url: string;
	proxyURL: string;
	height: number;
	width: number;
}

export const VIDEO_EXTENSION = /\.(mp4|mov)/i;

export const IMAGE_EXTENSION = /\.(bmp|jpe?g|png|gif|webp)/i;

export function isVideo(attachment: ImageAttachment | null) {
	return attachment ? VIDEO_EXTENSION.test(attachment.url) : false;
}

export function getAttachment(message: Message): ImageAttachment | null {
	if (message.attachments.size) {
		const attachment = message.attachments.find((att) => IMAGE_EXTENSION.test(att.url) || VIDEO_EXTENSION.test(att.url));
		if (attachment) {
			return {
				url: attachment.url,
				proxyURL: attachment.proxyURL,
				height: attachment.height!,
				width: attachment.width!
			};
		}
	}

	for (const embed of message.embeds) {
		if (embed.image) {
			return {
				url: embed.image.url,
				proxyURL: embed.image.proxyURL!,
				height: embed.image.height!,
				width: embed.image.width!
			};
		}
	}

	return null;
}

/**
 * Get the image url from a message.
 * @param message The Message instance to get the image url from
 */
export function getImage(message: Message): string | null {
	const attachment = getAttachment(message);
	return attachment ? attachment.proxyURL || attachment.url : null;
}

export async function resolveClientColor(
	resolveable: GuildResolvable | Message | null | ChatInputCommandInteraction,
	color?: ColorResolvable | number
): Promise<ColorResolvable> {
	if (!resolveable) return BrandingColors.Primary;

	if (resolveable instanceof Message) {
		if (resolveable.inGuild()) {
			const { member } = resolveable;
			if (member) {
				const memberColor = member.roles.highest.color;
				if (memberColor) return memberColor;
			} else {
				const { maybeMe } = container.utilities.guild(resolveable.guild);
				if (!maybeMe) return BrandingColors.Primary;

				return maybeMe.displayColor;
			}
		} else {
			return BrandingColors.Primary;
		}
	} else if (resolveable instanceof ChatInputCommandInteraction) {
		if (resolveable.inGuild()) {
			const fetchedMember = await resolveToNull(resolveable.guild!.members.fetch(resolveable.user.id!));
			if (fetchedMember) {
				const memberColor = fetchedMember.roles.highest.color;
				if (memberColor) return memberColor;
			} else {
				const { maybeMe } = container.utilities.guild(resolveable.guild!);
				if (!maybeMe) return color || BrandingColors.Primary;

				return maybeMe.displayColor;
			}
		}
	}
	const { maybeMe } = container.utilities.guild(
		resolveable instanceof Message || resolveable instanceof ChatInputCommandInteraction ? resolveable.guild! : resolveable
	);
	if (!maybeMe) return color || BrandingColors.Primary;

	return maybeMe.displayColor;
}

export function resolveEmbedField(name: string, text: string, inline: boolean = false): APIEmbedField {
	return { name, value: text, inline };
}

export function removeEmptyFields(fields: (APIEmbedField | null | undefined)[]): APIEmbedField[] {
	return fields.filter((field) => Boolean(field)) as APIEmbedField[];
}

/**
 * Returns a conditional embed field.
 */
export function conditionalField(condition: boolean, name: string, text: string, inline: boolean = false) {
	return ifNotNull(condition, { name, value: text, inline });
}

/**
 * Tests for a condition, if the condition is false returns `null`, otherwise returns the parsed value.
 */
export function ifNotNull<T>(condition: boolean, value: T) {
	if (!condition) return null;
	return value;
}

export function getSubcommand(name: string, description: DetailedDescription) {
	return description.subcommands?.find((command) => command.command === name);
}

export function getOption(commandName: string, name: string, description: DetailedDescription) {
	return description.subcommands?.find((command) => command.command === commandName)?.options?.find((opt) => opt.name === name) || null;
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

/**
 * Checks if the provided user ID is the same as the client's ID.
 *
 * @param userId - The user ID to check.
 */
export function isUserSelf(userId: Snowflake) {
	return userId === process.env.CLIENT_ID;
}
