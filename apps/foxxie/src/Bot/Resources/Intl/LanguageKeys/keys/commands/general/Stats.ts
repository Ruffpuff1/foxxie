import { LanguageHelpDisplayOptions } from '#lib/i18n/LanguageHelp';
import { FT, T } from '#lib/types';

export const Description = T('commands/general/stats:description');
export const DetailedDescription = T<LanguageHelpDisplayOptions>('commands/general:stats/detailedDescription');
export const Menu = FT<
	{
		deps: string[];
		memoryPercent: string;
		memoryUsed: string;
		messages: number;
		process: string;
		servers: number;
		shard: number;
		shardTotal: number;
		totalmemory: string;
		uptime: Date;
		users: number;
	},
	string[]
>('commands/general/stats:menu');
export const Name = T('commands/general/stats:name');
