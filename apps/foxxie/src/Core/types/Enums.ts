export enum BucketScope {
	/**
	 * Per channel cooldowns.
	 */
	Channel,
	/**
	 * Global cooldowns.
	 */
	Global,
	/**
	 * Per guild cooldowns.
	 */
	Guild,
	/**
	 * Per user cooldowns.
	 */
	User
}

export enum CommandOptionsRunTypeEnum {
	Dm = 'DM',
	GuildAny = 'GUILD_ANY',
	GuildNews = 'GUILD_NEWS',
	GuildNewsThread = 'GUILD_NEWS_THREAD',
	GuildPrivateThread = 'GUILD_PRIVATE_THREAD',
	GuildPublicThread = 'GUILD_PUBLIC_THREAD',
	GuildText = 'GUILD_TEXT',
	GuildVoice = 'GUILD_VOICE'
}
