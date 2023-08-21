import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import type { GuildMessage } from '#lib/types';
import { Stopwatch } from '@sapphire/stopwatch';
import type { Message } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['pong'],
    description: LanguageKeys.Commands.General.PingDescription
})
export default class UserCommand extends FoxxieCommand {
    public async messageRun(message: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const msg = await send(message, args.t(LanguageKeys.Commands.General.Ping));

        const stopwatch = new Stopwatch().start();
        await this.container.db.guilds.ensure(message.guild.id);
        stopwatch.stop();

        const content = args.t(LanguageKeys.Commands.General.PingPong, {
            roundTrip: (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp),
            wsPing: Math.round(this.container.client.ws.ping),
            dbPing: Math.round(stopwatch.duration)
        });

        return send(message, content);
    }
}
