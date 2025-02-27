import { formatEmoji } from '@discordjs/builders';
import { FormattedCustomEmojiWithGroups, TwemojiRegex } from '@sapphire/discord-utilities';
import { container } from '@sapphire/pieces';
import { isNullish } from '@sapphire/utilities';

// Based on the identifiers at https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/72x72/
export type EncodedTwemoji = 'a9' | 'ae' | 'e50a' | `${1 | 2 | 3}${string}`;

// Hacky workaround for codes Discord and Windows use that don't exist on Twemoji's CDN.
const TwemojiExceptions = {
	'\u2764\ufe0f': '2764' // (❤️)
} as Record<string, EncodedTwemoji>;

export interface EmojiObject extends EmojiObjectPartial {
	animated?: boolean;
}

export const defaultStarboardEmojis = ['⭐', '🌟', '✨', '💫'];

export type SerializedEmoji = { __TYPE__: 'SerializedEmoji' } & string;

interface EmojiObjectPartial {
	id: null | string;
	name: null | string;
}

export function getCustomEmojiUrl(id: string, animated: boolean) {
	return container.client.rest.cdn.emoji(id, { extension: animated ? 'gif' : 'png', size: 64 });
}

/**
 * Transforms the given emoji to a code point string that can be used for the CDN.
 * @param emoji The emoji to encode
 * @example
 * ```typescript
 * twemoji('😃');
 * // → '1f603'
 * ```
 */
export function getEncodedTwemoji(emoji: string): EncodedTwemoji {
	return TwemojiExceptions[emoji] ?? [...emoji].map((point) => point.codePointAt(0)!.toString(16)).join('-');
}

/**
 * Gets the CDN URL for a Twemoji.
 * @param emoji The encoded Twemoji to use.
 */
export function getTwemojiUrl<E extends EncodedTwemoji>(emoji: E) {
	return `https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/72x72/${emoji}.png` as const;
}

export function isStarboardEmoji(emojis: readonly string[], reacted: string): boolean {
	const combinedEmojis = [...emojis, ...defaultStarboardEmojis];
	if (combinedEmojis.includes(reacted.startsWith('%') ? decodeURIComponent(reacted) : reacted)) return true;
	return false;
}

const customEmojiRegExp = /^[as]\d{17,19}$/;

/**
 * Gets the ID of the emoji.
 * This is the input for URL encoded Twemojis or the ID of the emoji for custom ones
 */
export function getEmojiId(emoji: SerializedEmoji): string {
	return isSerializedTwemoji(emoji) ? emoji : emoji.slice(1);
}

/**
 * Formats an emoji into an {@link EmojiObject}.
 */
export function getEmojiObject(emoji: string): EmojiObject | null {
	if (isValidTwemoji(emoji)) {
		return {
			id: null,
			name: emoji
		};
	}

	const emojiProperties = FormattedCustomEmojiWithGroups.exec(emoji)!;

	if (isNullish(emojiProperties?.groups)) return null;

	return {
		animated: Boolean(emojiProperties.groups.animated),
		id: emojiProperties.groups.id,
		name: emojiProperties.groups.name
	};
}

/**
 * Formats an emoji in the format that we can use to for reactions on Discord messages.
 */
export function getEmojiReactionFormat(emoji: SerializedEmoji): string {
	return isSerializedTwemoji(emoji) ? decodeURIComponent(emoji) : `emoji:${emoji.slice(1)}`;
}

/**
 * Formats an emoji in the format that we can store in the database.
 */
export function getEmojiString(emoji: EmojiObject): SerializedEmoji {
	if (emoji.id) return `${emoji.animated ? 'a' : 's'}${emoji.id}` as SerializedEmoji;
	return encodeURIComponent(emoji.name!) as SerializedEmoji;
}

/**
 * Formats an emoji so it can be displayed in a Discord message.
 */
export function getEmojiTextFormat(emoji: SerializedEmoji): string {
	return isSerializedTwemoji(emoji) ? decodeURIComponent(emoji) : formatEmoji(emoji.slice(1), emoji.startsWith('a') as true | undefined);
}

/**
 * Checks whether a serialized emoji is a serialized twemoji.
 * @param emoji Checks whether or not the serialized emoji is a serialized twemoji.
 */
export function isSerializedTwemoji(emoji: SerializedEmoji) {
	return emoji.includes('%');
}

export function isValidCustomEmoji(emoji: string) {
	return FormattedCustomEmojiWithGroups.test(emoji);
}

/**
 * Checks whether or not the emoji is a valid serialized custom emoji. Checks whether it starts with either `a` or `s`,
 * followed by 17 to 19 numeric digits.
 * @param emoji The emoji to validate.
 */
export function isValidSerializedCustomEmoji(emoji: string): emoji is SerializedEmoji {
	return customEmojiRegExp.test(emoji);
}

export function isValidSerializedEmoji(emoji: string): emoji is SerializedEmoji {
	return isSerializedTwemoji(emoji as SerializedEmoji) ? isValidSerializedTwemoji(emoji) : isValidSerializedCustomEmoji(emoji);
}

/**
 * Checks whether or not the emoji is a valid serialized twemoji. This method is an alias of {@link isValidTwemoji} with
 * {@link decodeURIComponent}.
 * @param emoji The emoji to validate.
 */
export function isValidSerializedTwemoji(emoji: string): emoji is SerializedEmoji {
	return isValidTwemoji(decodeURIComponent(emoji));
}

/**
 * Checks whether or not the emoji is a valid twemoji.
 * @param emoji The emoji to validate.
 */
export function isValidTwemoji(emoji: string) {
	return TwemojiRegex.test(emoji);
}

/**
 * Resolves an emoji either from a database emoji, or a Discord {@link EmojiObject}.
 */
export function resolveEmojiId(emoji: EmojiObject | SerializedEmoji): string {
	if (isNullish(emoji)) return '';

	return typeof emoji === 'string' ? getEmojiId(emoji) : (emoji.id ?? encodeURIComponent(emoji.name!));
}
