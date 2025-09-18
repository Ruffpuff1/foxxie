import { ChatInputCommand, Command, CommandOptionsRunTypeEnum, MessageCommand, MessageCommandContext, UserError } from '@sapphire/framework';
import { Subcommand, SubcommandMappingArray } from '@sapphire/plugin-subcommands';
import { Config } from '#Configurations';
import { LanguageHelpDisplayOptions, LanguageHelpDisplaySubcommandOptions } from '#lib/i18n/LanguageHelp';
import { FTFunction } from '#lib/Types/Utils';
import { GuildMessage, PermissionLevels, TypedT } from '#Resources';
import { TimeService } from '#Services';
import { ChatInputCommandInteraction, Message, SlashCommandSubcommandBuilder, Snowflake } from 'discord.js';
import first from 'lodash/first.js';

import { FoxxieArgs } from './FoxxieArgs.js';
import { FoxxieCommand } from './FoxxieCommand.js';

export class FoxxieSubcommand extends Subcommand<FoxxieSubcommand.Args, FoxxieSubcommand.Options> {
	public allowedGuilds: string[];

	declare public readonly description: TypedT<string>;

	declare public readonly detailedDescription: TypedT<LanguageHelpDisplayOptions>;
	public readonly guarded: boolean;
	public readonly hidden: boolean;
	public readonly permissionLevel: PermissionLevels;
	public constructor(context: FoxxieSubcommand.LoaderContext, options: FoxxieSubcommand.Options) {
		super(context, {
			...{
				cooldownDelay: TimeService.Seconds(5),
				cooldownFilteredUsers: Config.ClientOwners,
				cooldownLimit: 2,
				generateDashLessAliases: true,
				runIn: [CommandOptionsRunTypeEnum.GuildAny],
				...options
			},
			...options
		});

		this.guarded = options.guarded ?? false;
		this.hidden = options.hidden ?? false;
		this.allowedGuilds = options.allowedGuilds ?? [];
		this.permissionLevel = options.permissionLevel ?? PermissionLevels.Everyone;
		this.detailedDescription = options.detailedDescription!;

		if (options.guarded) this.guarded = true;
	}

	public addAllowedGuildsPrecondition(options: FoxxieSubcommand.Options): void {
		if (options.allowedGuilds?.length) {
			this.preconditions.append({
				context: { allowedGuilds: options.allowedGuilds },
				name: 'AllowedGuilds'
			});
		}
	}

	public addPermissionLevels(options: FoxxieSubcommand.Options) {
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
	 *
	 * @remarks
	 *
	 * This method is used for slash commands, and will throw an error if the
	 * global command ids are empty.
	 */
	public getGlobalCommandId(): null | Snowflake {
		const ids = this.applicationCommandRegistry.globalChatInputCommandIds;
		if (!ids.size) return null;
		return first([...ids.values()])!;
	}

	public override messagePreParse(message: Message, parameters: string, context: MessageCommand.RunContext): Promise<FoxxieSubcommand.Args> {
		return FoxxieCommand.ImplementFoxxieCommandPreParse(this as MessageCommand, message, parameters, context);
	}

	protected error(identifier: string | UserError, context?: unknown): never {
		throw typeof identifier === 'string' ? new UserError({ context, identifier }) : identifier;
	}

	protected override parseConstructorPreConditions(options: FoxxieSubcommand.Options): void {
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

	public static MappedSubcommands = new Map<string, SubcommandMappingArray>();

	public static SubcommandBuilderData = new Map<string, SlashCommandSubcommandBuilder[]>();
}

export namespace FoxxieSubcommand {
	export type Args = FoxxieArgs;
	export type ChatInputRunArgs = [interaction: ChatInputCommand.Interaction, context: ChatInputCommand.RunContext];
	export type Interaction = ChatInputCommandInteraction;
	export type LoaderContext = Command.LoaderContext;
	export type MessageRunArgs = [message: GuildMessage, args: Args, context: MessageCommandContext];
	export type Options = ExtendOptions<Subcommand.Options>;
	export type RunContext = MessageCommand.RunContext;

	export type T = FTFunction;
}

export type ExtendOptions<T> = {
	allowedGuilds?: string[];
	description?: TypedT<string>;
	detailedDescription?: TypedT<LanguageHelpDisplaySubcommandOptions>;
	guarded?: boolean;
	hidden?: boolean;
	permissionLevel?: PermissionLevels;
} & T;
