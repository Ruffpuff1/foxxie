import { ChatInputCommand, MessageCommand, MessageCommandContext, PreconditionContainerArray } from '@sapphire/framework';
import { IUnorderedStrategy, Lexer } from '@sapphire/lexure';
import { AliasPiece } from '@sapphire/pieces';
import { fetchT } from '@sapphire/plugin-i18next';
import { isNullish } from '@sapphire/utilities';
import { FoxxieArgs } from '#lib/structures';
import { GuildMessage, PermissionLevels } from '#lib/types';
import { Awaitable, ChannelType, ChatInputCommandInteraction, Message } from 'discord.js';

import {
	CommandJSON,
	CommandOptionsRunType,
	CommandRunInUnion,
	CommandSpecificRunIn,
	DetailedDescriptionCommand,
	TextCommandJSON,
	TextCommandOptions
} from '../types/TextCommand.js';
import { FlagUnorderedStrategy } from '../utils/strategies/FlagUnorderedStrategy.js';
import { decoratedChatInputRunMethods, decoratedCommandOptions, decoratedRunMethods } from './TextCommandDecorators.js';

const ChannelTypes = Object.values(ChannelType).filter((type) => typeof type === 'number') as readonly ChannelType[];
const GuildChannelTypes = ChannelTypes.filter((type) => type !== ChannelType.DM && type !== ChannelType.GroupDM) as readonly ChannelType[];

export class TextCommand<PreParseReturn = FoxxieArgs, Options extends TextCommand.Options = TextCommand.Options> extends AliasPiece<
	Options,
	'textcommands'
