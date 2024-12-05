import { MessageCommand } from '@sapphire/framework';
import { Message } from 'discord.js';
import { FoxxieArgs } from '../FoxxieArgs';
import { fetchT } from '@sapphire/plugin-i18next';

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
