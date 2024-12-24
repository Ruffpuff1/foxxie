import { ChannelMentionRegex, SnowflakeRegex } from '@sapphire/discord.js-utilities';
import { Argument, Identifiers } from '@sapphire/framework';
import { isGuildMessage } from '#utils/common';
import { FuzzySearch } from '#utils/external/FuzzySearch';
import { validateChannelAccess } from '#utils/util';
import { Guild, GuildChannel, ThreadChannel, User } from 'discord.js';

export interface ChannelArgumentContext extends Argument.Context<GuildChannel | ThreadChannel> {
	filter?: (entry: GuildChannel | ThreadChannel) => boolean;
}

export class UserArgument extends Argument<GuildChannel | ThreadChannel> {
	public resolveChannel(query: string, guild: Guild) {
		const channelId = ChannelMentionRegex.exec(query) ?? SnowflakeRegex.exec(query);
		return (channelId !== null && guild.channels.cache.get(channelId[1])) ?? null;
	}

	public async run(parameter: string, { context, filter, message, minimum }: ChannelArgumentContext) {
		if (!isGuildMessage(message)) return this.error({ context, identifier: Identifiers.ArgumentGuildChannelMissingGuildError, parameter });
		filter = this.getFilter(message.author, filter);

		const resChannel = this.resolveChannel(parameter, message.guild);
		if (resChannel && filter(resChannel)) return this.ok(resChannel);

		const result = await new FuzzySearch(message.guild.channels.cache, (entry) => entry.name, filter).run(message, parameter, minimum);
		if (result) return this.ok(result[1]);
		return this.error({ context, identifier: Identifiers.ArgumentGuildChannelError, parameter });
	}

	private getFilter(author: User, filter?: (entry: GuildChannel | ThreadChannel) => boolean) {
		const clientUser = author.client.user!;
		return typeof filter === 'undefined'
			? (entry: GuildChannel | ThreadChannel) => validateChannelAccess(entry, author) && validateChannelAccess(entry, clientUser)
			: (entry: GuildChannel | ThreadChannel) =>
					filter(entry) && validateChannelAccess(entry, author) && validateChannelAccess(entry, clientUser);
	}
}
