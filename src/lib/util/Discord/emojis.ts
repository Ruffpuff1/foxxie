import { EmojiObject } from '#lib/types';
import { cast } from '@sapphire/utilities';

export type SerializedEmoji = string & { __TYPE__: 'SerializedEmoji' };

export const defaultStarboardEmojis = ['⭐', '🌟', '✨', '💫'];

export function isStarboardEmoji(emojis: readonly string[], reacted: string): boolean {
	const combinedEmojis = [...emojis, ...defaultStarboardEmojis];
	if (combinedEmojis.includes(reacted.startsWith('%') ? decodeURIComponent(reacted) : reacted)) return true;
	return false;
}

export function getEmojiString(emoji: EmojiObject): SerializedEmoji {
	if (emoji.id) return cast<SerializedEmoji>(`${emoji.animated ? 'a' : 's'}${emoji.id}`);
	return cast<SerializedEmoji>(encodeURIComponent(emoji.name!));
}
