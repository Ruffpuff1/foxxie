import { Listener } from '@sapphire/framework';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { BotIds } from '#utils/constants';

export class UserListener extends Listener<FoxxieEvents.MessageCreateBot> {
	public async run(...[message]: EventArgs<FoxxieEvents.MessageCreateBot>): Promise<void> {
		switch (message.author.id) {
			case BotIds.Disboard:
				this.container.client.emit(FoxxieEvents.MessageCreateBotDisboard, message);
				break;
			case BotIds.RealmBot:
				this.container.client.emit(FoxxieEvents.MessageCreateBotRealmBot, message);
				break;
		}
	}
}
