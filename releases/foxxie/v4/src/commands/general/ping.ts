import { languageKeys } from '../../lib/i18n';
import { FoxxieCommand } from '../../lib/structures/commands';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import type { CommandInteraction, Message } from 'discord.js';
import type { TFunction } from '@sapphire/plugin-i18next';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['pong'],
    description: languageKeys.commands.general.pingDescription,
    slashEnabled: true
})
export default class extends FoxxieCommand {

    public async messageRun(message: Message, args: FoxxieCommand.Args): Promise<Message> {
        const msg = await send(message, args.t(languageKeys.commands.general.ping));

        const content = args.t(languageKeys.commands.general.pingPong, {
            roundTrip: (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp),
            wsPing: Math.round(this.container.client.ws.ping)
        });
        return send(message, content);
    }

    public async applicationCommandRun(interaction: CommandInteraction, t: TFunction): Promise<void> {
        const response = await interaction.reply({ content: t(languageKeys.commands.general.ping), fetchReply: true });

        const content = t(languageKeys.commands.general.pingPong, {
            roundTrip: (response as Message).createdTimestamp - interaction.createdTimestamp,
            wsPing: Math.round(this.container.client.ws.ping)
        });
        await interaction.editReply(content);
    }

}