import { UserDiscogs, UserLastFM } from '@prisma/client';
import { getSupportedUserLanguageT } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { FTFunction } from '#lib/types';
import {
	ChatInputCommandInteraction,
	Guild,
	GuildTextBasedChannel,
	Message,
	MessageReference,
	Snowflake,
	StringSelectMenuBuilder,
	User
} from 'discord.js';

export class ContextModel {
	public contextUser: ({ discogs?: null | UserDiscogs } & UserLastFM) | null;
	public discordChannel: GuildTextBasedChannel;
	public discordGuild?: Guild;
	public discordUser: User;
	public interaction: ChatInputCommandInteraction | null = null;
	public interactionId?: Snowflake;
	public message: Message | null;
	public prefix: string;
	public referencedMessage: MessageReference | null;
	public selectMenu?: StringSelectMenuBuilder;
	public slashCommand?: boolean;
	public t: FTFunction;

	public constructor(args: ChatInputCommandInteraction | FoxxieCommand.Args, contextUser: null | UserLastFM = null) {
		if (args instanceof ChatInputCommandInteraction) {
			this.prefix = '/';
			this.discordGuild = args.guild!;
			this.discordChannel = args.channel as GuildTextBasedChannel;
			this.discordUser = args.user;
			this.slashCommand = true;
			this.interaction = args;
			this.t = getSupportedUserLanguageT(args);
			this.interactionId = args.id;
			this.message = null;
			this.referencedMessage = null;
			this.contextUser = contextUser;
		} else {
			this.prefix = args.commandContext.commandPrefix;
			this.discordGuild = args.message.guild!;
			this.discordChannel = args.message.channel as GuildTextBasedChannel;
			this.discordUser = args.message.author;
			this.slashCommand = false;
			this.t = args.t;
			this.interactionId = args.message.id;
			this.message = args.message;
			this.referencedMessage = args.message.reference;
			this.contextUser = contextUser;
		}
	}
}
