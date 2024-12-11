import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener } from '@sapphire/framework';
import { ConsoleState, EventArgs, FoxxieEvents } from '#lib/types';
import { ChannelType, italic } from 'discord.js';

const CHANNELID = '1305722872458772591';

@ApplyOptions({
	enabled: container.client.enabledProdOnlyEvent()
})
export class UserListener extends Listener<FoxxieEvents.MinecraftBotMessage> {
	public async run(...[message]: EventArgs<FoxxieEvents.MinecraftBotMessage>): Promise<void> {
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
		this.container.client.emit(FoxxieEvents.Console, ConsoleState.Debug, `[MINECRAFT] - ${`Sent webhook for ${name}.`}`);
	}
}
