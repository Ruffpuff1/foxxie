import { join } from 'node:path';

export class Constants {
	public static readonly RootFolder = process.cwd();

	public static readonly AssetsFolder = join(Constants.RootFolder, 'assets');

	public static readonly BotIds = {
		Development: ['812546582531801118', '840755658793418782'],
		Disboard: '302050872383242240',
		Foxxie: '825130284382289920',
		FoxxieAlpha: '812546582531801118',
		FoxxieNightly: '840755658793418782',
		RealmBot: '840681796914905100'
	};

	public static readonly Emojis = {
		Boosts: ['<a:boost1:904581076377292820>', '<a:boost2:904581123445776464>', '<a:boost3:904581171202097152>'],
		Error: '<:TickNo:894420222084280331>',
		Loading: '<a:HotCoffee:905458108225183765>',
		Music: '🎶 🎻',
		Perms: {
			Denied: '<:PermsDisabled:894420679934484561>',
			Granted: '<:PermsEnabled:894420447091904563>',
			NotSpecified: '<:PermsUnspecified:894420872234942466>'
		},
		Reactions: {
			No: '894420222084280331',
			Yes: '894419647439466556'
		},
		Success: '<:TickYes:894419647439466556>'
	};

	public static readonly LanguageFormatters = {
		And: 'and',
		Bold: 'bold',
		ChannelMention: 'channelMention',
		Code: 'code',
		CodeAnd: 'codeand',
		CodeBlock: 'codeblock',
		DateTime: 'datetime',
		Duration: 'duration',
		DurationString: 'durationString',
		ExplicitContentFilter: 'explicitContentFilter',
		FullDate: 'fulldate',
		HumanDateTime: 'humanDateTime',
		HumanLevels: 'humanLevels',
		Italic: 'italic',
		MessageNotifications: 'messageNotifications',
		Number: 'number',
		NumberCompact: 'numbercompact',
		PermissionsArray: 'permissionsarray',
		Remaining: 'remaining',
		Time: 'time',
		UserMention: 'userMention',
		VerificationLevel: 'verificationlevel'
	};

	public static readonly Urls = {
		TheCornerStore: 'https://tcs.rsehrk.com'
	};
}
