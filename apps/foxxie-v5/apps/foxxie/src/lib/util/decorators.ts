import { createFunctionPrecondition } from '@sapphire/decorators';
import { acquireSettings, GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import type { GuildMessage } from '#lib/types';
import { getAudio, sendLocalizedMessage } from '#utils/Discord';
import { isNullish } from '@sapphire/utilities';

export function RequireLevelingEnabled(): MethodDecorator {
    return createFunctionPrecondition(
        async (message: GuildMessage) => (message.guild ? acquireSettings(message.guild, GuildSettings.Leveling.Enabled) : true),
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.Leveling)
    );
}

export function RequireStarboardEnabled(): MethodDecorator {
    return createFunctionPrecondition(
        async (message: GuildMessage) => Boolean(await acquireSettings(message.guild, GuildSettings.Starboard.Channel)),
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.Starboard)
    );
}

export function RequireUserInVoiceChannel(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => message.member.voice.channelId !== null,
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.MusicUserVoiceChannel)
    );
}

export function RequireFoxxieInVoiceChannel(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => message.guild.me!.voice.channelId !== null,
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.MusicFoxxieVoiceChannel)
    );
}

export function RequireQueueNotEmpty(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => getAudio(message.guild).canStart(),
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.MusicQueueNotEmpty)
    );
}

export function RequireSameVoiceChannel(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => message.member.voice.channelId === getAudio(message.guild).voiceChannelId,
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.MusicSameVoiceChannel)
    );
}

export function RequireSongPresent(): MethodDecorator {
    return createFunctionPrecondition(
        async (message: GuildMessage) => {
            const track = await getAudio(message.guild).getCurrentSong();
            return !isNullish(track);
        },
        async (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.MusicNothingPlaying)
    );
}

export function RequireMusicPlaying(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => getAudio(message.guild).playing,
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.MusicNotPlaying)
    );
}

export function RequireMusicPaused(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => getAudio(message.guild).paused,
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.MusicNotPaused)
    );
}
