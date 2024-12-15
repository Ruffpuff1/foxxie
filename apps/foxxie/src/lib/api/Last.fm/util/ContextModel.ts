import { UserDiscogs, UserLastFM } from '@prisma/client';
import { TFunction } from '@sapphire/plugin-i18next';
import { Guild, GuildTextBasedChannel, Message, MessageReference, Snowflake, StringSelectMenuBuilder, User } from 'discord.js';

export interface LfmCommandContext {
	channel: GuildTextBasedChannel;
	guild: Guild;
	message: Message;
	t: TFunction;
	user: User;
}

export class ContextModel {
	public contextUser: ({ discogs?: UserDiscogs } & UserLastFM) | null;
	public discordChannel: GuildTextBasedChannel;
	public discordGuild?: Guild;
	public discordUser?: User;
	public interactionId?: Snowflake;
	public message: Message;
	public prefix: string;
	public referencedMessage: MessageReference | null;
	public selectMenu?: StringSelectMenuBuilder;
	public slashCommand?: boolean;
	public t: TFunction;

	public constructor(context: LfmCommandContext, prefix: string, contextUser: null | UserLastFM = null) {
		this.prefix = prefix;
		this.discordGuild = context.guild;
		this.discordChannel = context.channel;
		this.discordUser = context.user;
		this.slashCommand = false;
		this.t = context.t;
		this.interactionId = context.message.id;
		this.message = context.message;
		this.referencedMessage = context.message.reference;
		this.contextUser = contextUser;
	}
}
