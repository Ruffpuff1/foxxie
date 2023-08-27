import { api } from '#external/Api';
import { acquireSettings } from '#lib/database';
import { GuildMessage } from '#lib/types';
import { isNumber, isThenable } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { APIUser } from 'discord-api-types/v10';
import { Message, SnowflakeUtil } from 'discord.js';
import { cpus, hostname, loadavg, totalmem } from 'node:os';

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

export async function resolveKey(message: GuildMessage, key: string, ...variables: any[]): Promise<string> {
    const guild = await acquireSettings(message.guild.id);
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
    return SnowflakeUtil.deconstruct(id as string).timestamp;
}

export async function fetchReactionUsers(channelId: string, messageId: string, reactions: string[]) {
    const users: Set<string> = new Set();
    let rawUsers: APIUser[] = [];

    for (const reaction of reactions) {
        do {
            rawUsers = await api()
                .channels(channelId)
                .messages(messageId)
                .reactions(reaction)
                .get({ query: { limit: 100, after: rawUsers.length ? rawUsers[rawUsers.length - 1].id : undefined } });
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

export const IMAGE_EXTENSION = /\.(bmp|jpe?g|png|gif|webp)$/i;

export function getAttachment(message: Message): ImageAttachment | null {
    if (message.attachments.size) {
        const attachment = message.attachments.find(att => IMAGE_EXTENSION.test(att.url));
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
        if (embed.type === 'image') {
            return {
                url: embed.thumbnail!.url,
                proxyURL: embed.thumbnail!.proxyURL!,
                height: embed.thumbnail!.height!,
                width: embed.thumbnail!.width!
            };
        }
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
