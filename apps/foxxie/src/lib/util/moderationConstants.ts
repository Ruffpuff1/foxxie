export const enum SchemaKeys {
	Case = 'caseId',
	Channel = 'channelId',
	CreatedAt = 'createdAt',
	Duration = 'duration',
	ExtraData = 'extraData',
	Guild = 'guildId',
	ImageURL = 'imageUrl',
	LogChannel = 'logChannelId',
	LogMessageId = 'logMessageId',
	Metadata = 'metadata',
	Moderator = 'moderatorId',
	Reason = 'reason',
	Refrence = 'refrenceId',
	Type = 'type',
	User = 'userId'
}

export const enum TypeMetadata {
	Archived = 1 << 3,
	Completed = 1 << 4,
	/** @deprecated Use Temporary instead */
	Fast = 1 << 2,
	None = 0,
	Temporary = 1 << 1,
	Undo = 1 << 0
}

export const enum TypeVariation {
	Ban, // 0
	Kick, // 1
	Mute, // 2
	Prune, // 3
	Softban, // 4
	Warning, // 5
	Lock = 7, // 7
	VoiceMute, // 8
	VoiceDeafen, // 9
	VoiceDisconnect, // 10
	SetNickname, // 11
	RestrictedReaction, // 12
	RestrictedAttachment, // 13
	RestrictedVoice, // 14
	RestrictedEmoji, // 15
	RoleAdd, // 16
	RoleRemove, // 17
	Timeout, // 18
	Dehoist, // 19
	RestrictedEmbed, // 20
	RaidBan // 21 prob final for now
}

export interface ModerationTypeAssets {
	color: number;
	title: string;
}

export interface Unlock {
	unlock(): void;
}
