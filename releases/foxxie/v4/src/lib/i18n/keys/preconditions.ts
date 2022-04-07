import type { GuildMember } from 'discord.js';
import { FT, T } from '../../types';

export const audioNoMember = T('preconditions:audioNoMember');
export const audioNoVoiceChannel = FT<{ member: GuildMember }, string>('preconditions:audioNoVoiceChannel');

export const nsfw = FT<{ name: string }, string>('preconditions:nsfw');
export const permissions = FT<{ missing: string[] }, string>('preconditions:permissions');