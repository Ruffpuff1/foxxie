import { resolveToNull } from '@ruffpuff/utilities';
import { envParseString } from '@skyra/env-utilities';
import { readSettings } from '#lib/database';
import { combineMessageReactionUsers, StarboardData, truncateStarboardEmojis } from '#lib/database/Models/starboard';
import { FoxxieCommand } from '#lib/structures';
import { EnvKeys, GuildMessage } from '#lib/types';
import { emojis } from '#utils/constants';
import { DiscordAPIError, Message, RESTJSONErrorCodes, TextChannel } from 'discord.js';

export class UserCommand extends FoxxieCommand {
	public async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<void> {
		const STARCHANNELID = '779239210360111116';
		const STARMESSAGEID = await args.pick('string');
		const ID = await args.pick('number');

		const starChannel = msg.guild?.channels.cache.get(STARCHANNELID);
		if (!starChannel || !starChannel.isSendable()) this.error('no channel');

		const starMessage = await resolveToNull(starChannel.messages.fetch(STARMESSAGEID));
		if (!starMessage) this.error('no star msg');

		const { content, embeds } = starMessage;
		const [embed] = embeds;

		// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
		const channelId = /<#(?<id>\d{17,20})>$/.exec(content)?.groups!.id!;
		const messageChannel = msg.guild!.channels.cache.get(channelId);

		if (!messageChannel || !messageChannel.isSendable()) this.error('no message channel or not sendable');

		const [, starredMessageId] = embed.footer!.text.split(' ');

		const starredMessage = await resolveToNull((messageChannel as TextChannel).messages.fetch(starredMessageId));
		if (!starredMessage) this.error('no star message');

		let users: Set<string>;

		try {
			const { starboardEmojis, starboardSelfStar } = await readSettings(msg.guild!);

			const fetchedUsers = await combineMessageReactionUsers(truncateStarboardEmojis(starboardEmojis), starredMessage as GuildMessage);
			users = new Set(fetchedUsers.filter((user) => user !== envParseString(EnvKeys.ClientId)));

			// Remove the author's star if self star is disabled:
			if (!starboardSelfStar) users.delete(starredMessage.author.id);
		} catch (error) {
			if (error instanceof DiscordAPIError) {
				if (error.code === RESTJSONErrorCodes.MissingAccess) return;
				if (error.code === RESTJSONErrorCodes.UnknownMessage) return;
				return;
			}

			users = new Set();
		}

		if (!users.size) {
			this.error('no reaction users on star message');
		}

		const data: StarboardData = {
			channelId,
			enabled: true,
			guildId: msg.guildId!,
			id: ID,
			messageId: starredMessage.id,
			starChannelId: starChannel.id,
			starMessageId: starMessage.id,
			stars: users.size,
			userId: starredMessage.author.id
		};

		const created = await this.container.prisma.starboard.create({ data });
		console.log(created);
		await msg.react(emojis.reactions.yes);
	}
}
