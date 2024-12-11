import { MessageCommand } from '@sapphire/framework';
import { fetchT } from '@sapphire/plugin-i18next';
import { FoxxieArgs } from '#lib/structures';
import { Message } from 'discord.js';

export class FoxxieCommandUtilities {
	public static async ImplementFoxxieCommandPreParse(
		command: MessageCommand,
		message: Message,
		parameters: string,
		context: MessageCommand.RunContext
	): Promise<FoxxieArgs> {
		return FoxxieArgs.from(command, message, parameters, context, await fetchT(message));
	}
}
