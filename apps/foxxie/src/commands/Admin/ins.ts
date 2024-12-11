import { StarboardData } from '#lib/Database/Models/starboard';
import { FoxxieCommand } from '#lib/structures';
import { Collection, Message, SnowflakeUtil } from 'discord.js';

const DATA = [
	{
		_id: {
			$oid: '66ffda8caffb2a7fc289606e'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1291591652888023042',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1291733487669350424',
		stars: 1,
		lastUpdated: 1728043660134
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
				enabled: entry.enabled,
				guildId: entry.guildId,
				userId: entry.userId,
				messageId: entry.messageId,
				channelId: entry.channelId,
				starMessageId: entry.starMessageId,
				starChannelId: `1144155849053454397`,
				stars: entry.stars,
				id: index
			};

			index++;

			const created = await this.container.prisma.starboard.create({ data: resolved });
			console.log(created);
		}
	}
}
