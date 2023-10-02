import { acquireSettings } from '#lib/Database';
import { DetailedDescription, GuildMessage } from '#lib/Types';
import { cast, isNumber, isThenable } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { APIUser } from 'discord-api-types/v10';
import {
    APIEmbedField,
    ChatInputCommandInteraction,
    ColorResolvable,
    GuildResolvable,
    Message,
    RESTGetAPIChannelMessageReactionUsersResult,
    Routes,
    SnowflakeUtil,
    makeURLSearchParams
} from 'discord.js';
import { cpus, hostname, loadavg, totalmem } from 'node:os';
import { BrandingColors } from './constants';

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

export async function resolveKey(
    message: GuildMessage | ChatInputCommandInteraction,
    key: string,
    ...variables: any[]
): Promise<string> {
    const guild = await acquireSettings(message instanceof Message ? message.guild.id : message.guildId!);
    const result = guild.getLanguage()(key, { ...variables });

    return result;
}

export function getServerDetails() {
    // eslint-disable-next-line @typescript-eslint/no-extra-parens
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

export const VIDEO_EXTENSION = /\.(mp4|mov)$/i;

export const IMAGE_EXTENSION = /\.(bmp|jpe?g|png|gif|webp)$/i;

export function isVideo(attachment: ImageAttachment | null) {
    return attachment ? VIDEO_EXTENSION.test(attachment.url) : false;
}

export function getAttachment(message: Message): ImageAttachment | null {
    if (message.attachments.size) {
        const attachment = message.attachments.find(att => IMAGE_EXTENSION.test(att.url) || VIDEO_EXTENSION.test(att.url));
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

export function resolveClientColor(resolveable: GuildResolvable | null, color?: ColorResolvable): ColorResolvable {
    if (color) return color;

    if (!resolveable) return BrandingColors.Primary;

    const { maybeMe } = container.utilities.guild(resolveable);
    if (!maybeMe) return BrandingColors.Primary;

    return maybeMe.displayColor;
}

export function resolveEmbedField(name: string, text: string, inline: boolean = false): APIEmbedField {
    return { name, value: text, inline };
}

export function removeEmptyFields(fields: (APIEmbedField | null | undefined)[]): APIEmbedField[] {
    return fields.filter(field => Boolean(field)) as APIEmbedField[];
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
    return description.subcommands?.find(command => command.command === name);
}

export function getOption(commandName: string, name: string, description: DetailedDescription) {
    return (
        description.subcommands?.find(command => command.command === commandName)?.options?.find(opt => opt.name === name) || null
    );
}

export function parseDescription(description: string | string[] | undefined) {
    if (!description) return null;
    return Array.isArray(description) ? description.join('\n') : description;
}
