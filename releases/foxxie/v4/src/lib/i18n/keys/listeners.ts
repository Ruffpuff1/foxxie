import type { Track } from 'discord-player';
import { FT, T } from '../../types';

export const guildMemberAddGreetingDefault = T('listeners:guildMemberAddGreetingDefault');

export const guildMemberRemoveFarewellDefault = T('listeners:guildMemberRemoveFarewellDefault');

export const highlightAttachment = FT<{ url: string }, string>('listeners:highlightAttachment');
export const highlightClickToJump = T('listeners:highlightClickToJump');
export const highlightContentRegex = FT<{ regex: string, author: string, channel: string }, string>('listeners:highlightContentRegex');
export const highlightContentWord = FT<{ word: string, author: string, channel: string }, string>('listeners:highlightContentWord');
export const highlightEmbed = FT<{ url: string }, string>('listeners:highlightEmbed');
export const highlightSize = FT<{ url: string }, string>('listeners:highlightSize');

export const messageBoostDefault = FT<{ emoji: string }, string>('listeners:messageBoostDefault');
export const messageBoostTitle = T('listeners:messageBoostTitle');

export const pointsMessages = T<ArrayConstructor>('listeners:pointsMessages');
export const pointsRoleMessages = T<ArrayConstructor>('listeners:pointsRoleMessages');

export const starboardJumpTo = T('listeners:starboardJumpTo');

export const trackAddInfo = FT<{ track: Track }, string>('listeners:trackAddInfo');
export const trackStartInfo = FT<{ track: Track }, string>('listeners:trackStartInfo');
