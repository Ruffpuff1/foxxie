import { cast } from '@sapphire/utilities';
import { EmojiObject } from '#lib/types';

export type SerializedEmoji = { __TYPE__: 'SerializedEmoji' } & string;

export const defaultStarboardEmojis = ['⭐', '🌟', '✨', '💫'];

export function getEmojiString(emoji: EmojiObject): SerializedEmoji {
	if (emoji.id) return cast<SerializedEmoji>(`${emoji.animated ? 'a' : 's'}${emoji.id}`);
	return cast<SerializedEmoji>(encodeURIComponent(emoji.name!));
}

export function isStarboardEmoji(emojis: readonly string[], reacted: string): boolean {
	const combinedEmojis = [...emojis, ...defaultStarboardEmojis];
	if (combinedEmojis.includes(reacted.startsWith('%') ? decodeURIComponent(reacted) : reacted)) return true;
	return false;
}
