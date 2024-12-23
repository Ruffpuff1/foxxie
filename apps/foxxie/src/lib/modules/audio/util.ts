import type { VoiceChannel } from 'discord.js';

import { isNullish, Nullish } from '@sapphire/utilities';

import { Song } from './types.js';

export function deserializeEntry(value: string): Song {
	const index = value.indexOf(' ');
	const author = value.substring(0, index);
	const track = value.substring(index + 1);
	return { author, track };
}

/**
 * @license Apache License 2.0
 * @copyright 2019 Skyra Project
 */
export function getListenerCount(channel: Nullish | VoiceChannel): number {
	if (isNullish(channel)) return 0;

	let count = 0;
	for (const member of channel.members.values()) {
		if (!member.user.bot && !member.voice.deaf) ++count;
	}

	return count;
}

export function serializeEntry(value: Song): string {
	return `${value.author} ${value.track}`;
}
