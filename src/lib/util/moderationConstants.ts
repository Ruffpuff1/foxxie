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

export const enum TypeMetadata {
	None = 0,
	Undo = 1 << 0,
	Temporary = 1 << 1,
	/** @deprecated Use Temporary instead */
	Fast = 1 << 2,
	Archived = 1 << 3,
	Completed = 1 << 4
}

export const enum SchemaKeys {
	Case = 'caseId',
	CreatedAt = 'createdAt',
	Duration = 'duration',
	ExtraData = 'extraData',
	Guild = 'guildId',
	Moderator = 'moderatorId',
	Reason = 'reason',
	ImageURL = 'imageUrl',
	Type = 'type',
	User = 'userId',
	Refrence = 'refrenceId',
	LogChannel = 'logChannelId',
	LogMessageId = 'logMessageId',
	Channel = 'channelId',
	Metadata = 'metadata'
}

export interface ModerationTypeAssets {
	color: number;
	title: string;
}

export interface Unlock {
	unlock(): void;
}