> {
	public allowedGuilds: string[];

	/**
	 * A basic summary about the command
	 * @since 1.0.0
	 */
	public description: string;

	/**
	 * Longer version of command's summary and how to use it
	 * @since 1.0.0
	 */
	public detailedDescription: DetailedDescriptionCommand;

	/**
	 * The full category for the command, can be overridden by setting the {@link Command.Options.fullCategory} option.
	 *
	 * If {@link Command.Options.fullCategory} is not set, then:
	 * - If the command is loaded from the file system, then this is the command's location in file system relative to
	 *   the commands folder. For example, if you have a command located at `commands/General/Information/info.ts` then
	 *   this property will be `['General', 'Info']`.
	 * - If the command is virtual, then this will be `[]`.
	 *
	 * @since 2.0.0
	 */
	public readonly fullCategory: readonly string[];

	public readonly guarded: boolean;

	public readonly hidden: boolean;

	public permissionLevel: PermissionLevels;

	/**
	 * The preconditions to be run.
	 * @since 1.0.0
	 */
	public preconditions: PreconditionContainerArray;

	/**
	 * The raw name of the command as provided through file name or constructor options.
	 *
	 * This is exactly what is set by the developer, completely unmodified internally by the framework.
	 * Unlike the `name` which gets lowercased for storing it uniquely in the {@link CommandStore}.
	 */
	public rawName: string;

	/**
	 * The strategy to use for the lexer.
	 * @since 1.0.0
	 */
	public strategy: IUnorderedStrategy;

	/**
	 * If {@link SapphireClient.typing} is true, it can be overridden for a specific command using this property, set via its options.
	 * Otherwise, this property will be ignored.
	 * @default true
	 */
	public typing: boolean;

	/**
	 * The lexer to be used for command parsing
	 * @since 1.0.0
	 * @private
	 */
	protected lexer: Lexer;

	/**
	 * @since 1.0.0
	 * @param context The context.
	 * @param options Optional Command settings.
	 */
	public constructor(context: TextCommand.LoaderContext, options: Options = {} as Options) {
		const name = options.name ?? context.name;
		options = { ...options, ...(decoratedCommandOptions.get(name) || {}) };

		super(context, { ...options, name: name.toLowerCase() });

		this.rawName = name;
		this.description = options.description ?? '';
		this.detailedDescription = options.detailedDescription ?? '';
		this.strategy = new FlagUnorderedStrategy(options);
		this.fullCategory = options.fullCategory ?? this.location.directories;
		this.typing = options.typing ?? true;

		this.guarded = options.guarded ?? false;

		this.hidden = options.hidden ?? false;

		this.allowedGuilds = options.allowedGuilds ?? [];

		this.permissionLevel = options.permissionLevel ?? PermissionLevels.Everyone;

		this.lexer = new Lexer({
			quotes: options.quotes ?? [
				['"', '"'], // Double quotes
				['“', '”'], // Fancy quotes (on iOS)
				['「', '」'], // Corner brackets (CJK)
				['«', '»'] // French quotes (guillemets)
			]
		});

		if (options.generateDashLessAliases) {
			const dashLessAliases: string[] = [];
			if (this.name.includes('-')) dashLessAliases.push(this.name.replace(/-/g, ''));
			for (const alias of this.aliases) if (alias.includes('-')) dashLessAliases.push(alias.replace(/-/g, ''));

			this.aliases = [...this.aliases, ...dashLessAliases];
		}

		if (options.generateUnderscoreLessAliases) {
			const underscoreLessAliases: string[] = [];
			if (this.name.includes('_')) underscoreLessAliases.push(this.name.replace(/_/g, ''));
			for (const alias of this.aliases) if (alias.includes('_')) underscoreLessAliases.push(alias.replace(/_/g, ''));

			this.aliases = [...this.aliases, ...underscoreLessAliases];
		}

		this.preconditions = new PreconditionContainerArray(options.preconditions);
		// this.parseConstructorPreConditions(options);

		const foundMessageRun = decoratedRunMethods.get(this.name);
		if (foundMessageRun) this.messageRun = foundMessageRun;

		const foundChatInputRun = decoratedChatInputRunMethods.get(this.name);
		if (foundChatInputRun) this.chatInputRun = foundChatInputRun;
	}

	/**
	 * Executes the application command's logic.
	 * @param interaction The interaction that triggered the command.
	 * @param context The chat input command run context.
	 */
	public chatInputRun?(interaction: ChatInputCommandInteraction, context: ChatInputCommand.RunContext): Awaitable<unknown>;

	/**
	 * The message pre-parse method. This method can be overridden by plugins to define their own argument parser.
	 * @param message The message that triggered the command.
	 * @param parameters The raw parameters as a single string.
	 * @param context The command-context used in this execution.
	 */
	public async messagePreParse(message: Message, parameters: string, context: MessageCommand.RunContext): Promise<PreParseReturn> {
		return FoxxieArgs.from(this as MessageCommand, message, parameters, context, await fetchT(message)) as PreParseReturn;
	}

	/**
	 * Executes the message command's logic.
	 * @param message The message that triggered the command.
	 * @param args The value returned by {@link Command.messagePreParse}, by default an instance of {@link Args}.
	 * @param context The context in which the command was executed.
	 */
	public messageRun?(message: Message, args: FoxxieArgs, context: MessageCommand.RunContext): Awaitable<unknown>;

	public override async reload() {
		await super.reload();
	}

	/**
	 * Defines the JSON.stringify behavior of the command.
	 */
	public override toJSON(): CommandJSON {
		return {
			...super.toJSON(),
			category: this.category,
			description: this.description,
			detailedDescription: this.detailedDescription
		};
	}

	/**
	 * Parses the command's options and processes them, calling {@link Command#parseConstructorPreConditionsRunIn},
	 * {@link Command#parseConstructorPreConditionsNsfw},
	 * {@link Command#parseConstructorPreConditionsRequiredClientPermissions}, and
	 * {@link Command#parseConstructorPreConditionsCooldown}.
	 * @since 2.0.0
	 * @param options The command options given from the constructor.
	 */
	// protected parseConstructorPreConditions(options: TextCommand.Options): void {
	// 	this.parseConstructorPreConditionsRunIn(options);
	// 	this.parseConstructorPreConditionsNsfw(options);
	// 	this.parseConstructorPreConditionsRequiredClientPermissions(options);
	// 	this.parseConstructorPreConditionsRequiredUserPermissions(options);
	// 	this.parseConstructorPreConditionsCooldown(options);
	// }

	// /**
	//  * Appends the `Cooldown` precondition when {@link Command.Options.cooldownLimit} and
	//  * {@link Command.Options.cooldownDelay} are both non-zero.
	//  * @param options The command options given from the constructor.
	//  */
	// protected parseConstructorPreConditionsCooldown(options: TextCommand.Options) {
	// 	parseConstructorPreConditionsCooldown(
	// 		this,
	// 		options.cooldownLimit,
	// 		options.cooldownDelay,
	// 		options.cooldownScope,
	// 		options.cooldownFilteredUsers,
	// 		this.preconditions
	// 	);
	// }

	/**
	 * Appends the `NSFW` precondition if {@link Command.Options.nsfw} is set to true.
	 * @param options The command options given from the constructor.
	 */
	// protected parseConstructorPreConditionsNsfw(options: TextCommand.Options) {
	// 	parseConstructorPreConditionsNsfw(options.nsfw, this.preconditions);
	// }

	// /**
	//  * Appends the `ClientPermissions` precondition when {@link Command.Options.requiredClientPermissions} resolves to a
	//  * non-zero bitfield.
	//  * @param options The command options given from the constructor.
	//  */
	// protected parseConstructorPreConditionsRequiredClientPermissions(options: TextCommand.Options) {
	// 	parseConstructorPreConditionsRequiredClientPermissions(options.requiredClientPermissions, this.preconditions);
	// }

	// /**
	//  * Appends the `UserPermissions` precondition when {@link Command.Options.requiredUserPermissions} resolves to a
	//  * non-zero bitfield.
	//  * @param options The command options given from the constructor.
	//  */
	// protected parseConstructorPreConditionsRequiredUserPermissions(options: TextCommand.Options) {
	// 	parseConstructorPreConditionsRequiredUserPermissions(options.requiredUserPermissions, this.preconditions);
	// }

	// /**
	//  * Appends the `RunIn` precondition based on the values passed, defaulting to `null`, which doesn't add a
	//  * precondition.
	//  * @param options The command options given from the constructor.
	//  */
	// protected parseConstructorPreConditionsRunIn(options: TextCommand.Options) {
	// 	parseConstructorPreConditionsRunIn(options.runIn, this.resolveConstructorPreConditionsRunType.bind(this), this.preconditions);
	// }

	/**
	 * Resolves the {@link Command.Options.runIn} option into a {@link Command.RunInTypes} array.
	 * @param types The types to resolve.
	 * @returns The resolved types, or `null` if no types were resolved.
	 */
	protected resolveConstructorPreConditionsRunType(types: CommandRunInUnion): null | readonly ChannelType[] {
		if (isNullish(types)) return null;
		if (typeof types === 'number') return [types];
		if (typeof types === 'string') {
			switch (types) {
				case 'DM':
					return [ChannelType.DM];
				case 'GUILD_ANY':
					return GuildChannelTypes;
				case 'GUILD_NEWS':
					return [ChannelType.GuildAnnouncement];
				case 'GUILD_NEWS_THREAD':
					return [ChannelType.AnnouncementThread];
				case 'GUILD_PRIVATE_THREAD':
					return [ChannelType.PrivateThread];
				case 'GUILD_PUBLIC_THREAD':
					return [ChannelType.PublicThread];
				case 'GUILD_TEXT':
					return [ChannelType.GuildText];
				case 'GUILD_VOICE':
					return [ChannelType.GuildVoice];
				default:
					return null;
			}
		}

		// If there's no channel it can run on, throw an error:
		if (types.length === 0) {
			throw new Error(`${this.constructor.name}[${this.name}]: "runIn" was specified as an empty array.`);
		}

		if (types.length === 1) {
			return this.resolveConstructorPreConditionsRunType(types[0]);
		}

		const resolved = new Set<ChannelType>();
		for (const typeResolvable of types) {
			for (const type of this.resolveConstructorPreConditionsRunType(typeResolvable) ?? []) resolved.add(type);
		}

		// If all types were resolved, optimize to null:
		if (resolved.size === ChannelTypes.length) return null;

		// Return the resolved types in ascending order:
		return [...resolved].sort((a, b) => a - b);
	}

	/**
	 * The main category for the command, if any.
	 *
	 * This getter retrieves the first value of {@link Command.fullCategory}, if it has at least one item, otherwise it
	 * returns `null`.
	 *
	 * @note You can set {@link Command.Options.fullCategory} to override the built-in category resolution.
	 */
	public get category(): null | string {
		return this.fullCategory.at(0) ?? null;
	}

	/**
	 * The parent category for the command.
	 *
	 * This getter retrieves the last value of {@link Command.fullCategory}, if it has at least one item, otherwise it
	 * returns `null`.
	 *
	 * @note You can set {@link Command.Options.fullCategory} to override the built-in category resolution.
	 */
	public get parentCategory(): null | string {
		return this.fullCategory.at(-1) ?? null;
	}

	/**
	 * The sub-category for the command, if any.
	 *
	 * This getter retrieves the second value of {@link Command.fullCategory}, if it has at least two items, otherwise
	 * it returns `null`.
	 *
	 * @note You can set {@link Command.Options.fullCategory} to override the built-in category resolution.
	 */
	public get subCategory(): null | string {
		return this.fullCategory.at(1) ?? null;
	}
}

export namespace TextCommand {
	export type Args = FoxxieArgs;
	export type JSON = TextCommandJSON;
	export type LoaderContext = AliasPiece.LoaderContext<'textcommands'>;
	export type MessageRunArgs = [message: GuildMessage, args: FoxxieArgs, context: MessageCommandContext];
	export type Options = TextCommandOptions;
	export type RunInTypes = CommandOptionsRunType;
	export type RunInUnion = CommandRunInUnion;
	export type SpecificRunIn = CommandSpecificRunIn;
}
