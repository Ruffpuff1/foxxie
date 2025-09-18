import { ChatInputCommandContext, Command, CommandOptionsRunTypeEnum, MessageCommand, MessageCommandContext, UserError } from '@sapphire/framework';
import { fetchT } from '@sapphire/plugin-i18next';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { cast } from '@sapphire/utilities';
import { LanguageHelpDisplayOptions } from '#lib/i18n/LanguageHelp';
import { Config } from '#root/Bot/Configurations/Config';
import Foxxie from '#root/Bot/Foxxie';
import { GuildMessage, PermissionLevels, TypedFT, TypedT } from '#root/Bot/Resources/index';
import { TimeService } from '#root/Bot/Services/index';
import { Awaitable, Guild, Message, Snowflake } from 'discord.js';
import first from 'lodash/first.js';

import { FoxxieArgs } from './FoxxieArgs.js';

export abstract class FoxxieCommand extends Command<FoxxieCommand.Args, FoxxieCommand.Options> {
	public allowedGuilds: string[];

	declare public description: TypedT<string>;

	declare public detailedDescription: TypedFT<{ commandId?: null | string; prefix?: string }, LanguageHelpDisplayOptions>;

	public readonly guarded: boolean;

	public readonly hidden: boolean;

	public permissionLevel: PermissionLevels;

	public usage: null | string = null;

	public constructor(context: Command.LoaderContext, options: FoxxieCommand.Options) {
		super(context, {
			cooldownDelay: TimeService.Seconds(5),
			cooldownFilteredUsers: Config.ClientOwners,
			cooldownLimit: 2,
			generateDashLessAliases: true,
			runIn: [CommandOptionsRunTypeEnum.GuildAny],
			...options
		});

		this.guarded = options.guarded ?? false;
		this.usage = options.usage ?? null;
		this.hidden = options.hidden ?? false;
		this.allowedGuilds = options.allowedGuilds ?? [];
		this.permissionLevel = options.permissionLevel ?? PermissionLevels.Everyone;
		this.detailedDescription = options.detailedDescription as unknown as TypedFT<
			{ commandId?: null | string; prefix?: string },
			LanguageHelpDisplayOptions
		>;

		if (options.guarded) this.guarded = true;
	}

	public addAllowedGuildsPrecondition(options: FoxxieCommand.Options): void {
		if (options.allowedGuilds?.length) {
			this.preconditions.append({
				context: { allowedGuilds: options.allowedGuilds },
				name: 'AllowedGuilds'
			});
		}
	}

	public addPermissionLevels(options: FoxxieCommand.Options) {
		switch (options.permissionLevel!) {
			case PermissionLevels.Administrator:
				this.preconditions.append('Administrator');
				break;
			case PermissionLevels.BotOwner:
				this.preconditions.append('BotOwner');
				break;
			case PermissionLevels.Everyone:
				this.preconditions.append('Everyone');
				break;
			case PermissionLevels.GuildOwner:
				this.preconditions.append('GuildOwner');
				break;
			case PermissionLevels.Moderator:
				this.preconditions.append('Moderator');
				break;
			default:
				this.preconditions.append('Everyone');
		}
	}

	/**
	 * Retrieves the global command id from the application command registry.
	 */
	public getGlobalCommandId(): null | Snowflake {
		const ids = this.applicationCommandRegistry.globalChatInputCommandIds;
		if (!ids.size) return null;
		return [...first([...ids.values()])!][0];
	}

	public override messagePreParse(message: Message, parameters: string, context: MessageCommand.RunContext): Promise<FoxxieCommand.Args> {
		return FoxxieCommand.ImplementFoxxieCommandPreParse(this as MessageCommand, message, parameters, context);
	}

	public abstract override messageRun(message: Message, args: FoxxieCommand.Args, context: MessageCommand.RunContext): Awaitable<unknown>;

	protected error(identifier: string | UserError, context?: unknown): never {
		throw typeof identifier === 'string' ? new UserError({ context, identifier }) : identifier;
	}

	protected override parseConstructorPreConditions(options: FoxxieCommand.Options): void {
		super.parseConstructorPreConditions(options);
		// this.addPermissionLevels(options);
		this.addAllowedGuildsPrecondition(options);
	}

	public override get category(): null | string {
		return this.fullCategory.length > 0 ? this.fullCategory[0] : null;
	}

	public get permissionNode() {
		return `${this.category?.toLowerCase()}.${this.name}`;
	}

	protected get client(): Foxxie {
		return cast<Foxxie>(this.container.client);
	}

	public static async ImplementFoxxieCommandPreParse(
		command: MessageCommand,
		message: Message,
		parameters: string,
		context: MessageCommand.RunContext
	): Promise<FoxxieArgs> {
		return FoxxieArgs.from(command, message, parameters, context, await fetchT(message));
	}

	public static GuildOnlyMap = new Map<string, boolean>();
}

export namespace FoxxieCommand {
	export type Args = FoxxieArgs;

	export type ChatInputCommandInteraction = { guild: Guild; guildId: string } & Command.ChatInputCommandInteraction;
	export type ChatInputContext = ChatInputCommandContext;
	export type ChatInputRunArgs = [interaction: ChatInputCommandInteraction, context: ChatInputCommandContext];
	export type Context = MessageCommandContext;
	export type LoaderContext = Command.LoaderContext;
	export type MessageRunArgs = [message: GuildMessage, args: Args, context: MessageCommandContext];
	export type Options = {
		allowedGuilds?: string[];
		description?: TypedT<string>;
		detailedDescription?: TypedT<LanguageHelpDisplayOptions>;
		guarded?: boolean;
		hidden?: boolean;
		permissionLevel?: PermissionLevels;
		spam?: boolean;
		usage?: string;
	} & Command.Options;
	export type RunContext = MessageCommand.RunContext;
}

export type FoxxieCommandOptions = {
	allowedGuilds?: string[];
	description?: TypedT<string>;
	detailedDescription?: TypedT<LanguageHelpDisplayOptions>;
	guarded?: boolean;
	hidden?: boolean;
	permissionLevel?: PermissionLevels;

	spam?: boolean;
} & Subcommand.Options;
