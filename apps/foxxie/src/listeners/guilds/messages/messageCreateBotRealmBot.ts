import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener } from '@sapphire/framework';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { ChannelType, italic } from 'discord.js';

const CHANNELID = '1305722872458772591';

@ApplyOptions({
	enabled: container.client.enabledProdOnlyEvent(),
	name: 'MessageCreateBotRealmBot'
})
export class UserListener extends Listener<FoxxieEvents.MessageCreateBotRealmBot> {
	public async run(...[message]: EventArgs<FoxxieEvents.MessageCreateBotRealmBot>): Promise<void> {
		if (!message.embeds.length || message.channel.type !== ChannelType.GuildText || message.channel.id !== '1305722872458772591') return;
		await message.delete();

		const [
			{
				data: { author, description }
			}
		] = message.embeds;

		if (!author || description === `Chat relay has connected`) return;

		const channel = message.guild.channels.cache.get(CHANNELID);
		if (!channel || channel.type !== ChannelType.GuildText) return;

		const [name, ...rest] = author.name.split(' ');

		const content = rest.length ? italic(rest.join(' ')) : description || null;
		if (!content) return;

		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.find((w) => w.name === name) || (await channel.createWebhook({ name }));
		if (!webhook) return;

		await webhook.send({ content });
		this.container.logger.debug(`[MINECRAFT] - ${`Sent webhook for ${name}.`}`);
	}
}
