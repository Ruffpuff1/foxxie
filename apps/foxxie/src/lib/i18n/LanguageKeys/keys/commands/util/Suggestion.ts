import { FT, T } from '#lib/types';
import { MessageData } from '#modules/suggestions';
import { ChannelMention } from 'discord.js';

export const ComponentsAccept = T('commands/util/suggestion:componentsAccept');
export const ComponentsArchive = T('commands/util/suggestion:componentsArchive');
export const ComponentsConsider = T('commands/util/suggestion:componentsConsider');
export const ComponentsCreateThread = T('commands/util/suggestion:componentsCreateThread');
export const ComponentsDeny = T('commands/util/suggestion:componentsDeny');
export const NewFailedToSend = FT<{ channel: ChannelMention }>('commands/util/suggestion:newFailedToSend');
export const NewMessageContent = FT<MessageData>('commands/util/suggestion:newMessageContent');
export const NewMessageEmbedTitle = FT<MessageData>('commands/util/suggestion:newMessageEmbedTitle');
export const NewNotConfigured = T('commands/util/suggestion:newNotConfigured');
export const NewSuccess = FT<{ id: string }>('commands/util/suggestion:newSuccess');
export const ThreadChannelCreationFailure = T('commands/util/suggestion:threadChannelCreationFailure');
export const ThreadMemberAddFailure = T('commands/util/suggestion:threadMemberAddFailure');
