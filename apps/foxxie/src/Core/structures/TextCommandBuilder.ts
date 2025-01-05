import { CommandRunInUnion, CommandSpecificRunIn } from '@sapphire/framework';
import { LanguageHelpDisplayOptions } from '#lib/i18n/LanguageHelp';
import { PermissionLevels, TypedT } from '#lib/types';
import { PermissionResolvable } from 'discord.js';

import { TextCommand } from './TextCommand.js';

export class TextCommandBuilder {
	private aliases: string[] = [];
	private description: TypedT<string> | undefined;

	private detailedDescription: TypedT<LanguageHelpDisplayOptions> | undefined;

	private flags: boolean | string[] | undefined;

	private fullCategory!: string[];

	private name!: string;

	private options: boolean | readonly string[] | undefined;

	private permissionLevel: PermissionLevels | undefined;

	private requiredClientPermissions: PermissionResolvable | undefined;

	private requiredUserPermission: PermissionResolvable | undefined;

	private runIn: CommandRunInUnion | CommandSpecificRunIn | undefined;

	public setAliases(...aliases: string[]) {
		this.aliases = aliases;
		return this;
	}

	public setCategory(...parts: string[]) {
		this.fullCategory = [...parts];
		return this;
	}

	public setDescription(description: TypedT<string>) {
		this.description = description;
		return this;
	}

	public setDetailedDescription(detailedDescription: TypedT<LanguageHelpDisplayOptions>) {
		this.detailedDescription = detailedDescription;
		return this;
	}

	public setFlags(flags: boolean | string[]) {
		this.flags = flags;
		return this;
	}

	public setName(name: string) {
		this.name = name;
		return this;
	}

	public setOptions(options: boolean | readonly string[] | undefined) {
		this.options = options;
		return this;
	}

	public setPermissionLevel(permissionLevel: PermissionLevels) {
		this.permissionLevel = permissionLevel;
		return this;
	}

	public setRequiredClientPermissions(permissions: PermissionResolvable) {
		this.requiredClientPermissions = permissions;
		return this;
	}

	public setRequiredUserPermissions(permissions: PermissionResolvable) {
		this.requiredUserPermission = permissions;
		return this;
	}

	public setRunIn(runIn: CommandRunInUnion | CommandSpecificRunIn) {
		this.runIn = runIn;
		return this;
	}

	public toJSON(): TextCommand.Options {
		return {
			aliases: this.aliases,
			description: this.description,
			detailedDescription: this.detailedDescription,
			flags: this.flags,
			fullCategory: this.fullCategory,
			name: this.name,
			options: this.options,
			permissionLevel: this.permissionLevel,
			requiredClientPermissions: this.requiredClientPermissions,
			requiredUserPermissions: this.requiredUserPermission,
			runIn: this.runIn
		};
	}
}
