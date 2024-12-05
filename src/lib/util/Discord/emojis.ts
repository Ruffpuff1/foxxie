import { EmojiObject } from '#lib/types';
import { cast } from '@sapphire/utilities';

export type SerializedEmoji = string & { __TYPE__: 'SerializedEmoji' };

export const defaultStarboardEmojis = ['%E2%AD%90', encodeURIComponent('🌟'), encodeURIComponent('✨'), encodeURIComponent('💫')];

export function isStarboardEmoji(emojis: string[], reacted: string): boolean {
	const combinedEmojis = [...emojis, ...defaultStarboardEmojis];
	if (combinedEmojis.includes(reacted)) return true;
	return false;
}

export function getEmojiString(emoji: EmojiObject): SerializedEmoji {
	if (emoji.id) return cast<SerializedEmoji>(`${emoji.animated ? 'a' : 's'}${emoji.id}`);
	return cast<SerializedEmoji>(encodeURIComponent(emoji.name!));
}
