import { ChatInputCommandContext, Command, CommandOptionsRunTypeEnum, MessageCommand, MessageCommandContext, UserError } from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { cast } from '@sapphire/utilities';
import FoxxieClient from '#lib/FoxxieClient';
import { LanguageHelpDisplayOptions } from '#lib/i18n/LanguageHelp';
import { FoxxieArgs, FoxxieCommandUtilities } from '#lib/structures';
import { PermissionLevels, TypedFT, TypedT } from '#lib/types';
import { clientOwners } from '#root/config';
import { seconds } from '#utils/common';
import { Awaitable, Guild, Message, Snowflake } from 'discord.js';
import first from 'lodash/first.js';

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
			cooldownDelay: seconds(5),
			cooldownFilteredUsers: clientOwners,
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
		return FoxxieCommandUtilities.ImplementFoxxieCommandPreParse(this as MessageCommand, message, parameters, context);
	}

	public abstract override messageRun(message: Message, args: FoxxieCommand.Args, context: MessageCommand.RunContext): Awaitable<unknown>;

	protected error(identifier: string | UserError, context?: unknown): never {
		throw typeof identifier === 'string' ? new UserError({ context, identifier }) : identifier;
	}

	protected override parseConstructorPreConditions(options: FoxxieCommand.Options): void {
		super.parseConstructorPreConditions(options);
		this.addPermissionLevels(options);
		this.addAllowedGuildsPrecondition(options);
	}

	public override get category(): null | string {
		return this.fullCategory.length > 0 ? this.fullCategory[0] : null;
	}

	public get permissionNode() {
		return `${this.category?.toLowerCase()}.${this.name}`;
	}

	protected get client(): FoxxieClient {
		return cast<FoxxieClient>(this.container.client);
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace
// eslint-disable-next-line no-redeclare
export namespace FoxxieCommand {
	export type Args = FoxxieArgs;

	export type ChatInputCommandInteraction = { guild: Guild; guildId: string } & Command.ChatInputCommandInteraction;
	export type ChatInputContext = ChatInputCommandContext;
	export type Context = MessageCommandContext;

	export type LoaderContext = Command.LoaderContext;
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
