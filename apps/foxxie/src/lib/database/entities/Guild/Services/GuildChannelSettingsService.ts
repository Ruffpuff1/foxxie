import { Snowflake } from 'discord.js';

export class GuildChannelSettingsService {
	public boost: null | Snowflake = null;

	public command: Snowflake[] = [];

	public disabled: Snowflake[] = [];

	public disboard: null | Snowflake = null;

	public goodbye: null | Snowflake = null;

	public ignoreAll: Snowflake[] = [];

	public logsFilterInvites: null | Snowflake = null;

	public logsFilterWords: null | Snowflake = null;

	public logsMemberJoin: null | Snowflake = null;

	public logsMemberLeave: null | Snowflake = null;

	public logsMemberScreening: null | Snowflake = null;

	public logsMessageDelete: null | Snowflake = null;

	public logsMessageEdit: null | Snowflake = null;

	public logsMessageVoice: null | Snowflake = null;

	public logsModeration: null | Snowflake = null;

	public logsRoleUpdate: null | Snowflake = null;

	public welcome: null | Snowflake = null;

	public constructor(data: Partial<GuildChannelSettingsService>) {
		Object.assign(this, data);
	}
}
