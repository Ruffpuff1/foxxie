import { readSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
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
		await readSettings(message.guild.id);
		stopwatch.stop();

		const content = args.t(LanguageKeys.Commands.General.PingPong, {
			roundTrip: (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp),
			wsPing: Math.round(this.container.client.ws.ping),
			dbPing: Math.round(stopwatch.duration)
		});

		await send(message, content);
	}
}
