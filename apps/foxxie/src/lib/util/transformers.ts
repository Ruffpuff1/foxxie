import { cast } from '@sapphire/utilities';
import { CustomGet } from '#lib/types';
import { DiscordAPIError, RESTJSONErrorCodes } from 'discord.js';

export function channelLink<G extends string, C extends string>(guildId: G, channelId: C): `https://discord.com/channels/${G}/${C}` {
	return `https://discord.com/channels/${guildId}/${channelId}`;
}

/**
 * Transforms a Discord APi Error code into a usable error language key.
 * @param error {@link DiscordAPIError} The Discord API error.
 * @returns The i18next key for the error message.
 */
export function handleDiscordAPIError(error: DiscordAPIError | Error): {
	identifier: '' | CustomGet<string, string>;
	message: string;
} {
	let identifier: '' | CustomGet<string, string> = '';

	if (error instanceof DiscordAPIError) {
		switch (cast<RESTJSONErrorCodes>(error.code)) {
			case RESTJSONErrorCodes.UnknownUser:
				identifier = '';
		}
	}

	return { identifier, message: error.message };
}

/**
 * Formats a message url link.
 * @param guildId The Guildid of the message
 * @param channelId The channelId of the message
 * @param messageId The id of the message
 * @returns string
 */
export function messageLink<G extends string, C extends string, M extends string>(
	guildId: G,
	channelId: C,
	messageId: M
): `https://discord.com/channels/${G}/${C}/${M}` {
	return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
}
