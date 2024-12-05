export class GuildRoleSettingsService {
	public auto: string[] = [];

	public bot: string[] = [];

	public embedRestrict: string | null = null;

	public muted: string | null = null;

	public constructor(data: Partial<GuildRoleSettingsService>) {
		Object.assign(this, data);
	}
}
