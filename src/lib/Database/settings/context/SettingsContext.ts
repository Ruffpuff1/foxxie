import { PermissionNodeManager, ReadonlyGuildData } from '#lib/database';
import { isNullishOrEmpty } from '@sapphire/utilities';

export class SettingsContext {
	readonly #permissionNodes: PermissionNodeManager;
	#wordFilterRegExp: RegExp | null;

	public constructor(public settings: ReadonlyGuildData) {
		this.#permissionNodes = new PermissionNodeManager(settings);
		this.#wordFilterRegExp = isNullishOrEmpty(settings.selfmodFilterRaw) ? null : new RegExp('', 'gi');
	}

	public get permissionNodes() {
		return this.#permissionNodes;
	}

	public get wordFilterRegExp() {
		return this.#wordFilterRegExp;
	}

	public update(settings: ReadonlyGuildData, data: Partial<ReadonlyGuildData>) {
		// FIX
		console.log(settings, data);
	}
}
