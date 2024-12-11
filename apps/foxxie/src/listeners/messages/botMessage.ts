import { Listener } from '@sapphire/framework';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { BotIds } from '#utils/constants';

export class UserListener extends Listener<FoxxieEvents.BotMessage> {
	public async run(...[message]: EventArgs<FoxxieEvents.BotMessage>): Promise<void> {
		if (message.author.id === BotIds.RealmBot) this.container.client.emit(FoxxieEvents.MinecraftBotMessage, message);
	}
}
