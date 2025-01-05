import { CommandOptionsRunTypeEnum, PreconditionEntryResolvable } from '@sapphire/framework';
import { AliasPiece, AliasPieceJSON } from '@sapphire/pieces';
import { SubcommandMappingArray } from '@sapphire/plugin-subcommands';
import { Nullish } from '@sapphire/utilities';
import { PermissionLevels } from '#lib/types';
import { ChannelType, PermissionResolvable, Snowflake } from 'discord.js';

import { TextCommand } from '../structures/TextCommand.js';
import { FlagStrategyOptions } from '../utils/strategies/FlagUnorderedStrategy.js';
import { BucketScope } from './Enums.js';

export interface CommandJSON extends AliasPieceJSON {
	category: null | string;
	description: string;
	detailedDescription: DetailedDescriptionCommand;
}

export type CommandOptionsRunType =
	| 'DM'
	| 'GUILD_ANY'
	| 'GUILD_NEWS_THREAD'
	| 'GUILD_NEWS'
	| 'GUILD_PRIVATE_THREAD'
	| 'GUILD_PUBLIC_THREAD'
	| 'GUILD_TEXT'
	| 'GUILD_VOICE';

export type CommandRunInUnion =
	| ChannelType
	| CommandOptionsRunTypeEnum
	| Nullish
	| readonly (ChannelType | CommandOptionsRunTypeEnum | TextCommand.RunInTypes)[]
	| TextCommand.RunInTypes;

export interface CommandSpecificRunIn {
	messageRun?: CommandRunInUnion;
}

export type DetailedDescriptionCommand = DetailedDescriptionCommandObject | string;

export interface DetailedDescriptionCommandObject {}

export interface TextCommandContext extends Record<PropertyKey, unknown> {
	/**
	 * The alias used to run this command.
	 */
	commandName: string;
	/**
	 * The matched prefix, this will always be the same as {@link MessageCommand.RunContext.prefix} if it was a string, otherwise it is
	 * the result of doing `prefix.exec(content)[0]`.
	 */
	commandPrefix: string;
	/**
	 * The prefix used to run this command.
	 *
	 * This is a string for the mention and default prefix, and a RegExp for the `regexPrefix`.
	 */
	prefix: RegExp | string;
}

export interface TextCommandJSON extends AliasPieceJSON {
	category: null | string;
	description: string;
	detailedDescription: DetailedDescriptionCommand;
}

export interface TextCommandOptions extends FlagStrategyOptions, AliasPiece.Options {
	allowedGuilds?: string[];

	/**
	 * The time in milliseconds for the cooldown entries to reset, if set to a non-zero value alongside {@link CommandOptions.cooldownLimit}, the `Cooldown` precondition will be added to the list.
	 * @since 2.0.0
	 * @default 0
	 */
	cooldownDelay?: number;

	/**
	 * The users that are exempt from the Cooldown precondition.
	 * Use this to filter out someone like a bot owner
	 * @since 2.0.0
	 * @default undefined
	 */
	cooldownFilteredUsers?: Snowflake[];

	/**
	 * The amount of entries the cooldown can have before filling up, if set to a non-zero value alongside {@link CommandOptions.cooldownDelay}, the `Cooldown` precondition will be added to the list.
	 * @since 2.0.0
	 * @default 1
	 */
	cooldownLimit?: number;

	/**
	 * The scope of the cooldown entries.
	 * @since 2.0.0
	 * @default BucketScope.User
	 */
	cooldownScope?: BucketScope;

	/**
	 * The description for the command.
	 * @since 1.0.0
	 * @default ''
	 */
	description?: string;

	/**
	 * The detailed description for the command.
	 * @since 1.0.0
	 * @default ''
	 */
	detailedDescription?: DetailedDescriptionCommand;

	/**
	 * The full category path for the command
	 * @since 2.0.0
	 * @default 'An array of folder names that lead back to the folder that is registered for in the commands store'
	 * @example
	 * ```typescript
	 * // Given a file named `ping.js` at the path of `commands/General/ping.js`
	 * ['General']
	 *
	 * // Given a file named `info.js` at the path of `commands/General/About/info.js`
	 * ['General', 'About']
	 * ```
	 */
	fullCategory?: string[];

	/**
	 * Whether to add aliases for commands with dashes in them
	 * @since 1.0.0
	 * @default false
	 */
	generateDashLessAliases?: boolean;

	/**
	 * Whether to add aliases for commands with underscores in them
	 * @since 3.0.0
	 * @default false
	 */
	generateUnderscoreLessAliases?: boolean;

	guarded?: boolean;

	hidden?: boolean;

	/**
	 * Sets whether the command should be treated as NSFW. If set to true, the `NSFW` precondition will be added to the list.
	 * @since 2.0.0
	 * @default false
	 */
	nsfw?: boolean;

	permissionLevel?: PermissionLevels;
	/**
	 * The {@link Precondition}s to be run, accepts an array of their names.
	 * @seealso {@link PreconditionContainerArray}
	 * @since 1.0.0
	 * @default []
	 */
	preconditions?: readonly PreconditionEntryResolvable[];
	/**
	 * The quotes accepted by this command, pass `[]` to disable them.
	 * @since 1.0.0
	 * @default
	 * [
	 *   ['"', '"'], // Double quotes
	 *   ['“', '”'], // Fancy quotes (on iOS)
	 *   ['「', '」'] // Corner brackets (CJK)
	 *   ['«', '»'] // French quotes (guillemets)
	 * ]
	 */
	quotes?: [string, string][];

	/**
	 * The required permissions for the client.
	 * @since 2.0.0
	 * @default 0
	 */
	requiredClientPermissions?: PermissionResolvable;

	/**
	 * The required permissions for the user.
	 * @since 2.0.0
	 * @default 0
	 */
	requiredUserPermissions?: PermissionResolvable;

	/**
	 * The channels the command should run in. If set to `null`, no precondition entry will be added.
	 * Some optimizations are applied when given an array to reduce the amount of preconditions run
	 * (e.g. `'GUILD_TEXT'` and `'GUILD_NEWS'` becomes `'GUILD_ANY'`, and if both `'DM'` and `'GUILD_ANY'` are defined,
	 * then no precondition entry is added as it runs in all channels).
	 *
	 * This can be both {@link CommandRunInUnion} which will have the same precondition apply to all the types of commands,
	 * or you can use {@link CommandSpecificRunIn} to apply different preconditions to different types of commands.
	 * @since 2.0.0
	 * @default null
	 */
	runIn?: CommandRunInUnion | CommandSpecificRunIn;

	subcommands?: SubcommandMappingArray;

	/**
	 * If {@link SapphireClient.typing} is true, this option will override it.
	 * Otherwise, this option has no effect - you may call {@link Channel#sendTyping}` in the run method if you want specific commands to display the typing status.
	 * @default true
	 */
	typing?: boolean;
}
