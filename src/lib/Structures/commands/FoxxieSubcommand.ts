import { DetailedDescription, DetailedDescriptionArgs, PermissionLevels, TypedFT, TypedT } from '#lib/types';
import { clientOwners } from '#root/config';
import { seconds } from '#utils/common';
import { Command, CommandOptionsRunTypeEnum, MessageCommand, UserError } from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { ChatInputCommandInteraction, Message, Snowflake } from 'discord.js';
import FoxxieClient from '#lib/FoxxieClient';
import { cast } from '@sapphire/utilities';
import first from 'lodash/first.js';
import { FoxxieArgs, FoxxieCommandUtilities } from '#lib/structures';

export class FoxxieSubcommand extends Subcommand<FoxxieSubcommand.Args, FoxxieSubcommand.Options> {
	public readonly guarded: boolean;
	public readonly hidden: boolean;
	public readonly permissionLevel: PermissionLevels;
	public allowedGuilds: string[];
	public usage: string | null = null;
	declare public readonly detailedDescription: TypedFT<DetailedDescriptionArgs, DetailedDescription>;
	declare public readonly description: TypedT<string>;

	public constructor(context: FoxxieSubcommand.LoaderContext, options: FoxxieSubcommand.Options) {
		super(context, {
			...{
				cooldownDelay: seconds(5),
				cooldownLimit: 2,
				runIn: [CommandOptionsRunTypeEnum.GuildAny],
				cooldownFilteredUsers: clientOwners,
				generateDashLessAliases: true,
				...options
			},
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

	public override messagePreParse(message: Message, parameters: string, context: MessageCommand.RunContext): Promise<FoxxieSubcommand.Args> {
		return FoxxieCommandUtilities.ImplementFoxxieCommandPreParse(this as MessageCommand, message, parameters, context);
	}

	public addAllowedGuildsPrecondition(options: FoxxieSubcommand.Options): void {
		if (options.allowedGuilds?.length) {
			this.preconditions.append({
				name: 'AllowedGuilds',
				context: { allowedGuilds: options.allowedGuilds }
			});
		}
	}

	public addPermissionLevels(options: FoxxieSubcommand.Options) {
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
	 *
	 * @remarks
	 *
	 * This method is used for slash commands, and will throw an error if the
	 * global command ids are empty.
	 */
	public getGlobalCommandId(): Snowflake {
		const ids = this.applicationCommandRegistry.guildIdToChatInputCommandIds;
		if (ids.size === 0) throw new Error('The global command ids are empty.');
		return [...first([...ids.values()])!][0];
	}

	protected override parseConstructorPreConditions(options: FoxxieSubcommand.Options): void {
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

export namespace FoxxieSubcommand {
	export type Options = ExtendOptions<Subcommand.Options>;
	export type Args = FoxxieArgs;
	export type LoaderContext = Command.LoaderContext;
	export type RunContext = MessageCommand.RunContext;

	export type Interaction = ChatInputCommandInteraction;
}

export type ExtendOptions<T> = T & {
	description: TypedT<string>;
	detailedDescription: TypedFT<DetailedDescriptionArgs, DetailedDescription>;
	guarded?: boolean;
	hidden?: boolean;
	usage?: string;
	permissionLevel?: number;
	allowedGuilds?: string[];
};
