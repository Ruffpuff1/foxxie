import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import type { GuildMessage } from '#lib/Types';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { Stopwatch } from '@sapphire/stopwatch';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['pong'],
    description: LanguageKeys.Commands.General.PingDescription
})
export default class UserCommand extends FoxxieCommand {
    public async messageRun(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const msg = await send(message, { content: args.t(LanguageKeys.Commands.General.Ping), embeds: undefined });

        const stopwatch = new Stopwatch().start();
        await this.container.db.guilds.ensure(message.guild.id);
        stopwatch.stop();

        const content = args.t(LanguageKeys.Commands.General.PingPong, {
            roundTrip: (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp),
            wsPing: Math.round(this.container.client.ws.ping),
            dbPing: Math.round(stopwatch.duration)
        });

        await send(message, content);
    }
}
