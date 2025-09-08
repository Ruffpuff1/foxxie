import { FoxxieCommand } from '#lib/structures';

import { ChatInput } from '../structures/TextCommandDecorators.js';

export class GeneralChatInputCommands {
	@ChatInput((builder) => builder.setName('ping').setDescription('description'), [])
	public static async ChatInputPing(...[interaction]: FoxxieCommand.ChatInputRunArgs) {
		return interaction.reply('Pong!');
	}
}
