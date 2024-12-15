import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['pong', 'lag', 'latency'],
    description: LanguageKeys.Commands.General.PingDescription,
    detailedDescription: LanguageKeys.Commands.General.PingDetailedDescription
})
export class UserCommand extends FoxxieCommand {
    public async messageRun(msg: Message, args: FoxxieCommand.Args) {
        const sent = await send(msg, args.t(LanguageKeys.Commands.General.Ping));

        const content = args.t(LanguageKeys.Commands.General.PingPong, {
            roundTrip: (sent.editedTimestamp || sent.createdTimestamp) - (msg.editedTimestamp || msg.createdTimestamp),
            wsPing: Math.round(this.container.client.ws.ping)
        });
        return send(msg, content);
    }
}
