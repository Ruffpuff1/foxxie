import { DiscordAPIError } from 'discord.js';

export function channelLink<G extends string, C extends string>(guildId: G, channelId: C): `https://discord.com/channels/${G}/${C}` {
    return `https://discord.com/channels/${guildId}/${channelId}`;
}

/**
 * Formats a message url link.
 * @param guildId The Guildid of the message
 * @param channelId The channelId of the message
 * @param messageId The id of the message
 * @returns string
 */
export function messageLink<G extends string, C extends string, M extends string>(guildId: G, channelId: C, messageId: M): `https://discord.com/channels/${G}/${C}/${M}` {
    return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
}

/**
 * Transforms a Discord APi Error code into a usable error language key.
 * @param error {@link DiscordAPIError} The Discord API error.
 * @returns The i18next key for the error message.
 */
export function handleDiscordAPIError(error: Error): {
    identifier: string;
    message: string;
} {
    if (error instanceof DiscordAPIError) {
        const identifier = '';

        switch (error.code) {
            default:
                return { identifier, message: error.message };
        }
    } else {
        return { identifier: '', message: error.message };
    }
}
