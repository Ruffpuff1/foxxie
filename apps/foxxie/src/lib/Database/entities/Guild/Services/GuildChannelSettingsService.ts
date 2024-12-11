import { Snowflake } from 'discord.js';

export class GuildChannelSettingsService {
	public boost: Snowflake | null = null;

	public command: Snowflake[] = [];

	public disabled: Snowflake[] = [];

	public disboard: Snowflake | null = null;

	public goodbye: Snowflake | null = null;

	public ignoreAll: Snowflake[] = [];

	public logsFilterInvites: Snowflake | null = null;

	public logsFilterWords: Snowflake | null = null;

	public logsMemberJoin: Snowflake | null = null;

	public logsMemberLeave: Snowflake | null = null;

	public logsMemberScreening: Snowflake | null = null;

	public logsMessageDelete: Snowflake | null = null;

	public logsMessageEdit: Snowflake | null = null;

	public logsMessageVoice: Snowflake | null = null;

	public logsModeration: Snowflake | null = null;

	public logsRoleUpdate: Snowflake | null = null;

	public welcome: Snowflake | null = null;

	public constructor(data: Partial<GuildChannelSettingsService>) {
		Object.assign(this, data);
	}
}
