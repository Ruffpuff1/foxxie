export class GuildRoleSettingsService {
	public auto: string[] = [];

	public bot: string[] = [];

	public embedRestrict: null | string = null;

	public muted: null | string = null;

	public constructor(data: Partial<GuildRoleSettingsService>) {
		Object.assign(this, data);
	}
}
