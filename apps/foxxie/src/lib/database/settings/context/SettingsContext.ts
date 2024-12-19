import { isNullishOrEmpty } from '@sapphire/utilities';
import { PermissionNodeManager, ReadonlyGuildData } from '#lib/database';

import { HighlightManager } from '../structures/HighlightManager.js';

export class SettingsContext {
	#highlights: HighlightManager;
	readonly #permissionNodes: PermissionNodeManager;
	#wordFilterRegExp: null | RegExp;

	public constructor(public settings: ReadonlyGuildData) {
		this.#highlights = new HighlightManager(settings);
		this.#permissionNodes = new PermissionNodeManager(settings);
		this.#wordFilterRegExp = isNullishOrEmpty(settings.selfmodFilterRaw) ? null : new RegExp('', 'gi');
	}

	public update(_: ReadonlyGuildData, __: Partial<ReadonlyGuildData>) {
		// FIX
	}

	public get highlights() {
		return this.#highlights;
	}

	public get permissionNodes() {
		return this.#permissionNodes;
	}

	public get wordFilterRegExp() {
		return this.#wordFilterRegExp;
	}
}
