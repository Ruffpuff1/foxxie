import { FT, T } from '#lib/types';
import { MessageData } from '#modules/suggestions';
import { ChannelMention } from 'discord.js';

export const ComponentsAccept = T('commands/utility/suggestion:componentsAccept');
export const ComponentsArchive = T('commands/utility/suggestion:componentsArchive');
export const ComponentsConsider = T('commands/utility/suggestion:componentsConsider');
export const ComponentsCreateThread = T('commands/utility/suggestion:componentsCreateThread');
export const ComponentsDeny = T('commands/utility/suggestion:componentsDeny');
export const NewFailedToSend = FT<{ channel: ChannelMention }>('commands/utility/suggestion:newFailedToSend');
export const NewMessageContent = FT<MessageData>('commands/utility/suggestion:newMessageContent');
export const NewMessageEmbedTitle = FT<MessageData>('commands/utility/suggestion:newMessageEmbedTitle');
export const NewNotConfigured = T('commands/utility/suggestion:newNotConfigured');
export const NewSuccess = FT<{ id: string }>('commands/utility/suggestion:newSuccess');
export const ThreadChannelCreationFailure = T('commands/utility/suggestion:threadChannelCreationFailure');
export const ThreadMemberAddFailure = T('commands/utility/suggestion:threadMemberAddFailure');
