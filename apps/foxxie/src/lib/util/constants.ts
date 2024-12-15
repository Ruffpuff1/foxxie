export const rootFolder = process.cwd();

export const enum BrandingColors {
	Primary = 0xed7c7d,
	Secondary = 0x4583c7
}

export const enum Colors {
	Black = 0x737f8d,
	Blurple = 0x5865f2,
	BlurpleOld = 0x7289db,
	Disboard = 0x25b8b8,
	Green = 0x5dba7d,
	LemonYellow = 0xf1ab1d,
	Orange = 0xf79454,
	PokemonBird = 0x969696,
	Red = 0xff5b5b,
	Restricted = 1579292,
	TheCornerStoreStarboard = 0xfff59f,
	Yellow = 0xffdb5c
}

export const enum LanguageFormatters {
	Bold = 'bold',
	DateTime = 'dateTime',
	Duration = 'duration',
	DurationString = 'durationString',
	ExplicitContentFilter = 'explicitContentFilter',
	HumanDateTime = 'humanDateTime',
	HumanLevels = 'humanLevels',
	Italic = 'italic',
	MessageNotifications = 'messageNotifications',
	Number = 'number',
	NumberCompact = 'numberCompact',
	Permissions = 'permissions'
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
	EndTempTimeout = 'moderationEndTimeout',
	IndexUser = 'indexUser',
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
	boosts: ['<a:boost1:904581076377292820>', '<a:boost2:904581123445776464>', '<a:boost3:904581171202097152>'],

	perms: {
		denied: '<:PermsDisabled:894420679934484561>',
		granted: '<:PermsEnabled:894420447091904563>',
		notSpecified: '<:PermsUnspecified:894420872234942466>'
	},
	reactions: {
		no: '894420222084280331',
		yes: '894419647439466556'
	}
};

export const enum BadgeEmojis {
	ActiveDeveloper = '<:activedev:1144525267537231872>',
	Balance = '<:HypesquadBalance:1144552586565914685>',
	Boost = '<:Boost:1144556254761603122>',
	Bot = '<:Bot:1144539023415718009>',
	Bravery = '<:HypesquadBravery:1144552590168838154>',
	Brilliance = '<:HypesquadBrilliance:1144552588470141039>',
	BugHunt1 = '<:BugHunter1:1144557276707950623>',
	BugHunt2 = '<:BugHunter2:1144557274443022347>',
	EarlySupporter = '<:EarlySupporter:1144553854072016987>',
	HttpBot = '<:httpbot:1144545349965455370>',
	HypeSquadEvents = '<:HypesquadEvents:1144555463682297977>',
	ModAlumni = '<:ModAlumni:1144541044113940510>',
	Nitro = '<:Nitro:1144556247908102224>',
	Partner = '<:PartneredServerOwner:1144552591620046868>',
	Staff = '<:Staff:1144541041702227979>',
	VerifiedBot = '<:VerifiedBot:1144539025869373540>',
	VerifiedDev = '<:VerifiedBotDeveloper:1144541045598720170>'
}

export const enum Emojis {
	AutoModerator = ':fox:',
	Bot = ':robot:',
	/** The logo of https://bulbapedia.bulbagarden.net */
	Bulbapedia = '1317612914370285569',
	Calendar = ':calendar_spiral:',
	Error = '<:TickNo:894420222084280331>',
	/** This is the default Twemoji, uploaded as a custom emoji because iOS and Android do not render the emoji properly */
	FemaleSignEmoji = '<:Female:950037546212147200>',
	FoxWiggle = '<a:foxwiggle:799197027568713748>',
	Hourglass = ':hourglass:',
	Information = ':information_source:',
	LastFm = '<:lastfm:882227627287515166>',
	Loading = '<a:HotCoffee:905458108225183765>',
	/** This is the default Twemoji, uploaded as a custom emoji because iOS and Android do not render the emoji properly */
	MaleSignEmoji = '<:Male:950037521126023208>',
	Moderator = ':hammer:',
	Music = '🎶 🎻',
	QuarantinedIcon = ':speech_balloon:',
	RuffThink = '<:RuffThink:910209205636579421>',
	/** The logo of https://serebii.net */
	Serebii = '1317612983530164294',
	ShieldMember = ':bust_in_silhouette:',
	/** The logo of https://www.smogon.com */
	Smogon = '1317613005734674495',
	SpammerIcon = ':warning:',
	Success = '<:TickYes:894419647439466556>',
	Vinyl = '<:Vinyl:1155284004656910397>'
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

export const enum BotIds {
	RealmBot = '840681796914905100'
}

export const enum SelectMenuCustomIds {
	Pokemon = 'pokemon-select-menu'
}

export const enum SubcommandKeys {
	List = 'list',
	Set = 'set',
	Show = 'show',
	User = 'user'
}
