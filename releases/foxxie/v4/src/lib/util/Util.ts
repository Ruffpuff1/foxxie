import type { Message, Guild } from 'discord.js';
import { languageKeys } from '../i18n';
import { randomArray } from '@ruffpuff/utilities';
import { fetchT } from '@sapphire/plugin-i18next';
import { hostname } from 'os';

const zws = '\u200B';

/**
 * Image extensions:
 * - bmp
 * - jpg
 * - jpeg
 * - png
 * - gif
 * - webp
 */
export const IMAGE_EXTENSION = /\.(bmp|jpe?g|png|gif|webp)$/i;

export interface ImageAttachment {
	url: string;
	proxyURL: string;
	height: number;
	width: number;
}

export const anyMentionRegExp = /<(@[!&]?|#)(\d{17,19})>/g;

/**
 * Get a image attachment from a message.
 * @param message The Message instance to get the image url from
 */
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

export function isOnServer(): boolean {
    return hostname() === process.env.PROD_HOST;
}

export function getContent(message: Message): null | string {
    if (message.content) return message.content;
    for (const embed of message.embeds) {
        if (embed.description) return embed.description;
        if (embed.fields.length) return embed.fields[0].value;
    }
    return null;
}

export async function sendLoading(msg: Message, key?: string): Promise<Message> {
    const t = await fetchT(msg);

    const langArr = t(key ?? languageKeys.system.messageLoading, { returnObjects: true });
    const picked = randomArray(t(key ?? languageKeys.system.messageLoading, { returnObjects: true }));
    const number = langArr.indexOf(picked);

    const content = t(key
        ? `${key}.${number}`
        : `${languageKeys.system.messageLoading}.${number}`, { returnObjects: true });
    return msg.channel.send({ content });
}

export function getAllContent(message: Message): string {
    const output = [];
    if (message.content) output.push(message.content);
    for (const embed of message.embeds) {
        if (embed.author?.name) output.push(`${embed.author.name}`);
        if (embed.title) output.push(`**${embed.title}**`);
        if (embed.description) output.push(embed.description);
        for (const field of embed.fields) {
            output.push(`${field.name}\n${field.value}`);
        }
        if (embed.footer?.text) output.push(embed.footer.text);
    }

    return output.join('\n');
}

/**
    * Clean all mentions from a body of text
    * @param guild The guild for context
    * @param input The input to clean
    * @returns The input cleaned of mentions
    * @license Apache-2.0
    * @copyright 2019 Antonio Román
    */
export function cleanMentions(guild: Guild, input: string): string {
    if (!(typeof input === 'string')) return input;
    return input.replace(/@(here|everyone)/g, `@${zws}$1`).replace(/<(@[!&]?|#)(\d{17,19})>/g, (match, type, id) => {
        switch (type) {
        case '@':
        case '@!': {
            const tag = guild.client.users.cache.get(id);
            return tag ? `@${tag.username}` : `<${type}${zws}${id}>`;
        }
        case '@&': {
            const role = guild.roles.cache.get(id);
            return role ? `@${role.name}` : match;
        }
        case '#': {
            const channel = guild.channels.cache.get(id);
            return channel ? `#${channel.name}` : `<${type}${zws}${id}>`;
        }
        default:
            return `<${type}${zws}${id}>`;
        }
    });
}