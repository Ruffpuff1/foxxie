export const rootFolder = process.cwd();

export const enum LanguageFormatters {
	Bold = 'bold',
	Duration = 'duration',
	DurationString = 'durationString',
	ExplicitContentFilter = 'explicitContentFilter',
	Italic = 'italic',
	MessageNotifications = 'messageNotifications',
	Number = 'number',
	NumberCompact = 'numberCompact',
	HumanLevels = 'humanLevels',
	Permissions = 'permissions',
	DateTime = 'dateTime',
	HumanDateTime = 'humanDateTime'
}

export const enum Colors {
	PokemonBird = 0x969696,
	Red = 0xff5c5c,
	Orange = 0xf79454,
	Yellow = 0xffdb5c,
	LemonYellow = 0xf1ab1d,
	Green = 0x5dba7d,
	Black = 0x737f8d,
	TheCornerStoreStarboard = 0xfff59f,
	BlurpleOld = 0x7289db,
	Blurple = 0x5865f2,
	Disboard = 0x25b8b8,
	Restricted = 1579292
}

export const enum BrandingColors {
	Primary = 0xed7c7d,
	Secondary = 0x4583c7
}

export type ModerationTaskId = Omit<Schedules, 'Birthday' | 'Disboard' | 'UpdateDiscogsUsers' | 'UpdateLastFmUsers'>;

export const ModerationTasks = [Schedules.EndTempBan, Schedules.EndTempMute, Schedules.EndTempNick, Schedules.EndTempNick];

export const enum Schedules {
	Birthday = 'birthday',
	Disboard = 'disboard',
	EndTempBan = 'moderationEndBan',
	EndTempMute = 'moderationEndMute',
	EndTempNick = 'moderationEndSetNickname',
	EndTempRestrictEmbed = 'moderationEndRestrictionEmbed',
	Reminder = 'reminder',
	RemoveBirthdayRole = 'removeBirthdayRole',
	UpdateDiscogsUsers = 'updateDiscogsUsers',
	UpdateLastFmUsers = 'updateLastFmUsers'
}

export const enum Urls {
	Celestia = 'https://celestia.reese.gay',
	Disboard = 'https://disboard.org/',
	Haste = 'https://hastebin.com',
	Repo = 'https://github.com/Ruffpuff1/foxxie',
	Support = 'https://rsehrk.com/tcs',
	TheCornerStore = 'https://rsehrk.com/tcs'
}

export const emojis = {
	perms: {
		granted: '<:PermsEnabled:894420447091904563>',
		notSpecified: '<:PermsUnspecified:894420872234942466>',
		denied: '<:PermsDisabled:894420679934484561>'
	},

	boosts: ['<a:boost1:904581076377292820>', '<a:boost2:904581123445776464>', '<a:boost3:904581171202097152>'],
	reactions: {
		no: '894420222084280331',
		yes: '894419647439466556'
	}
};

export const enum Emojis {
	AutoModerator = ':fox:',
	Bot = ':robot:',
	/** The logo of https://bulbapedia.bulbagarden.net */
	Bulbapedia = '910209205636579421',
	Calendar = ':calendar_spiral:',
	Error = '<:TickNo:894420222084280331>',
	/** This is the default Twemoji, uploaded as a custom emoji because iOS and Android do not render the emoji properly */
	FemaleSignEmoji = '<:Female:950037546212147200>',
	FoxWiggle = '<a:foxwiggle:799197027568713748>',
	Hourglass = ':hourglass:',
	Information = ':information_source:',
	Loading = '<a:HotCoffee:905458108225183765>',
	/** This is the default Twemoji, uploaded as a custom emoji because iOS and Android do not render the emoji properly */
	MaleSignEmoji = '<:Male:950037521126023208>',
	Moderator = ':hammer:',
	Music = '🎶 🎻',
	QuarantinedIcon = ':speech_balloon:',
	RuffThink = '<:RuffThink:910209205636579421>',
	/** The logo of https://serebii.net */
	Serebii = '910209205636579421',
	ShieldMember = ':bust_in_silhouette:',
	/** The logo of https://www.smogon.com */
	Smogon = '910209205636579421',
	SpammerIcon = ':warning:',
	Success = '<:TickYes:894419647439466556>',
	Vinyl = '<:Vinyl:1155284004656910397>'
}

export const enum BadgeEmojis {
	Bot = '<:Bot:1144539023415718009>',
	VerifiedBot = '<:VerifiedBot:1144539025869373540>',
	ActiveDeveloper = '<:activedev:1144525267537231872>',
	ModAlumni = '<:ModAlumni:1144541044113940510>',
	Staff = '<:Staff:1144541041702227979>',
	VerifiedDev = '<:VerifiedBotDeveloper:1144541045598720170>',
	HttpBot = '<:httpbot:1144545349965455370>',
	Partner = '<:PartneredServerOwner:1144552591620046868>',
	Brilliance = '<:HypesquadBrilliance:1144552588470141039>',
	Bravery = '<:HypesquadBravery:1144552590168838154>',
	Balance = '<:HypesquadBalance:1144552586565914685>',
	HypeSquadEvents = '<:HypesquadEvents:1144555463682297977>',
	Nitro = '<:Nitro:1144556247908102224>',
	Boost = '<:Boost:1144556254761603122>',
	BugHunt1 = '<:BugHunter1:1144557276707950623>',
	BugHunt2 = '<:BugHunter2:1144557274443022347>',
	EarlySupporter = '<:EarlySupporter:1144553854072016987>'
}

export const allowedInviteIds = [
	// ID for `The Corner Store`, Foxxie's home server.
	'761512748898844702',
	/* Below are official Discord servers. DDevs, Testers, Townhall, DAPI, Demo Server, and Poker Night. */
	'613425648685547541',
	'197038439483310086',
	'169256939211980800',
	'81384788765712384',
	'670065151621332992',
	'831646372519346186',
	// Discord.JS server
	'222078108977594368',
	// Typescript Server
	'508357248330760243'
];

export const enum SelectMenuCustomIds {
	Pokemon = 'pokemon-select-menu'
}
