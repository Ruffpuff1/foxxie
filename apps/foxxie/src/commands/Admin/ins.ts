import { StarboardData } from '#lib/Database/Models/starboard';
import { FoxxieCommand } from '#lib/structures';
import { Collection, Message, SnowflakeUtil } from 'discord.js';

const DATA = [
	{
		_id: {
			$oid: '66ffda8caffb2a7fc289606e'
		},
		channelId: '1145593489216786532',
		enabled: true,
		guildId: '1117671374052397136',
		lastUpdated: 1728043660134,
		messageId: '1291591652888023042',
		starMessageId: '1291733487669350424',
		stars: 1,
		userId: '733163699912835082'
	}
] as const;

export class UserCommand extends FoxxieCommand {
	public async messageRun(_: Message): Promise<void> {
		let index = 1;

		const sorted = new Collection(DATA.map((e) => [e.messageId, e])).sort(
			(a, b) => SnowflakeUtil.timestampFrom(a.starMessageId || '0') - SnowflakeUtil.timestampFrom(b.starMessageId || '0')
		);

		for (const entry of sorted.values()) {
			if (!entry.starMessageId || !entry.messageId) continue;
			const resolved: StarboardData = {
				channelId: entry.channelId,
				enabled: entry.enabled,
				guildId: entry.guildId,
				id: index,
				messageId: entry.messageId,
				starChannelId: `1144155849053454397`,
				starMessageId: entry.starMessageId,
				stars: entry.stars,
				userId: entry.userId
			};

			index++;

			const created = await this.container.prisma.starboard.create({ data: resolved });
			console.log(created);
		}
	}
}
