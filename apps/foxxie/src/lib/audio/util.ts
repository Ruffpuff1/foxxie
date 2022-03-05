import type { VoiceChannel } from 'discord.js';
import type { Song } from './types';
import { Nullish, isNullish } from '@sapphire/utilities';

export function serializeEntry(value: Song): string {
    return `${value.author} ${value.track}`;
}

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
export function getListenerCount(channel: VoiceChannel | Nullish): number {
    if (isNullish(channel)) return 0;

    let count = 0;
    for (const member of channel.members.values()) {
        if (!member.user.bot && !member.voice.deaf) ++count;
    }

    return count;
}
