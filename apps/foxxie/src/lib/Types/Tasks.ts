import { APIEmbed } from 'discord.js';

export interface ReminderScheduleData {
	channelId: null | string;
	createdChannelId: string;
	json: APIEmbed | null;
	repeat: null | number;
	text: null | string;
	timeago: Date;
	userId: string;
}

export interface RemoveBirthdayRoleData {
	guildId: string;
	roleId: string;
	userId: string;
}
