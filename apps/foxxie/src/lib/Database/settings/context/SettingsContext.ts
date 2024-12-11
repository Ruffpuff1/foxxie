import { PermissionNodeManager, ReadonlyGuildData } from '#lib/database';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { HighlightManager } from '../structures/HighlightManager.js';

export class SettingsContext {
	#highlights: HighlightManager;
	readonly #permissionNodes: PermissionNodeManager;
	#wordFilterRegExp: RegExp | null;

	public constructor(public settings: ReadonlyGuildData) {
		this.#highlights = new HighlightManager(settings);
		this.#permissionNodes = new PermissionNodeManager(settings);
		this.#wordFilterRegExp = isNullishOrEmpty(settings.selfmodFilterRaw) ? null : new RegExp('', 'gi');
	}

	public get permissionNodes() {
		return this.#permissionNodes;
	}

	public get wordFilterRegExp() {
		return this.#wordFilterRegExp;
	}

	public get highlights() {
		return this.#highlights;
	}

	public update(_: ReadonlyGuildData, __: Partial<ReadonlyGuildData>) {
		// FIX
	}
}
