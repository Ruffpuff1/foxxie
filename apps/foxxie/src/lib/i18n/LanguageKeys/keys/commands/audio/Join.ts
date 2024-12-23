import { LanguageHelpDisplayOptions } from '#lib/i18n/LanguageHelp';
import { FT, T } from '#lib/types';
import { ChannelMention } from 'discord.js';

export const Description = T('commands/audio/join:description');
export const DetailedDescription = T<LanguageHelpDisplayOptions>('commands/audio/join:detailedDescription');
export const Failed = T('commands/audio/join:failed');
export const Success = FT<{ channel: ChannelMention }>('commands/audio/join:success');
export const VoiceChannelFull = T('commands/audio/join:voiceChannelFull');
export const VoiceChannelNoConnect = T('commands/audio/join:voiceChannelNoConnect');
export const VoiceChannelNoSpeak = T('commands/audio/join:voiceChannelNoSpeak');
export const VoiceDifferent = T('commands/audio/join:voiceDifferent');
export const VoiceSame = T('commands/audio/join:voiceSame');
