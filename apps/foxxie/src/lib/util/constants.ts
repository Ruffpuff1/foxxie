export const rootFolder = process.cwd();

export const enum BrandingColors {
	Primary = 0xf16a6a,
	Ruff = 0x857788,
	Secondary = 0xbfcaf3
}

export const enum Colors {
	Blue = 0x3f51b5,
	Green = 0x8ac34a,
	Orange = 0xff9900,
	Red = 0xf16a6a,
	Restricted = 0x18191c,
	White = 0xeeeeee,
	Yellow = 0xffc109
}

export const enum LanguageFormatters {
	And = 'and',
	Bold = 'bold',
	ChannelMention = 'channelMention',
	Code = 'code',
	CodeAnd = 'codeand',
	CodeBlock = 'codeblock',
	DateTime = 'datetime',
	Duration = 'duration',
	DurationString = 'durationString',
	ExplicitContentFilter = 'explicitContentFilter',
	FullDate = 'fulldate',
	HumanDateTime = 'humanDateTime',
	HumanLevels = 'humanLevels',
	Italic = 'italic',
	MessageNotifications = 'messageNotifications',
	Number = 'number',
	NumberCompact = 'numbercompact',
	PermissionsArray = 'permissionsarray',
	Remaining = 'remaining',
	Time = 'time',
	UserMention = 'userMention',
	VerificationLevel = 'verificationlevel'
}

export const enum Schedules {
	Birthday = 'birthday',
	Disboard = 'disboard',
	EndTempBan = 'moderationEndBan',
	EndTempMute = 'moderationEndMute',
	EndTempNick = 'moderationEndSetNickname',
	EndTempRestrictEmbed = 'moderationEndRestrictionEmbed',
	EndTempTimeout = 'moderationEndTimeout',
	IndexUser = 'indexUser',
	LastFMUpdateArtistsForUser = 'lastFmUpdateArtistsForUser',
	Reminder = 'reminder',
	RemoveBirthdayRole = 'removeBirthdayRole',
	UpdateDiscogsUsers = 'updateDiscogsUsers',
	UpdateLastFmUsers = 'updateLastFmUsers'
}

export const enum Urls {
	Haste = 'https://hastebin.com',
	Support = 'https://tcs.rshk.me',
	TheCornerStore = 'https://tcs.rshk.me'
}

export type ModerationTaskId = Omit<Schedules, 'Birthday' | 'Disboard' | 'UpdateDiscogsUsers' | 'UpdateLastFmUsers'>;

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
	Cassette = '<:Cassette:1317747854550503525>',
	Error = '<:TickNo:894420222084280331>',
	Female = '<:Female:950037546212147200>',
	/** This is the default Twemoji, uploaded as a custom emoji because iOS and Android do not render the emoji properly */
	FemaleSignEmoji = '<:Female:950037546212147200>',
	FoxWiggle = '<a:foxwiggle:799197027568713748>',
	GithubIssueClosed = '<:GithubIssueClosed:950035839306596362>',
	GithubIssueOpen = '<:GithubIssueOpen:950035888459624518>',
	GithubPRClosed = '<:GithubPRClosed:950017073231298560>',
	GithubPRMerged = '<:GithubPRMerged:950014664979406858>',
	GithubPROpen = '<:GithubPROpen:950014721979985960>',
	Hourglass = ':hourglass:',
	Information = ':information_source:',
	LastFm = '<:lastfm:882227627287515166>',
	Loading = '<a:HotCoffee:905458108225183765>',
	Male = '<:Male:950037521126023208>',
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
