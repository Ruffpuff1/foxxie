import { container } from '@sapphire/pieces';
import { EventArgs } from '#lib/types';
import { ChatInputCommandInteraction, Events } from 'discord.js';

import { Event } from '../structures/EventDecorators.js';

export class InteractionHandler {
	@Event((event) => event.setName(Events.InteractionCreate))
	public static InteractionCreate(...[interaction]: EventArgs<Events.InteractionCreate>) {
		if (interaction.isChatInputCommand()) {
			return InteractionHandler.ChatInputCommandCreate(interaction);
		}
	}

	private static ChatInputCommandCreate(interaction: ChatInputCommandInteraction) {
		const { client, stores } = container;
		const commandStore = stores.get('textcommands');

		const command = commandStore.get(interaction.commandName);
		if (!command) {
			return;
			// InteractionHandler.UnknownChatInputCommand({
			// 	context: { commandId: interaction.commandId, commandName: interaction.commandName },
			// 	interaction
			// });
		}

		if (!command.chatInputRun) {
			console.log(`no chat input run`);
			return;
		}

		console.log('should run', client.id);
	}
}
