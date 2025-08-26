import { FT, T } from '#lib/types';
import { RoleMention, UserMention } from 'discord.js';

export const BoostMessageDefault = T('listeners/events:boostMessageDefault');
export const GoodbyeDefault = T('listeners/events:goodbyeDefault');
export const HighlightAttachment = FT<{ url: string }>('listeners/events:highlightAttachment');
export const HighlightContentWord = FT<{ author: string; channel: string; word: string }>('listeners/events:highlightContentWord');
export const HighlightEmbed = FT<{ url: string }>('listeners/events:highlightEmbed');
export const HighlightJumpTo = T('listeners/events:highlightJumpTo');
export const HighlightTooLong = FT<{ url: string }>('listeners/events:highlightTooLong');
export const PointsMessages = FT<
	{
		guild: string;
		level: number;
		mention: UserMention;
		nick: string;
		user: string;
	},
	IterableIterator<string>
>('listeners/events:pointsMessages');
export const PointsRoleMessages = FT<
	{ guild: string; level: number; mention: UserMention; nick: string; role: RoleMention; user: string },
	IterableIterator<string>
>('listeners/events:pointsRoleMessages');

export const WelcomeDefault = T('listeners/events:welcomeDefault');
