import { container, MessageCommand } from '@sapphire/framework';
import { Message } from 'discord.js';
import { FoxxieArgs } from '../FoxxieArgs';

export class FoxxieCommandUtilities {
    public static async ImplementFoxxieCommandPreParse(
        command: MessageCommand,
        message: Message,
        parameters: string,
        context: MessageCommand.RunContext
    ): Promise<FoxxieArgs> {
        return FoxxieArgs.from(command, message, parameters, context, await container.settings.getT(message.guild));
    }
}
