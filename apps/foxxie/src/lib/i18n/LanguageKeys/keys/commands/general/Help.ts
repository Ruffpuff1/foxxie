import { FT, T } from '#lib/types';

export const Aliases = FT<{ aliases: string[] }>('commands/general/help:aliases');
export const Categories = T<{
	admin: string;
	audio: string;
	configuration: string;
	general: string;
	misc: string;
	moderation: string;
	social: string;
	util: string;
	websearch: string;
}>('commands/general/help:categories');
export const Data = FT<
	{ aliases: string[]; context: 'alias'; footerName: string; titleDescription: string } | { footerName: string; titleDescription: string },
	{ footer: string; title: string }
>('commands/general/help:data');
export const Description = T('commands/general/help:description');
export const Menu = FT<{ name: string }>('commands/general/help:menu');
export const Titles = T<{
	aliases: string;
	examples: string;
	explainedUsage: string;
	extendedHelp: string;
	permissionNode: string;
	possibleFormats: string;
	reminders: string;
	subcommands: string;
	support: string;
	terms: string;
	usages: string;
}>('commands/general/help:titles');
