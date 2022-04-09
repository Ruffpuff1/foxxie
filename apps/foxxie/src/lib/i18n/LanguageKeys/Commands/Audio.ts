import type { HelpDisplayData } from '#lib/types';
import { FT, T } from '@foxxie/i18n';
import type { ChannelMention } from 'discord.js';

export const DisconnectDescription = T('commands/audio:disconnectDescription');
export const DisconnectDetailedDescription = T<HelpDisplayData>('commands/audio:disconnectDetailedDescription');
export const DisconnectSuccess = FT<{ channel: ChannelMention }>('commands/audio:disconnectSuccess');
export const PlayAlreadyPlaying = T('commands/audio:playAlreadyPlaying');
export const PlayDescription = T('commands/audio:playDescription');
export const PlayDetailedDescription = T<HelpDisplayData>('commands/audio:playDetailedDescription');
export const PlayNoSongs = T('commands/audio:playNoSongs');
export const PlayQueueEmpty = T('commands/audio:playQueueEmpty');
export const JoinDescription = T('commands/audio:joinDescription');
export const JoinDetailedDescription = T<HelpDisplayData>('commands/audio:joinDetailedDescription');
export const JoinFailed = T('commands/audio:joinFailed');
export const JoinSuccess = FT<{ channel: ChannelMention }>('commands/audio:joinSuccess');
export const JoinVoiceChannelFull = T('commands/audio:joinVoiceChannelFull');
export const JoinVoiceChannelNoConnect = T('commands/audio:joinVoiceChannelNoConnect');
export const JoinVoiceChannelNoSpeak = T('commands/audio:joinVoiceChannelNoSpeak');
export const JoinVoiceDifferent = T('commands/audio:joinVoiceDifferent');
export const JoinVoiceSame = T('commands/audio:joinVoiceSame');
export const SavequeueAlreadyExists = FT<{ name: string }>('commands/audio:savequeueAlreadyExists');
export const SavequeueDescription = T('commands/audio:savequeueDescription');
export const SavequeueDetailedDescription = T<HelpDisplayData>('commands/audio:savequeueDetailedDescription');
export const SavequeueListNone = T('commands/audio:savequeueListNone');
export const SavequeueSuccess = FT<{ name: string }>('commands/audio:savequeueSuccess');
export const SkipDescription = T('commands/audio:skipDescription');
export const SkipDetailedDescription = T<HelpDisplayData>('commands/audio:skipDetailedDescription');
export const SkipSuccess = T('commands/audio:skipSuccess');
export const ShuffleDescription = T('commands/audio:shuffleDescription');
export const ShuffleDetailedDescription = T<HelpDisplayData>('commands/audio:shuffleDetailedDescription');
export const ShuffleSuccess = T('commands/audio:shuffleSuccess');
