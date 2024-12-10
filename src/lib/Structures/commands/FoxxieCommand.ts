import { CustomFunctionGet, DetailedDescription, PermissionLevels, TypedT } from '#lib/types';
import { clientOwners } from '#root/config';
import { seconds } from '#utils/common';
import { ChatInputCommandContext, Command, CommandOptionsRunTypeEnum, MessageCommand, MessageCommandContext, UserError } from '@sapphire/framework';
import { Awaitable, Guild, Message, Snowflake } from 'discord.js';
import { cast } from '@sapphire/utilities';
import FoxxieClient from '#lib/FoxxieClient';
import first from 'lodash/first.js';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { FoxxieArgs, FoxxieCommandUtilities } from '#lib/structures';
import { LanguageHelpDisplayOptions } from '#lib/I18n/LanguageHelp';

export abstract class FoxxieCommand extends Command<FoxxieCommand.Args, FoxxieCommand.Options> {
	public readonly guarded: boolean;

	public readonly hidden: boolean;

	public allowedGuilds: string[];

	public usage: string | null = null;

	public permissionLevel: PermissionLevels;

	declare public detailedDescription:
		| CustomFunctionGet<
				string,
				{
					prefix: string;
					CHANNEL: string;
				},
				DetailedDescription
		  >
		| TypedT<LanguageHelpDisplayOptions>;

	public constructor(context: Command.LoaderContext, options: FoxxieCommand.Options) {
		super(context, {
			cooldownDelay: seconds(5),
			cooldownLimit: 2,
			runIn: [CommandOptionsRunTypeEnum.GuildAny],
			cooldownFilteredUsers: clientOwners,
			generateDashLessAliases: true,
			...options
		});

		this.guarded = options.guarded ?? false;
		this.usage = options.usage ?? null;
		this.hidden = options.hidden ?? false;
		this.allowedGuilds = options.allowedGuilds ?? [];
		this.permissionLevel = options.permissionLevel ?? PermissionLevels.Everyone;
		this.detailedDescription = options.detailedDescription!;

		if (options.guarded) this.guarded = true;
	}

	public abstract override messageRun(message: Message, args: FoxxieCommand.Args, context: MessageCommand.RunContext): Awaitable<unknown>;

	public override messagePreParse(message: Message, parameters: string, context: MessageCommand.RunContext): Promise<FoxxieCommand.Args> {
		return FoxxieCommandUtilities.ImplementFoxxieCommandPreParse(this as MessageCommand, message, parameters, context);
	}

	public addAllowedGuildsPrecondition(options: FoxxieCommand.Options): void {
		if (options.allowedGuilds?.length) {
			this.preconditions.append({
				name: 'AllowedGuilds',
				context: { allowedGuilds: options.allowedGuilds }
			});
		}
	}

	public addPermissionLevels(options: FoxxieCommand.Options) {
		switch (options.permissionLevel) {
			case PermissionLevels.Everyone:
				this.preconditions.append('Everyone');
				break;
			case PermissionLevels.Moderator:
				this.preconditions.append('Moderator');
				break;
			case PermissionLevels.Administrator:
				this.preconditions.append('Administrator');
				break;
			case PermissionLevels.BotOwner:
				this.preconditions.append('BotOwner');
				break;
			default:
				this.preconditions.append('Everyone');
		}
	}

	/**
	 * Retrieves the global command id from the application command registry.
	 */
	public getGlobalCommandId(): Snowflake {
		const ids = this.applicationCommandRegistry.globalChatInputCommandIds;
		return [...first([...ids.values()])!][0];
	}

	protected override parseConstructorPreConditions(options: FoxxieCommand.Options): void {
		super.parseConstructorPreConditions(options);
		this.addPermissionLevels(options);
		this.addAllowedGuildsPrecondition(options);
	}

	protected error(identifier: string | UserError, context?: unknown): never {
		throw typeof identifier === 'string' ? new UserError({ identifier, context }) : identifier;
	}

	public override get category(): string | null {
		return this.fullCategory.length > 0 ? this.fullCategory[0] : null;
	}

	protected get client(): FoxxieClient {
		return cast<FoxxieClient>(this.container.client);
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace
// eslint-disable-next-line no-redeclare
export namespace FoxxieCommand {
	export type Options = Command.Options & {
		guarded?: boolean;
		hidden?: boolean;
		spam?: boolean;
		usage?: string;
		allowedGuilds?: string[];
		permissionLevel?: PermissionLevels;
		detailedDescription?:
			| CustomFunctionGet<
					string,
					{
						prefix: string;
						CHANNEL: string;
					},
					DetailedDescription
			  >
			| TypedT<LanguageHelpDisplayOptions>;
	};

	export type Args = FoxxieArgs;
	export type LoaderContext = Command.LoaderContext;
	export type RunContext = MessageCommand.RunContext;

	export type ChatInputCommandInteraction = Command.ChatInputCommandInteraction & { guildId: string; guild: Guild };
	export type Context = MessageCommandContext;
	export type ChatInputContext = ChatInputCommandContext;
}

export type FoxxieCommandOptions = Subcommand.Options & {
	guarded?: boolean;
	hidden?: boolean;
	spam?: boolean;
	allowedGuilds?: string[];
	permissionLevel?: PermissionLevels;

	detailedDescription?:
		| CustomFunctionGet<
				string,
				{
					prefix: string;
				},
				DetailedDescription
		  >
		| TypedT<LanguageHelpDisplayOptions>;
};
