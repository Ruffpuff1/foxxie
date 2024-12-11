import { MessageCommand } from '@sapphire/framework';
import { Message } from 'discord.js';
import { fetchT } from '@sapphire/plugin-i18next';
import { FoxxieArgs } from '#lib/structures';

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
