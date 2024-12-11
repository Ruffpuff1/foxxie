import { APIEmbed } from 'discord.js';

export interface RemoveBirthdayRoleData {
	guildId: string;
	userId: string;
	roleId: string;
}

export interface ReminderScheduleData {
	channelId: string | null;
	createdChannelId: string;
	userId: string;
	text: string | null;
	json: APIEmbed | null;
	repeat: number | null;
	timeago: Date;
}
